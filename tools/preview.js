const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = path.resolve(__dirname, 'cuirs');
const t = {}; for (const f of fs.readdirSync(dir)) if (f.endsWith('.png'))
  t[f.replace('.png','')] = 'data:image/png;base64,' + fs.readFileSync(path.join(dir,f)).toString('base64');
const cas0=[];
const types=['graine','caviar','lisse','daim','galuchat','alligator'];
const cols=[['#161616','Noir'],['#8f5424','Cognac'],['#243352','Marine'],['#efe9dd','Craie']];
for(const t of types)for(const [c,n] of cols)cas0.push([t,c,n]);
const cas=cas0;
const html = `<body style="margin:0;background:#111;font:11px system-ui;color:#aaa;display:grid;grid-template-columns:repeat(4,1fr)">
${cas.map(([k,c,n])=>`<div><div style="height:230px;background-image:url(${t[k]});background-color:${c};background-blend-mode:hard-light;background-size:512px 512px"></div><div style="padding:6px">${n} · ${k}</div></div>`).join('')}
<div style="grid-column:1/-1;height:520px;background-image:url(${t.graine});background-color:#3a3a3a;background-blend-mode:hard-light;background-size:512px 512px"></div>
</body>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1400,height:2400}});
await p.setContent(html);await p.waitForTimeout(400);
await p.screenshot({path:'tools/out/planche.png',fullPage:true});await b.close();console.log('ok')})();
