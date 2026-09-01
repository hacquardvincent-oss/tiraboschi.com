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
    const lg = document.querySelector('.ent__logo');
    const r = lg.getBoundingClientRect();
    const t = document.querySelector('.acc__hx h1');
    return { logo: lg.textContent.trim().slice(0, 11),
             nav: document.querySelectorAll('.ent__n .lien').length,
             entrees: [...document.querySelectorAll('.ent__n .lien')].map(b =>
               b.textContent.trim()),
             /* le logo est CENTRÉ dans la page, pas rangé à gauche */
             centre: Math.abs((r.left + r.width / 2) - innerWidth / 2),
             /* et il pèse assez face au titre du hero */
             corpsLogo: parseFloat(getComputedStyle(lg).fontSize),
             corpsNav: parseFloat(getComputedStyle(
               document.querySelector('.ent__n .lien')).fontSize),
             /* le nom est au centre : RIEN ne doit passer dessous */
             collision: [...document.querySelectorAll('.ent__n .lien,.ent .plan-b')]
               .filter(b => { const q = b.getBoundingClientRect();
                 return q.left < r.right - 1 && r.left < q.right - 1; })
               .map(b => b.textContent.trim() || 'menu'),
             corpsTitre: parseFloat(getComputedStyle(t).fontSize),
             hauteurEnTete: Math.round(e.height),
             enTete: Math.round(e.top) === 0 && e.width >= innerWidth - 1,
             pose: document.getElementById('ent').classList.contains('pose'),
             hero: Math.abs(h.height - innerHeight) < 2,
             pieces: document.querySelectorAll('.q').length,
             pied: document.querySelectorAll('.pied li button').length,
             defile: a.scrollHeight - a.clientHeight,
             barre: document.getElementById('barre').classList.contains('on') };
  });
  v('l\'accueil porte un logo', /Tiraboschi/i.test(ac.logo), ac.logo);
  /* le reproche tenait à une disproportion : logo minuscule et rangé à
     gauche, sous un titre de hero deux fois plus grand */
  v('le logo est centré dans la page', ac.centre <= 2, Math.round(ac.centre) + ' px du centre');
  v('aucune entrée de menu ne passe sous le nom',
    ac.collision.length === 0, ac.collision.join(', '));
  v('il tient sa place face au titre du hero',
    ac.corpsLogo >= 19 && ac.corpsTitre / ac.corpsLogo <= 3.2,
    'logo ' + ac.corpsLogo + ' px · titre ' + ac.corpsTitre + ' px (×' +
      (ac.corpsTitre / ac.corpsLogo).toFixed(1) + ')');
  v('le menu se lit sans loupe', ac.corpsNav >= 11, ac.corpsNav + ' px');
  v('l\'en-tête a de la hauteur', ac.hauteurEnTete >= 80, ac.hauteurEnTete + ' px');
  /* les MÊMES entrées partout, plus le compte et le rendez-vous */
  v('les cinq lieux, le compte et le rendez-vous', ac.nav === 7, ac.nav);
  v('et ce sont bien les cinq lieux',
    ac.entrees.join('|') === "La Galerie|L'Atelier|La Maison|La Bibliothèque|Le Boudoir|" +
      "Votre Cercle|Rendez-vous", ac.entrees.join('|'));
  v('l\'en-tête est posé en haut', ac.enTete);
  v('il est transparent sur le hero', !ac.pose);
  v('le hero occupe la page entière', ac.hero);
  v('les cinq pièces sont des bandes, pas une liste', ac.pieces === 5, ac.pieces);
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

  /* ── LES FILMS DE LA MAISON ──
     Le hero de l'accueil est un film : muet, en boucle, `playsinline`,
     et il s'arrête dès qu'on quitte le lieu. */
  await p.waitForTimeout(1200);
  const hf = await p.evaluate(() => {
    const v = document.querySelector('#accF video');
    if (!v) return null;
    const src = [...v.querySelectorAll('source')].map(s => s.type);
    return { muet: v.muted, boucle: v.loop, enligne: v.playsInline,
             joue: !v.paused, avance: v.currentTime > 0,
             formats: src, affiche: (v.poster || '').startsWith('data:image/webp'),
             large: v.videoWidth, embarque: src.length > 0 &&
               [...v.querySelectorAll('source')].every(s => s.src.startsWith('data:')) };
  });
  v('le hero de l\'accueil est un film', !!hf && hf.large > 0,
    hf && hf.large + ' px');
  v('il est muet et en boucle', hf && hf.muet && hf.boucle && hf.enligne);
  v('il tourne', hf && hf.joue && hf.avance);
  v('il est proposé en deux formats', hf && hf.formats.join() === 'video/webm,video/mp4',
    hf && hf.formats.join());
  v('les films sont embarqués comme le reste', hf && hf.embarque);
  v('il a une affiche, pour éviter le flash blanc', hf && hf.affiche);
  /* et il ne tourne pas quand on est ailleurs — batterie */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(700);
  v('il s\'arrête quand on quitte l\'accueil',
    await p.evaluate(() => document.querySelector('#accF video').paused));
  await p.evaluate(() => __lieu('accueil')); await p.waitForTimeout(700);
  v('et repart quand on revient',
    await p.evaluate(() => !document.querySelector('#accF video').paused));

  /* ── L'EN-TÊTE EST LE MÊME PARTOUT ──
     Le reproche : un logo différent d'un lieu à l'autre, et des entrées
     qui changeaient. On vérifie que le nom et les sept entrées sont
     identiques dans chaque lieu. */
  const signature = ac.entrees.join('|');
  for (const id of ['galerie', 'atelier', 'maison', 'bibliotheque', 'rdv', 'boudoir']) {
    await p.evaluate(i => __lieu(i), id); await p.waitForTimeout(450);
    const h = await p.evaluate(() => {
      const e = document.getElementById('ent');
      const lg = document.querySelector('.ent__logo');
      return { visible: e.classList.contains('on') &&
                 getComputedStyle(e).visibility === 'visible',
               nom: lg.textContent.replace(/\s+/g, ' ').trim(),
               centre: Math.abs((lg.getBoundingClientRect().left +
                 lg.getBoundingClientRect().width / 2) - innerWidth / 2),
               entrees: [...document.querySelectorAll('.ent__n .lien')].map(b =>
                 b.textContent.trim()).join('|') };
    });
    v('l\'en-tête est là dans « ' + id + ' »', h.visible);
    v('le même nom dans « ' + id + ' »', /^Tiraboschi Paris · 1904$/.test(h.nom), h.nom);
    v('centré dans « ' + id + ' »', h.centre <= 2, Math.round(h.centre));
    v('les mêmes entrées dans « ' + id + ' »', h.entrees === signature, h.entrees);
  }
  /* LE V A QUITTÉ LE NOM : il est la signature des pièces, pas du mot */
  v('le nom ne porte plus de V',
    await p.evaluate(() => document.querySelectorAll('.ent__logo svg').length) === 0);

  /* SUR DESKTOP, PAS DE BURGER EN PLUS DU MENU : l'un ou l'autre */
  const burger = await p.evaluate(() => ({
    visible: getComputedStyle(document.getElementById('entPlan')).display !== 'none',
    entrees: [...document.querySelectorAll('.ent__n .lien')]
      .filter(b => getComputedStyle(b).display !== 'none').length }));
  v('sur desktop, le menu est visible et le burger absent',
    !burger.visible && burger.entrees === 7,
    'burger=' + burger.visible + ' · ' + burger.entrees + ' entrées');

  /* LES SOUS-ENTRÉES SE DÉPLIENT SOUS LEUR ENTRÉE — plus en tout petit
     au bas d'un tiroir, là où personne n'allait */
  await p.evaluate(() => __lieu('accueil')); await p.waitForTimeout(400);
  await p.hover('.ent__n .lien[data-sous="galerie"]'); await p.waitForTimeout(800);
  const vol = await p.evaluate(() => {
    const vo = document.getElementById('volet');
    const r = vo.getBoundingClientRect();
    const im = vo.querySelector('.volet__v img');
    return { ouvert: vo.classList.contains('on'),
             sousEntree: [...vo.querySelectorAll('li button')].map(b =>
               b.firstChild.textContent.trim()),
             corps: parseFloat(getComputedStyle(vo.querySelector('li button')).fontSize),
             sousEnTete: Math.round(r.top) === Math.round(
               document.getElementById('ent').getBoundingClientRect().bottom),
             visuel: !!im && im.naturalWidth > 600,
             fond: getComputedStyle(document.getElementById('ent')).backgroundColor };
  });
  v('le volet s\'ouvre sous l\'entrée désignée', vol.ouvert && vol.sousEnTete);
  v('il porte un visuel', vol.visuel);
  v('les sous-entrées s\'y lisent', vol.corps >= 12.5, vol.corps + ' px');
  v('le cabinet des matières y est enfin accessible',
    vol.sousEntree.some(x => /Cabinet des matières/i.test(x)), vol.sousEntree.join(' · '));
  v('les cinq modèles aussi',
    ['Victoire','Jane','Colette','Rafaël','Pochon']
      .every(m => vol.sousEntree.some(x => x.includes(m))), vol.sousEntree.join(' · '));
  v('l\'en-tête prend le fond du volet', lum(rgb(vol.fond)) > .9, vol.fond);
  /* et une sous-entrée mène vraiment où elle dit */
  await p.evaluate(() => {
    [...document.querySelectorAll('#volet li button')]
      .find(b => /Cabinet des matières/i.test(b.textContent)).click();
  });
  await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('elle ouvre le cabinet', e.plongee && e.cabinet, e.lieu + ' · plongée=' + e.plongee);
  await p.click('#plgOk'); await p.waitForTimeout(600);
  await p.evaluate(() => __lieu('accueil')); await p.waitForTimeout(500);

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
  v('elle reprend les cinq pièces', er.entrees === 5, er.entrees);
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

  /* ── le mur : LA COLLECTION, cinq modèles en ascenseur horizontal ── */
  v('le fond de la galerie est blanc',
    rgb(await p.evaluate(() => getComputedStyle(document.getElementById('galerie'))
      .backgroundColor)).join() === '255,255,255');
  v('cinq modèles accrochés', e.oeuvres === 5, e.oeuvres);
  const modeles = await p.evaluate(() =>
    [...document.querySelectorAll('.tuile')].map(t => t.dataset.oe));
  v('la collection au complet, Rafaël compris',
    modeles.join() === 'victoire,jane,colette,rafael,olympe', modeles.join());
  const hero = await p.evaluate(() => {
    const h = document.querySelector('.hero');
    if (!h) return null;
    const r = h.getBoundingClientRect();
    const im = h.querySelector('img');
    return { large: Math.round(r.width), haut: Math.round(r.height),
             part: r.width / innerWidth,
             /* le visuel d'accueil doit être une PRISE DE VUE ÉDITORIALE
                définie, pas un packshot agrandi : on mesure le rapport
                entre les pixels natifs et la place qu'on lui donne */
             natif: im.naturalWidth, densite: im.naturalWidth / r.width };
  });
  v('la galerie s\'ouvre sur un grand visuel', hero && hero.part > .55,
    hero && hero.part.toFixed(2));
  v('ce visuel est net à sa taille d\'affichage',
    hero && hero.natif >= 1500 && hero.densite >= 1.5,
    hero && hero.natif + ' px natifs pour ' + Math.round(hero.large) +
      ' px affichés (×' + hero.densite.toFixed(2) + ')');
  const taille = await p.evaluate(() =>
    Math.round(Math.max(...[...document.querySelectorAll('.tuile')]
      .map(x => x.getBoundingClientRect().width))));
  v('les silhouettes sont grandes', taille >= 480, taille + ' px');
  v('quatre ouvertures dans le mur', e.ouvertures === 4, e.ouvertures);
  const ouv = await p.evaluate(() =>
    [...document.querySelectorAll('.ouv')].map(o => o.dataset.ouv).join());
  v('les quatre autres lieux se rencontrent en marchant',
    ouv === 'atelier,maison,bibliotheque,serrure', ouv);

  /* ── LES CADRAGES : une pièce se montre ENTIÈRE, jamais rognée ──
     (le reproche tenait en une capture : la Victoire coupée en haut
     et en bas par un `object-fit:cover`) */
  const cadres = await p.evaluate(() => {
    const t = [...document.querySelectorAll('.tuile')].filter(x =>
      x.querySelector('.tuile__m img'));
    const rogne = t.filter(x =>
      getComputedStyle(x.querySelector('.tuile__m img')).objectFit !== 'contain');
    return { total: t.length, rogne: rogne.length,
             ex: rogne.length ? rogne[0].dataset.oe : '' };
  });
  v('aucune pièce n\'est rognée sur le mur', cadres.rogne === 0,
    cadres.rogne + '/' + cadres.total + ' rognée(s) · ' + cadres.ex);
  /* montrer entier ne doit pas vouloir dire noyer la pièce dans du blanc :
     l'emplacement d'une silhouette suit ses proportions */
  const emprise = await p.evaluate(() =>
    [...document.querySelectorAll('.tuile')].filter(t =>
      t.querySelector('.tuile__m img')).map(t => {
      const m = t.querySelector('.tuile__m').getBoundingClientRect();
      const im = t.querySelector('img');
      const r = im.naturalWidth / im.naturalHeight;
      let w = m.width, h = w / r; if (h > m.height) { h = m.height; w = h * r; }
      return { id: t.dataset.oe, p: (w * h) / (m.width * m.height) };
    }).sort((a, b) => a.p - b.p)[0]);
  v('une silhouette occupe son emplacement', emprise.p >= .68,
    emprise.id + ' à ' + Math.round(emprise.p * 100) + ' %');
  /* LE RAFAËL S'ACCROCHE EN MOUVEMENT : toutes ses prises de vue le
     montrent rabat ouvert, alors c'est le film produit qui tient lieu
     de vue — la pièce fermée, seule, qui tourne. */
  const tf = await p.evaluate(() => {
    const t = document.querySelector('.tuile[data-oe="rafael"]');
    const v = t.querySelector('video');
    const r = t.getBoundingClientRect();
    return { film: t.dataset.film, aImage: !!t.querySelector('.tuile__m img'),
             affiche: (v.poster || '').startsWith('data:image/webp'),
             muet: v.muted, boucle: v.loop, enligne: v.playsInline,
             dit: (t.querySelector('.tuile__film') || {}).textContent,
             ratio: r.width / r.height,
             ratioFilm: v.videoWidth ? v.videoWidth / v.videoHeight : 0 };
  });
  v('le Rafaël s\'accroche en mouvement', tf.film === 'f-croco' && !tf.aImage, tf.film);
  v('le film y est muet, en boucle, en ligne', tf.muet && tf.boucle && tf.enligne);
  v('il porte une affiche', tf.affiche);
  v('et se signale comme un film', /film/i.test(tf.dit || ''), tf.dit);
  /* l'emplacement suit le format du film, comme il suit celui d'une
     photographie : sinon on recadre la pièce */
  v('son emplacement suit le format du film',
    Math.abs(tf.ratio - 1.78) < .18,
    'tuile ' + tf.ratio.toFixed(2) + ' · film ' + (tf.ratioFilm || 1.78).toFixed(2));

  /* et chaque modèle se reconnaît : il est NOMMÉ sous sa silhouette */
  const nommes = await p.evaluate(() =>
    [...document.querySelectorAll('.tuile .tuile__n')].map(n => n.textContent.trim()));
  v('chaque modèle est nommé sous sa silhouette',
    nommes.join('|') === 'Victoire|Jane|Colette|Rafaël|Olympe', nommes.join(' · '));

  const patch = await p.evaluate(() => {
    const m = document.getElementById('mur');
    const t = [...m.querySelectorAll('.tuile')].map(x => {
      const r = x.getBoundingClientRect(); return { w: r.width, h: r.height, t: r.top };
    });
    return { debordeX: m.scrollWidth - m.clientWidth, debordeY: m.scrollHeight - m.clientHeight,
             ecartL: Math.max(...t.map(x => x.w)) / Math.min(...t.map(x => x.w)),
             niveaux: new Set(t.map(x => Math.round(x.t / 20))).size };
  });
  v('le mur se parcourt à l\'horizontale', patch.debordeX > 1800, patch.debordeX);
  v('le mur ne déborde pas à la verticale', patch.debordeY <= 1, patch.debordeY);
  /* les silhouettes sont accrochées librement, pas alignées au cordeau */
  v('elles ne sont pas à la même hauteur', patch.niveaux >= 3, patch.niveaux);

  await p.hover('.tuile');
  await p.mouse.wheel(0, 700); await p.waitForTimeout(600);
  const marche = await p.evaluate(() => ({
    x: document.getElementById('mur').scrollLeft,
    n: document.getElementById('marcheN').textContent }));
  v('la molette fait marcher le long du mur', marche.x > 150, marche.x);
  v('le repère nomme la pièce courante', /Pièce \d+ sur 5/.test(marche.n), marche.n);

  /* ── LA PAGE D'UNE PIÈCE ──
     Ce n'est plus une vue en grand : c'est une page qui se descend,
     comme la fiche Shopify. */
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
             large: document.querySelector('.plein__ph img').naturalWidth,
             contient: document.querySelector('.plein__ph').classList.contains('contenir') };
  });
  v('l\'image remplit la bande qui lui est donnée', grand.part > .96,
    (grand.part * 100).toFixed(0) + ' %');
  v('le cartel se lit à côté d\'elle', grand.aCote);
  v('la pièce s\'y montre entière', grand.contient);
  v('la photographie est une vraie prise de vue',
    grand.src.startsWith('data:image/webp') && grand.large >= 1000,
    grand.src + ' ' + grand.large + 'px');
  const cart = await p.locator('#plein').innerText();
  v('aucun prix dans la page d\'une pièce', !/€/.test(cart),
    (cart.match(/.{0,26}€.{0,26}/) || [])[0]);
  v('ni aucun mot de commerce',
    !/s'ach[eè]t|acheter|se vend|à vendre|\bvente\b|panier|ajouter au/i.test(cart),
    (cart.match(/.{0,32}(s'ach[eè]t|acheter|\bvente\b|panier).{0,32}/i) || [])[0]);
  const source = await p.evaluate(() =>
    document.querySelector('.tuile[data-oe="victoire"] .tuile__m').style.visibility);
  v('la tuile d\'origine s\'efface pendant l\'ouverture', source === 'hidden', source);

  /* les vues, en haut de la page */
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
  v('défiler passe à la vue suivante',
    /Vue 2 sur \d/.test(await p.evaluate(() =>
      document.getElementById('pleinVn').textContent)));
  v('la pièce reste la même', (await p.evaluate(() => __etat())).pleinIdx === 0);

  /* LA PAGE SE DESCEND : neuf sections, pas trois panneaux */
  const surp = await p.evaluate(() => {
    const doc = document.getElementById('pleinDoc');
    const secs = [...document.querySelectorAll('#pleinSuite .sp')];
    return { sections: secs.map(s => s.dataset.sp),
             hauteur: doc.scrollHeight, ecran: doc.clientHeight,
             sommaire: [...document.querySelectorAll('#pleinNav button')].map(b =>
               b.textContent.trim()),
             mots: document.getElementById('pleinSuite').textContent
               .trim().split(/\s+/).length };
  });
  v('la page porte l\'origine, la forme, les matières, la fabrication',
    ['origine','silhouette','matieres','matiere','fabrication','mot','surmesure','autres']
      .every(k => surp.sections.includes(k)), surp.sections.join(' · '));
  v('elle se descend vraiment', surp.hauteur > surp.ecran * 4,
    surp.hauteur + ' px pour un écran de ' + surp.ecran);
  v('elle porte du contenu, pas des titres', surp.mots >= 700, surp.mots + ' mots');
  v('un sommaire dit ce qui vient', surp.sommaire.length === surp.sections.length,
    surp.sommaire.join(' · '));

  /* les cotes réelles de la Victoire, telles que le thème les donne */
  const cotes = await p.evaluate(() =>
    [...document.querySelectorAll('#pleinSuite [data-sp="silhouette"] .sp__l>div')]
      .map(d => [...d.children].map(s => s.textContent.trim()).join(' ')));
  v('les cotes sont celles de la maison',
    cotes.join('|').includes('Hauteur 28 cm') && cotes.join('|').includes('Largeur 35 cm') &&
    cotes.join('|').includes('Profondeur 12 cm'), cotes.join(' · '));

  /* le gros plan de matière, en pleine page */
  const zoom = await p.evaluate(() => {
    const z = document.querySelector('#pleinSuite [data-sp="matiere"] .plein__zoom');
    if (!z) return null;
    const r = z.getBoundingClientRect();
    return { haut: Math.round(r.height), large: Math.round(r.width),
             natif: z.querySelector('img').naturalWidth,
             legende: z.querySelector('.plein__zc strong').textContent.trim() };
  });
  v('un gros plan de matière occupe la page', zoom && zoom.large >= 1200 && zoom.haut >= 500,
    zoom && zoom.large + '×' + zoom.haut);
  v('il est légendé et net', zoom && zoom.legende.length > 8 && zoom.natif >= 1000,
    zoom && zoom.legende + ' · ' + zoom.natif + ' px');

  /* les chiffres de fabrication, ceux du thème */
  const fab = await p.evaluate(() =>
    [...document.querySelectorAll('#pleinSuite [data-sp="fabrication"] .sp__f>div')]
      .map(d => d.querySelector('span').textContent + ' ' + d.querySelector('b').textContent));
  v('la fabrication est chiffrée',
    fab.join('|').includes('3 400') && fab.length === 4, fab.join(' · '));

  /* le sommaire mène où il dit */
  await p.evaluate(() => {
    [...document.querySelectorAll('#pleinNav button')]
      .find(b => b.dataset.vers === 'fabrication').click();
  });
  await p.waitForTimeout(900);
  v('le sommaire mène à sa section',
    await p.evaluate(() => Math.abs(document.querySelector(
      '#pleinSuite [data-sp="fabrication"]').getBoundingClientRect().top) < 90),
    await p.evaluate(() => Math.round(document.querySelector(
      '#pleinSuite [data-sp="fabrication"]').getBoundingClientRect().top)));

  /* LE FILM DE LA PIÈCE : il ne se charge qu'à l'approche, et s'arrête
     dès qu'il sort de l'écran. */
  /* on rouvre la pièce pour repartir du haut : le sommaire nous avait
     fait passer devant le film */
  await p.evaluate(() => __plein(0)); await p.waitForTimeout(1200);
  const avantFilm = await p.evaluate(() => {
    const v = document.querySelector('#pleinSuite [data-sp="film"] video');
    return v ? { charge: v.querySelectorAll('source').length, joue: !v.paused } : null;
  });
  v('le film de la pièce attend qu\'on l\'approche',
    avantFilm && avantFilm.charge === 0 && !avantFilm.joue,
    avantFilm && avantFilm.charge + ' source(s)');
  await p.evaluate(() => {
    const s = document.querySelector('#pleinSuite [data-sp="film"]');
    const d = document.getElementById('pleinDoc');
    d.scrollTo({ top: d.scrollTop + s.getBoundingClientRect().top, behavior: 'instant' });
  });
  await p.waitForTimeout(2200);
  const surFilm = await p.evaluate(() => {
    const f = document.querySelector('#pleinSuite [data-sp="film"]');
    const v = f.querySelector('video');
    const r = f.querySelector('.film').getBoundingClientRect();
    return { joue: !v.paused, avance: v.currentTime > .4, large: v.videoWidth,
             pleine: r.width >= innerWidth - 2 && r.height > 400,
             legende: f.querySelector('.film__c strong').textContent.trim(),
             bouton: !!f.querySelector('.film__b') };
  });
  v('il se met à tourner quand on arrive dessus',
    surFilm.joue && surFilm.avance && surFilm.large > 0,
    surFilm.large + ' px · t=' + surFilm.avance);
  v('il occupe la page', surFilm.pleine);
  v('il est légendé', surFilm.legende.length > 8, surFilm.legende);
  v('on peut l\'arrêter à la main', surFilm.bouton);
  await p.evaluate(() => { document.getElementById('pleinDoc').scrollTop = 0; });
  await p.waitForTimeout(900);
  v('et il s\'arrête quand il sort de l\'écran',
    await p.evaluate(() =>
      document.querySelector('#pleinSuite [data-sp="film"] video').paused));

  /* L'OLYMPE ATTEND SA SÉANCE : on le dit, on ne le maquille pas */
  await p.evaluate(() => __plein(4)); await p.waitForTimeout(1200);
  const oly = await p.evaluate(() => ({
    titre: document.getElementById('pleinN2').textContent,
    kicker: document.getElementById('pleinK').textContent,
    texte: document.getElementById('pleinSuite').textContent.replace(/\s+/g, ' ') }));
  v('l\'Olympe a sa page', /Olympe/.test(oly.titre), oly.titre);
  v('et l\'absence de prises de vue est dite en clair',
    /prises de vue/i.test(oly.kicker) && /volumes d’étude|volume d’étude/i.test(oly.texte),
    oly.kicker);

  /* LE RAFAËL, ET SON NUANCIER DANS SA FICHE — plus sur le mur */
  await p.evaluate(() => __plein(3)); await p.waitForTimeout(1400);
  const raf = await p.evaluate(() => ({
    titre: document.getElementById('pleinN2').textContent,
    texte: document.getElementById('pleinSuite').textContent.replace(/\s+/g, ' ') }));
  v('le Rafaël a sa page', /Rafaël/.test(raf.titre), raf.titre);
  v('avec sa date et ses chiffres',
    /1952/.test(raf.texte) && /3 800/.test(raf.texte) && /16 heures/.test(raf.texte),
    raf.texte.slice(0, 60));
  /* les cotes de la page Shopify décrivent un autre volume : on ne les
     affirme pas par-dessus les photographies */
  v('les cotes restent à confirmer, pas inventées',
    /à confirmer/i.test(raf.texte) && !/38 cm/.test(raf.texte),
    (raf.texte.match(/.{0,30}(38 cm|à confirmer).{0,20}/i) || [])[0]);

  const nuan = await p.evaluate(() => {
    const sec = document.querySelector('#pleinSuite [data-sp="nuancier"]');
    const nus = [...document.querySelectorAll('#pleinSuite .nu')];
    return { present: !!sec, n: nus.length,
             surLeMur: document.querySelectorAll('#mur .tuile--nu').length,
             noms: nus.map(b => b.querySelector('.nu__n').firstChild.textContent.trim()),
             mot: document.getElementById('nuD').textContent.trim(),
             /* chaque peau se montre entière, comme la pièce */
             rogne: nus.filter(b =>
               getComputedStyle(b.querySelector('img')).objectFit !== 'contain').length };
  });
  v('le nuancier vit dans la fiche de la pièce', nuan.present && nuan.n === 32,
    nuan.n + ' peaux');
  v('et plus sur le mur', nuan.surLeMur === 0, nuan.surLeMur);
  v('aucune peau n\'y est rognée', nuan.rogne === 0, nuan.rogne);
  v('la carte commence par les neutres',
    /Gris Sauge/.test(nuan.noms.slice(0, 7).join()), nuan.noms.slice(0, 5).join(', '));
  /* le film du nuancier accompagne la carte */
  v('un film accompagne le nuancier',
    await p.evaluate(() => !!document.querySelector(
      '#pleinSuite [data-sp="nuancier"] .film')));
  v('elle se termine par les bleus', /Bleu/.test(nuan.noms.slice(-2).join()),
    nuan.noms.slice(-2).join(', '));
  v('aucune nuance n\'est répétée',
    new Set(nuan.noms).size === nuan.noms.length,
    nuan.noms.length + ' noms, ' + new Set(nuan.noms).size + ' distincts');
  v('la peau désignée est commentée', nuan.mot.length > 60, nuan.mot.slice(0, 50));
  /* désigner une peau change les vues du haut */
  const avantNu = await p.evaluate(() =>
    document.querySelector('.plein__ph img').getAttribute('src').slice(-40));
  await p.evaluate(() => document.querySelectorAll('#pleinSuite .nu')[12].click());
  await p.waitForTimeout(900);
  const apresNu = await p.evaluate(() => ({
    src: document.querySelector('.plein__ph img').getAttribute('src').slice(-40),
    mot: document.getElementById('nuD').textContent.trim(),
    ici: [...document.querySelectorAll('#pleinSuite .nu')].findIndex(b =>
      b.classList.contains('ici')),
    haut: document.getElementById('pleinDoc').scrollTop }));
  v('désigner une peau change la pièce montrée', apresNu.src !== avantNu);
  v('et le mot qui l\'accompagne', apresNu.mot.length > 40 && apresNu.ici === 12,
    'peau ' + apresNu.ici);

  /* on passe d'un modèle à l'autre depuis le bas de la page */
  await p.evaluate(() => {
    document.querySelector('#pleinSuite [data-sp-oe="victoire"]').click();
  });
  await p.waitForTimeout(1100);
  v('la collection en bas de page mène au modèle suivant',
    (await p.evaluate(() => __etat())).pleinIdx === 0,
    await p.evaluate(() => document.getElementById('pleinN2').textContent));
  await p.evaluate(() => __fermerPlein()); await p.waitForTimeout(1000);
  v('toutes les tuiles sont rendues au mur',
    await p.evaluate(() =>
      [...document.querySelectorAll('.tuile__m')].every(m => m.style.visibility !== 'hidden')));

  /* ── LA PROMESSE ── */
  for (const id of ['galerie', 'atelier', 'maison', 'bibliotheque', 'rdv']) {
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
  v('la maison est un lieu à part', e.lieu === 'maison', e.lieu);
  v('cinq chapitres', e.chapitres === 5, e.chapitres);
  /* LA CHRONIQUE EST CELLE DE LA MAISON, reprise du thème Shopify :
     ni dates ni faits inventés. */
  const ma = await p.evaluate(() =>
    document.getElementById('maison').textContent.replace(/\s+/g, ' '));
  const annees = await p.evaluate(() =>
    [...document.querySelectorAll('.chap__an')].map(a => a.textContent.trim()));
  v('les repères sont ceux du thème',
    annees.join('|') === '1904|1938|1972|2019|Aujourd’hui', annees.join('|'));
  v('1904 : un maroquinier formé à Florence',
    /Florence/.test(ma) && /premier atelier à Paris/.test(ma));
  v('1938 : le veau pleine fleur du Limousin et les tanneries',
    /Limousin/.test(ma) && /tanneries françaises/.test(ma));
  v('1972 : la boutique rue Saint-Honoré', /Saint-Honoré/.test(ma));
  v('2019 : la capsule numérotée et @boschi_paris',
    /capsule numérotée/.test(ma) && /boschi_paris/.test(ma));
  v('aujourd’hui : six artisans, neuf modèles, zéro sous-traitance',
    /Six artisans/.test(ma) && /Neuf modèles/.test(ma) && /Zéro sous-traitance/.test(ma));
  v('et les chiffres de la maison',
    /3 400/.test(ma) && /48–72 h/.test(ma) && /100 %/.test(ma));
  v('elle arrive à Laurène', /Laurène/.test(ma));
  v('le fil d\'Ariane garde le chemin', /TIRABOSCHI.*MAISON/i.test(
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
  v('la maison se lit à la verticale', chap.y > 1200, chap.y);
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

  /* LES POINTS SE SIGNALENT — sans quoi personne ne voit qu'il y a
     quelque chose à saisir, et la porte reste fermée faute d'être vue */
  const halos = await p.evaluate(() => {
    const h = [...document.querySelectorAll('#seHalos circle')];
    const c = document.querySelector('#sePoints circle');
    const st = h.length ? getComputedStyle(h[0]) : null;
    return { n: h.length, anime: st && st.animationName !== 'none',
             duree: st && st.animationDuration,
             decale: h.map(x => getComputedStyle(x).animationDelay).filter(
               (d, i, a) => a.indexOf(d) === i).length,
             /* et les points eux-mêmes sont assez clairs pour se voir */
             trait: c ? getComputedStyle(c).stroke : '' };
  });
  v('chaque point porte un halo qui bat', halos.n === 9 && halos.anime,
    halos.n + ' halos · ' + halos.duree);
  v('ils battent en cascade, pas ensemble', halos.decale === 9, halos.decale);
  v('les points se voient sur le fond sombre',
    contraste(rgb(halos.trait), [12, 12, 13]) >= 3.5,
    contraste(rgb(halos.trait), [12, 12, 13]).toFixed(1) + ':1');

  /* au bout de quelques secondes d'hésitation, les CINQ points de la
     figure s'allument l'un après l'autre : on montre le chemin */
  await p.waitForTimeout(3000);
  const guide1 = await p.evaluate(() => ({
    guide: __etat().guide,
    appel: [...document.querySelectorAll('#seHalos .appel')].map(h => +h.dataset.i) }));
  v('après une hésitation, la figure se montre', guide1.guide, guide1.guide);
  v('elle allume un point de la figure à la fois',
    guide1.appel.length === 1 && [0, 1, 2, 4, 7].includes(guide1.appel[0]),
    guide1.appel.join(','));
  const vus = new Set(guide1.appel);
  /* le cycle bat toutes les 620 ms et compte deux temps morts :
     on échantillonne plus vite que lui pour ne rater aucun temps */
  for (let k = 0; k < 34; k++) {
    await p.waitForTimeout(200);
    (await p.evaluate(() =>
      [...document.querySelectorAll('#seHalos .appel')].map(h => +h.dataset.i)))
      .forEach(i => vus.add(i));
  }
  v('et finit par montrer les cinq',
    [0, 1, 2, 4, 7].every(i => vus.has(i)), [...vus].sort((a, b) => a - b).join(','));
  v('elle ne montre jamais un point hors de la figure',
    [...vus].every(i => [0, 1, 2, 4, 7].includes(i)), [...vus].join(','));
  /* dès qu'on prend un point, la démonstration s'arrête */
  await p.evaluate(() => __figure([[0]])); await p.waitForTimeout(400);
  v('elle s\'arrête dès qu\'on prend un point',
    !(await p.evaluate(() => __etat())).guide);
  await p.evaluate(() => __serrure()); await p.waitForTimeout(600);

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

  /* ── LA BIBLIOTHÈQUE : les cahiers ── */
  await p.evaluate(() => __lieu('bibliotheque')); await p.waitForTimeout(700);
  const bi = await p.evaluate(() => {
    const l = document.getElementById('bibliotheque');
    const c = [...document.querySelectorAll('#cahiers .cah')];
    return { cahiers: c.length, x: l.scrollWidth - l.clientWidth,
             titres: c.map(x => x.querySelector('.cah__n').textContent.trim()),
             mots: c.map(x => x.querySelector('.cah__c').textContent.trim().split(/\s+/).length),
             ouvert: document.querySelectorAll('#cahiers .cah.on').length,
             texte: l.textContent.replace(/\s+/g, ' ') };
  });
  v('la bibliothèque tient six cahiers', bi.cahiers === 6, bi.cahiers);
  v('elle ne déborde pas latéralement', bi.x <= 1, bi.x);
  /* c'est une pièce de fond : chaque cahier doit porter du texte,
     c'est ce qui la rend lisible par un moteur comme par une lectrice */
  v('chaque cahier est écrit, pas titré', Math.min(...bi.mots) >= 150,
    Math.min(...bi.mots) + ' mots au plus court');
  v('elle nomme les peausseries de la maison',
    /alligator/i.test(bi.texte) && /galuchat/i.test(bi.texte) && /autruche/i.test(bi.texte));
  v('elle porte les faits de la maison',
    /3\s?400|trois mille quatre cents/i.test(bi.texte) && /Made in France/i.test(bi.texte) &&
    /tannage végétal/i.test(bi.texte));
  /* et les tanneries, nommées : c'est ce qui rend le propos vérifiable */
  v('elle nomme les tanneries partenaires',
    /Rémy Carriat/.test(bi.texte) && /Tannerie du Puy/.test(bi.texte) &&
    /Mégisserie Berry/.test(bi.texte));
  await p.click('#cahiers .cah:nth-child(1) .cah__t'); await p.waitForTimeout(700);
  v('un cahier s\'ouvre', await p.evaluate(() =>
    document.querySelector('#cahiers .cah').classList.contains('on')));

  /* ── le rendez-vous : tout se joue AU-DESSUS DE LA LIGNE DE FLOTTAISON ── */
  await p.evaluate(() => __lieu('rdv')); await p.waitForTimeout(600);
  const fl = await p.evaluate(() => {
    const l = document.getElementById('rdv');
    const f = document.querySelector('.rdv__f').getBoundingClientRect();
    const g = document.querySelector('.rdv__go').getBoundingClientRect();
    const t = document.querySelector('.rdv__t').getBoundingClientRect();
    return { defile: l.scrollHeight - l.clientHeight,
             visuel: f.bottom <= innerHeight + 1 && f.height > innerHeight * .5,
             cta: g.bottom <= innerHeight + 1,
             titre: t.top >= 0,
             d: 'visuel ' + Math.round(f.bottom) + ' · cta ' + Math.round(g.bottom) +
                ' / ' + innerHeight };
  });
  v('le rendez-vous ne se descend pas', fl.defile <= 1, fl.defile + ' px');
  v('le visuel est au-dessus de la ligne de flottaison', fl.visuel, fl.d);
  v('le bouton de rendez-vous aussi', fl.cta && fl.titre, fl.d);

  await p.fill('#rNom', 'Hélène Mauro');
  await p.fill('#rMail', 'h.mauro@example.com');
  await p.click('.rdv__go'); await p.waitForTimeout(700);
  v('la demande de rendez-vous se confirme',
    /Hélène Mauro/.test(await p.locator('#rdvOk').innerText()));

  /* ── le plan, devenu un méga-menu ── */
  await p.evaluate(() => __plan()); await p.waitForTimeout(800);
  v('le plan liste les cinq lieux', await p.locator('#planL .pl').count() === 5,
    await p.locator('#planL .pl').count());
  /* une seule entrée est déployée à la fois — celle qu'on désigne.
     Les autres doivent rester STRICTEMENT de même hauteur : c'était
     le déséquilibre reproché sur la capture. */
  const lignes = await p.evaluate(() => [...document.querySelectorAll('.pl')].map(l => {
    const r = l.getBoundingClientRect();
    const n = l.querySelector('.pl__n').getBoundingClientRect();
    const i = l.querySelector('.pl__i').getBoundingClientRect();
    return { h: Math.round(r.height), ouverte: l.classList.contains('vise'),
             /* le numéro est calé sur la LIGNE DE BASE du nom, pas sur son
                centre : on vérifie qu'il tombe bien dans la boîte du nom */
             num: (i.top + i.height / 2) >= n.top && (i.top + i.height / 2) <= n.bottom,
             large: Math.round(l.querySelector('.pl__n').getBoundingClientRect().width) };
  }));
  const H = lignes.filter(l => !l.ouverte).map(l => l.h);
  v('les entrées au repos ont la même hauteur', Math.max(...H) - Math.min(...H) <= 1,
    lignes.map(l => l.h + (l.ouverte ? '*' : '')).join('/'));
  v('une seule entrée est déployée', lignes.filter(l => l.ouverte).length === 1);
  v('l\'entrée déployée est la plus haute',
    Math.max(...lignes.map(l => l.h)) === lignes.find(l => l.ouverte).h);
  v('le numéro est calé sur le nom', lignes.every(l => l.num));
  const noms = await p.evaluate(() =>
    [...document.querySelectorAll('.pl__n')].map(n =>
      n.firstChild.textContent + (n.querySelector('em') ? n.querySelector('em').textContent : '')));
  v('les noms du plan n\'ont pas d\'espace parasite',
    noms.join('|') === "La Galerie|L'Atelier|La Maison|La Bibliothèque|Le Boudoir",
    noms.join('|'));

  /* le méga-menu : une image éditoriale suit l'entrée survolée, et
     toutes les pages du site sont atteignables depuis là */
  const mega = await p.evaluate(() => {
    const v = document.getElementById('planV');
    return { visuels: v.children.length,
             montre: [...v.children].findIndex(c => c.classList.contains('on')),
             natif: v.querySelector('.on img') ? v.querySelector('.on img').naturalWidth : 0,
             colonnes: document.querySelectorAll('.plan__f h4').length,
             liens: [...document.querySelectorAll('.plan__f li button')].map(b =>
               b.textContent.trim()) };
  });
  v('chaque entrée porte son visuel', mega.visuels === 5, mega.visuels);
  v('un visuel est montré', mega.montre === 0 && mega.natif >= 800,
    mega.montre + ' · ' + mega.natif + ' px');
  await p.hover('#planL .pl:nth-child(4)'); await p.waitForTimeout(900);
  v('le visuel suit l\'entrée désignée',
    await p.evaluate(() => [...document.getElementById('planV').children]
      .findIndex(c => c.classList.contains('on'))) === 3);
  v('le menu range les pages en colonnes', mega.colonnes >= 3, mega.colonnes);
  /* les pages que le client ne trouvait pas doivent être là */
  const attendus = ['cabinet', 'nuancier', 'créatrice', 'rendez-vous'];
  v('les pages secondaires y sont atteignables',
    attendus.every(a => mega.liens.some(l => new RegExp(a, 'i').test(l))),
    mega.liens.join(' · '));

  /* et elles mènent vraiment quelque part */
  const versCabinet = await p.evaluate(() => {
    const b = [...document.querySelectorAll('.plan__f li button')]
      .find(x => /cabinet/i.test(x.textContent));
    b.click(); return 1;
  });
  await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('« le cabinet des matières » ouvre le cabinet', e.plongee && e.cabinet && versCabinet,
    e.lieu + ' plongée=' + e.plongee);
  await p.click('#plgOk'); await p.waitForTimeout(600);
  await p.evaluate(() => __plan()); await p.waitForTimeout(700);
  await p.evaluate(() => {
    const b = [...document.querySelectorAll('.plan__f li button')]
      .find(x => /créatrice/i.test(x.textContent));
    b.click();
  });
  await p.waitForTimeout(1100);
  v('« la créatrice » mène à la maison',
    (await p.evaluate(() => __etat())).lieu === 'maison',
    (await p.evaluate(() => __etat())).lieu);
  await p.evaluate(() => __plan()); await p.waitForTimeout(700);
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
