const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const F = 'file://' + path.resolve(__dirname, '../tiraboschi-atelier-prototype.html');
const FAUX = fs.readFileSync('/tmp/claude-0/-home-user-tiraboschi-com/0c5da69e-11bb-5c63-83b6-1098a8c5334e/scratchpad/packshot.png');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.route('**cdn.shopify.com**', r => r.fulfill({ contentType: 'image/png', body: FAUX }));
  await p.goto(F); await p.waitForTimeout(700);
  await p.screenshot({ path: 'tools/out/1-briques.png' });

  // swipe des briques
  const dk = await p.locator('#dk').boundingBox();
  await p.mouse.move(dk.x+dk.width*.6, dk.y+dk.height/2); await p.mouse.down();
  for(let i=1;i<=10;i++) await p.mouse.move(dk.x+dk.width*(.6-.03*i), dk.y+dk.height/2);
  await p.waitForTimeout(80);
  await p.screenshot({ path: 'tools/out/1b-briques-drag.png' });
  await p.mouse.up(); await p.waitForTimeout(900);

  await p.click('#dkGo'); await p.waitForTimeout(1000);
  await p.screenshot({ path: 'tools/out/2-atelier.png' });

  await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/3-coverflow.png' });
  // aller sur cognac (index 22) puis matière caviar
  await p.evaluate(() => { for (let i = 0; i < 22; i++) document.getElementById('plgN').click(); });
  await p.waitForTimeout(1100);
  await p.click('.fm[data-f="caviar"]'); await p.waitForTimeout(700);
  await p.screenshot({ path: 'tools/out/3b-coverflow-caviar.png' });
  await p.click('#plgOk'); await p.waitForTimeout(1800);
  await p.screenshot({ path: 'tools/out/4-piece.png' });

  await p.click('.aj[data-k="ferrures"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/5-options.png' });
  await p.click('#plgX'); await p.waitForTimeout(500);
  // fil d'étapes : retour silhouettes puis certificat direct
  await p.click('.pa[data-s="1"]'); await p.waitForTimeout(800);
  await p.screenshot({ path: 'tools/out/6-retour-briques.png' });
  await p.click('.pa[data-s="3"]'); await p.waitForTimeout(1400);
  await p.screenshot({ path: 'tools/out/7-certificat.png' });
  console.log('erreurs:', errs.length?errs:'aucune');
  await b.close();
})();
