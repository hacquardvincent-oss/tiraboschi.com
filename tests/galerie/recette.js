/* Recette de la démo Galerie · Atelier · Boudoir.
   Lancer depuis la racine : NODE_PATH=/opt/node22/lib/node_modules node tests/galerie/recette.js

   Ce qu'on vérifie tient en trois phrases :
   — la galerie est claire, elle ne vend rien, et l'on ne s'y perd pas
     (fil d'Ariane, plan, rendez-vous toujours atteignable) ;
   — l'atelier et le boudoir se rencontrent EN MARCHANT, pas seulement
     dans un menu ;
   — le prix et le module 3D n'existent que dans le boudoir. */
const { chromium } = require('playwright');
const fs = require('fs');

const F = 'file://' + process.cwd() + '/tiraboschi-galerie-demo.html';

/* Le CDN de la boutique n'est pas joignable depuis l'environnement de
   recette. On sert une vignette neutre à sa place : les cas portent sur
   la mise en page et sur les textes, jamais sur la photographie. Elle est
   embarquée ici pour que la recette ne dépende d'aucun fichier volatil. */
const SUB = fs.readFileSync('tools/rot360/hd-graine.webp');
const SUB_TYPE = 'image/webp';

let ok = 0, ko = 0;
const cas = [];
function v(nom, cond, detail) {
  if (cond) { ok++; cas.push('  ok   ' + nom); }
  else { ko++; cas.push('  ÉCHEC ' + nom + (detail !== undefined ? ' → ' + detail : '')); }
}

/* contraste WCAG */
const lin = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
const lum = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const contraste = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05);
};
const rgb = s => (s.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map(Number);

(async () => {
  const nav = await chromium.launch();
  const erreurs = [];

  async function page(w, h) {
    const p = await nav.newPage({ viewport: { width: w, height: h } });
    p.on('console', m => { if (m.type() === 'error') erreurs.push(w + 'px · ' + m.text()); });
    p.on('pageerror', e => erreurs.push(w + 'px · ' + e.message));
    await p.route('**cdn.shopify.com/s/files/**', r =>
      r.fulfill({ contentType: SUB_TYPE, body: SUB }));
    await p.route('**fonts.googleapis.com/**', r =>
      r.fulfill({ contentType: 'text/css', body: '' }));
    await p.goto(F);
    await p.waitForTimeout(400);
    return p;
  }

  /* ═════════════ 1440 × 900 — le parcours complet ═════════════ */
  const p = await page(1440, 900);
  let e = await p.evaluate(() => __etat());

  /* ── le seuil ── */
  v('le seuil ouvre la démonstration', e.lieu === 'seuil', e.lieu);
  v('la barre est absente au seuil',
    !(await p.evaluate(() => document.getElementById('barre').classList.contains('on'))));

  await p.click('#entrer'); await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('« Entrer » mène directement dans la galerie', e.lieu === 'galerie', e.lieu);

  /* ── LA GALERIE EST CLAIRE ── */
  const fonds = await p.evaluate(() => ({
    galerie: getComputedStyle(document.getElementById('galerie')).backgroundColor,
    salle: getComputedStyle(document.querySelector('.salle')).backgroundColor,
    corps: getComputedStyle(document.body).backgroundColor,
    barre: getComputedStyle(document.getElementById('barre')).backgroundColor,
  }));
  v('le fond de la galerie est un blanc pur',
    rgb(fonds.galerie).join() === '255,255,255', fonds.galerie);
  v('le fond du document est blanc', rgb(fonds.corps).join() === '255,255,255', fonds.corps);

  /* ── les repères marchands : on ne perd pas le visiteur ── */
  v('la barre est présente dès la galerie',
    await p.evaluate(() => document.getElementById('barre').classList.contains('on')));
  v('le fil d\'Ariane annonce le lieu', /GALERIE/i.test(e.ariane), e.ariane);
  v('le rendez-vous est atteignable depuis la barre', await p.isVisible('#versRdv'));

  /* le « menu » : un plan, pas une liste de liens */
  await p.click('#planB'); await p.waitForTimeout(700);
  e = await p.evaluate(() => __etat());
  v('le plan s\'ouvre', e.plan);
  v('le plan liste les quatre destinations', await p.locator('#planL .pl').count() === 4);
  const plan = await p.locator('#plan').innerText();
  v('le plan signale l\'accès réservé du boudoir', /réservé/i.test(plan));
  const clos = await p.evaluate(() => {
    const n = document.querySelector('.pl[data-clos] .pl__n');
    const s = getComputedStyle(n);
    return { c: s.color, o: parseFloat(s.opacity), t: parseFloat(s.fontSize) };
  });
  /* le boudoir est estompé, pas illisible : seuil « grand texte » de la WCAG */
  v('le titre réservé reste lisible',
    contraste(rgb(clos.c).map(v => Math.round(255 + (v - 255) * clos.o)), [255, 255, 255]) >= 3
    && clos.t >= 24,
    contraste(rgb(clos.c).map(v => Math.round(255 + (v - 255) * clos.o)), [255, 255, 255])
      .toFixed(2) + ':1 · ' + clos.t + 'px');
  v('aucun prix dans le plan', !/€/.test(plan), (plan.match(/.{0,26}€.{0,26}/) || [])[0]);
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  v('Échap referme le plan', !(await p.evaluate(() => __etat())).plan);

  /* ── LE MUR : huit œuvres et DEUX ouvertures rencontrées en marchant ── */
  e = await p.evaluate(() => __etat());
  v('huit œuvres accrochées', e.oeuvres === 8, e.oeuvres);
  v('deux ouvertures posées dans le mur', e.ouvertures === 2, e.ouvertures);
  const ouv = await p.evaluate(() =>
    [...document.querySelectorAll('.ouv')].map(o => o.dataset.ouv));
  v('l\'Atelier et le Boudoir se rencontrent sur le mur',
    ouv.join() === 'atelier,porte', ouv.join());

  const mur = await p.evaluate(() => {
    const m = document.getElementById('mur');
    return { x: m.scrollWidth - m.clientWidth, y: m.scrollHeight - m.clientHeight };
  });
  v('le mur se parcourt à l\'horizontale', mur.x > 400, mur.x);
  v('le mur ne déborde pas à la verticale', mur.y <= 1, mur.y);

  /* la ligne d'accrochage : les pièces posent toutes exactement dessus */
  const ligne = await p.evaluate(() => {
    const tracee = document.querySelector('.ligne').getBoundingClientRect().top;
    const bas = [...document.querySelectorAll('.oe__m, .ouv__c')]
      .map(m => m.getBoundingClientRect().bottom);
    return { ecart: Math.max(...bas) - Math.min(...bas),
             cible: Math.max(...bas.map(b => Math.abs(b - tracee))) };
  });
  v('pièces et ouvertures posent à la même hauteur', ligne.ecart < 2, ligne.ecart.toFixed(1));
  v('elles posent sur la ligne réellement tracée', ligne.cible < 2, ligne.cible.toFixed(1));

  /* rien sur le mur ne doit recouvrir le repère de marche : c'est ce qui
     faisait buter le texte de l'ouverture sur l'indicateur */
  const collision = await p.evaluate(() => {
    const m = document.querySelector('.marche').getBoundingClientRect();
    let pire = 0, quoi = '';
    document.querySelectorAll('.mur > *').forEach(el => {
      const r = el.getBoundingClientRect();
      const d = r.bottom - m.top;
      if (d > pire) { pire = d; quoi = el.className; }
    });
    return { pire: Math.round(pire), quoi };
  });
  v('rien ne déborde sur le repère de marche', collision.pire <= 0,
    collision.pire + ' px · ' + collision.quoi);

  /* la molette verticale fait marcher latéralement */
  await p.hover('.oe');
  await p.mouse.wheel(0, 700); await p.waitForTimeout(600);
  const marche = await p.evaluate(() => ({
    x: document.getElementById('mur').scrollLeft,
    barre: document.getElementById('marcheB').style.width,
    n: document.getElementById('marcheN').textContent,
  }));
  v('la molette fait marcher le long du mur', marche.x > 150, marche.x);
  v('la progression se lit', parseFloat(marche.barre) > 0, marche.barre);
  v('le repère nomme l\'œuvre courante', /Œuvre \d+ sur 8/.test(marche.n), marche.n);

  /* le fil d'Ariane suit la section où l'on se trouve */
  await p.evaluate(() => {
    document.querySelectorAll('.oe')[6].scrollIntoView({ inline: 'center', behavior: 'instant' });
  });
  await p.waitForTimeout(500);
  e = await p.evaluate(() => __etat());
  v('le fil d\'Ariane suit la section traversée',
    /RENCONTRES/i.test(e.ariane), e.ariane);

  await p.evaluate(() => {
    document.querySelector('.ouv').scrollIntoView({ inline: 'center', behavior: 'instant' });
  });
  await p.waitForTimeout(450);
  v('le fil d\'Ariane ne se vide pas devant une ouverture',
    /·/.test((await p.evaluate(() => __etat())).ariane),
    (await p.evaluate(() => __etat())).ariane);

  /* ── la notice ── */
  await p.evaluate(() => __ouvrir(0)); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('la notice s\'ouvre', e.notice);
  const not = await p.locator('#not').innerText();
  v('la notice porte un cartel', /dimensions|matières|façonnage/i.test(not));
  v('la notice ne montre AUCUN prix', !/€/.test(not), (not.match(/.{0,26}€.{0,26}/) || [])[0]);
  v('la seule action est de demander à voir',
    (await p.locator('#notGo').innerText()).toLowerCase().includes('demander'));
  const cnot = await p.evaluate(() => [
    getComputedStyle(document.getElementById('notN')).color,
    getComputedStyle(document.getElementById('not')).backgroundColor]);
  v('la notice est claire et lisible',
    rgb(cnot[1]).join() === '255,255,255' && contraste(rgb(cnot[0]), rgb(cnot[1])) >= 4.5,
    cnot.join(' sur '));

  /* la pièce d'exception prend bien sa nuance */
  await p.evaluate(() => __ouvrir(3)); await p.waitForTimeout(600);
  const teinte = await p.evaluate(() => {
    const t = getComputedStyle(document.getElementById('notT'));
    const i = document.getElementById('notImg');
    return { fond: t.backgroundColor, masque: t.maskImage.slice(0, 24),
             src: i.getAttribute('src').slice(0, 22), large: i.naturalWidth };
  });
  v('la pièce d\'exception est teintée', rgb(teinte.fond).join() === '30,58,48', teinte.fond);
  v('la teinte passe par le masque du cuir', teinte.masque.includes('url('), teinte.masque);
  v('le rendu est embarqué',
    teinte.src.startsWith('data:image/webp') && teinte.large > 300,
    teinte.src + ' ' + teinte.large);

  /* une photographie ordinaire ne doit PAS hériter du masque de la précédente */
  await p.evaluate(() => __ouvrir(1)); await p.waitForTimeout(500);
  const propre = await p.evaluate(() => {
    const t = getComputedStyle(document.getElementById('notT'));
    return { masque: t.maskImage, fond: t.backgroundColor };
  });
  v('la notice se nettoie entre deux œuvres',
    propre.masque === 'none' && rgb(propre.fond).join() === '0,0,0',
    propre.masque.slice(0, 20) + ' / ' + propre.fond);

  /* ── LE FIL DE VISITE : on accompagne vers le rendez-vous ── */
  e = await p.evaluate(() => __etat());
  v('le fil de visite apparaît après deux œuvres', e.visite && e.vues >= 2,
    'vues=' + e.vues + ' visible=' + e.visite);
  const fil = await p.locator('#visite').innerText();
  v('le fil compte ce qui a été regardé', /regardée?s?/.test(fil), fil.replace(/\n/g, ' '));
  v('le fil n\'affiche aucun prix', !/€/.test(fil));
  v('le fil conduit au rendez-vous',
    /rendez-vous/i.test(await p.locator('#visiteGo').innerText()));

  /* ── LA PROMESSE : rien ne se vend hors du boudoir ── */
  await p.evaluate(() => { __lieu('galerie'); });
  for (const id of ['galerie', 'atelier', 'rdv']) {
    await p.evaluate(i => __lieu(i), id); await p.waitForTimeout(400);
    const txt = await p.locator('#' + id).innerText();
    v('aucun prix dans « ' + id + ' »', !/€|\bprix\b|panier|ajouter au/i.test(txt),
      (txt.match(/.{0,30}(€|\bprix\b|panier).{0,30}/i) || [])[0]);
  }

  /* ── L'ATELIER : il se descend ── */
  await p.evaluate(() => __lieu('atelier')); await p.waitForTimeout(700);
  e = await p.evaluate(() => __etat());
  v('l\'atelier est un lieu à part', e.lieu === 'atelier', e.lieu);
  v('le fil d\'Ariane garde le chemin de retour',
    /GALERIE.*ATELIER/i.test(e.ariane), e.ariane);
  v('le retour à la galerie est cliquable dans le fil',
    await p.locator('#fil button').count() >= 1);
  const at = await p.evaluate(() => {
    const a = document.getElementById('atelier');
    return { gestes: document.querySelectorAll('.geste').length,
             y: a.scrollHeight - a.clientHeight,
             x: a.scrollWidth - a.clientWidth,
             fond: getComputedStyle(a).backgroundColor };
  });
  v('six gestes composent l\'atelier', at.gestes === 6, at.gestes);
  v('l\'atelier se descend', at.y > 600, at.y);
  v('l\'atelier ne déborde pas latéralement', at.x <= 1, at.x);
  v('l\'atelier reste clair', lum(rgb(at.fond)) > .85, at.fond);

  /* les révélations au défilement s'arment bien */
  await p.evaluate(() => { const a = document.getElementById('atelier'); a.scrollTop = 900; });
  await p.waitForTimeout(900);
  const revs = await p.evaluate(() => document.querySelectorAll('[data-rev].vu').length);
  v('les gestes se révèlent au défilement', revs >= 2, revs);

  /* ── le cabinet des matières, en clair et sans prix ── */
  await p.evaluate(() => __cabinet()); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('le cabinet ouvre la plongée', e.plongee && e.cabinet);
  const cab = await p.evaluate(() => ({
    clair: document.getElementById('plg').classList.contains('plg--clair'),
    fond: getComputedStyle(document.querySelector('.plg__bg')).backgroundColor,
    texte: getComputedStyle(document.getElementById('plgNom')).color,
    legende: document.getElementById('plgD').textContent,
    bouton: document.getElementById('plgOk').textContent,
    familles: document.querySelectorAll('.fm').length,
    cartes: document.querySelectorAll('.sw').length,
  }));
  v('le cabinet est en teinte claire', cab.clair && rgb(cab.fond).join() === '255,255,255',
    cab.fond);
  v('le cabinet reste lisible',
    contraste(rgb(cab.texte), rgb(cab.fond)) >= 4.5,
    contraste(rgb(cab.texte), rgb(cab.fond)).toFixed(2) + ':1');
  v('le cabinet montre les six matières', cab.familles === 6, cab.familles);
  v('le cabinet montre les 52 nuances', cab.cartes === 52, cab.cartes);
  v('le cabinet n\'affiche pas de prix', !/€/.test(cab.legende), cab.legende);
  v('le cabinet ne retient rien', !/retenir/i.test(cab.bouton), cab.bouton);
  await p.click('#plgOk'); await p.waitForTimeout(600);
  e = await p.evaluate(() => __etat());
  v('fermer le cabinet ne pose aucun cuir', !e.plongee && e.cuir === '', e.cuir);

  /* ── LA PORTE ── */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(400);
  await p.evaluate(() => __porte()); await p.waitForTimeout(700);
  await p.fill('#code', '0000'); await p.waitForTimeout(300);
  v('un mauvais code n\'ouvre pas',
    await p.evaluate(() => document.getElementById('codeE').classList.contains('on')) &&
    (await p.evaluate(() => __etat())).lieu === 'galerie');
  await p.fill('#code', '1904'); await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('le bon code ouvre le boudoir', e.lieu === 'boudoir', e.lieu);

  /* ── LE BOUDOIR : tourné vers le module 3D ── */
  v('le boudoir s\'ouvre DIRECTEMENT sur le module 3D', e.scene === 'atl', e.scene);
  const bd = await p.evaluate(() => {
    const b = document.getElementById('boudoir');
    const s = getComputedStyle(b);
    return { fond: s.backgroundColor,
             bois: /url\(/.test(s.backgroundImage) ? s.backgroundImage.slice(0, 40) : 'aucune',
             barreSombre: document.getElementById('barre').classList.contains('sombre'),
             piece: document.getElementById('phImg').getBoundingClientRect(),
             rot: !!document.getElementById('rotP'),
             crans: document.querySelectorAll('.rot__c').length };
  });
  v('le boudoir est sombre', lum(rgb(bd.fond)) < .05, bd.fond);
  v('aucune texture plaquée dans le boudoir', bd.bois === 'aucune', bd.bois);
  v('la barre suit le lieu et passe en sombre', bd.barreSombre);
  v('la pièce occupe le centre du salon',
    bd.piece.width > 300 && bd.piece.height > 300, JSON.stringify(bd.piece));
  v('une commande de rotation est offerte', bd.rot && bd.crans === 8, bd.crans);

  /* le module 3D : on tourne */
  const av = await p.evaluate(() => document.getElementById('phImg').getAttribute('src'));
  await p.evaluate(() => __tourner(4)); await p.waitForTimeout(500);
  const ap = await p.evaluate(() => ({
    src: document.getElementById('phImg').getAttribute('src'),
    deg: document.getElementById('deg').textContent,
    curseur: document.getElementById('rotT').style.left,
    aria: document.getElementById('rotP').getAttribute('aria-valuenow'),
  }));
  v('tourner change le rendu', ap.src !== av);
  v('l\'angle est annoncé', ap.deg === '60°', ap.deg);
  v('le curseur de rotation suit la pièce',
    Math.abs(parseFloat(ap.curseur) - 100 / 6) < .5 && ap.aria === '60',
    ap.curseur + ' / ' + ap.aria);
  await p.evaluate(() => __tourner(20)); await p.waitForTimeout(400);
  const mir = await p.evaluate(() => ({
    miroir: document.getElementById('ph').classList.contains('miroir'),
    deg: document.getElementById('deg').textContent }));
  v('la seconde moitié est reflétée', mir.miroir && mir.deg === '300°',
    mir.deg + ' miroir=' + mir.miroir);
  await p.evaluate(() => __tourner(0)); await p.waitForTimeout(300);

  /* poser une matière */
  await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(700);
  const sombre = await p.evaluate(() => ({
    clair: document.getElementById('plg').classList.contains('plg--clair'),
    legende: document.getElementById('plgD').textContent }));
  v('depuis le boudoir la plongée reste sombre', !sombre.clair);
  await p.click('.fm[data-f="alligator"]'); await p.waitForTimeout(500);
  v('la plongée du boudoir annonce le supplément',
    /€/.test(await p.evaluate(() => document.getElementById('plgD').textContent)));
  await p.evaluate(() => { for (let i = 0; i < 5; i++) document.getElementById('plgN').click(); });
  await p.waitForTimeout(400);
  await p.click('#plgOk'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('le cuir retenu s\'inscrit', e.cuir === 'alligator:etain', e.cuir);
  v('le cuir retenu se répercute au total', e.total === 5700, e.total);
  const acc = await p.evaluate(() => ({
    opacite: getComputedStyle(document.getElementById('phT')).opacity,
    accent: getComputedStyle(document.getElementById('boudoir'))
      .getPropertyValue('--accent').trim(),
    fond: getComputedStyle(document.getElementById('boudoir')).backgroundColor,
  }));
  v('la pièce a pris sa nuance', parseFloat(acc.opacite) > .95, acc.opacite);
  v('le salon reprend la couleur en accent, pas en fond',
    acc.accent === '#6b6e73' && lum(rgb(acc.fond)) < .05, acc.accent + ' / ' + acc.fond);

  /* la pièce achevée */
  await p.click('#voirCert'); await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('la pièce achevée s\'affiche', e.scene === 'cert', e.scene);
  const cert = await p.locator('.scene[data-s="cert"]').innerText();
  v('le certificat récapitule la composition', /Alligator|Étain/.test(cert));
  v('le certificat porte l\'estimation ferme', /5\s?700/.test(cert));
  v('le certificat nomme la cliente', /Hélène/.test(cert));
  v('rien n\'est encaissé', /Aucun paiement/.test(cert));

  /* le carnet reste accessible, sans devenir la porte d'entrée */
  await p.click('.scene[data-s="cert"] .sb[data-s="carnet"]'); await p.waitForTimeout(700);
  v('le carnet est une scène secondaire',
    (await p.evaluate(() => __etat())).scene === 'carnet');
  v('le carnet montre ses pièces', await p.locator('#carnet .pos1').count() === 2);

  /* ── on ressort par le fil d'Ariane ── */
  await p.evaluate(() => document.querySelector('#fil button').click());
  await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('le fil d\'Ariane ramène à la galerie', e.lieu === 'galerie', e.lieu);
  v('la barre redevient claire en sortant',
    !(await p.evaluate(() => document.getElementById('barre').classList.contains('sombre'))));

  /* ── le rendez-vous conclut la visite ── */
  await p.evaluate(() => __lieu('rdv')); await p.waitForTimeout(500);
  await p.fill('#rNom', 'Hélène Mauro');
  await p.fill('#rMail', 'h.mauro@example.com');
  await p.click('.rdv__go'); await p.waitForTimeout(700);
  const conf = await p.locator('#rdvOk').innerText();
  v('la demande de rendez-vous se confirme', /Hélène Mauro/.test(conf), conf.replace(/\n/g, ' '));
  v('le fil de visite se retire une fois le rendez-vous pris',
    !(await p.evaluate(() => __etat())).visite);

  /* ── tout ce qui compte est embarqué ── */
  const dehors = await p.evaluate(() => {
    const ext = [];
    document.querySelectorAll('img').forEach(i => {
      const s = i.getAttribute('src') || '';
      if (s && !s.startsWith('data:')) ext.push(s.slice(0, 50));
    });
    return ext;
  });
  v('rendus et cuirs sont embarqués ; seules les photos viennent du CDN',
    dehors.every(s => s.includes('cdn.shopify.com')),
    dehors.filter(s => !s.includes('cdn')).slice(0, 3));

  await p.close();

  /* ═════════════ les autres tailles ═════════════ */
  for (const [w, h, nom] of [[1280, 800, 'tablette paysage'], [820, 1180, 'tablette portrait'],
                             [390, 844, 'téléphone']]) {
    const q = await page(w, h);
    await q.evaluate(() => __lieu('galerie')); await q.waitForTimeout(500);
    const deb = await q.evaluate(() => {
      let pire = 0, ou = '';
      ['galerie', 'atelier', 'rdv', 'boudoir'].forEach(id => {
        __lieu(id);
        const el = document.getElementById(id);
        const d = el.scrollWidth - el.clientWidth;
        if (d > pire) { pire = d; ou = id; }
      });
      return { pire, ou };
    });
    v(nom + ' : aucun débordement latéral', deb.pire <= 1, deb.pire + ' px (' + deb.ou + ')');

    await q.evaluate(() => __lieu('galerie')); await q.waitForTimeout(500);
    const oeuvre = await q.evaluate(() => {
      const o = document.querySelector('.oe');
      const r = o.getBoundingClientRect();
      const c = o.querySelector('.oe__c').getBoundingClientRect();
      const b = document.getElementById('barre').getBoundingClientRect();
      return { sousBarre: r.top >= b.bottom - 1, cartel: c.bottom <= innerHeight + 2,
               h: Math.round(c.bottom) + '/' + innerHeight };
    });
    v(nom + ' : l\'œuvre et son cartel tiennent sous la barre',
      oeuvre.sousBarre && oeuvre.cartel, oeuvre.h);

    if (w <= 760) {
      const compact = await q.evaluate(() => ({
        rdv: !!document.getElementById('versRdv').offsetParent,
        raccourcis: !!document.getElementById('versAtelier').offsetParent }));
      v(nom + ' : la barre garde le rendez-vous et laisse le reste au plan',
        compact.rdv && !compact.raccourcis, JSON.stringify(compact));
    }
    await q.evaluate(() => { __lieu('boudoir'); __scene('atl'); }); await q.waitForTimeout(700);
    const onglets = await q.evaluate(() => {
      const o = document.querySelector('.sbar__o');
      const der = o.lastElementChild.getBoundingClientRect();
      return { atteignable: o.scrollWidth - o.clientWidth <= 0 || o.scrollWidth > o.clientWidth,
               dansEcran: der.right <= innerWidth + 1 || o.scrollWidth > o.clientWidth,
               d: Math.round(der.right) + '/' + innerWidth };
    });
    v(nom + ' : les onglets du boudoir restent atteignables',
      onglets.atteignable && onglets.dansEcran, onglets.d);
    const atl = await q.evaluate(() => {
      const i = document.getElementById('phImg').getBoundingClientRect();
      const s = document.querySelector('.sbar').getBoundingClientRect();
      const r = document.querySelector('.rot').getBoundingClientRect();
      return { sousBarre: i.top >= s.bottom - 1, visible: i.width > 60 && i.height > 60,
               rotVisible: r.bottom <= innerHeight + 2 && r.width > 40,
               d: Math.round(i.top) + '/' + Math.round(s.bottom) + ' rot ' + Math.round(r.bottom) };
    });
    v(nom + ' : la pièce est entière sous la barre', atl.sousBarre && atl.visible, atl.d);
    v(nom + ' : la commande de rotation reste à l\'écran', atl.rotVisible, atl.d);
    await q.close();
  }

  await nav.close();

  console.log(cas.join('\n'));
  if (erreurs.length) {
    console.log('\nErreurs console :');
    erreurs.forEach(x => console.log('  ' + x));
  }
  console.log('\n' + ok + ' ok · ' + ko + ' échec(s) · ' + erreurs.length + ' erreur(s) console');
  process.exit(ko || erreurs.length ? 1 : 0);
})();
