const { chromium } = require('playwright');

function lum(c){const s=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)});
  return 0.2126*s[0]+0.7152*s[1]+0.0722*s[2];}
function ratio(a,b){const l1=lum(a),l2=lum(b);const [h,l]=l1>l2?[l1,l2]:[l2,l1];
  return (h+0.05)/(l+0.05);}
function parse(s){const m=s.match(/rgba?\(([^)]+)\)/); if(!m) return null;
  const p=m[1].split(',').map(Number); return {rgb:p.slice(0,3), a:p.length>3?p[3]:1};}
function over(fg,bg){ // composite fg (avec alpha) sur bg opaque
  return fg.rgb.map((v,i)=>Math.round(v*fg.a + bg[i]*(1-fg.a)));}

(async () => {
  const b = await chromium.launch();
  const pages = ['collection','produit','editoriale','panier'];
  const results = [];
  for (const name of pages) {
    for (const vp of [{w:1440,h:900,label:'desktop'},{w:390,h:844,label:'mobile'}]) {
      const p = await b.newPage({ viewport:{width:vp.w,height:vp.h} });
      await p.goto('file://' + require('path').resolve(process.argv[2]) + '/hdr-' + name + '.html');
      await p.waitForTimeout(400);
      for (const y of [0, 600]) {
        await p.evaluate(v=>window.scrollTo(0,v), y);
        await p.waitForTimeout(450);
        const r = await p.evaluate(() => {
          const hdr = document.getElementById('hdr');
          // Mesurer l'habillage reellement visible a ce point de rupture
          const d = hdr.querySelector('.hdr__d'), m = hdr.querySelector('.hdr__m');
          const vis = el => el && getComputedStyle(el).display !== 'none';
          const inner = vis(m) ? m : d;
          const cs = getComputedStyle(hdr), ci = getComputedStyle(inner);
          // Ce qu'il y a DERRIERE le header au point (60, 34)
          const stack = document.elementsFromPoint(60, 34).filter(e => !hdr.contains(e));
          let behind = 'rgb(255, 255, 255)';
          for (const el of stack) {
            const bg = getComputedStyle(el).backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') { behind = bg; break; }
          }
          return { which: inner.className, hdrBg: cs.backgroundColor, textColor: ci.color, behind,
                   onDark: document.body.classList.contains('on-dark'),
                   solid: hdr.classList.contains('solid'),
                   hidden: hdr.classList.contains('hidden') };
        });
        const behind = parse(r.behind); const hb = parse(r.hdrBg); const tc = parse(r.textColor);
        let eff = behind.rgb;
        if (hb && hb.a > 0) eff = over(hb, eff);
        const cr = ratio(tc.rgb, eff);
        results.push({ which:r.which, page:name, vp:vp.label, y, solid:r.solid, onDark:r.onDark,
          text:r.textColor, eff:'rgb('+eff.join(',')+')', cr: cr.toFixed(2) });
      }
      await p.close();
    }
  }
  await b.close();
  console.log('CONTRASTE texte du header / fond effectif  (seuil lisible : 4.5)\n');
  console.log('page        vue/bloc       scroll  solid  on-dark  fond effectif      contraste');
  console.log('-'.repeat(78));
  let bad = 0;
  for (const r of results) {
    const ok = parseFloat(r.cr) >= 4.5;
    if (!ok) bad++;
    console.log(
      r.page.padEnd(12) + (r.vp+'/'+r.which.replace('hdr__','')).padEnd(15) + String(r.y).padEnd(8) +
      String(r.solid).padEnd(7) + String(r.onDark).padEnd(9) +
      r.eff.padEnd(19) + r.cr.padStart(6) + (ok ? '' : '   ECHEC'));
  }
  console.log('\n' + (bad ? bad + ' cas illisible(s)' : 'Tous les cas lisibles'));
})();
