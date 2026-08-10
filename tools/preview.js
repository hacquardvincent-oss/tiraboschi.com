const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = path.resolve(__dirname, 'cuirs');
const t = {}; for (const f of fs.readdirSync(dir)) if (f.endsWith('.png'))
  t[f.replace('.png','')] = 'data:image/png;base64,' + fs.readFileSync(path.join(dir,f)).toString('base64');
const cas = [
  ['graine','#161616','Noir Grainé'],['graine','#8f5424','Cognac'],['graine','#b8874a','Camel'],['graine','#243352','Marine'],
  ['lisse','#0d0d0d','Noir Absolu'],['lisse','#5e1f2c','Bordeaux'],['lisse','#efe9dd','Craie'],['lisse','#1e3a30','Vert Empire'],
  ['daim','#3a3d42','Ardoise'],['daim','#b05a3c','Terracotta'],['daim','#93a087','Sauge'],['daim','#ddd2ba','Écru'],
  ['galuchat','#b9b7ae','Galuchat Perle'],['galuchat','#6e7276','Galuchat Ardoise'],
  ['python','#a89474','Python Naturel'],['python','#3a3a42','Python Nuit'],
  ['alligator','#1f1f22','Alligator Noir'],['alligator','#8a5a2e','Alligator Cognac'],
];
const html = `<body style="margin:0;background:#111;font:11px system-ui;color:#aaa;display:grid;grid-template-columns:repeat(6,1fr)">
${cas.map(([k,c,n])=>`<div><div style="height:180px;background-image:url(${t[k]});background-color:${c};background-blend-mode:hard-light;background-size:200px 200px"></div><div style="padding:6px">${n} · ${k}</div></div>`).join('')}
<div style="grid-column:1/-1;height:340px;background-image:url(${t.graine});background-color:#8f5424;background-blend-mode:hard-light;background-size:420px 420px"></div>
<div style="grid-column:1/-1;height:340px;background-image:url(${t.galuchat});background-color:#b9b7ae;background-blend-mode:hard-light;background-size:420px 420px"></div>
</body>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1400}});
await p.setContent(html);await p.waitForTimeout(400);
await p.screenshot({path:'tools/out/planche.png',fullPage:true});await b.close();console.log('ok')})();
