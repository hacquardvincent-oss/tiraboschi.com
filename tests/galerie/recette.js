/* Recette de la démo Galerie · Atelier · Maison · Boudoir.
   Lancer depuis la racine : NODE_PATH=/opt/node22/lib/node_modules node tests/galerie/recette.js

   Ce qu'on vérifie :
   — la galerie est blanche, tient sur les photographies de la maison,
     et ne vend rien ;
   — une pièce s'ouvre en PLEIN ÉCRAN depuis sa propre tuile ;
   — chaque lieu a sa façon de se déplacer, et l'on ne s'y perd pas ;
   — le boudoir s'ouvre en traçant un T, et la pièce s'y tourne AU
     DOIGT autant qu'au rail ;
   — le prix n'existe que dans le boudoir. */
const { chromium } = require('playwright');

const F = 'file://' + process.cwd() + '/tiraboschi-galerie-demo.html';

let ok = 0, ko = 0;
const cas = [];
function v(nom, cond, detail) {
  if (cond) { ok++; cas.push('  ok   ' + nom); }
  else { ko++; cas.push('  ÉCHEC ' + nom + (detail !== undefined ? ' → ' + detail : '')); }
}
const lin = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
const lum = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
const contraste = (a, b) => {
  const la = lum(a), lb = lum(b);
  return (Math.max(la, lb) + .05) / (Math.min(la, lb) + .05);
};
const rgb = s => (s.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map(Number);

/* glisser à la souris, comme on prendrait la pièce */
async function glisser(p, x, y, dx, pas) {
  await p.mouse.move(x, y);
  await p.mouse.down();
  for (let i = 1; i <= (pas || 12); i++) {
    await p.mouse.move(x + dx * i / (pas || 12), y);
    await p.waitForTimeout(16);
  }
  await p.mouse.up();
}

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
    await p.waitForTimeout(400);
    return p;
  }

  /* ═════════════ 1440 × 900 ═════════════ */
  const p = await page(1440, 900);
  let e = await p.evaluate(() => __etat());
  v('le seuil ouvre la démonstration', e.lieu === 'seuil', e.lieu);
  await p.click('#entrer'); await p.waitForTimeout(1100);
  e = await p.evaluate(() => __etat());
  v('« Entrer » mène à l\'accueil', e.lieu === 'accueil', e.lieu);

  /* ── L'ACCUEIL : une vraie page, tenue par un en-tête et un pied ── */
  const ac = await p.evaluate(() => {
    const a = document.getElementById('accueil');
    const h = document.querySelector('.acc__h').getBoundingClientRect();
    const e = document.getElementById('ent').getBoundingClientRect();
    return { logo: document.querySelector('.ent__logo').textContent.trim().slice(0, 11),
             nav: document.querySelectorAll('.ent__n .lien').length,
             enTete: Math.round(e.top) === 0 && e.width >= innerWidth - 1,
             pose: document.getElementById('ent').classList.contains('pose'),
             hero: Math.abs(h.height - innerHeight) < 2,
             pieces: document.querySelectorAll('.q').length,
             pied: document.querySelectorAll('.pied li button').length,
             defile: a.scrollHeight - a.clientHeight,
             barre: document.getElementById('barre').classList.contains('on') };
  });
  v('l\'accueil porte un logo', /Tiraboschi/i.test(ac.logo), ac.logo);
  v('un menu et un rendez-vous', ac.nav === 5, ac.nav);
  v('l\'en-tête est posé en haut', ac.enTete);
  v('il est transparent sur le hero', !ac.pose);
  v('le hero occupe la page entière', ac.hero);
  v('les quatre pièces sont des bandes, pas une liste', ac.pieces === 4, ac.pieces);
  v('un pied de page donne les entrées', ac.pied >= 8, ac.pied);
  v('la page se descend', ac.defile > 1200, ac.defile);
  v('la barre de lieu ne s\'impose pas ici', !ac.barre);

  /* entrebâiller une bande l'ouvre */
  const avant = await p.evaluate(() =>
    document.querySelectorAll('.q')[1].getBoundingClientRect().width);
  await p.hover('.q:nth-child(2)'); await p.waitForTimeout(1300);
  const apres = await p.evaluate(() =>
    document.querySelectorAll('.q')[1].getBoundingClientRect().width);
  v('une bande s\'ouvre quand on la désigne', apres > avant * 1.4,
    Math.round(avant) + ' → ' + Math.round(apres));

  /* l'en-tête se pose dès qu'on quitte le hero */
  await p.evaluate(() => { document.getElementById('accueil').scrollTop = innerHeight * 1.2; });
  await p.waitForTimeout(700);
  const pose = await p.evaluate(() => ({
    pose: document.getElementById('ent').classList.contains('pose'),
    fond: getComputedStyle(document.getElementById('ent')).backgroundColor,
    texte: getComputedStyle(document.getElementById('ent')).color }));
  v('l\'en-tête se pose en descendant', pose.pose);
  v('il reste lisible une fois posé',
    contraste(rgb(pose.texte), [255, 255, 255]) >= 4.5,
    contraste(rgb(pose.texte), [255, 255, 255]).toFixed(1) + ':1');

  /* ── LE DISCOURS : on ne parle jamais de commerce ── */
  const interdits = /s'ach[eè]t|acheter|se vend|à vendre|\bvente\b|panier|ajouter au|boutique en ligne/i;
  for (const id of ['accueil', 'erreur']) {
    await p.evaluate(i => __lieu(i), id); await p.waitForTimeout(500);
    const t = await p.locator('#' + id).innerText();
    v('aucun mot de commerce dans « ' + id + ' »', !interdits.test(t),
      (t.match(new RegExp('.{0,30}(' + interdits.source + ').{0,30}', 'i')) || [])[0]);
  }

  /* ── LA PAGE INTROUVABLE reprend la liste, à sa place ── */
  e = await p.evaluate(() => __etat());
  v('la page introuvable est un lieu', e.lieu === 'erreur', e.lieu);
  const er = await p.evaluate(() => ({
    entrees: document.querySelectorAll('#erL .ap').length,
    titre: document.querySelector('.er__t').textContent.replace(/\s+/g, ' ').trim(),
    fond: getComputedStyle(document.getElementById('erreur')).backgroundColor }));
  v('elle reprend les quatre pièces', er.entrees === 4, er.entrees);
  v('elle le dit sans jargon', /porte/i.test(er.titre), er.titre);
  v('elle est sombre', lum(rgb(er.fond)) < .04, er.fond);
  await p.evaluate(() => __lieu('accueil')); await p.waitForTimeout(600);
  await p.evaluate(() => { document.getElementById('accueil').scrollTop = 0; });
  await p.waitForTimeout(400);
  await p.click('.q:nth-child(1)'); await p.waitForTimeout(1200);
  e = await p.evaluate(() => __etat());
  v('la première bande mène à la galerie', e.lieu === 'galerie', e.lieu);

  /* ── plus une seule image d'emprunt : tout vient de la maison ── */
  const sources = await p.evaluate(() => {
    const s = [];
    document.querySelectorAll('img').forEach(i => s.push(i.getAttribute('src') || ''));
    const p = s.filter(x => !x.startsWith('data:image/gif'));
    return { total: p.length, externes: p.filter(x => x && !x.startsWith('data:')).length,
             vides: p.filter(x => !x).length };
  });
  v('toutes les photographies sont embarquées',
    sources.externes === 0 && sources.vides === 0, JSON.stringify(sources));
  const casses = await p.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter(i => !(i.getAttribute('src') || '').startsWith('data:image/gif'))
      .filter(i => i.complete && i.naturalWidth === 0).length);
  v('aucune image cassée', casses === 0, casses);

  /* ── le mur ── */
  v('le fond de la galerie est blanc',
    rgb(await p.evaluate(() => getComputedStyle(document.getElementById('galerie'))
      .backgroundColor)).join() === '255,255,255');
  v('trente-sept pièces accrochées', e.oeuvres === 37, e.oeuvres);
  v('dont trente-deux au nuancier', e.nuancier === 32, e.nuancier);
  const hero = await p.evaluate(() => {
    const h = document.querySelector('.hero');
    if (!h) return null;
    const r = h.getBoundingClientRect();
    return { large: Math.round(r.width), haut: Math.round(r.height),
             part: r.width / innerWidth };
  });
  v('la galerie s\'ouvre sur un grand visuel', hero && hero.part > .55,
    hero && hero.part.toFixed(2));
  /* les tuiles ont grandi */
  const taille = await p.evaluate(() => {
    const t = [...document.querySelectorAll('.tuile')].map(x => x.getBoundingClientRect().width);
    const n = [...document.querySelectorAll('.tuile--nu')].map(x => x.getBoundingClientRect().width);
    return { max: Math.round(Math.max(...t)), nu: Math.round(n[0]) };
  });
  v('les silhouettes sont grandes', taille.max >= 550, taille.max + ' px');
  v('les pièces du nuancier aussi', taille.nu >= 280, taille.nu + ' px');
  v('trois ouvertures dans le mur', e.ouvertures === 3, e.ouvertures);
  const ouv = await p.evaluate(() =>
    [...document.querySelectorAll('.ouv')].map(o => o.dataset.ouv).join());
  v('l\'Atelier, le Boudoir et la Maison se rencontrent en marchant',
    ouv === 'atelier,serrure,maison', ouv);

  const patch = await p.evaluate(() => {
    const m = document.getElementById('mur');
    const t = [...m.querySelectorAll('.tuile:not(.tuile--nu)')].map(x => {
      const r = x.getBoundingClientRect(); return { w: r.width, h: r.height, t: r.top };
    });
    const n = [...m.querySelectorAll('.tuile--nu')].map(x => {
      const r = x.getBoundingClientRect(); return { w: Math.round(r.width), t: Math.round(r.top) };
    });
    return { debordeX: m.scrollWidth - m.clientWidth, debordeY: m.scrollHeight - m.clientHeight,
             ecartL: Math.max(...t.map(x => x.w)) / Math.min(...t.map(x => x.w)),
             niveaux: new Set(t.map(x => Math.round(x.t / 20))).size,
             nuLarg: new Set(n.map(x => x.w)).size,
             nuBandes: new Set(n.map(x => x.t)).size };
  });
  v('le mur se parcourt à l\'horizontale', patch.debordeX > 2500, patch.debordeX);
  v('le mur ne déborde pas à la verticale', patch.debordeY <= 1, patch.debordeY);
  /* les silhouettes sont accrochées librement… */
  v('les silhouettes ont des formats inégaux', patch.ecartL >= 1.5, patch.ecartL.toFixed(2));
  v('elles ne sont pas à la même hauteur', patch.niveaux >= 4, patch.niveaux);
  /* …le nuancier, lui, est une grille stricte */
  v('le nuancier est une grille régulière',
    patch.nuLarg === 1 && patch.nuBandes === 3,
    patch.nuLarg + ' largeur(s) · ' + patch.nuBandes + ' bande(s)');
  /* il est MERCHANDISÉ : la carte va du clair au foncé par famille,
     elle ne suit pas l'ordre des prises de vue */
  const rangement = await p.evaluate(() => {
    const noms = [...document.querySelectorAll('.tuile--nu .tuile__n')].map(n => n.textContent);
    return { noms, tete: noms.slice(0, 7).join(', '), queue: noms.slice(-2).join(', ') };
  });
  v('la carte commence par les neutres',
    /Gris Sauge/.test(rangement.tete) && /Graphite/.test(rangement.tete), rangement.tete);
  v('elle se termine par les bleus', /Bleu/.test(rangement.queue), rangement.queue);
  /* sur un mur qu'on longe, l'œil lit la COLONNE : trois pièces
     empilées doivent se suivre dans la carte, pas être à onze rangs */
  const colonnes = await p.evaluate(() => {
    const t = [...document.querySelectorAll('.tuile--nu')].map((x, i) => {
      const r = x.getBoundingClientRect();
      return { i, x: Math.round(r.left + x.closest('.mur').scrollLeft) };
    });
    const col = {};
    t.forEach(o => (col[o.x] = col[o.x] || []).push(o.i));
    const suites = Object.values(col).filter(c => c.length > 1)
      .map(c => c.every((v, k) => k === 0 || v === c[k - 1] + 1));
    return { colonnes: Object.keys(col).length, suivies: suites.filter(Boolean).length,
             total: suites.length };
  });
  v('chaque colonne suit la carte des couleurs',
    colonnes.suivies === colonnes.total && colonnes.total >= 10,
    colonnes.suivies + '/' + colonnes.total + ' colonnes en suite');
  v('aucune nuance n\'est répétée',
    new Set(rangement.noms).size === rangement.noms.length,
    rangement.noms.length + ' noms, ' + new Set(rangement.noms).size + ' distincts');

  await p.hover('.tuile');
  await p.mouse.wheel(0, 700); await p.waitForTimeout(600);
  const marche = await p.evaluate(() => ({
    x: document.getElementById('mur').scrollLeft,
    n: document.getElementById('marcheN').textContent }));
  v('la molette fait marcher le long du mur', marche.x > 150, marche.x);
  v('le repère nomme la pièce courante', /Pièce \d+ sur 37/.test(marche.n), marche.n);

  /* ── le plein écran ── */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(400);
  await p.evaluate(() => __plein(0)); await p.waitForTimeout(1300);
  e = await p.evaluate(() => __etat());
  v('la pièce s\'ouvre en plein écran', e.plein && e.pleinIdx === 0);
  const grand = await p.evaluate(() => {
    const ph = document.querySelector('.plein__ph').getBoundingClientRect();
    const c = document.querySelector('.plein__c').getBoundingClientRect();
    const st = document.querySelector('.plein__s'), cs = getComputedStyle(st);
    const W = st.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const H = st.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return { part: Math.max(ph.width / W, ph.height / H), aCote: ph.right <= c.left + 1,
             src: document.querySelector('.plein__ph img').getAttribute('src').slice(0, 22),
             large: document.querySelector('.plein__ph img').naturalWidth };
  });
  v('l\'image remplit la bande qui lui est donnée', grand.part > .96,
    (grand.part * 100).toFixed(0) + ' %');
  v('le cartel se lit à côté d\'elle', grand.aCote);
  v('la photographie est une vraie prise de vue',
    grand.src.startsWith('data:image/webp') && grand.large >= 1000,
    grand.src + ' ' + grand.large + 'px');
  const cart = await p.locator('#plein').innerText();
  v('aucun prix en plein écran', !/€/.test(cart), (cart.match(/.{0,26}€.{0,26}/) || [])[0]);
  const source = await p.evaluate(() =>
    document.querySelector('.tuile[data-oe="v0"] .tuile__m').style.visibility);
  v('la tuile d\'origine s\'efface pendant l\'ouverture', source === 'hidden', source);

  /* LES AUTRES VUES SE DÉFILENT — plus de swipe entre pièces pour ça */
  const vues0 = await p.evaluate(() => ({
    n: document.querySelectorAll('.plein__vue').length,
    compte: document.getElementById('pleinVn').textContent,
    hauteur: document.querySelector('.plein__vue').getBoundingClientRect().height,
    bande: document.getElementById('pleinVues').clientHeight }));
  v('la pièce a plusieurs vues empilées', vues0.n >= 2, vues0.n);
  v('chaque vue tient toute la bande',
    Math.abs(vues0.hauteur - vues0.bande) < 2, vues0.hauteur + '/' + vues0.bande);
  v('le compte des vues est annoncé', /Vue 1 sur \d/.test(vues0.compte), vues0.compte);
  await p.evaluate(() => {
    const vs = document.getElementById('pleinVues');
    vs.scrollTo({ top: vs.clientHeight, behavior: 'instant' });
  });
  await p.waitForTimeout(600);
  const vues1 = await p.evaluate(() => ({
    compte: document.getElementById('pleinVn').textContent,
    pos: document.getElementById('pleinVues').scrollTop }));
  v('défiler passe à la vue suivante', /Vue 2 sur \d/.test(vues1.compte), vues1.compte);
  v('la pièce reste la même', (await p.evaluate(() => __etat())).pleinIdx === 0);

  await p.click('#pleinN'); await p.waitForTimeout(900);
  v('la flèche mène à la pièce suivante',
    (await p.evaluate(() => __etat())).pleinIdx === 1);
  v('et l\'on repart de la première vue',
    await p.evaluate(() => document.getElementById('pleinVues').scrollTop === 0));
  /* une pièce du nuancier : elle se montre ENTIÈRE, jamais recadrée */
  await p.evaluate(() => __plein(12)); await p.waitForTimeout(900);
  const nu = await p.evaluate(() => ({
    contient: document.querySelector('.plein__ph').classList.contains('contenir'),
    titre: document.getElementById('pleinN2').textContent,
    i: document.getElementById('pleinI').textContent }));
  v('le nuancier se montre entier', nu.contient);
  v('la pièce du nuancier est nommée', /\w/.test(nu.titre) && /Nuancier/.test(nu.i),
    nu.titre + ' · ' + nu.i);
  await p.evaluate(() => __fermerPlein()); await p.waitForTimeout(1000);
  v('toutes les tuiles sont rendues au mur',
    await p.evaluate(() =>
      [...document.querySelectorAll('.tuile__m')].every(m => m.style.visibility !== 'hidden')));

  /* ── LA PROMESSE ── */
  for (const id of ['galerie', 'atelier', 'maison', 'rdv']) {
    await p.evaluate(i => __lieu(i), id); await p.waitForTimeout(450);
    const txt = await p.locator('#' + id).innerText();
    v('aucun prix dans « ' + id + ' »', !/€|\bprix\b|panier|ajouter au/i.test(txt),
      (txt.match(/.{0,30}(€|\bprix\b|panier).{0,30}/i) || [])[0]);
    v('aucun mot de commerce dans « ' + id + ' »',
      !/s'ach[eè]t|acheter|se vend|à vendre|\bvente\b|boutique en ligne/i.test(txt),
      (txt.match(/.{0,32}(s'ach[eè]t|acheter|se vend|\bvente\b).{0,32}/i) || [])[0]);
  }

  /* ── L'ATELIER : six plans que l'on traverse ── */
  await p.evaluate(() => __lieu('atelier')); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('six plans composent l\'atelier', e.plans === 6, e.plans);
  const at = await p.evaluate(() => {
    const a = document.getElementById('atelier');
    const s = document.querySelector('.plan6').getBoundingClientRect();
    return { fond: getComputedStyle(a).backgroundColor,
             colle: getComputedStyle(document.querySelector('.plan6')).position,
             pleineHauteur: Math.abs(s.height - innerHeight) < 2,
             y: a.scrollHeight - a.clientHeight, x: a.scrollWidth - a.clientWidth,
             rail: document.querySelectorAll('.at__rail button').length,
             texte: getComputedStyle(document.querySelector('.plan6__t')).color };
  });
  v('l\'atelier est sombre', lum(rgb(at.fond)) < .04, at.fond);
  v('chaque plan tient toute la page', at.pleineHauteur);
  v('les plans se calent pour se superposer', at.colle === 'sticky', at.colle);
  v('l\'atelier se traverse à la verticale', at.y > 2000, at.y);
  v('il ne déborde pas latéralement', at.x <= 1, at.x);
  v('le rail donne les six gestes', at.rail === 6, at.rail);
  v('le texte y est lisible', contraste(rgb(at.texte), rgb(at.fond)) >= 7,
    contraste(rgb(at.texte), rgb(at.fond)).toFixed(1) + ':1');
  v('la barre passe en sombre avec le lieu',
    await p.evaluate(() => document.getElementById('barre').classList.contains('sombre')));
  await p.evaluate(() => { document.getElementById('atelier').scrollTop = innerHeight * 2.4; });
  await p.waitForTimeout(900);
  const fil = await p.evaluate(() => ({
    ici: document.querySelectorAll('.plan6.ici').length,
    railIci: [...document.querySelectorAll('.at__rail button')].findIndex(b => b.classList.contains('ici')),
    retard: document.querySelector('.plan6[data-i="2"] .plan6__m').style.transform,
    /* le plan qu'on recouvre s'assombrit, recule d'un rien, et reste calé */
    voile: parseFloat(document.querySelector('.plan6[data-i="0"] .plan6__v').style.opacity || 0),
    recul: document.querySelector('.plan6[data-i="0"]').style.transform,
    /* trois plans empilés en haut, le quatrième encore plus bas :
       c'est la signature de l'empilement (le rectangle d'un plan réduit
       n'est pas exactement à zéro, il est rentré de sa mise à l'échelle) */
    hauts: [...document.querySelectorAll('.plan6')]
      .map(s => s.getBoundingClientRect().top).filter(t => t < 60).length,
    suivant: Math.round(document.querySelector('.plan6[data-i="3"]').getBoundingClientRect().top) }));
  v('le plan traversé se révèle', fil.ici >= 1, fil.ici);
  v('le rail suit où l\'on est', fil.railIci >= 1, fil.railIci);
  const rail = await p.evaluate(() => {
    const r = document.querySelector('.at__rail').getBoundingClientRect();
    return { dansEcran: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0,
             d: Math.round(r.top) + '..' + Math.round(r.bottom) + ' / ' + innerHeight };
  });
  /* il est posé en fixe : il ne doit pas partir avec la page */
  v('le rail reste à l\'écran quand on avance', rail.dansEcran, rail.d);
  v('l\'image prend du retard sur la page', /translateY/.test(fil.retard), fil.retard);
  v('les plans traversés restent empilés en haut',
    fil.hauts >= 3 && fil.suivant > 300, fil.hauts + ' calés · suivant à ' + fil.suivant);
  v('il s\'assombrit et recule sous le suivant',
    fil.voile > .3 && /scale\(0\./.test(fil.recul), fil.voile + ' · ' + fil.recul);

  /* ── LA MAISON : la chronique ── */
  await p.evaluate(() => __lieu('maison')); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('le cartonnier est un lieu à part', e.lieu === 'maison', e.lieu);
  v('cinq chapitres', e.chapitres === 5, e.chapitres);
  const ma = await p.locator('#maison').innerText();
  v('la chronique part de 1904', /1904/.test(ma));
  v('elle arrive à Laurène', /Laurène/.test(ma));
  v('les repères d\'exemple sont signalés', /exemple/i.test(ma));
  v('le fil d\'Ariane garde le chemin', /TIRABOSCHI.*CARTONNIER/i.test(
    (await p.evaluate(() => __etat())).ariane),
    (await p.evaluate(() => __etat())).ariane);
  const chap = await p.evaluate(() => {
    const m = document.getElementById('maison');
    const c = document.querySelector('.chap').getBoundingClientRect();
    return { y: m.scrollHeight - m.clientHeight, x: m.scrollWidth - m.clientWidth,
             fond: getComputedStyle(m).backgroundColor,
             pleineHauteur: Math.abs(c.height - innerHeight) < 2,
             annee: parseFloat(getComputedStyle(document.querySelector('.chap__an')).fontSize),
             frise: document.querySelectorAll('.frise button').length };
  });
  v('chaque chapitre tient toute la page', chap.pleineHauteur);
  v('l\'année est immense', chap.annee >= 120, Math.round(chap.annee) + ' px');
  v('la frise donne les cinq repères', chap.frise === 5, chap.frise);
  v('le cartonnier se lit à la verticale', chap.y > 1200, chap.y);
  v('il ne déborde pas latéralement', chap.x <= 1, chap.x);
  v('il est sur papier clair', lum(rgb(chap.fond)) > .85, chap.fond);
  await p.evaluate(() => { document.getElementById('maison').scrollTop = innerHeight * 3.05; });
  await p.waitForTimeout(900);
  const frise = await p.evaluate(() => ({
    ici: [...document.querySelectorAll('.frise button')].findIndex(b => b.classList.contains('ici')),
    fil: document.getElementById('friseB').style.height,
    dansEcran: (() => { const r = document.querySelector('.frise').getBoundingClientRect();
      return r.top >= 0 && r.bottom <= innerHeight; })() }));
  v('la frise suit le chapitre traversé', frise.ici === 3, frise.ici);
  v('son fil se remplit', parseFloat(frise.fil) > 40, frise.fil);
  v('elle reste à l\'écran', frise.dansEcran);

  /* ── LA SERRURE : on trace un T ── */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(400);
  await p.evaluate(() => __serrure()); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('la serrure s\'ouvre', e.serrure);
  /* `visibility` ne s'interpole pas : un calque refermé reste `visible`
     pendant toute sa transition. Sans `pointer-events:none`, il avale
     les clics du lieu que l'on vient d'ouvrir. */
  const calques = await p.evaluate(() => ['plan', 'plein', 'plg'].map(id => {
    const el = document.getElementById(id);
    return id + '=' + (el.classList.contains('on') ? 'ouvert'
      : getComputedStyle(el).pointerEvents);
  }));
  v('un calque fermé n\'intercepte plus rien',
    calques.every(c => /=none|=ouvert/.test(c)), calques.join(' '));
  v('elle ne demande aucun code écrit',
    await p.locator('#serrure input').count() === 0);
  v('elle présente neuf points',
    await p.locator('#sePoints circle').count() === 9);

  /* AU CLIC, point par point : sur un pavé tactile on ne trace pas */
  const grille = await p.evaluate(() => {
    const g = document.getElementById('seG').getBoundingClientRect();
    return { l: g.left, t: g.top, w: g.width, h: g.height };
  });
  const clic = async i => {
    await p.mouse.click(grille.l + (10 + (i % 3) * 40) / 100 * grille.w,
                        grille.t + (12 + Math.floor(i / 3) * 39) / 100 * grille.h);
    await p.waitForTimeout(130);
  };
  for (const i of [0, 1, 2, 4, 7]) await clic(i);
  const auClic = await p.evaluate(() => __etat());
  v('les cinq points se prennent au clic', auClic.figure === '0,1,2,4,7', auClic.figure);
  v('un bouton de validation apparaît',
    await p.evaluate(() => !document.getElementById('seOk').hidden));
  await p.click('#seOk'); await p.waitForTimeout(1300);
  e = await p.evaluate(() => __etat());
  v('valider au clic ouvre le boudoir', e.lieu === 'boudoir' && !e.serrure,
    e.lieu + ' / serrure=' + e.serrure);

  /* ── LE PARCOURS : on est reçue avant d'être servie ── */
  v('on arrive dans l\'antichambre, pas sur l\'outil', e.scene === 'antichambre', e.scene);
  const anti = await p.locator('.scene[data-s="antichambre"]').innerText();
  v('on y est nommée', /Hélène/.test(anti));
  /* le salut doit s'accorder à l'heure qu'il annonce juste au-dessus */
  const salut = await p.evaluate(() => ({
    mot: document.getElementById('bdSalut').textContent,
    h: +document.getElementById('bdHeure').textContent.split(' h ')[0] }));
  v('le salut suit l\'heure',
    (salut.h < 18) === (salut.mot === 'Bonjour'), salut.mot + ' à ' + salut.h + ' h');
  /* l'en-tête de l'accueil reste lisible sur un hero clair */
  v('on y retrouve ses pièces', await p.locator('#carnet .pos1').count() === 2);
  v('deux portes s\'ouvrent devant', await p.locator('.porte2').count() === 2);
  const pas = await p.evaluate(() => {
    const b = [...document.querySelectorAll('.scene.on .pas')];
    return { n: b.length, ouverts: b.filter(x => !x.disabled).length,
             ici: b.findIndex(x => x.classList.contains('on')) };
  });
  v('le parcours compte quatre pas', pas.n === 4, pas.n);
  v('seul le premier est franchi', pas.ouverts === 1 && pas.ici === 0,
    pas.ouverts + ' ouverts, ici=' + pas.ici);
  v('aucun prix dans l\'antichambre', !/€/.test(anti),
    (anti.match(/.{0,26}€.{0,26}/) || [])[0]);

  await p.click('.porte2[data-va="silhouette"]'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('la première porte mène au choix de la silhouette', e.scene === 'silhouette', e.scene);
  v('deux silhouettes sont proposées', await p.locator('.silh').count() === 2);
  v('une seule est disponible en volume',
    await p.locator('.silh:not([disabled])').count() === 1);
  const sil = await p.locator('.scene[data-s="silhouette"]').innerText();
  v('aucun prix au choix de la silhouette', !/€/.test(sil));
  await p.click('.silh:not([disabled])'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('elle mène au volume', e.scene === 'atl', e.scene);
  const pas3 = await p.evaluate(() => {
    const b = [...document.querySelectorAll('.scene.on .pas')];
    return { ouverts: b.filter(x => !x.disabled).length,
             ici: b.findIndex(x => x.classList.contains('on')) };
  });
  v('les pas franchis restent ouverts', pas3.ouverts === 3 && pas3.ici === 2,
    pas3.ouverts + ' ouverts, ici=' + pas3.ici);
  /* on ressort pour refaire la figure au tracé */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(500);
  await p.evaluate(() => __serrure()); await p.waitForTimeout(700);

  /* une figure fausse ne doit rien ouvrir */
  await p.evaluate(() => __figure([[0, 3, 6]])); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('une figure fausse n\'ouvre pas', e.serrure && e.lieu === 'galerie',
    e.lieu + ' figure=' + e.figure);
  v('elle est signalée puis effacée',
    await p.evaluate(() => document.getElementById('seE').textContent.length > 0) &&
    e.figure === '', e.figure);

  /* le T, tracé à la vraie souris : la barre, puis le fût */
  const pt = await p.evaluate(() => {
    const r = document.getElementById('seG').getBoundingClientRect();
    return [...Array(9)].map((_, i) => [
      r.left + (10 + (i % 3) * 40) / 100 * r.width,
      r.top + (12 + Math.floor(i / 3) * 39) / 100 * r.height]);
  });
  const trait = async l => {
    await p.mouse.move(pt[l[0]][0], pt[l[0]][1]);
    await p.mouse.down();
    for (const i of l.slice(1)) { await p.mouse.move(pt[i][0], pt[i][1]); await p.waitForTimeout(40); }
    await p.mouse.up();
  };
  await trait([0, 1, 2]);
  await p.waitForTimeout(150);
  await trait([1, 4, 7]);
  await p.waitForTimeout(1700);
  e = await p.evaluate(() => __etat());
  v('un T tracé au doigt ouvre le boudoir', e.lieu === 'boudoir' && !e.serrure,
    e.lieu + ' / serrure=' + e.serrure);
  v('le tracé mène lui aussi à l\'antichambre', e.scene === 'antichambre', e.scene);
  /* on refait le parcours pour retrouver le volume */
  await p.click('.porte2[data-va="silhouette"]'); await p.waitForTimeout(800);
  await p.click('.silh:not([disabled])'); await p.waitForTimeout(900);
  v('le parcours ramène au volume',
    (await p.evaluate(() => __etat())).scene === 'atl');

  /* ── LE MODULE : la pièce se tourne AU DOIGT ── */
  /* (on y est déjà : le parcours nous y a menés) */
  const bd = await p.evaluate(() => {
    const b = document.getElementById('boudoir');
    const t = getComputedStyle(document.querySelector('.tot'));
    return { fond: getComputedStyle(b).backgroundColor, bloc: t.backgroundColor,
             blocTexte: t.color };
  });
  v('le boudoir est clair', lum(rgb(bd.fond)) > .9, bd.fond);
  v('l\'estimation est posée en noir', lum(rgb(bd.bloc)) < .05, bd.bloc);
  v('elle reste lisible', contraste(rgb(bd.blocTexte), rgb(bd.bloc)) >= 4.5);
  v('le geste est annoncé',
    /prenez la pièce/i.test(await p.locator('#saisir').innerText()) &&
    parseFloat((await p.evaluate(() => __etat())).saisir) > .5,
    (await p.evaluate(() => __etat())).saisir);

  const boite = await p.locator('#phImg').boundingBox();
  const av = (await p.evaluate(() => __etat())).angle;
  await glisser(p, boite.x + boite.width * .5, boite.y + boite.height * .5, -170);
  await p.waitForTimeout(700);
  let ap = await p.evaluate(() => __etat());
  v('la pièce tourne quand on la saisit à la souris', ap.angle !== av,
    av + ' → ' + ap.angle);
  v('l\'invitation s\'efface une fois le geste fait', parseFloat(ap.saisir) < .1, ap.saisir);

  /* le même geste au doigt, hors de l'image : toute la scène est saisissable */
  await p.evaluate(() => __tourner(0));
  const tourneDoigt = await p.evaluate(async () => {
    const sc = document.getElementById('sc');
    const r = sc.getBoundingClientRect();
    const y = r.top + r.height * .5, x0 = r.left + r.width * .5;
    const env = (t, x) => sc.dispatchEvent(new PointerEvent(t, { bubbles: true, pointerId: 7,
      pointerType: 'touch', clientX: x, clientY: y }));
    env('pointerdown', x0);
    for (let i = 1; i <= 10; i++) env('pointermove', x0 - i * 18);
    env('pointerup', x0 - 180);
    await new Promise(r => setTimeout(r, 400));
    return __etat().angle;
  });
  v('elle tourne aussi au doigt, prise n\'importe où dans la scène',
    tourneDoigt !== 0, '0 → ' + tourneDoigt);

  /* le balayage à deux doigts d'un pavé tactile : c'est un `wheel` */
  await p.evaluate(() => __tourner(0));
  const sc = await p.locator('#sc').boundingBox();
  await p.mouse.move(sc.x + sc.width * .5, sc.y + sc.height * .5);
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(60, 0); await p.waitForTimeout(40); }
  await p.waitForTimeout(400);
  const aDeuxDoigts = (await p.evaluate(() => __etat())).angle;
  v('elle tourne au balayage à deux doigts', aDeuxDoigts !== 0, '0 → ' + aDeuxDoigts);

  await p.evaluate(() => __tourner(4)); await p.waitForTimeout(400);
  ap = await p.evaluate(() => ({
    deg: document.getElementById('deg').textContent,
    curseur: document.getElementById('rotT').style.left }));
  v('l\'angle est annoncé', ap.deg === '60°', ap.deg);
  v('le rail suit la pièce', Math.abs(parseFloat(ap.curseur) - 100 / 6) < .5, ap.curseur);
  await p.evaluate(() => __tourner(20)); await p.waitForTimeout(400);
  v('la seconde moitié est reflétée',
    await p.evaluate(() => document.getElementById('ph').classList.contains('miroir')));
  await p.evaluate(() => __tourner(0)); await p.waitForTimeout(300);

  /* poser une peausserie */
  await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(700);
  await p.click('.fm[data-f="alligator"]'); await p.waitForTimeout(500);
  v('la plongée du boudoir annonce le supplément',
    /€/.test(await p.evaluate(() => document.getElementById('plgD').textContent)));
  await p.evaluate(() => { for (let i = 0; i < 5; i++) document.getElementById('plgN').click(); });
  await p.waitForTimeout(400);
  await p.click('#plgOk'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('le cuir retenu s\'inscrit', e.cuir === 'alligator:etain', e.cuir);
  v('il se répercute au total', e.total === 5700, e.total);
  await p.click('#voirCert'); await p.waitForTimeout(1000);
  v('la pièce achevée est le quatrième pas',
    (await p.evaluate(() => __etat())).scene === 'cert');
  const cert = await p.locator('.scene[data-s="cert"]').innerText();
  v('la pièce achevée récapitule', /Alligator|Étain/.test(cert) && /5\s?700/.test(cert));
  v('rien n\'est encaissé', /Aucun paiement/.test(cert));

  /* le cabinet, depuis l'atelier */
  await p.evaluate(() => __lieu('atelier')); await p.waitForTimeout(500);
  await p.evaluate(() => __cabinet()); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('le cabinet ouvre la plongée', e.plongee && e.cabinet);
  const cab = await p.evaluate(() => ({
    legende: document.getElementById('plgD').textContent,
    bouton: document.getElementById('plgOk').textContent,
    familles: document.querySelectorAll('.fm').length }));
  v('il montre les six matières', cab.familles === 6, cab.familles);
  v('il n\'affiche pas de prix', !/€/.test(cab.legende), cab.legende);
  v('il ne retient rien', !/retenir/i.test(cab.bouton), cab.bouton);
  await p.click('#plgOk'); await p.waitForTimeout(600);

  /* ── le rendez-vous ── */
  await p.evaluate(() => __lieu('rdv')); await p.waitForTimeout(500);
  await p.fill('#rNom', 'Hélène Mauro');
  await p.fill('#rMail', 'h.mauro@example.com');
  await p.click('.rdv__go'); await p.waitForTimeout(700);
  v('la demande de rendez-vous se confirme',
    /Hélène Mauro/.test(await p.locator('#rdvOk').innerText()));

  /* ── le plan ── */
  await p.click('#planB'); await p.waitForTimeout(800);
  v('le plan liste les six destinations', await p.locator('#planL .pl').count() === 6);
  const lignes = await p.evaluate(() => [...document.querySelectorAll('.pl')].map(l => {
    const r = l.getBoundingClientRect();
    const n = l.querySelector('.pl__n').getBoundingClientRect();
    const i = l.querySelector('.pl__i').getBoundingClientRect();
    const d = l.querySelector('.pl__d').getBoundingClientRect();
    return { h: Math.round(r.height),
             num: Math.abs((i.top + i.height / 2) - (n.top + n.height / 2)),
             desc: Math.abs((d.top + d.height / 2) - (r.top + r.height / 2)) };
  }));
  const H = lignes.map(l => l.h);
  v('les lignes du plan ont la même hauteur', Math.max(...H) - Math.min(...H) <= 1, H.join('/'));
  v('numéro et description y sont centrés',
    lignes.every(l => l.num <= 2 && l.desc <= 2));
  const noms = await p.evaluate(() =>
    [...document.querySelectorAll('.pl__n')].map(n =>
      n.firstChild.textContent + (n.querySelector('em') ? n.querySelector('em').textContent : '')));
  v('les noms du plan n\'ont pas d\'espace parasite',
    noms.join('|') === "L'Accueil|La Galerie|L'Atelier|Le Cartonnier|Le Boudoir|Le Rendez-vous",
    noms.join('|'));
  await p.keyboard.press('Escape'); await p.waitForTimeout(500);

  await p.close();

  /* ═════════════ les autres tailles ═════════════ */
  for (const [w, h, nom] of [[1280, 800, 'tablette paysage'], [820, 1180, 'tablette portrait'],
                             [390, 844, 'téléphone']]) {
    const q = await page(w, h);
    await q.evaluate(() => __lieu('galerie')); await q.waitForTimeout(600);
    const deb = await q.evaluate(() => {
      let pire = 0, ou = '';
      ['galerie', 'atelier', 'maison', 'rdv', 'boudoir'].forEach(id => {
        __lieu(id);
        const el = document.getElementById(id);
        const d = el.scrollWidth - el.clientWidth;
        if (d > pire) { pire = d; ou = id; }
      });
      return { pire, ou };
    });
    v(nom + ' : aucun débordement latéral', deb.pire <= 1, deb.pire + ' px (' + deb.ou + ')');

    await q.evaluate(() => __lieu('galerie')); await q.waitForTimeout(600);
    const chev = await q.evaluate(() => {
      const m = document.getElementById('mur');
      /* offset* : on mesure la MISE EN PAGE, pas la position animée */
      const b = [...m.children].map(c => ({
        x: c.offsetLeft, y: c.offsetTop, w: c.offsetWidth, h: c.offsetHeight,
        n: c.className.split(' ')[0] }));
      let n = 0, ex = '';
      for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
        const a = b[i], e = b[j];
        if (a.x < e.x + e.w - 1 && e.x < a.x + a.w - 1 &&
            a.y < e.y + e.h - 1 && e.y < a.y + a.h - 1) { n++; if (!ex) ex = a.n + '×' + e.n; }
      }
      return { n, ex };
    });
    v(nom + ' : aucune pièce n\'en recouvre une autre', chev.n === 0, chev.n + ' · ' + chev.ex);

    await q.evaluate(() => __plein(0)); await q.waitForTimeout(1100);
    const pe = await q.evaluate(() => {
      const ph = document.querySelector('.plein__ph').getBoundingClientRect();
      const c = document.querySelector('.plein__c').getBoundingClientRect();
      const g = document.getElementById('pleinGo').getBoundingClientRect();
      return { libre: ph.right <= c.left + 1 || ph.bottom <= c.top + 1,
               cta: g.bottom <= innerHeight + 1 && g.width > 40 };
    });
    v(nom + ' : image et cartel ne se recouvrent pas', pe.libre);
    v(nom + ' : le bouton de rendez-vous reste à l\'écran', pe.cta);
    await q.evaluate(() => __fermerPlein()); await q.waitForTimeout(700);

    /* la serrure doit tenir à l'écran, et rester utilisable au doigt */
    await q.evaluate(() => __serrure()); await q.waitForTimeout(700);
    const se = await q.evaluate(() => {
      const g = document.getElementById('seG').getBoundingClientRect();
      const b = document.getElementById('seX').getBoundingClientRect();
      return { dansEcran: g.top >= 0 && b.bottom <= innerHeight + 1, taille: Math.round(g.width) };
    });
    v(nom + ' : la serrure tient à l\'écran', se.dansEcran, se.taille + ' px');
    v(nom + ' : les points restent assez grands', se.taille >= 190, se.taille);
    await q.evaluate(() => { document.getElementById('seX').click(); });
    await q.waitForTimeout(400);

    await q.evaluate(() => { __lieu('boudoir'); __scene('atl'); }); await q.waitForTimeout(700);
    const atl = await q.evaluate(() => {
      const i = document.getElementById('phImg').getBoundingClientRect();
      const s = document.querySelector('.scene.on .sbar').getBoundingClientRect();
      const r = document.querySelector('.rot').getBoundingClientRect();
      const sa = document.getElementById('saisir').getBoundingClientRect();
      return { sousBarre: i.top >= s.bottom - 1, visible: i.width > 60 && i.height > 60,
               rot: r.bottom <= innerHeight + 2, saisir: sa.bottom <= innerHeight + 2,
               d: Math.round(i.top) + '/' + Math.round(s.bottom) };
    });
    v(nom + ' : la pièce est entière sous la barre', atl.sousBarre && atl.visible, atl.d);
    v(nom + ' : le rail et l\'invitation restent à l\'écran', atl.rot && atl.saisir);
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
