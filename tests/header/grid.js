const { chromium } = require('playwright');
function lum(c){const s=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
  return 0.2126*s[0]+0.7152*s[1]+0.0722*s[2];}
function ratio(a,b){const l1=lum(a),l2=lum(b);const[h,l]=l1>l2?[l1,l2]:[l2,l1];return (h+0.05)/(l+0.05);}
(async () => {
  const b = await chromium.launch();
  for (const vp of [{w:1440,h:900,n:'desktop'},{w:390,h:844,n:'mobile'}]) {
    const p = await b.newPage({ viewport:{width:vp.w,height:vp.h} });
    await p.goto('file://' + require('path').resolve(process.argv[2]) + '/collection.html');
    await p.waitForTimeout(350);
    const r = await p.evaluate(() => {
      const d=document.documentElement;
      const first=document.querySelector('.card .card__type');
      const price=document.querySelector('.card__price--request');
      const cs=getComputedStyle(price);
      const m=cs.color.match(/[\d.]+/g).map(Number);
      const op=parseFloat(cs.opacity);
      const eff=m.slice(0,3).map(v=>Math.round(v*op+255*(1-op)));
      return {
        overflow: d.scrollWidth-d.clientWidth,
        textLeft: Math.round(first.getBoundingClientRect().left),
        broken: [...document.querySelectorAll('img')].filter(i=>!i.getAttribute('src')||!i.getAttribute('src').trim()).length,
        priceEff: eff
      };
    });
    const cr = ratio(r.priceEff, [255,255,255]);
    console.log('── ' + vp.n);
    console.log('   debordement horizontal  : ' + (r.overflow>0?r.overflow+'px ⚠':'aucun'));
    console.log('   texte card, bord gauche : ' + r.textLeft + 'px' + (r.textLeft<8?'  ⚠ colle au bord':'  OK'));
    console.log('   images sans src         : ' + (r.broken?r.broken+' ⚠':'aucune'));
    console.log('   contraste "prix sur demande" : ' + cr.toFixed(2) + (cr>=4.5?'  OK':'  ⚠ sous le seuil'));
    await p.close();
  }
  await b.close();
})();
