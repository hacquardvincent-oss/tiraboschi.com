/* Recette de la démonstration à deux mondes.
   Chaque cas garde un principe de l'expérience :
   vitrine sans achat · seuil humain · lumière qui change ·
   voile The Society · configurateur intact.                       */
const { chromium } = require('playwright');
const path = require('path');
const F = 'file://' + path.resolve(__dirname, '../../tiraboschi-maison-demo.html');

let ko = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) ko++; };

(async () => {
  const b = await chromium.launch();
  for (const vp of [{ w: 1440, h: 900, n: 'Desktop 1440' },
                    { w: 1024, h: 768, n: 'Tablette' },
                    { w: 390, h: 844, n: 'iPhone 12' }]) {
    console.log('\n══ ' + vp.n);
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h },
      hasTouch: vp.w < 900, isMobile: vp.w < 900 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(F); await p.waitForTimeout(700);

    // ── 1. La vitrine ne vend rien
    const vitrine = await p.evaluate(() => {
      const t = document.getElementById('public').innerText.toLowerCase();
      return {
        achat: /ajouter au panier|acheter|panier|prix|€/.test(t),
        cta: [...document.querySelectorAll('#public a, #public button')]
              .map(e => e.textContent.trim()).filter(Boolean),
        connexion: /se connecter|créer un compte|s'inscrire/.test(t),
      };
    });
    ok(!vitrine.achat, 'aucun prix ni panier sur la vitrine publique');
    ok(!vitrine.connexion, 'aucun « se connecter » : on ne s\'inscrit pas');
    ok(vitrine.cta.some(t => /Demander à être reçue/.test(t)),
       'l\'unique conversion est le rendez-vous');

    // ── 2. Le seuil : la demande, puis l'invitation
    await p.evaluate(() => document.getElementById('seuil').scrollIntoView());
    await p.waitForTimeout(600);
    await p.click('#formDemande button[type="submit"]');
    await p.waitForTimeout(700);
    const apres = await p.evaluate(() => ({
      formulaire: document.getElementById('seuilForm').hidden,
      reponse: document.getElementById('reponse').classList.contains('on'),
      nom: document.getElementById('repNom').textContent,
      prive: document.getElementById('prive').classList.contains('on'),
    }));
    ok(apres.formulaire && apres.reponse, 'la demande laisse place à la réponse de la Maison');
    ok(apres.nom === 'Hélène', 'la réponse est nominative (' + apres.nom + ')');
    ok(!apres.prive, 'la demande N\'OUVRE PAS la porte — un humain le fait');

    // ── 3. Le code : quatre lettres, et seulement les bonnes
    await p.click('#ouvrir'); await p.waitForTimeout(500);
    ok(await p.evaluate(() => document.getElementById('carton').classList.contains('on')),
       'l\'invitation nominative se présente');
    const champs = await p.locator('#codeIn input').all();
    await champs[2].fill('X'); await champs[3].fill('X');
    await p.waitForTimeout(400);
    ok(await p.evaluate(() => document.getElementById('codeErr').classList.contains('on')),
       'un code faux ne dit rien de plus');
    ok(await p.evaluate(() => !document.getElementById('prive').classList.contains('on')),
       'un code faux n\'ouvre pas');
    await champs[2].fill('R'); await champs[3].fill('A');
    await p.waitForTimeout(2200);
    const dedans = await p.evaluate(() => window.__demo());
    ok(dedans.monde === 'prive', 'le bon code fait passer dans l\'espace privé');

    // ── 4. La lumière change vraiment
    const lumiere = await p.evaluate(() => {
      const lum = s => { const c = s.match(/\d+/g).slice(0, 3).map(Number);
        const f = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
        return .2126 * f[0] + .7152 * f[1] + .0722 * f[2]; };
      return lum(getComputedStyle(document.getElementById('prive')).backgroundColor);
    });
    ok(lumiere < 0.02, `l'espace privé est une autre lumière (luminance ${lumiere.toFixed(3)})`);
    ok(await p.evaluate(() => document.getElementById('accNom').textContent === 'Hélène'),
       'la cliente est nommée en entrant');

    // ── 5. Le voile The Society
    ok(dedans.matieresVisibles === 6,
       `Hélène (cercle III) voit les 6 matières, exotiques comprises (${dedans.matieresVisibles})`);

    // ── 6. Le configurateur : plongée, cover flow, rail, teinte masquée
    await p.click('.pf[data-v="atl"]'); await p.waitForTimeout(700);
    await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(700);
    ok(await p.evaluate(() => document.querySelectorAll('.sw').length === 52),
       'cover flow : 52 nuances en scène');
    ok(await p.evaluate(() => document.querySelectorAll('#plgRail i').length === 52),
       'ascenseur de nuances : 52 crans');
    await p.click('.fm[data-f="alligator"]'); await p.waitForTimeout(400);
    const rail = await p.locator('#plgRail').boundingBox();
    await p.mouse.click(rail.x + rail.width * (50.5 / 52), rail.y + rail.height / 2);
    await p.waitForTimeout(500);
    await p.click('#plgOk'); await p.waitForTimeout(1200);
    const habille = await p.evaluate(() => window.__demo());
    ok(habille.cuir === 'alligator:vert-empire', `la matière est retenue (${habille.cuir})`);
    ok(habille.melange === 'multiply', 'la nuance se multiplie à travers le masque du cuir');
    ok(habille.rendu.startsWith('data:image/webp'), 'la pièce affichée est un rendu Cycles');
    ok(habille.total === 1900 + 3800, `le prix suit (${habille.total} €)`);

    // ── 7. Le certificat, et l'absence de paiement
    await p.click('#voirCert'); await p.waitForTimeout(900);
    const cert = await p.evaluate(() => ({
      vue: document.querySelector('.pv.on').dataset.v,
      lignes: document.querySelectorAll('#certG .cl').length,
      // ce qui compte n'est pas le mot « paiement » (la note dit justement
      // qu'il n'y en a pas) mais l'absence d'une ACTION d'encaissement
      actions: [...document.querySelectorAll('[data-v="cert"] button, [data-v="cert"] a')]
                 .map(e => e.textContent.trim()).filter(Boolean),
    }));
    ok(cert.vue === 'cert' && cert.lignes >= 7, `le certificat récapitule (${cert.lignes} lignes)`);
    ok(cert.actions.some(t => /Confier à Laurène/.test(t)), 'le geste final confie la pièce');
    ok(!cert.actions.some(t => /pay|régl|acompte|command|panier/i.test(t)),
       'aucune action d\'encaissement dans l\'espace privé');

    // ── 8. Rien ne déborde
    const geo = await p.evaluate(() => {
      const glisseur = e => { for (let n = e; n; n = n.parentElement) {
        const c = getComputedStyle(n);
        if (n.scrollHeight > n.clientHeight + 2 && c.overflowY !== 'visible') return true;
        if (n.scrollWidth > n.clientWidth + 2 && c.overflowX !== 'visible') return true; }
        return false; };
      return { x: document.documentElement.scrollWidth - innerWidth,
        hors: [...document.querySelectorAll('#prive .rep, #prive .aj, .op, .plg__ok, .tot')]
          .filter(e => { const r = e.getBoundingClientRect();
            return r.width && !glisseur(e) && (r.right > innerWidth + 1 || r.left < -1); })
          .map(e => e.className) };
    });
    ok(geo.x <= 0, `aucun défilement horizontal (débord ${geo.x}px)`);
    ok(geo.hors.length === 0, 'rien hors cadre ' + JSON.stringify(geo.hors));

    ok(errs.length === 0, 'aucune erreur console ' + (errs[0] || ''));
    await ctx.close();
  }
  await b.close();
  console.log(ko ? `\n${ko} ÉCHEC(S)` : '\nTOUT PASSE');
  process.exit(ko ? 1 : 0);
})();
