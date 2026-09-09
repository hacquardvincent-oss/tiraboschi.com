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

/* ═══ MESURER LA PIÈCE, PAS LE CADRE ═══
   Une vue détourée est surtout transparente : la Colette n'occupe que
   la moitié de la largeur de sa vue. Mesurer le cadre ne dit donc rien
   de la taille à laquelle on voit le sac — et c'était précisément le
   reproche. On dessine la vue sur une toile et l'on relève la boîte de
   l'alpha : c'est la pièce.
   Cela sert aussi à vérifier qu'elle n'est PAS COUPÉE : si la matière
   touche le bas du cadre, c'est qu'on l'a tranchée à l'export. */
const MESURE = `(sel => {
  const im = document.querySelector(sel);
  if (!im || !im.naturalWidth) return null;
  const r = im.getBoundingClientRect();
  const N = 120, H = Math.max(8, Math.round(N * im.naturalHeight / im.naturalWidth));
  const c = document.createElement('canvas'); c.width = N; c.height = H;
  const x = c.getContext('2d');
  x.drawImage(im, 0, 0, N, H);
  const d = x.getImageData(0, 0, N, H).data;
  let g = N, dr = -1, ht = H, bs = -1;
  for (let j = 0; j < H; j++) for (let i = 0; i < N; i++) {
    if (d[(j * N + i) * 4 + 3] > 40) {
      if (i < g) g = i; if (i > dr) dr = i;
      if (j < ht) ht = j; if (j > bs) bs = j;
    }
  }
  if (dr < 0) return null;
  return {
    cadreL: r.width, cadreH: r.height, natif: im.naturalWidth,
    rapport: (r.width / r.height) / (im.naturalWidth / im.naturalHeight),
    pieceL: (dr - g + 1) / N * r.width,
    pieceH: (bs - ht + 1) / H * r.height,
    /* les rangées vides sous la matière : zéro = la pièce est coupée */
    sousLaPiece: (H - 1 - bs) / H,
    surLaPiece: ht / H,
    centreX: r.left + (g + dr + 1) / 2 / N * r.width,
    cadreX: r.left + r.width / 2,
    densite: im.naturalWidth / r.width,
  };
})`;

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
  v('quatre pièces y tournent', e.carTotal === 4, e.carTotal);
  const car = await p.evaluate(() => {
    const ps = [...document.querySelectorAll('.car__p')];
    return { n: ps.length,
             ici: ps.findIndex(x => x.classList.contains('car__p--ici')),
             opacites: ps.map(x => +getComputedStyle(x).opacity),
             sources: ps.map(x => (x.querySelector('img').src || '').slice(0, 15)) };
  });
  v('chaque pièce a sa vignette', car.n === 4 &&
    car.sources.every(s => s.startsWith('data:image/we')), car.sources[0]);
  /* LA PIÈCE AU CENTRE TIENT LA MOITIÉ DE L'ÉCRAN, et elle est
     DÉTOURÉE : plus de plateau de studio derrière elle. */
  const grand = await p.evaluate(MESURE + '(".car__p img")');
  /* « les sacs sont censés être beaucoup plus grands, moitié de
     l'écran ». Sur une pièce plus haute que large, c'est la HAUTEUR
     qui sature : la porter à la moitié de la largeur (720 px) lui en
     demanderait 970 de haut, plus que la fenêtre n'en a. */
  v('la pièce au centre remplit la hauteur de la scène',
    grand && grand.pieceH / 900 >= .55,
    grand && (grand.pieceH / 900 * 100).toFixed(0) + ' % de la hauteur');
  v('et elle est large', grand && grand.pieceL / 1440 >= .25,
    grand && (grand.pieceL / 1440 * 100).toFixed(0) + ' % de la largeur');
  v('elle est nette à cette taille',
    grand.natif >= 1200 && grand.densite >= 1.0,
    grand.natif + ' px natifs pour ' + Math.round(grand.cadreL) +
      ' px affichés (×' + grand.densite.toFixed(2) + ')');
  /* LE CADRE EST AU FORMAT DE LA VUE. En flex, une image bornée en
     hauteur par un pourcentage s'écrase : l'anse s'aplatissait. */
  v('la vue n\'est pas déformée', Math.abs(grand.rapport - 1) < .02,
    '×' + grand.rapport.toFixed(3));
  /* LA PIÈCE EST ENTIÈRE : de la transparence sous elle, donc rien
     n'a été tranché à l'export. */
  v('la pièce est entière, pas coupée en bas', grand.sousLaPiece > .01,
    (grand.sousLaPiece * 100).toFixed(1) + ' % de vide sous la matière');
  const coin = await p.evaluate(() => {
    const im = document.querySelector('.car__p img');
    const c = document.createElement('canvas'); c.width = c.height = 4;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0, 4, 4, 0, 0, 4, 4);
    /* la cible est le SAC, pas son cadre : une vue détourée est aux
       deux tiers transparente, et le cadre de la pièce du centre
       recouvrirait celui de ses voisines */
    const h = im.parentNode.querySelector('.car__h');
    const rh = h.getBoundingClientRect(), ri = im.getBoundingClientRect();
    return { a: x.getImageData(0, 0, 1, 1).data[3],
             cliquable: getComputedStyle(h).pointerEvents !== 'none'
               && rh.width > 60 && rh.width < ri.width * .95 };
  });
  v('elle est détourée : pas de toile derrière elle', coin.a < 24, coin.a);
  v('et elle est cliquable', coin.cliquable);
  v('celle du centre domine', car.ici === 0 && car.opacites[0] === 1,
    car.opacites.map(o => o.toFixed(2)).join(' '));
  v('les autres s\'effacent en s\'éloignant',
    car.opacites[1] < car.opacites[0] && car.opacites[2] < car.opacites[1],
    car.opacites.map(o => o.toFixed(2)).join(' '));

  /* ═══ L'ÉVENTAIL ═══
     Au repos les pièces sont SERRÉES ; sous la main elles s'écartent,
     puis se referment. À écart fixe, elles paraissaient simplement
     éloignées — c'était le reproche. */
  const ecarts = async () => p.evaluate(() => {
    const ps = [...document.querySelectorAll('.car__p')];
    const c = ps.map(x => { const r = x.getBoundingClientRect(); return r.left + r.width / 2; });
    return Math.abs(c[1] - c[0]);
  });
  const serre = await ecarts();
  const bc = await p.locator('#carS').boundingBox();
  await p.mouse.move(bc.x + bc.width * .5, bc.y + bc.height * .5);
  await p.mouse.down();
  for (let i = 1; i <= 6; i++) {
    await p.mouse.move(bc.x + bc.width * .5 - i * 9, bc.y + bc.height * .5);
    await p.waitForTimeout(30);
  }
  const ouvert = await ecarts();
  const ouv = await p.evaluate(() => __etat().ouverture);
  await p.mouse.up();
  /* on sort la main du carrousel : le survol le tient ouvert, et c'est
     voulu — sans quoi les voisines restent hors d'atteinte */
  await p.mouse.move(8, 8); await p.waitForTimeout(1500);
  const referme = await ecarts();
  v('au repos les pièces sont serrées l\'une contre l\'autre',
    serre < ouvert * .62, Math.round(serre) + ' px');
  v('sous la main l\'éventail s\'ouvre', ouvert > serre + 40 && ouv > .5,
    Math.round(serre) + ' px → ' + Math.round(ouvert) + ' px');
  v('et il se referme quand on lâche', referme < ouvert * .72,
    Math.round(referme) + ' px');
  await p.evaluate(() => __car(0)); await p.waitForTimeout(900);
  await p.click('#carN'); await p.waitForTimeout(1200);
  v('la flèche tourne l\'anneau', (await p.evaluate(() => __etat())).car === 1);

  /* ── LA PIÈCE ── */
  await p.evaluate(() => __car(0)); await p.waitForTimeout(700);
  /* CLIQUER SUR LA PIÈCE DOIT FAIRE QUELQUE CHOSE — au centre, elle
     s'ouvre ; de côté, elle vient au centre. C'était le reproche : le
     clic ne produisait rien. */
  /* on survole d'abord : l'éventail s'ouvre, et la voisine se dégage
     de derrière la pièce du centre */
  await p.hover('#carS'); await p.waitForTimeout(1300);
  await p.click('.car__p[data-id="colette-bordeaux"] .car__h');
  await p.waitForTimeout(1300);
  v('cliquer une pièce de côté l\'amène au centre',
    (await p.evaluate(() => __etat())).car === 1,
    (await p.evaluate(() => __etat())).car);
  await p.evaluate(() => __car(0)); await p.waitForTimeout(900);
  await p.click('#carGo');
  await p.waitForFunction(() => __pret(), null, { timeout: 30000 });
  await p.waitForTimeout(600);
  e = await p.evaluate(() => __etat());
  v('« prendre la pièce en main » ouvre le tour', e.scene === 'piece', e.scene);
  v('la séquence est chargée en entier', e.vues === 39, e.vues + ' vues');
  /* LA PIÈCE EST GRANDE ET NETTE DANS LE CONFIGURATEUR AUSSI */
  const dim = await p.evaluate(MESURE + '(".tour__im>img")');
  const coin2 = await p.evaluate(() => {
    const im = document.querySelector('.tour__im>img');
    const c = document.createElement('canvas'); c.width = c.height = 4;
    const x = c.getContext('2d'); x.drawImage(im, 0, 0, 4, 4, 0, 0, 4, 4);
    return x.getImageData(0, 0, 1, 1).data[3];
  });
  v('la pièce occupe la moitié de la hauteur', dim.pieceH / 900 >= .5,
    (dim.pieceH / 900 * 100).toFixed(0) + ' % de la hauteur');
  v('elle n\'est pas agrandie', dim.densite >= 1.0,
    dim.natif + ' px natifs (×' + dim.densite.toFixed(2) + ')');
  v('la vue n\'est pas déformée', Math.abs(dim.rapport - 1) < .02,
    '×' + dim.rapport.toFixed(3));
  v('la pièce est entière, pas coupée en bas', dim.sousLaPiece > .01,
    (dim.sousLaPiece * 100).toFixed(1) + ' % de vide sous la matière');
  v('elle est détourée', coin2 < 24, coin2);
  /* L'OMBRE EST UN FICHIER À PART, et la page doit vraiment la
     composer : elle était préchargée mais jamais accrochée. */
  const ombre = await p.evaluate(() => {
    const o = document.querySelector('#tourO img');
    if (!o) return null;
    const a = o.getBoundingClientRect(), b = document.getElementById('tourIm').getBoundingClientRect();
    return { src: (o.src || '').slice(0, 15), natif: o.naturalWidth,
             cale: Math.abs(a.width - b.width) < 2 && Math.abs(a.height - b.height) < 2 };
  });
  v('l\'ombre se compose sous la pièce',
    ombre && ombre.src.startsWith('data:image/we') && ombre.natif > 0,
    ombre && ombre.src);
  v('et elle est calée sur le cadre de la vue', ombre && ombre.cale);
  /* ELLE EST AU CENTRE DE L'ÉCRAN, pas de sa seule colonne : avec un
     rail « auto » à droite et un cartel plus étroit à gauche, elle
     tombait 163 px à droite du milieu. */
  v('et centrée sur l\'écran', Math.abs(dim.cadreX - 720) <= 12,
    Math.round(dim.cadreX - 720) + ' px du centre');
  v('ce sont de vraies prises de vue',
    e.source.length > 20 && (await p.evaluate(() =>
      document.querySelector('.tour__c img').src.startsWith('data:image/webp'))));

  /* ── LES POINTS SUR LA PIÈCE ──
     On désigne un élément SUR l'objet, pas seulement dans un rail. */
  const pts = await p.evaluate(() => __points());
  v('sept points se posent sur la pièce', pts.length === 7, pts.length);
  v('seuls ceux qui se voient à cet angle sont montrés',
    pts.some(x => x.vu) && pts.some(x => !x.vu),
    pts.filter(x => x.vu).map(x => x.id).join(', '));
  const surPiece = await p.evaluate(() => {
    const b = document.querySelector('.pt.vu');
    const im = document.querySelector('.tour__im img').getBoundingClientRect();
    const r = b.getBoundingClientRect();
    /* un point doit tomber SUR la pièce, pas à côté : c'était le
       défaut — posés en % de la scène, ils manquaient l'objet */
    return r.left >= im.left - 20 && r.right <= im.right + 20 &&
           r.top >= im.top - 20 && r.bottom <= im.bottom + 20;
  });
  v('un point tombe bien sur la pièce', surPiece);
  await p.click('.pt[data-pt="anse"]'); await p.waitForTimeout(1600);
  v('cliquer un point choisit son élément',
    (await p.evaluate(() => __etat())).element === 'anse');

  /* ═══ SE RAPPROCHER ═══
     « Si je clique sur l'anse, il se rapproche de moi. » Alors la
     pièce avance, le point désigné vient au centre, et la matière
     reste nette — le rapprochement se plafonne à la définition de la
     prise de vue. */
  const pres = await p.evaluate(() => __etat());
  v('cliquer un point rapproche la pièce', pres.pres && pres.approche > 1.25,
    '×' + pres.approche);
  const vise = await p.evaluate(() => {
    const b = document.querySelector('.pt[data-pt="anse"]').getBoundingClientRect();
    const c = document.getElementById('tourC').getBoundingClientRect();
    return { dx: Math.abs(b.left + b.width / 2 - (c.left + c.width / 2)),
             dy: Math.abs(b.top + b.height / 2 - (c.top + c.height / 2)),
             taille: b.width };
  });
  v('et amène l\'élément désigné au centre de la lucarne',
    vise.dx <= 26 && vise.dy <= 26,
    Math.round(vise.dx) + ' / ' + Math.round(vise.dy) + ' px');
  /* le repère vit dans le cadre : sans contre-échelle, un losange de
     30 px en ferait 78 dès qu'on s'approche et masquerait sa cible */
  v('le repère ne grossit pas avec la pièce', Math.abs(vise.taille - 30) <= 7,
    Math.round(vise.taille) + ' px');
  const net = await p.evaluate(MESURE + '(".tour__im>img")');
  v('et la matière reste nette de près', net.densite >= .85,
    '×' + net.densite.toFixed(2));
  await p.click('#tourR'); await p.waitForTimeout(1300);
  const recule = await p.evaluate(() => __etat());
  v('« voir la pièce entière » fait reculer',
    !recule.pres && recule.approche === 1, '×' + recule.approche);
  /* on peut tourner AUTOUR d'un détail tant qu'il se voit ; passé son
     arc, rester au plus près montrerait une face qui ne le porte pas */
  await p.evaluate(() => __element(6)); await p.waitForTimeout(1500);
  const ferr = await p.evaluate(() => __etat());
  await p.evaluate(() => __poser(0)); await p.waitForTimeout(500);
  v('tourner le dos à un détail fait reculer tout seul',
    ferr.pres && !(await p.evaluate(() => __etat())).pres);
  /* un second clic sur le même point ouvre la macro : pour aller plus
     près qu'une prise de vue, il faut une autre prise de vue */
  await p.evaluate(() => __element(0)); await p.waitForTimeout(1400);
  await p.click('.pt[data-pt="peau"]'); await p.waitForTimeout(800);
  v('un second clic sur le point ouvre la macro',
    (await p.evaluate(() => __etat())).zoom);
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);
  await p.evaluate(() => __reculer());

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
  await p.evaluate(() => __peau(2));
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

  /* ═══ CE QUI SE DIT SUIT LE MODÈLE ═══
     L'Olympe n'a pas de V : elle a un cordon. Montrer une photo de
     cordon sous le titre « Le V », ou légender « l'écaille » un veau
     grainé, trahit le montage aussi sûrement qu'une image mal choisie. */
  await p.evaluate(() => __car(3)); await p.waitForTimeout(900);
  await p.evaluate(() => __prendre());
  await p.waitForFunction(() => __pret(), null, { timeout: 30000 });
  await p.waitForTimeout(900);
  await p.evaluate(() => __element(1));
  await p.waitForTimeout(1300);
  const olympe = await p.evaluate(() => ({
    piece: __etat().piece,
    rail: [...document.querySelectorAll('.el__n')].map(x => x.textContent),
    t: document.getElementById('ditT').textContent.trim(),
    zl: document.getElementById('ditZl').textContent.trim(),
  }));
  v('sur l\'Olympe, le V devient le cordon', olympe.piece === 'olympe' &&
    olympe.rail[1] === 'Le cordon' && /cordon/i.test(olympe.t),
    olympe.rail[1] + ' · ' + olympe.t);
  await p.evaluate(() => __element(0)); await p.waitForTimeout(1200);
  const leg = await p.evaluate(() => document.getElementById('ditZl').textContent.trim());
  v('et la légende de la macro ne parle plus d\'écaille',
    !/écaille/i.test(leg) && leg.length > 6, leg);
  await p.evaluate(() => __reculer());
  await p.evaluate(() => __scene('car'));
  await p.evaluate(() => __car(0)); await p.waitForTimeout(600);

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
