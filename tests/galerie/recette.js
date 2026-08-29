/* Recette de la démo Galerie · Atelier · Boudoir.
   Lancer depuis la racine : NODE_PATH=/opt/node22/lib/node_modules node tests/galerie/recette.js

   Ce qu'on vérifie tient en quatre phrases :
   — la galerie est blanche, en patchwork, et ne vend rien ;
   — une œuvre s'ouvre en PLEIN ÉCRAN depuis sa propre tuile, jamais
     dans une fenêtre ;
   — on ne s'y perd pas : fil d'Ariane, plan équilibré, rendez-vous
     toujours à portée, fil de visite qui accompagne ;
   — le prix et le module 3D n'existent que dans le boudoir, qui est
     clair et tenu par des noirs. */
const { chromium } = require('playwright');
const fs = require('fs');

const F = 'file://' + process.cwd() + '/tiraboschi-galerie-demo.html';

/* Le CDN de la boutique n'est pas joignable depuis l'environnement de
   recette : on sert un rendu d'atelier déjà versionné à sa place, pour
   que la mise en page se mesure sur une image de taille réaliste. */
const SUB = fs.readFileSync('tools/rot360/hd-graine.webp');

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
      r.fulfill({ contentType: 'image/webp', body: SUB }));
    await p.route('**fonts.googleapis.com/**', r =>
      r.fulfill({ contentType: 'text/css', body: '' }));
    await p.goto(F);
    await p.waitForTimeout(400);
    return p;
  }

  /* ═════════════ 1440 × 900 — le parcours complet ═════════════ */
  const p = await page(1440, 900);
  let e = await p.evaluate(() => __etat());

  v('le seuil ouvre la démonstration', e.lieu === 'seuil', e.lieu);
  v('la barre est absente au seuil',
    !(await p.evaluate(() => document.getElementById('barre').classList.contains('on'))));
  await p.click('#entrer'); await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('« Entrer » mène directement dans la galerie', e.lieu === 'galerie', e.lieu);

  /* ── LA GALERIE EST BLANCHE ── */
  const fonds = await p.evaluate(() => ({
    galerie: getComputedStyle(document.getElementById('galerie')).backgroundColor,
    corps: getComputedStyle(document.body).backgroundColor,
  }));
  v('le fond de la galerie est un blanc pur',
    rgb(fonds.galerie).join() === '255,255,255', fonds.galerie);
  v('le fond du document est blanc', rgb(fonds.corps).join() === '255,255,255', fonds.corps);

  /* ── LE PATCHWORK ── */
  e = await p.evaluate(() => __etat());
  v('onze œuvres accrochées', e.oeuvres === 11, e.oeuvres);
  v('deux ouvertures posées dans le mur', e.ouvertures === 2, e.ouvertures);
  const patch = await p.evaluate(() => {
    const m = document.getElementById('mur');
    const s = getComputedStyle(m);
    const t = [...m.querySelectorAll('.tuile')].map(x => {
      const r = x.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), t: Math.round(r.top) };
    });
    const larg = t.map(x => x.w), haut = t.map(x => x.h), hauts = t.map(x => x.t);
    return {
      grille: s.display,
      lignes: s.gridTemplateRows.split(' ').length,
      debordeX: m.scrollWidth - m.clientWidth,
      debordeY: m.scrollHeight - m.clientHeight,
      formats: new Set(larg.map(w => w + 'x')).size,
      ecartLarge: Math.max(...larg) / Math.min(...larg),
      ecartHaut: Math.max(...haut) / Math.min(...haut),
      niveaux: new Set(hauts.map(h => Math.round(h / 20))).size,
      plusGrande: Math.max(...larg),
    };
  });
  v('le mur est une trame de douze lignes',
    patch.grille === 'grid' && patch.lignes === 12, patch.grille + ' · ' + patch.lignes);
  v('le mur se parcourt à l\'horizontale', patch.debordeX > 2000, patch.debordeX);
  v('le mur ne déborde pas à la verticale', patch.debordeY <= 1, patch.debordeY);
  /* le patchwork, c'est l'inégalité des formats ET des hauteurs d'accrochage */
  v('les formats sont franchement inégaux',
    patch.ecartLarge >= 1.6 && patch.ecartHaut >= 1.9,
    'largeurs ×' + patch.ecartLarge.toFixed(2) + ' · hauteurs ×' + patch.ecartHaut.toFixed(2));
  v('les œuvres ne sont pas toutes accrochées à la même hauteur',
    patch.niveaux >= 4, patch.niveaux + ' niveaux');
  v('les visuels sont grands', patch.plusGrande >= 500, patch.plusGrande + ' px');

  /* la molette fait marcher */
  await p.hover('.tuile');
  await p.mouse.wheel(0, 700); await p.waitForTimeout(600);
  const marche = await p.evaluate(() => ({
    x: document.getElementById('mur').scrollLeft,
    barre: document.getElementById('marcheB').style.width,
    n: document.getElementById('marcheN').textContent,
  }));
  v('la molette fait marcher le long du mur', marche.x > 150, marche.x);
  v('la progression se lit', parseFloat(marche.barre) > 0, marche.barre);
  v('le repère nomme l\'œuvre courante', /Œuvre \d+ sur 11/.test(marche.n), marche.n);

  /* les tuiles se révèlent en avançant */
  const revele = await p.evaluate(() => document.querySelectorAll('.tuile.vu').length);
  v('les tuiles se lèvent à mesure qu\'on avance', revele >= 2, revele);

  /* ── LE PLEIN ÉCRAN ── */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(400);
  await p.evaluate(() => __plein(0)); await p.waitForTimeout(1200);
  e = await p.evaluate(() => __etat());
  v('l\'œuvre s\'ouvre en plein écran', e.plein && e.pleinIdx === 0);
  const grand = await p.evaluate(() => {
    const pl = document.getElementById('plein');
    const r = pl.getBoundingClientRect();
    const ph = document.getElementById('pleinPh').getBoundingClientRect();
    return { pleinEcran: Math.round(r.width) === innerWidth && Math.round(r.height) === innerHeight,
             image: Math.round(ph.height), fenetre: Math.round(innerHeight * .45),
             fond: getComputedStyle(pl).backgroundColor };
  });
  v('le plein écran occupe tout l\'écran', grand.pleinEcran);
  v('l\'image y est vraiment grande', grand.image > grand.fenetre,
    grand.image + ' px de haut · seuil ' + grand.fenetre);
  const cote = await p.evaluate(() => {
    const ph = document.getElementById('pleinPh').getBoundingClientRect();
    const c = document.querySelector('.plein__c').getBoundingClientRect();
    return { aCote: ph.right <= c.left + 1, part: ph.height / innerHeight };
  });
  v('le cartel se lit à côté de l\'œuvre, pas sous elle', cote.aCote);
  v('l\'œuvre occupe la hauteur de l\'écran',
    cote.part > .7, (cote.part * 100).toFixed(0) + ' % de la hauteur');
  v('le plein écran est blanc', rgb(grand.fond).join() === '255,255,255', grand.fond);
  const cart = await p.locator('#plein').innerText();
  v('le cartel accompagne l\'œuvre', /dimensions|matières|façonnage/i.test(cart));
  v('aucun prix en plein écran', !/€/.test(cart), (cart.match(/.{0,26}€.{0,26}/) || [])[0]);
  v('la seule action est de demander à voir',
    (await p.locator('#pleinGo').innerText()).toLowerCase().includes('demander'));
  const monte = await p.evaluate(() => ({
    dit: document.getElementById('plein').classList.contains('dit'),
    o: getComputedStyle(document.querySelector('.plein__c .mt')).opacity }));
  v('le cartel est monté après l\'image', monte.dit && parseFloat(monte.o) > .9,
    JSON.stringify(monte));
  /* la tuile d'origine est masquée le temps de l'ouverture : sinon on
     verrait l'œuvre à deux endroits */
  const source = await p.evaluate(() =>
    document.querySelector('.tuile[data-oe="rafael"] .tuile__m').style.visibility);
  v('la tuile d\'origine s\'efface pendant l\'ouverture', source === 'hidden', source);

  /* on passe d'une œuvre à l'autre sans repasser par le mur */
  await p.click('#pleinN'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('la flèche mène à l\'œuvre suivante', e.plein && e.pleinIdx === 1, e.pleinIdx);
  v('le titre a suivi', /Colette/.test(await p.locator('#pleinN2').innerText()));
  await p.keyboard.press('ArrowRight'); await p.waitForTimeout(900);
  v('le clavier avance aussi', (await p.evaluate(() => __etat())).pleinIdx === 2);

  /* une pièce d'exception : le rendu prend sa nuance */
  await p.evaluate(() => __plein(3)); await p.waitForTimeout(900);
  const teinte = await p.evaluate(() => {
    const t = getComputedStyle(document.getElementById('pleinT'));
    const i = document.getElementById('pleinImg');
    return { fond: t.backgroundColor, masque: t.maskImage.slice(0, 24),
             src: i.getAttribute('src').slice(0, 22), large: i.naturalWidth };
  });
  v('la pièce d\'exception est teintée', rgb(teinte.fond).join() === '30,58,48', teinte.fond);
  v('la teinte passe par le masque du cuir', teinte.masque.includes('url('), teinte.masque);
  v('le rendu est embarqué',
    teinte.src.startsWith('data:image/webp') && teinte.large > 300, teinte.src);
  /* une photographie ordinaire ne doit pas hériter du masque précédent */
  await p.evaluate(() => __plein(5)); await p.waitForTimeout(700);
  const propre = await p.evaluate(() => {
    const t = getComputedStyle(document.getElementById('pleinT'));
    return { masque: t.maskImage, fond: t.backgroundColor,
             src: document.getElementById('pleinImg').getAttribute('src').slice(0, 22) };
  });
  v('le plein écran se nettoie entre deux œuvres',
    propre.masque === 'none' && rgb(propre.fond).join() === '0,0,0',
    propre.masque.slice(0, 18) + ' / ' + propre.fond);
  v('les sculptures de la maison sont embarquées',
    propre.src.startsWith('data:image/webp'), propre.src);

  await p.evaluate(() => __fermerPlein()); await p.waitForTimeout(1100);
  e = await p.evaluate(() => __etat());
  v('on referme et l\'on revient au mur', !e.plein && e.lieu === 'galerie');
  const rendue = await p.evaluate(() =>
    [...document.querySelectorAll('.tuile__m')].every(m => m.style.visibility !== 'hidden'));
  v('toutes les tuiles sont rendues au mur', rendue);

  /* ── LE FIL DE VISITE ── */
  e = await p.evaluate(() => __etat());
  v('le fil de visite apparaît après deux œuvres', e.visite && e.vues >= 2,
    'vues=' + e.vues + ' visible=' + e.visite);
  v('le fil conduit au rendez-vous',
    /rendez-vous/i.test(await p.locator('#visiteGo').innerText()));

  /* ── LE PLAN : quatre lignes ÉQUILIBRÉES ── */
  await p.click('#planB'); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('le plan s\'ouvre', e.plan);
  const lignes = await p.evaluate(() => [...document.querySelectorAll('.pl')].map(l => {
    const r = l.getBoundingClientRect();
    const n = l.querySelector('.pl__n').getBoundingClientRect();
    const i = l.querySelector('.pl__i').getBoundingClientRect();
    const d = l.querySelector('.pl__d').getBoundingClientRect();
    const mil = r.top + r.height / 2;
    return { h: Math.round(r.height),
             ecartNum: Math.abs((i.top + i.height / 2) - (n.top + n.height / 2)),
             ecartDesc: Math.abs((d.top + d.height / 2) - mil) };
  }));
  const hauteurs = lignes.map(l => l.h);
  v('les quatre lignes du plan ont la même hauteur',
    Math.max(...hauteurs) - Math.min(...hauteurs) <= 1, hauteurs.join(' / '));
  v('le numéro est aligné sur le nom, ligne par ligne',
    lignes.every(l => l.ecartNum <= 2), lignes.map(l => l.ecartNum.toFixed(1)).join(' / '));
  v('la description est centrée dans sa ligne',
    lignes.every(l => l.ecartDesc <= 2), lignes.map(l => l.ecartDesc.toFixed(1)).join(' / '));
  const plan = await p.locator('#plan').innerText();
  v('le plan signale l\'accès réservé du boudoir', /réservé/i.test(plan));
  /* l'apostrophe ne doit pas être séparée de l'italique qui la suit */
  const noms = await p.evaluate(() =>
    [...document.querySelectorAll('.pl__n')].map(n => n.firstChild.textContent +
      (n.querySelector('em') ? n.querySelector('em').textContent : '')));
  v('les noms du plan n\'ont pas d\'espace parasite',
    noms.join('|') === "La Galerie|L'Atelier|Le Boudoir|Le Rendez-vous", noms.join('|'));
  v('aucun prix dans le plan', !/€/.test(plan), (plan.match(/.{0,26}€.{0,26}/) || [])[0]);
  const clos = await p.evaluate(() => {
    const n = document.querySelector('.pl[data-clos] .pl__n');
    const s = getComputedStyle(n);
    return { c: s.color, o: parseFloat(s.opacity), t: parseFloat(s.fontSize) };
  });
  v('le titre réservé reste lisible',
    contraste(rgb(clos.c).map(x => Math.round(255 + (x - 255) * clos.o)), [255, 255, 255]) >= 3
    && clos.t >= 24,
    contraste(rgb(clos.c).map(x => Math.round(255 + (x - 255) * clos.o)), [255, 255, 255])
      .toFixed(2) + ':1');
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  v('Échap referme le plan', !(await p.evaluate(() => __etat())).plan);

  /* ── LA PROMESSE : rien ne se vend hors du boudoir ── */
  for (const id of ['galerie', 'atelier', 'rdv']) {
    await p.evaluate(i => __lieu(i), id); await p.waitForTimeout(400);
    const txt = await p.locator('#' + id).innerText();
    v('aucun prix dans « ' + id + ' »', !/€|\bprix\b|panier|ajouter au/i.test(txt),
      (txt.match(/.{0,30}(€|\bprix\b|panier).{0,30}/i) || [])[0]);
  }

  /* ── L'ATELIER ── */
  await p.evaluate(() => __lieu('atelier')); await p.waitForTimeout(700);
  e = await p.evaluate(() => __etat());
  v('l\'atelier est un lieu à part', e.lieu === 'atelier', e.lieu);
  v('le fil d\'Ariane garde le chemin de retour', /GALERIE.*ATELIER/i.test(e.ariane), e.ariane);
  const at = await p.evaluate(() => {
    const a = document.getElementById('atelier');
    return { gestes: document.querySelectorAll('.geste').length,
             y: a.scrollHeight - a.clientHeight, x: a.scrollWidth - a.clientWidth,
             fond: getComputedStyle(a).backgroundColor };
  });
  v('six gestes composent l\'atelier', at.gestes === 6, at.gestes);
  v('l\'atelier se descend', at.y > 600, at.y);
  v('l\'atelier ne déborde pas latéralement', at.x <= 1, at.x);
  v('l\'atelier reste clair', lum(rgb(at.fond)) > .85, at.fond);
  await p.evaluate(() => { document.getElementById('atelier').scrollTop = 900; });
  await p.waitForTimeout(900);
  v('les gestes se révèlent au défilement',
    (await p.evaluate(() => document.querySelectorAll('[data-rev].vu').length)) >= 2);

  /* le cabinet des matières */
  await p.evaluate(() => __cabinet()); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('le cabinet ouvre la plongée', e.plongee && e.cabinet);
  const cab = await p.evaluate(() => ({
    fond: getComputedStyle(document.querySelector('.plg__bg')).backgroundColor,
    texte: getComputedStyle(document.getElementById('plgNom')).color,
    legende: document.getElementById('plgD').textContent,
    bouton: document.getElementById('plgOk').textContent,
    familles: document.querySelectorAll('.fm').length,
    cartes: document.querySelectorAll('.sw').length,
  }));
  v('le cabinet est clair', rgb(cab.fond).join() === '255,255,255', cab.fond);
  v('le cabinet reste lisible', contraste(rgb(cab.texte), rgb(cab.fond)) >= 4.5,
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

  /* ── LE BOUDOIR : CLAIR, tenu par des noirs, tourné vers le 3D ── */
  v('le boudoir s\'ouvre DIRECTEMENT sur le module 3D', e.scene === 'atl', e.scene);
  const bd = await p.evaluate(() => {
    const b = document.getElementById('boudoir');
    const s = getComputedStyle(b);
    const t = document.querySelector('.tot');
    const st = getComputedStyle(t);
    return { fond: s.backgroundColor,
             texture: /url\(/.test(s.backgroundImage) ? 'oui' : 'aucune',
             bloc: st.backgroundColor, blocTexte: st.color,
             piece: document.getElementById('phImg').getBoundingClientRect(),
             crans: document.querySelectorAll('.rot__c').length };
  });
  v('le boudoir est clair', lum(rgb(bd.fond)) > .9, bd.fond);
  v('aucune texture plaquée dans le boudoir', bd.texture === 'aucune', bd.texture);
  /* le seul aplat sombre du salon, et c'est le prix */
  v('l\'estimation est posée en noir', lum(rgb(bd.bloc)) < .05, bd.bloc);
  v('elle reste lisible', contraste(rgb(bd.blocTexte), rgb(bd.bloc)) >= 4.5,
    contraste(rgb(bd.blocTexte), rgb(bd.bloc)).toFixed(2) + ':1');
  v('la pièce occupe le centre du salon',
    bd.piece.width > 300 && bd.piece.height > 300, JSON.stringify(bd.piece));
  v('une commande de rotation est offerte', bd.crans === 8, bd.crans);
  /* rien de la fiche ne doit passer sous la sous-barre du salon */
  const sousBarre = await p.evaluate(() => {
    const s = document.querySelector('.scene.on .sbar').getBoundingClientRect();
    const k = document.querySelector('.fiche__k').getBoundingClientRect();
    const i = document.getElementById('phImg').getBoundingClientRect();
    return { fiche: Math.round(k.top - s.bottom), piece: Math.round(i.top - s.bottom) };
  });
  v('la fiche commence sous la sous-barre', sousBarre.fiche >= 0, sousBarre.fiche + ' px');
  v('la pièce aussi', sousBarre.piece >= 0, sousBarre.piece + ' px');

  const av = await p.evaluate(() => document.getElementById('phImg').getAttribute('src'));
  await p.evaluate(() => __tourner(4)); await p.waitForTimeout(500);
  const ap = await p.evaluate(() => ({
    src: document.getElementById('phImg').getAttribute('src'),
    deg: document.getElementById('deg').textContent,
    curseur: document.getElementById('rotT').style.left,
    aria: document.getElementById('rotP').getAttribute('aria-valuenow') }));
  v('tourner change le rendu', ap.src !== av);
  v('l\'angle est annoncé', ap.deg === '60°', ap.deg);
  v('le curseur de rotation suit la pièce',
    Math.abs(parseFloat(ap.curseur) - 100 / 6) < .5 && ap.aria === '60',
    ap.curseur + ' / ' + ap.aria);
  await p.evaluate(() => __tourner(20)); await p.waitForTimeout(400);
  const mir = await p.evaluate(() => ({
    miroir: document.getElementById('ph').classList.contains('miroir'),
    deg: document.getElementById('deg').textContent }));
  v('la seconde moitié est reflétée', mir.miroir && mir.deg === '300°', mir.deg);
  await p.evaluate(() => __tourner(0)); await p.waitForTimeout(300);

  /* poser une matière */
  await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(700);
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
    fond: getComputedStyle(document.getElementById('boudoir')).backgroundColor }));
  v('la pièce a pris sa nuance', parseFloat(acc.opacite) > .95, acc.opacite);
  v('le salon reprend la couleur en accent, pas en fond',
    acc.accent === '#6b6e73' && lum(rgb(acc.fond)) > .9, acc.accent + ' / ' + acc.fond);

  await p.click('#voirCert'); await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('la pièce achevée s\'affiche', e.scene === 'cert', e.scene);
  const cert = await p.locator('.scene[data-s="cert"]').innerText();
  v('le certificat récapitule la composition', /Alligator|Étain/.test(cert));
  v('le certificat porte l\'estimation ferme', /5\s?700/.test(cert));
  v('le certificat nomme la cliente', /Hélène/.test(cert));
  v('rien n\'est encaissé', /Aucun paiement/.test(cert));
  await p.click('.scene[data-s="cert"] .sb[data-s="carnet"]'); await p.waitForTimeout(700);
  v('le carnet est une scène secondaire',
    (await p.evaluate(() => __etat())).scene === 'carnet');
  v('le carnet montre ses pièces', await p.locator('#carnet .pos1').count() === 2);

  /* on ressort par le fil d'Ariane */
  await p.evaluate(() => document.querySelector('#fil button').click());
  await p.waitForTimeout(800);
  v('le fil d\'Ariane ramène à la galerie',
    (await p.evaluate(() => __etat())).lieu === 'galerie');

  /* le rendez-vous conclut */
  await p.evaluate(() => __lieu('rdv')); await p.waitForTimeout(500);
  await p.fill('#rNom', 'Hélène Mauro');
  await p.fill('#rMail', 'h.mauro@example.com');
  await p.click('.rdv__go'); await p.waitForTimeout(700);
  v('la demande de rendez-vous se confirme',
    /Hélène Mauro/.test(await p.locator('#rdvOk').innerText()));
  v('le fil de visite se retire une fois le rendez-vous pris',
    !(await p.evaluate(() => __etat())).visite);

  /* tout ce qui compte est embarqué */
  const dehors = await p.evaluate(() => {
    const ext = [];
    document.querySelectorAll('img').forEach(i => {
      const s = i.getAttribute('src') || '';
      if (s && !s.startsWith('data:')) ext.push(s.slice(0, 50));
    });
    return ext;
  });
  v('sculptures, vues de galerie, rendus et cuirs sont embarqués',
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
    const mur = await q.evaluate(() => {
      const m = document.getElementById('mur');
      const t = m.querySelector('.tuile').getBoundingClientRect();
      const b = document.getElementById('barre').getBoundingClientRect();
      return { sousBarre: t.top >= b.bottom - 1, large: Math.round(t.width),
               deborde: m.scrollWidth - m.clientWidth };
    });
    v(nom + ' : le mur ne déborde pas de son axe', mur.deborde <= 1 || mur.deborde > 200,
      mur.deborde);
    v(nom + ' : la première tuile est sous la barre', mur.sousBarre, mur.large);

    /* aucune œuvre ne doit en recouvrir une autre — c'est la règle d'un
       accrochage, et le repli en colonnes l'avait cassée */
    const chev = await q.evaluate(() => {
      const m = document.getElementById('mur');
      /* on lève toutes les tuiles : sinon on mesure pendant l'animation
         de révélation, qui décale de 16 px */
      m.querySelectorAll('.tuile,.ouv').forEach(t => t.classList.add('vu'));
      /* offset* plutôt que getBoundingClientRect : on mesure la MISE EN
         PAGE, pas la position animée par les transformations de révélation */
      const b = [...m.children].map(c => ({
        x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight,
        n: c.className.split(' ')[0] }));
      let n = 0, ex = '';
      for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
        const a = b[i], e = b[j];
        if (a.x < e.x + e.w - 1 && e.x < a.x + a.w - 1 &&
            a.y < e.y + e.h - 1 && e.y < a.y + a.h - 1) {
          n++; if (!ex) ex = a.n + '#' + i + ' × ' + e.n + '#' + j;
        }
      }
      return { n, ex };
    });
    v(nom + ' : aucune œuvre n\'en recouvre une autre', chev.n === 0,
      chev.n + ' chevauchement(s) · ' + chev.ex);

    /* le plein écran doit tenir à l'écran, quelle que soit la taille */
    await q.evaluate(() => __plein(0)); await q.waitForTimeout(1100);
    const pe = await q.evaluate(() => {
      const ph = document.getElementById('pleinPh').getBoundingClientRect();
      const c = document.querySelector('.plein__c').getBoundingClientRect();
      const g = document.getElementById('pleinGo').getBoundingClientRect();
      /* le cartel est À CÔTÉ de l'œuvre en large, DESSOUS en étroit :
         dans les deux cas ils ne doivent pas se recouvrir */
      const cote = ph.right <= c.left + 1, dessous = ph.bottom <= c.top + 1;
      return { dansEcran: ph.top >= -1 && (cote || dessous),
               ctaVisible: g.bottom <= innerHeight + 1 && g.width > 40,
               d: (cote ? 'à côté ' : 'dessous ') +
                  Math.round(ph.right) + '/' + Math.round(c.left) + ' · ' +
                  Math.round(ph.bottom) + '/' + Math.round(c.top) };
    });
    v(nom + ' : l\'image et le cartel ne se recouvrent pas', pe.dansEcran, pe.d);
    v(nom + ' : le bouton de rendez-vous reste à l\'écran', pe.ctaVisible);
    await q.evaluate(() => __fermerPlein()); await q.waitForTimeout(800);

    if (w <= 760) {
      const compact = await q.evaluate(() => ({
        rdv: !!document.getElementById('versRdv').offsetParent,
        raccourcis: !!document.getElementById('versAtelier').offsetParent }));
      v(nom + ' : la barre garde le rendez-vous et laisse le reste au plan',
        compact.rdv && !compact.raccourcis, JSON.stringify(compact));
    }

    await q.evaluate(() => { __lieu('boudoir'); __scene('atl'); }); await q.waitForTimeout(700);
    const atl = await q.evaluate(() => {
      const i = document.getElementById('phImg').getBoundingClientRect();
      const s = document.querySelector('.sbar').getBoundingClientRect();
      const r = document.querySelector('.rot').getBoundingClientRect();
      return { sousBarre: i.top >= s.bottom - 1, visible: i.width > 60 && i.height > 60,
               rotVisible: r.bottom <= innerHeight + 2 && r.width > 40,
               d: Math.round(i.top) + '/' + Math.round(s.bottom) };
    });
    v(nom + ' : la pièce est entière sous la barre', atl.sousBarre && atl.visible, atl.d);
    v(nom + ' : la commande de rotation reste à l\'écran', atl.rotVisible);
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
