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
  await p.click('#entrer'); await p.waitForTimeout(1000);
  e = await p.evaluate(() => __etat());
  v('« Entrer » mène dans la galerie', e.lieu === 'galerie', e.lieu);

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
  v('trente-deux pièces accrochées', e.oeuvres === 32, e.oeuvres);
  v('dont vingt-six au nuancier', e.nuancier === 26, e.nuancier);
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
  v('les silhouettes ont des formats inégaux', patch.ecartL >= 1.4, patch.ecartL.toFixed(2));
  v('elles ne sont pas à la même hauteur', patch.niveaux >= 4, patch.niveaux);
  /* …le nuancier, lui, est une grille stricte */
  v('le nuancier est une grille régulière',
    patch.nuLarg === 1 && patch.nuBandes === 3,
    patch.nuLarg + ' largeur(s) · ' + patch.nuBandes + ' bande(s)');

  await p.hover('.tuile');
  await p.mouse.wheel(0, 700); await p.waitForTimeout(600);
  const marche = await p.evaluate(() => ({
    x: document.getElementById('mur').scrollLeft,
    n: document.getElementById('marcheN').textContent }));
  v('la molette fait marcher le long du mur', marche.x > 150, marche.x);
  v('le repère nomme la pièce courante', /Pièce \d+ sur 32/.test(marche.n), marche.n);

  /* ── le plein écran ── */
  await p.evaluate(() => __lieu('galerie')); await p.waitForTimeout(400);
  await p.evaluate(() => __plein(0)); await p.waitForTimeout(1300);
  e = await p.evaluate(() => __etat());
  v('la pièce s\'ouvre en plein écran', e.plein && e.pleinIdx === 0);
  const grand = await p.evaluate(() => {
    const ph = document.getElementById('pleinPh').getBoundingClientRect();
    const c = document.querySelector('.plein__c').getBoundingClientRect();
    const st = document.querySelector('.plein__s'), cs = getComputedStyle(st);
    const W = st.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const H = st.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return { part: Math.max(ph.width / W, ph.height / H), aCote: ph.right <= c.left + 1,
             src: document.getElementById('pleinImg').getAttribute('src').slice(0, 22),
             large: document.getElementById('pleinImg').naturalWidth };
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
  await p.click('#pleinN'); await p.waitForTimeout(900);
  v('la flèche mène à la pièce suivante',
    (await p.evaluate(() => __etat())).pleinIdx === 1);
  /* une pièce du nuancier : elle se montre ENTIÈRE, jamais recadrée */
  await p.evaluate(() => __plein(10)); await p.waitForTimeout(900);
  const nu = await p.evaluate(() => ({
    contient: document.getElementById('pleinPh').classList.contains('contenir'),
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
  }

  /* ── L'ATELIER : six plans que l'on traverse ── */
  await p.evaluate(() => __lieu('atelier')); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('six plans composent l\'atelier', e.plans === 6, e.plans);
  const at = await p.evaluate(() => {
    const a = document.getElementById('atelier');
    const s = document.querySelector('.plan6').getBoundingClientRect();
    return { fond: getComputedStyle(a).backgroundColor,
             pleineHauteur: Math.abs(s.height - innerHeight) < 2,
             y: a.scrollHeight - a.clientHeight, x: a.scrollWidth - a.clientWidth,
             rail: document.querySelectorAll('.at__rail button').length,
             texte: getComputedStyle(document.querySelector('.plan6__t')).color };
  });
  v('l\'atelier est sombre', lum(rgb(at.fond)) < .04, at.fond);
  v('chaque plan tient toute la page', at.pleineHauteur);
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
    retard: document.querySelector('.plan6[data-i="2"] .plan6__m').style.transform }));
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

  /* ── LA MAISON : la chronique ── */
  await p.evaluate(() => __lieu('maison')); await p.waitForTimeout(700);
  e = await p.evaluate(() => __etat());
  v('la maison est un lieu à part', e.lieu === 'maison', e.lieu);
  v('cinq chapitres', e.chapitres === 5, e.chapitres);
  const ma = await p.locator('#maison').innerText();
  v('la chronique part de 1904', /1904/.test(ma));
  v('elle arrive à Laurène', /Laurène/.test(ma));
  v('les repères d\'exemple sont signalés', /exemple/i.test(ma));
  v('le fil d\'Ariane garde le chemin', /GALERIE.*MAISON/i.test(
    (await p.evaluate(() => __etat())).ariane));
  const chap = await p.evaluate(() => {
    const m = document.getElementById('maison');
    return { y: m.scrollHeight - m.clientHeight, x: m.scrollWidth - m.clientWidth,
             fond: getComputedStyle(m).backgroundColor };
  });
  v('la maison se lit à la verticale', chap.y > 1200, chap.y);
  v('elle ne déborde pas latéralement', chap.x <= 1, chap.x);
  v('elle est sur papier clair', lum(rgb(chap.fond)) > .85, chap.fond);

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
  v('le boudoir s\'ouvre sur le volume', e.scene === 'atl', e.scene);

  /* ── LE MODULE : la pièce se tourne AU DOIGT ── */
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
    /tourner/i.test(await p.locator('#saisir').innerText()) &&
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
  v('le plan liste les cinq destinations', await p.locator('#planL .pl').count() === 5);
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
    noms.join('|') === "La Galerie|L'Atelier|La Maison|Le Boudoir|Le Rendez-vous",
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
      const ph = document.getElementById('pleinPh').getBoundingClientRect();
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
