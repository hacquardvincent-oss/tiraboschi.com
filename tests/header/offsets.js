const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  let bad = 0;
  console.log('INVARIANT : l\'espace RESERVE sous le header doit egaler l\'espace OCCUPE\n');
  console.log('largeur  --search-h  search rendue  bas header  haut filtres  ecart');
  console.log('-'.repeat(70));
  for (const w of [1600,1440,1280,1201,1200,1100,900,390]) {
    const p = await b.newPage({ viewport:{width:w,height:900} });
    await p.goto('file://' + require('path').resolve(process.argv[2]) + '/collection.html');
    await p.waitForTimeout(280);
    await p.evaluate(()=>window.scrollTo(0,1200));
    await p.waitForTimeout(380);
    const r = await p.evaluate(() => {
      const hdr=document.getElementById('hdr'), srch=document.getElementById('hdr-search'),
            flt=document.getElementById('col-filters');
      const cs=getComputedStyle(document.documentElement);
      const shown = srch && getComputedStyle(srch).display!=='none';
      const sh = shown ? srch.getBoundingClientRect().height : 0;
      const hb = hdr.getBoundingClientRect();
      const fltShown = getComputedStyle(flt).display !== 'none';
      return { fltShown, declared: parseFloat(cs.getPropertyValue('--search-h')) || 0,
               rendered: Math.round(sh), hdrBottom: Math.round(hb.bottom),
               filterTop: Math.round(flt.getBoundingClientRect().top),
               occupied: Math.round(hb.height + sh) };
    });
    // Sous 900px la barre de filtres cede la place au bouton flottant :
    // seul l'invariant reserve/occupe reste pertinent.
    const ecart = r.fltShown ? r.filterTop - r.occupied : 0;
    const ok = Math.abs(ecart) <= 1 && Math.abs(r.declared - r.rendered) <= 1;
    if (!ok) bad++;
    console.log(String(w+'px').padEnd(9) + String(r.declared+'px').padEnd(12) +
      String(r.rendered+'px').padEnd(15) + String(r.hdrBottom).padEnd(12) +
      String(r.fltShown ? r.filterTop : '— (FAB)').padEnd(14) +
      String(ecart)+'px' + (ok?'':'  ⚠ BANDEAU VIDE'));
    await p.close();
  }
  await b.close();
  console.log('\n' + (bad ? bad + ' largeur(s) en defaut' : 'Aucun bandeau vide'));
  process.exit(bad ? 1 : 0);
})();
