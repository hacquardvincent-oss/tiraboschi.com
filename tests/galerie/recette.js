/* Recette de la démo Galerie & Boudoir.
   Lancer depuis la racine : NODE_PATH=/opt/node22/lib/node_modules node tests/galerie/recette.js

   Ce qu'on vérifie tient en une phrase : la galerie ne vend rien, le
   boudoir seul chiffre, et l'on peut aller de l'un à l'autre sans
   qu'une erreur ne sorte en console. */
const { chromium } = require('playwright');
const fs = require('fs');

const F = 'file://' + process.cwd() + '/tiraboschi-galerie-demo.html';

/* Le CDN de la boutique n'est pas joignable depuis l'environnement de
   recette. On sert une vignette neutre à sa place : les cas portent sur
   la mise en page et sur les textes, jamais sur la photographie. Elle est
   embarquée ici pour que la recette ne dépende d'aucun fichier volatil. */
const SUB = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAIAAAC5TEmyAAAANElEQVR42mPU11JloAZgYWRkHKYGMTFQCYyG0YgOI5b///8PU4OoF/2jYTQaRqNeG6HRDwChDCrZXATt0wAAAABJRU5ErkJggg==', 'base64');

let ok = 0, ko = 0;
const cas = [];
function v(nom, cond, detail) {
  if (cond) { ok++; cas.push('  ok   ' + nom); }
  else { ko++; cas.push('  ÉCHEC ' + nom + (detail !== undefined ? ' → ' + detail : '')); }
}

/* contraste WCAG entre deux couleurs rgb */
const lin = c => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
const lum = ([r, g, b]) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
function contraste(a, b) {
  const la = lum(a), lb = lum(b);
  return ((Math.max(la, lb) + .05) / (Math.min(la, lb) + .05));
}
const rgb = s => (s.match(/\d+/g) || [0, 0, 0]).slice(0, 3).map(Number);

(async () => {
  const nav = await chromium.launch();
  const erreurs = [];

  async function page(w, h) {
    const p = await nav.newPage({ viewport: { width: w, height: h } });
    p.on('console', m => { if (m.type() === 'error') erreurs.push(w + 'px · ' + m.text()); });
    p.on('pageerror', e => erreurs.push(w + 'px · ' + e.message));
    await p.route('**cdn.shopify.com/s/files/**', r =>
      r.fulfill({ contentType: 'image/png', body: SUB }));
    await p.route('**fonts.googleapis.com/**', r =>
      r.fulfill({ contentType: 'text/css', body: '' }));
    await p.goto(F);
    await p.waitForTimeout(400);
    return p;
  }

  /* ───────────────── 1440 × 900 — le parcours complet ───────────────── */
  const p = await page(1440, 900);

  /* — le seuil — */
  v('le seuil est le premier lieu', (await p.evaluate(() => __etat())).lieu === 'seuil');
  v('le seuil propose une entrée, pas un achat',
    await p.isVisible('#entrer') && !(await p.locator('#seuil').innerText()).match(/€|acheter|panier/i));

  await p.click('#entrer'); await p.waitForTimeout(900);
  let e = await p.evaluate(() => __etat());
  v('« Entrer » mène au hall', e.lieu === 'hall', e.lieu);
  v('le hall montre trois salles', await p.locator('#portes .pt').count() === 3);

  /* — la salle I — */
  await p.click('.pt[data-salle="pieces"]'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('la première porte ouvre la Salle I', e.lieu === 'salle-pieces', e.lieu);
  const nOe = await p.locator('#salle-pieces .oe').count();
  v('cinq œuvres accrochées en Salle I', nOe === 5, nOe);

  /* la cimaise se parcourt à l'horizontale — c'est une marche, pas une ancre */
  const mur = await p.evaluate(() => {
    const m = document.querySelector('#salle-pieces .mur');
    return { deborde: m.scrollWidth - m.clientWidth, y: m.scrollHeight - m.clientHeight };
  });
  v('la cimaise déborde à l\'horizontale', mur.deborde > 200, mur.deborde);
  v('la cimaise ne déborde pas à la verticale', mur.y <= 1, mur.y);

  /* la molette verticale doit faire marcher latéralement */
  await p.hover('#salle-pieces .oe');
  await p.mouse.wheel(0, 600); await p.waitForTimeout(500);
  const apresMolette = await p.evaluate(() =>
    document.querySelector('#salle-pieces .mur').scrollLeft);
  v('la molette fait marcher le long du mur', apresMolette > 100, apresMolette);
  const cpt = await p.locator('#salle-pieces [data-pos]').innerText();
  v('le repère indique où l\'on est', /Œuvre \d+ sur 5/.test(cpt), cpt);

  /* — la notice — */
  await p.evaluate(() => __ouvrir(0, 0)); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('la notice s\'ouvre sur l\'œuvre', e.notice);
  const not = await p.locator('#not').innerText();
  v('la notice porte un cartel', /dimensions|matières|façonnage/i.test(not));
  v('la notice ne montre AUCUN prix', !/€/.test(not), not.match(/.{0,24}€.{0,24}/));
  v('la seule action est de demander à voir',
    (await p.locator('#notGo').innerText()).toLowerCase().includes('demander'));

  /* la pièce d'exception : le rendu prend bien sa nuance */
  await p.evaluate(() => __ouvrir(0, 3)); await p.waitForTimeout(500);
  const teinte = await p.evaluate(() => {
    const t = getComputedStyle(document.getElementById('notT'));
    const i = document.getElementById('notImg');
    return { fond: t.backgroundColor, masque: t.maskImage.slice(0, 30),
             src: i.getAttribute('src').slice(0, 24), large: i.naturalWidth };
  });
  v('la pièce d\'exception est teintée', rgb(teinte.fond).join() === '30,58,48', teinte.fond);
  v('la teinte passe par le masque du cuir', teinte.masque.includes('url('), teinte.masque);
  v('le rendu d\'exception est embarqué', teinte.src.startsWith('data:image/webp') &&
    teinte.large > 300, teinte.src + ' ' + teinte.large);

  /* — LA PROMESSE : rien ne se vend en galerie — */
  await p.evaluate(() => { __lieu('hall'); });
  const publiques = ['hall', 'salle-pieces', 'salle-geste', 'salle-rencontres', 'rdv'];
  for (const id of publiques) {
    await p.evaluate(i => __lieu(i), id); await p.waitForTimeout(320);
    const txt = await p.locator('#' + id).innerText();
    v('aucun prix dans « ' + id + ' »', !/€|\bprix\b|panier|ajouter au/i.test(txt),
      (txt.match(/.{0,30}(€|\bprix\b|panier).{0,30}/i) || [])[0]);
  }

  /* — le cabinet des matières : on regarde, on ne retient pas — */
  await p.evaluate(() => __lieu('salle-geste')); await p.waitForTimeout(400);
  await p.evaluate(() => __cabinet()); await p.waitForTimeout(700);
  e = await p.evaluate(() => __etat());
  v('le cabinet ouvre la plongée', e.plongee && e.galerie);
  const cab = await p.evaluate(() => ({
    legende: document.getElementById('plgD').textContent,
    bouton: document.getElementById('plgOk').textContent,
    familles: document.querySelectorAll('.fm').length,
    cartes: document.querySelectorAll('.sw').length,
  }));
  v('le cabinet montre les six matières', cab.familles === 6, cab.familles);
  v('le cabinet montre les 52 nuances', cab.cartes === 52, cab.cartes);
  v('le cabinet n\'affiche pas de prix', !/€/.test(cab.legende), cab.legende);
  v('le cabinet ne retient rien', !/retenir/i.test(cab.bouton), cab.bouton);
  await p.click('#plgOk'); await p.waitForTimeout(600);
  e = await p.evaluate(() => __etat());
  v('fermer le cabinet ne pose aucun cuir', !e.plongee && e.cuir === '', e.cuir);

  /* — la porte du boudoir — */
  await p.evaluate(() => __lieu('hall')); await p.waitForTimeout(300);
  await p.click('#versPorte'); await p.waitForTimeout(600);
  await p.fill('#code', '0000'); await p.waitForTimeout(300);
  v('un mauvais code n\'ouvre pas',
    await p.evaluate(() => document.getElementById('codeE').classList.contains('on')) &&
    (await p.evaluate(() => __etat())).lieu === 'hall');
  await p.fill('#code', '1904'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('le bon code ouvre le boudoir', e.lieu === 'boudoir' && e.scene === 'salon',
    e.lieu + '/' + e.scene);
  const bd = await p.locator('#boudoir').innerText();
  v('le salon nomme la cliente', /Hélène/.test(bd));
  v('le salon offre les deux portes', await p.locator('#boudoir .pd').count() === 2);
  v('le carnet montre ses pièces', await p.locator('#carnet .pos1').count() === 2);

  /* — l'atelier : ici seulement, le prix — */
  await p.click('.pd[data-porte="modele"]'); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('la première porte mène à l\'atelier', e.scene === 'atl', e.scene);
  v('l\'atelier chiffre la pièce', e.total === 1900, e.total);
  v('le prix s\'affiche dans la fiche',
    /1\s?900/.test(await p.locator('#tot').innerText()));

  /* poser un cuir */
  await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(700);
  e = await p.evaluate(() => __etat());
  v('la plongée du salon n\'est pas en mode galerie', !e.galerie);
  await p.evaluate(() => { for (let i = 0; i < 5; i++) document.getElementById('plgN').click(); });
  await p.click('.fm[data-f="alligator"]'); await p.waitForTimeout(400);
  v('la plongée du salon annonce le supplément de matière',
    /€/.test(await p.evaluate(() => document.getElementById('plgD').textContent)),
    await p.evaluate(() => document.getElementById('plgD').textContent));
  await p.click('#plgOk'); await p.waitForTimeout(800);
  e = await p.evaluate(() => __etat());
  v('le cuir retenu s\'inscrit', e.cuir === 'alligator:etain', e.cuir);
  v('le cuir retenu se répercute au total', e.total === 5700, e.total);
  const teint = await p.evaluate(() => getComputedStyle(document.getElementById('phT')).opacity);
  v('la pièce a pris sa nuance', parseFloat(teint) > .95, teint);

  /* — la rotation 360° — */
  const av = await p.evaluate(() => document.getElementById('phImg').getAttribute('src'));
  await p.evaluate(() => __tourner(4)); await p.waitForTimeout(500);
  const ap = await p.evaluate(() => ({
    src: document.getElementById('phImg').getAttribute('src'),
    miroir: document.getElementById('ph').classList.contains('miroir'),
    deg: document.getElementById('deg').textContent,
  }));
  v('tourner change le rendu', ap.src !== av);
  v('l\'angle est annoncé', ap.deg === '60°', ap.deg);
  await p.evaluate(() => __tourner(20)); await p.waitForTimeout(400);
  const mir = await p.evaluate(() => ({
    miroir: document.getElementById('ph').classList.contains('miroir'),
    deg: document.getElementById('deg').textContent,
  }));
  v('la seconde moitié est reflétée', mir.miroir && mir.deg === '300°',
    mir.deg + ' miroir=' + mir.miroir);
  await p.evaluate(() => __tourner(0)); await p.waitForTimeout(300);

  /* — la pièce achevée — */
  await p.click('#voirCert'); await p.waitForTimeout(900);
  e = await p.evaluate(() => __etat());
  v('la pièce achevée s\'affiche', e.scene === 'cert', e.scene);
  const cert = await p.locator('#boudoir .scene[data-s="cert"]').innerText();
  v('le certificat récapitule la composition', /Alligator|Étain/.test(cert));
  v('le certificat porte l\'estimation ferme', /5\s?700/.test(cert));
  v('le certificat nomme la cliente', /Hélène/.test(cert));
  v('rien n\'est encaissé', /Aucun paiement/.test(cert));

  /* — les contrastes — */
  const cts = await p.evaluate(() => {
    const r = {};
    const lire = (sel, id) => {
      const el = document.querySelector(sel); if (!el) return;
      const s = getComputedStyle(el);
      r[id] = [s.color, s.backgroundColor];
    };
    __lieu('salle-pieces'); lire('#salle-pieces .oe__n', 'salle1');
    __lieu('salle-geste'); lire('#salle-geste .oe__n', 'salle2');
    __lieu('salle-rencontres'); lire('#salle-rencontres .oe__n', 'salle3');
    /* le fond du texte est celui de la salle, pas celui de l'élément */
    ['salle-pieces', 'salle-geste', 'salle-rencontres'].forEach((s, i) => {
      r['mur' + (i + 1)] = getComputedStyle(document.getElementById(s)).getPropertyValue('--mur').trim();
    });
    __lieu('boudoir'); lire('.bd__t', 'boudoir');
    r.notice = [getComputedStyle(document.getElementById('notN')).color,
                getComputedStyle(document.getElementById('not')).backgroundColor];
    r.plg = [getComputedStyle(document.getElementById('plgNom')).color,
             getComputedStyle(document.querySelector('.plg__bg')).backgroundColor];
    return r;
  });
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  [['Salle I', cts.salle1[0], cts.mur1], ['Salle II', cts.salle2[0], cts.mur2],
   ['Salle III', cts.salle3[0], cts.mur3]].forEach(([n, c, m]) => {
    const r = contraste(rgb(c), hex(m));
    v('contraste lisible en ' + n, r >= 4.5, r.toFixed(2) + ':1');
  });
  const cbd = contraste(rgb(cts.boudoir[0]), hex('#241811'));
  v('contraste lisible au boudoir', cbd >= 4.5, cbd.toFixed(2) + ':1');
  const cnt = contraste(rgb(cts.notice[0]), rgb(cts.notice[1]));
  v('contraste lisible dans la notice', cnt >= 4.5, cnt.toFixed(2) + ':1');

  /* — la démo tient hors connexion pour tout ce qui compte — */
  const dehors = await p.evaluate(() => {
    const ext = [];
    document.querySelectorAll('img').forEach(i => {
      const s = i.getAttribute('src') || '';
      if (s && !s.startsWith('data:')) ext.push(s.slice(0, 60));
    });
    return ext;
  });
  v('les rendus et les cuirs sont embarqués',
    dehors.every(s => s.includes('cdn.shopify.com')), dehors.filter(s => !s.includes('cdn')).slice(0, 3));

  await p.close();

  /* ───────────────── les autres tailles ───────────────── */
  for (const [w, h, nom] of [[1280, 800, 'tablette paysage'], [820, 1180, 'tablette portrait'],
                             [390, 844, 'téléphone']]) {
    const q = await page(w, h);
    await q.evaluate(() => { __lieu('hall'); });
    await q.waitForTimeout(300);
    const deb = await q.evaluate(() => {
      let pire = 0;
      ['hall', 'salle-pieces', 'boudoir'].forEach(id => {
        __lieu(id);
        const el = document.getElementById(id);
        pire = Math.max(pire, el.scrollWidth - el.clientWidth);
      });
      return pire;
    });
    v(nom + ' : aucun débordement latéral', deb <= 1, deb + ' px');

    await q.evaluate(() => __lieu('salle-pieces'));
    await q.waitForTimeout(400);
    const lisible = await q.evaluate(() => {
      const o = document.querySelector('#salle-pieces .oe');
      const r = o.getBoundingClientRect();
      const c = o.querySelector('.oe__c').getBoundingClientRect();
      return { dansEcran: r.top >= -2 && c.bottom <= innerHeight + 2, h: Math.round(c.bottom) };
    });
    v(nom + ' : l\'œuvre et son cartel tiennent à l\'écran', lisible.dansEcran, lisible.h);

    await q.evaluate(() => { __lieu('boudoir'); __scene('atl'); });
    await q.waitForTimeout(500);
    const atl = await q.evaluate(() => {
      const i = document.getElementById('phImg').getBoundingClientRect();
      const b = document.querySelector('.sbar').getBoundingClientRect();
      return { sousLaBarre: i.top >= b.bottom - 1, visible: i.width > 60 && i.height > 60 };
    });
    v(nom + ' : la pièce est entière sous la barre', atl.sousLaBarre && atl.visible,
      JSON.stringify(atl));
    await q.close();
  }

  await nav.close();

  console.log(cas.join('\n'));
  if (erreurs.length) {
    console.log('\nErreurs console :');
    erreurs.forEach(x => console.log('  ' + x));
  }
  console.log('\n' + ok + ' ok · ' + ko + ' échec(s) · ' +
    erreurs.length + ' erreur(s) console');
  process.exit(ko || erreurs.length ? 1 : 0);
})();
