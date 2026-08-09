const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  await p.goto('file://' + require('path').resolve(process.argv[2]) + '/collection.html');
  await p.waitForTimeout(300);

  console.log('COMPORTEMENT AU SCROLL (desktop, page avec barre de filtres)\n');
  console.log('scrollY   header cache   haut header   haut filtres   barre filtres');
  console.log('-'.repeat(64));
  let bad = 0;
  for (const y of [0, 300, 900, 1500, 900, 300]) {
    await p.evaluate(v => window.scrollTo(0, v), y); await p.waitForTimeout(420);
    const r = await p.evaluate(() => {
      const h = document.getElementById('hdr'), f = document.getElementById('col-filters');
      const hb = h.getBoundingClientRect(), fb = f.getBoundingClientRect();
      return { hidden: h.classList.contains('hidden'),
               hTop: Math.round(hb.top), hBottom: Math.round(hb.bottom),
               fTop: Math.round(fb.top) };
    });
    /* Invariants : le header ne se rétracte jamais et reste en haut ;
       la barre de filtres, une fois accostée, colle exactement au header
       (jamais dessous avec un vide, jamais par-dessus). */
    const docked = r.fTop <= r.hBottom + 1;
    const ok = !r.hidden && r.hTop === 0 && (!docked || Math.abs(r.fTop - r.hBottom) <= 1);
    if (!ok) bad++;
    console.log(String(y).padEnd(10) + String(r.hidden).padEnd(15) +
      String(r.hTop).padEnd(14) + String(r.fTop).padEnd(15) +
      (docked ? 'accostée' : 'dans le flux') + (ok ? '' : '  ⚠'));
  }

  const cta = await p.evaluate(() => {
    const l = document.querySelector('.col-editorial-2x2__link');
    if (!l) return null;
    const cs = getComputedStyle(l);
    const after = getComputedStyle(l, '::after');
    return { textDeco: cs.textDecorationLine, padBottom: cs.paddingBottom,
             filet: after.height, tracking: cs.letterSpacing };
  });
  console.log('\nCTA « Découvrir l\'atelier »');
  if (cta) {
    console.log('  soulignement navigateur : ' + cta.textDeco + (cta.textDeco === 'none' ? '  (remplacé)' : '  ⚠'));
    console.log('  espace texte / filet    : ' + cta.padBottom);
    console.log('  épaisseur du filet      : ' + cta.filet);
    console.log('  interlettrage           : ' + cta.tracking);
  }
  await b.close();
  console.log('\n' + (bad ? bad + ' état(s) en défaut' : 'Header permanent, barre accostée sans vide'));
})();
