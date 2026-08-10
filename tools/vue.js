const { chromium } = require('playwright');
const path = require('path');
const F = 'file://' + path.resolve(__dirname, '../tiraboschi-atelier-prototype.html');
const fs = require('fs');
const FAUX = fs.readFileSync('/tmp/claude-0/-home-user-tiraboschi-com/0c5da69e-11bb-5c63-83b6-1098a8c5334e/scratchpad/packshot.png');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.route('**cdn.shopify.com**', r => r.fulfill({ contentType: 'image/png', body: FAUX }));
  await p.goto(F); await p.waitForTimeout(600);
  await p.click('[data-go="0"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/1-atelier-nu.png' });

  await p.click('.aj[data-k="ext"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/2-coverflow.png' });
  // aller sur un cognac grainé
  await p.evaluate(() => { for (let i = 0; i < 26; i++) document.getElementById('plgN').click(); });
  await p.waitForTimeout(1200);
  await p.screenshot({ path: 'tools/out/3-coverflow-cognac.png' });
  await p.click('#plgOk'); await p.waitForTimeout(1800);
  await p.screenshot({ path: 'tools/out/4-piece-habillee.png' });

  await p.click('.aj[data-k="ferrures"]'); await p.waitForTimeout(900);
  await p.screenshot({ path: 'tools/out/5-options.png' });
  await p.click('#plgX'); await p.waitForTimeout(600);
  await p.click('#toCert'); await p.waitForTimeout(1600);
  await p.screenshot({ path: 'tools/out/6-certificat.png' });
  await b.close(); console.log('vues prises');
})();
