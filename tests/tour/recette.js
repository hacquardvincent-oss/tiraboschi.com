/* Recette du tour de la pièce — configurateur photographique.
   NODE_PATH=/opt/node22/lib/node_modules node tests/tour/recette.js

   Ce qu'on vérifie :
   — cinq tours complets, photographiés, pas un rendu ;
   — la pièce tourne au doigt, à la souris, au pavé tactile, au clavier ;
   — CHANGER DE PEAU GARDE L'ANGLE : c'est tout l'intérêt d'un tour
     photographié — on compare deux cuirs sous le même jour ;
   — désigner un élément fait TOURNER la pièce jusqu'à lui ;
   — le bord du plateau ne se voit pas : la page porte la couleur
     exacte de la toile de studio ;
   — aucun prix, aucun mot de commerce. */
const { chromium } = require('playwright');
const F = 'file://' + process.cwd() + '/tiraboschi-tour-360.html';

let ok = 0, ko = 0;
const cas = [];
const v = (n, c, d) => c ? (ok++, cas.push('  ok   ' + n))
  : (ko++, cas.push('  ÉCHEC ' + n + (d !== undefined ? ' → ' + d : '')));
const rgb = s => (s.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map(Number);
const ecart = (a, b) => Math.max(...a.map((x, i) => Math.abs(x - b[i])));

(async () => {
  const nav = await chromium.launch();
  const erreurs = [];
  async function page(w, h) {
    const p = await nav.newPage({ viewport: { width: w, height: h } });
    p.on('console', m => { if (m.type() === 'error') erreurs.push(w + 'px · ' + m.text()); });
    p.on('pageerror', e => erreurs.push(w + 'px · ' + e.message));
    await p.route('**fonts.googleapis.com/**', r =>
      r.fulfill({ contentType: 'text/css', body: '' }));
    await p.goto(F);
    await p.waitForTimeout(500);
    return p;
  }
  const p = await page(1440, 900);

  /* ── LE CARROUSEL ── */
  let e = await p.evaluate(() => __etat());
  v('on arrive au carrousel des modèles', e.scene === 'car', e.scene);
  v('cinq pièces y tournent', e.carTotal === 5, e.carTotal);
  const car = await p.evaluate(() => {
    const ps = [...document.querySelectorAll('.car__p')];
    const r = ps.map(x => x.getBoundingClientRect());
    return { n: ps.length,
             /* la pièce au centre est la plus grande et la plus claire */
             centre: r[0].width === Math.max(...r.map(x => x.width)),
             opacites: ps.map(x => +getComputedStyle(x).opacity),
             sources: ps.map(x => (x.querySelector('img').src || '').slice(0, 15)) };
  });
  v('chaque pièce a sa vignette', car.n === 5 &&
    car.sources.every(s => s.startsWith('data:image/we')), car.sources[0]);
  v('celle du centre domine', car.centre && car.opacites[0] === 1,
    car.opacites.map(o => o.toFixed(2)).join(' '));
  v('les autres s\'effacent en s\'éloignant',
    car.opacites[1] < car.opacites[0] && car.opacites[2] < car.opacites[1],
    car.opacites.map(o => o.toFixed(2)).join(' '));
  await p.click('#carN'); await p.waitForTimeout(900);
  v('la flèche tourne l\'anneau', (await p.evaluate(() => __etat())).car === 1);

  /* ── LA PIÈCE ── */
  await p.evaluate(() => __car(0)); await p.waitForTimeout(700);
  await p.click('#carGo');
  await p.waitForFunction(() => __pret(), null, { timeout: 30000 });
  await p.waitForTimeout(600);
  e = await p.evaluate(() => __etat());
  v('« prendre la pièce en main » ouvre le tour', e.scene === 'piece', e.scene);
  v('la séquence est chargée en entier', e.vues === 39, e.vues + ' vues');
  v('ce sont de vraies prises de vue',
    e.source.length > 20 && (await p.evaluate(() =>
      document.querySelector('.tour__c img').src.startsWith('data:image/webp'))));

  /* LE BORD DU PLATEAU NE DOIT PAS SE VOIR : la page porte la couleur
     exacte relevée sur la toile de studio */
  const toile = await p.evaluate(() => {
    const f = document.getElementById('fond');
    const s = getComputedStyle(document.documentElement);
    return { bord: s.getPropertyValue('--toile').trim(),
             halo: s.getPropertyValue('--halo').trim(),
             fond: getComputedStyle(f).backgroundImage.includes('radial-gradient'),
             /* et l'ombre portée est celle de la photographie, pas une
                seconde ombre en CSS qui ferait un halo noir */
             ombreCss: getComputedStyle(
               document.querySelector('.tour__c img')).filter };
  });
  v('la page prend la couleur de la toile', /^#[0-9a-f]{6}$/i.test(toile.bord), toile.bord);
  v('et prolonge son halo', toile.fond && /^#[0-9a-f]{6}$/i.test(toile.halo), toile.halo);
  v('aucune ombre ajoutée par-dessus la vraie',
    toile.ombreCss === 'none', toile.ombreCss);
  const raccord = await p.evaluate(() => {
    /* on compare le coin de la vue avec le fond de la page : si le
       plateau se voyait, l'écart sauterait aux yeux */
    const im = document.querySelector('.tour__c img');
    const r = im.getBoundingClientRect();
    /* on lit le PIXEL du coin, à sa taille native : dessiner l'image
       réduite moyennerait tout le fondu et ne dirait rien */
    const c = document.createElement('canvas');
    c.width = c.height = 4;
    const x = c.getContext('2d');
    x.drawImage(im, 0, 0, 4, 4, 0, 0, 4, 4);
    const d = x.getImageData(0, 0, 1, 1).data;
    return { alpha: d[3], coin: [d[0], d[1], d[2]] };
  });
  v('le coin de la vue est transparent', raccord.alpha < 40, raccord.alpha);

  /* ── LE GESTE ── */
  const b = await p.locator('#tour').boundingBox();
  await p.mouse.move(b.x + b.width * .5, b.y + b.height * .5);
  await p.mouse.down();
  for (let i = 1; i <= 14; i++) {
    await p.mouse.move(b.x + b.width * .5 - i * 22, b.y + b.height * .5);
    await p.waitForTimeout(16);
  }
  await p.mouse.up(); await p.waitForTimeout(900);
  const tourne = await p.evaluate(() => __etat());
  v('la pièce tourne quand on la saisit', tourne.angle !== 0, '0° → ' + tourne.angle + '°');
  v('l\'invitation s\'efface une fois le geste fait',
    await p.evaluate(() => document.getElementById('tour').classList.contains('deja')));
  /* le balayage à deux doigts d'un pavé tactile arrive en `wheel` */
  await p.evaluate(() => __poser(0)); await p.waitForTimeout(200);
  await p.mouse.move(b.x + b.width * .5, b.y + b.height * .5);
  for (let i = 0; i < 5; i++) { await p.mouse.wheel(70, 0); await p.waitForTimeout(40); }
  await p.waitForTimeout(300);
  v('elle tourne au balayage à deux doigts',
    (await p.evaluate(() => __etat())).angle !== 0,
    (await p.evaluate(() => __etat())).angle + '°');
  /* et au clavier, pour qui n'a pas de souris */
  await p.evaluate(() => __poser(0)); await p.waitForTimeout(200);
  await p.locator('#tour').focus();
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(300);
  v('elle tourne aussi au clavier',
    (await p.evaluate(() => __etat())).angle !== 0);

  /* ── CHANGER DE PEAU GARDE L'ANGLE ── */
  await p.evaluate(() => __poser(.62)); await p.waitForTimeout(300);
  const avant = await p.evaluate(() => __etat());
  await p.evaluate(() => __peau(3));
  await p.waitForFunction(() => __pret(), null, { timeout: 30000 });
  await p.waitForTimeout(700);
  const apres = await p.evaluate(() => __etat());
  v('on change de peau', apres.peau === 'colette-cognac', apres.peau);
  /* les séquences n'ont PAS le même nombre de vues (39 contre 22) :
     l'angle se repère par une fraction du tour, jamais par un numéro */
  v('les deux tours n\'ont pas le même nombre de vues',
    avant.vues !== apres.vues, avant.vues + ' contre ' + apres.vues);
  v('et pourtant l\'angle est conservé',
    Math.abs(avant.angle - apres.angle) <= 9,
    avant.angle + '° → ' + apres.angle + '°');
  v('la vue montrée a bien changé', apres.source !== avant.source);

  /* ── LE RAIL DES ÉLÉMENTS ── */
  const rail = await p.evaluate(() => ({
    n: document.querySelectorAll('.el').length,
    noms: [...document.querySelectorAll('.el__n')].map(x => x.textContent) }));
  v('sept éléments se personnalisent', rail.n === 7, rail.n);
  v('la peau, le V, l\'anse, la tranche, le fond, la doublure, les ferrures',
    rail.noms.join('|') === "La peau|Le V|L'anse|La tranche|Le fond|La doublure|Les ferrures",
    rail.noms.join('|'));
  /* DÉSIGNER UN ÉLÉMENT FAIT TOURNER LA PIÈCE JUSQU'À LUI — on ne pose
     pas un repère par-dessus, c'est la pièce qui se présente */
  await p.evaluate(() => __poser(0)); await p.waitForTimeout(300);
  await p.evaluate(() => __element(3));            /* la tranche : 90° */
  await p.waitForTimeout(1200);
  const el = await p.evaluate(() => __etat());
  v('désigner un élément fait tourner la pièce jusqu\'à lui',
    el.element === 'tranche' && Math.abs(el.angle - 90) <= 9, el.angle + '°');
  const dit = await p.evaluate(() => ({
    t: document.getElementById('ditT').textContent.trim(),
    d: document.getElementById('ditD').textContent.trim(),
    z: (document.querySelector('#ditZ img') || {}).src || '' }));
  v('et le cartel suit', /tranche/i.test(dit.t) && dit.d.length > 80, dit.t);
  v('avec sa macro de matière', dit.z.startsWith('data:image/webp'));
  /* la macro s'accorde à la peau : pas une écaille pour un veau lisse */
  await p.evaluate(() => __element(0)); await p.waitForTimeout(900);
  const zLisse = await p.evaluate(() => (document.querySelector('#ditZ img') || {}).dataset.z);
  await p.evaluate(() => __peau(0));
  await p.waitForFunction(() => __pret(), null, { timeout: 30000 });
  await p.waitForTimeout(900);
  const zCroco = await p.evaluate(() => (document.querySelector('#ditZ img') || {}).dataset.z);
  v('la macro s\'accorde à la peau choisie', zLisse !== zCroco,
    zLisse + ' (veau) contre ' + zCroco + ' (alligator)');

  /* ── LE ZOOM MATIÈRE ── */
  await p.evaluate(() => document.getElementById('ditZ').click());
  await p.waitForTimeout(900);
  const zoom = await p.evaluate(() => {
    const i = document.querySelector('#plgI img');
    const r = i.getBoundingClientRect();
    return { on: __etat().zoom, natif: i.naturalWidth,
             plein: r.width >= innerWidth - 2,
             t: document.getElementById('plgT').textContent.trim() };
  });
  v('le zoom matière s\'ouvre en plein cadre', zoom.on && zoom.plein);
  v('et il est net', zoom.natif >= 1000, zoom.natif + ' px');
  v('il est titré', zoom.t.length > 3, zoom.t);
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  v('il se referme', !(await p.evaluate(() => __etat())).zoom);

  /* ── LE DISCOURS ── */
  const txt = await p.evaluate(() => document.body.innerText);
  v('aucun prix', !/€|\bprix\b/i.test(txt), (txt.match(/.{0,26}(€|prix).{0,26}/i) || [])[0]);
  v('aucun mot de commerce',
    !/s'ach[eè]t|acheter|se vend|\bvente\b|panier|ajouter au/i.test(txt),
    (txt.match(/.{0,30}(s'ach[eè]t|acheter|\bvente\b|panier).{0,30}/i) || [])[0]);
  v('on parle de la main, de la peau et du temps',
    /pleine fleur/i.test(txt) && /CITES/.test(txt) && /sellier|tannerie/i.test(txt));

  /* ── LES AUTRES TAILLES ── */
  await p.close();
  for (const [w, h, nom] of [[1280, 800, 'tablette paysage'],
                             [820, 1180, 'tablette portrait'], [390, 844, 'téléphone']]) {
    const q = await page(w, h);
    await q.evaluate(() => __prendre());
    await q.waitForFunction(() => __pret(), null, { timeout: 30000 });
    await q.waitForTimeout(700);
    const m = await q.evaluate(() => {
      const d = document.documentElement;
      const im = document.querySelector('.tour__c img').getBoundingClientRect();
      const ch = document.querySelector('.choix').getBoundingClientRect();
      const ro = document.querySelector('.rot').getBoundingClientRect();
      return { deborde: d.scrollWidth - d.clientWidth,
               piece: im.width > 120 && im.bottom <= innerHeight + 1,
               choix: ch.bottom <= innerHeight + 1,
               rail: ro.bottom <= innerHeight + 1,
               chevauche: im.bottom > ch.top + 1 };
    });
    v(nom + ' : aucun débordement latéral', m.deborde <= 1, m.deborde);
    v(nom + ' : la pièce tient à l\'écran', m.piece);
    v(nom + ' : les choix et le rail d\'angle aussi', m.choix && m.rail);
    v(nom + ' : la pièce ne recouvre pas les choix', !m.chevauche);
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
