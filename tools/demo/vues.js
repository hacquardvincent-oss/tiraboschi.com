/* Vues de la nouvelle vitrine — avec le CDN servi depuis une image locale,
   pour que la démonstration soit lisible même sans réseau. */
const { chromium } = require('playwright');
const fs = require('fs');
const F = 'file:///home/user/tiraboschi.com/tiraboschi-maison-demo.html';
// une photographie d'atelier de substitution (le CDN est injoignable d'ici)
const SUB = fs.readFileSync('/home/user/tiraboschi.com/tools/out/subst.png');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.route('**cdn.shopify.com/s/files/**', r => r.fulfill({ contentType: 'image/png', body: SUB }));
  await p.route('**cdn.shopify.com/videos/**', r => r.abort());
  await p.goto(F); await p.waitForTimeout(600);
  await p.screenshot({ path: 'tools/out/v0-splash.png' });
  await p.waitForTimeout(2200);
  await p.screenshot({ path: 'tools/out/v1-hero.png' });
  // défilement INSTANTANÉ : html a scroll-behavior:smooth, un scrollBy
  // enchaîné arriverait avant la fin de l'animation
  await p.evaluate(() => scrollTo({ top: document.getElementById('ch-geste').offsetTop
    + innerHeight * 1.8, behavior: 'instant' }));
  await p.waitForTimeout(1100);
  await p.screenshot({ path: 'tools/out/v2-geste.png' });
  await p.evaluate(() => scrollTo({ top: document.getElementById('ch-maison').offsetTop
    + innerHeight * 1.4, behavior: 'instant' }));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: 'tools/out/v3-chapitre.png' });
  await p.evaluate(() => scrollTo({ top: document.getElementById('ch-pieces').offsetTop,
    behavior: 'instant' }));
  await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/v4-pieces.png' });
  await p.click('.pc[data-p="colette"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/v5-fiche.png' });
  await b.close(); console.log('vues ok');
})();
