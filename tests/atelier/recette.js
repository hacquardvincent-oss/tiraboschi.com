/* Recette de l'atelier sur-mesure.
   Chaque cas correspond à un défaut réellement constaté :
   1. écrans d'option en noir sur noir
   2. cover flow qui saute au lieu de glisser
   3. matières qui n'étaient pas des cuirs
   4. choix sans conséquence sur la photographie                       */
const { chromium } = require('playwright');
const path = require('path');
const F = 'file://' + path.resolve(__dirname, '../../tiraboschi-atelier-prototype.html');

let ko = 0;
const ok = (c, m) => { console.log((c ? '  ✓ ' : '  ✗ ') + m); if (!c) ko++; };

const rgb = s => { const m = String(s).match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number) : null; };
const lum = c => { const f = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
  return .2126 * f[0] + .7152 * f[1] + .0722 * f[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };

(async () => {
  const b = await chromium.launch();

  for (const vp of [{ w: 1440, h: 900, n: 'Desktop 1440' }, { w: 1024, h: 768, n: 'Tablette' }, { w: 390, h: 844, n: 'iPhone 12' }]) {
    console.log('\n══ ' + vp.n);
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: vp.w < 900, isMobile: vp.w < 900 });
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.route('**cdn.shopify.com**', r => r.abort());   // on teste la mécanique, pas le réseau
    await p.goto(F); await p.waitForTimeout(500);
    await p.click('[data-go="0"]'); await p.waitForTimeout(800);

    // ── 1. TOUS les écrans d'option sont lisibles
    let pireOpt = 99; const fantomes = [], colles = [];
    for (const k of ['ferrures', 'doublure', 'bijou', 'pieds', 'longueur', 'grav']) {
      await p.click(`.aj[data-k="${k}"]`); await p.waitForTimeout(650);
      const r = await p.evaluate(() => {
        const bg = getComputedStyle(document.getElementById('plgBg')).backgroundColor;
        const caches = ['plgFam','plgStage','plgP','plgN','plgGlisse']
          .filter(i => { const e = document.getElementById(i);
            return e && e.hidden && getComputedStyle(e).display !== 'none'; });
        const n0 = document.querySelector('.op__n'), d0 = document.querySelector('.op__d');
        const colles = !!(n0 && d0 && n0.getBoundingClientRect().bottom > d0.getBoundingClientRect().top + 1);
        const cibles = ['#plgT', '#plgOk', '.op__n', '.plg__n', '.plg__champ'].map(s => document.querySelector(s)).filter(Boolean);
        return { bg, cs: cibles.map(e => getComputedStyle(e).color), vus: cibles.length, caches, colles };
      });
      if (r.caches.length) fantomes.push(k + ':' + r.caches.join(','));
      if (r.colles) colles.push(k);
      const pire = Math.min(...r.cs.map(c => ratio(rgb(c), rgb(r.bg))));
      pireOpt = Math.min(pireOpt, pire);
      await p.click('#plgX'); await p.waitForTimeout(500);
    }
    ok(pireOpt >= 4.5, `écrans d'option lisibles — pire contraste ${pireOpt.toFixed(2)}:1 (≥ 4.5)`);
    ok(fantomes.length === 0, 'rien de fantôme sur un écran d\'option ' + JSON.stringify(fantomes));
    ok(colles.length === 0, 'nom et description séparés ' + JSON.stringify(colles));

    // ── 2. Le fond de la plongée tient le texte blanc sur les 55 nuances
    await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(700);
    const pireCuir = await p.evaluate(() => {
      if (!window.__mat) return { pire: 0, coupable: 'crochet de recette absent' };
      const L = window.__mat();
      let pire = 99, coupable = '';
      const el = document.createElement('div'); document.body.appendChild(el);
      for (const m of L) {
        el.style.background = window.__fond(m.c);
        const c = getComputedStyle(el).backgroundColor.match(/\d+/g).slice(0, 3).map(Number);
        const f = c.map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
        const l = .2126 * f[0] + .7152 * f[1] + .0722 * f[2];
        const r = 1.05 / (l + .05);
        if (r < pire) { pire = r; coupable = m.nom; }
      }
      el.remove();
      return { pire, coupable };
    });
    ok(pireCuir.pire >= 4.5, `fond plongée × 55 cuirs — pire ${pireCuir.pire.toFixed(2)}:1 sur ${pireCuir.coupable}`);

    // ── 3. Le cover flow GLISSE : la carte suit le doigt, elle ne saute pas
    const box = await p.locator('#plgStage').boundingBox();
    const cy = box.y + box.height / 2;
    const tr0 = await p.evaluate(() => { const e = document.querySelector('.plg__sw.mid');
      return e ? getComputedStyle(e).transform : 'absente'; });
    await p.mouse.move(box.x + box.width * .58, cy);
    await p.mouse.down();
    await p.mouse.move(box.x + box.width * .50, cy);
    await p.waitForTimeout(60);
    const trMid = await p.evaluate(() => {
      const e = document.querySelector('.plg__sw[data-i="0"]');
      if (!e) return { t: 'absente', trans: 'absente' };
      return { t: getComputedStyle(e).transform, trans: getComputedStyle(e).transitionDuration };
    });
    await p.mouse.move(box.x + box.width * .22, cy);
    await p.mouse.up(); await p.waitForTimeout(700);
    const idxApres = await p.evaluate(() => window.__pi ? window.__pi() : -1);
    ok(trMid.t.startsWith('matrix') && trMid.t !== tr0,
       'la carte suit le pointeur pendant le glissé (pas de saut au relâché)');
    ok(/^0s|^0\.0*s$/.test(trMid.trans.split(',')[0].trim()), 'transitions coupées pendant le glissé — pas de traîne');
    ok(idxApres > 0, `le glissé change de cuir (index ${idxApres})`);

    // ── 4. Les cartes sont persistantes → les transitions peuvent jouer
    const nb = await p.evaluate(() => document.querySelectorAll('.plg__sw').length);
    ok(nb > 7, `cartes persistantes : ${nb} en scène (le rendu jetable en créait 7)`);

    // ── 5. Les matières sont des textures bitmap, plus des filtres SVG
    const tex = await p.evaluate(() => {
      const e = document.querySelector('.plg__sw.mid');
      const c = e ? getComputedStyle(e) : { backgroundImage: '', backgroundBlendMode: '', backgroundColor: '' };
      return { img: c.backgroundImage.slice(0, 24), blend: c.backgroundBlendMode, col: c.backgroundColor,
               svg: document.querySelectorAll('#pats pattern').length };
    });
    ok(tex.img.startsWith('url("data:image/png'), 'la matière est une photographie de cuir (PNG)');
    ok(tex.blend === 'hard-light', 'la nuance est appliquée en hard-light');
    ok(tex.svg === 0, 'plus aucun motif SVG procédural');

    // ── 6. Retenir un cuir habille la photographie
    const av = await p.evaluate(() => {
      const t = document.getElementById('atlTeint'), g = document.getElementById('atlGrain');
      return { t: t ? +getComputedStyle(t).opacity : -1, g: g ? +getComputedStyle(g).opacity : -1 };
    });
    await p.click('#plgOk'); await p.waitForTimeout(1400);
    const ap = await p.evaluate(() => {
      const vide = { opacity: '-1', backgroundColor: '', mixBlendMode: '', backgroundImage: '' };
      const te = document.getElementById('atlTeint'), ge = document.getElementById('atlGrain');
      const t = te ? getComputedStyle(te) : vide, g = ge ? getComputedStyle(ge) : vide;
      const ch = document.querySelector('.aj[data-k="ext"] .aj__c');
      return { to: +t.opacity, tc: t.backgroundColor, tb: t.mixBlendMode,
               go: +g.opacity, gi: g.backgroundImage.slice(0, 24), gb: g.mixBlendMode,
               chip: ch ? getComputedStyle(ch).backgroundImage.slice(0, 24) : '',
               pastille: document.querySelectorAll('.rep.set .rep__sw').length };
    });
    ok(av.t === 0 && ap.to > .5, `la teinte du cuir se pose sur la photo (${av.t} → ${ap.to})`);
    ok(ap.tb === 'color' && ap.gb === 'overlay', 'mélanges color/overlay — le fond studio blanc reste blanc');
    ok(ap.go > .2 && ap.gi.startsWith('url("data:image/png'), 'le grain du cuir se pose aussi');
    ok(ap.chip.startsWith('url("data:image/png'), 'le ruban montre la matière retenue');
    ok(ap.pastille >= 1, `${ap.pastille} repère(s) portent la matière sur la photo`);

    // ── 7. Une option non-cuir se voit aussi, là où le modèle a un repère
    //     (tous les ajustements n'ont pas de point sur chaque silhouette)
    await p.click('.aj[data-k="bijou"]'); await p.waitForTimeout(600);
    await p.click('.op[data-id="chaine"]'); await p.waitForTimeout(400);
    await p.click('#plgOk'); await p.waitForTimeout(700);
    const fer = await p.evaluate(() => {
      const r = document.querySelector('.rep[data-k="bijou"]');
      const sw = r && r.querySelector('.rep__sw'), rv = r && r.querySelector('[data-rv]');
      const ch = document.querySelector('.aj[data-k="bijou"] .aj__c');
      return { set: !!r && r.classList.contains('set'),
               col: sw ? getComputedStyle(sw).backgroundColor : null,
               val: rv ? rv.textContent : '',
               chip: ch ? getComputedStyle(ch).backgroundColor : 'rgb(0,0,0)' };
    });
    ok(fer.val.indexOf('Chaîne') >= 0, `le repère affiche la valeur retenue («${(fer.val || '').trim()}»)`);
    ok(rgb(fer.chip) && lum(rgb(fer.chip)) > .2, 'le ruban prend la teinte de la pièce retenue');

    // ── 8. Rien ne sort de l'écran, rien ne défile
    // Le ruban défile horizontalement par construction : seul le vertical est un défaut.
    const geo = await p.evaluate(() => {
      const glisseur = e => { for (let n = e; n; n = n.parentElement)
        if (n.scrollWidth > n.clientWidth + 2 && getComputedStyle(n).overflowX !== 'visible') return true;
        return false; };
      return {
        scrollY: document.documentElement.scrollHeight - innerHeight,
        scrollX: document.documentElement.scrollWidth - innerWidth,
        bas: [...document.querySelectorAll('.rep,.aj,.op,.plg__ok,.tot,.plg__cap,.plg__glisse')]
          .filter(e => { const r = e.getBoundingClientRect();
            return r.width && (r.bottom > innerHeight + 1 || r.top < -1); })
          .map(e => e.className + '|' + Math.round(e.getBoundingClientRect().bottom)),
        cote: [...document.querySelectorAll('.rep,.op,.plg__ok,.tot')]
          .filter(e => { const r = e.getBoundingClientRect();
            return r.width && !glisseur(e) && (r.right > innerWidth + 1 || r.left < -1); })
          .map(e => e.className)
      };
    });
    ok(geo.scrollY <= 0, `aucun défilement vertical (débord ${geo.scrollY}px)`);
    ok(geo.scrollX <= 0, `aucun défilement horizontal de page (débord ${geo.scrollX}px)`);
    ok(geo.bas.length === 0, 'rien sous la ligne de flottaison ' + JSON.stringify(geo.bas));
    ok(geo.cote.length === 0, 'rien hors cadre latéralement ' + JSON.stringify(geo.cote));

    // ── 9. Chaque repère est réellement cliquable : rien ne passe sous le ruban
    const masques = await p.evaluate(() => {
      return [...document.querySelectorAll('.rep')].filter(r => {
        const b = r.getBoundingClientRect();
        const x = b.left + b.width / 2, y = b.top + b.height / 2;
        const sur = document.elementFromPoint(x, y);
        return !sur || !sur.closest('.rep');
      }).map(r => r.dataset.k);
    });
    ok(masques.length === 0, 'tous les repères sont atteignables ' + JSON.stringify(masques));

    ok(errs.length === 0, 'aucune erreur console ' + (errs[0] || ''));
    await ctx.close();
  }

  await b.close();
  console.log(ko ? `\n${ko} ÉCHEC(S)` : '\nTOUT PASSE');
  process.exit(ko ? 1 : 0);
})();
