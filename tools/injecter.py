# -*- coding: utf-8 -*-
"""Réinjecte les tuiles tools/cuirs/*.png dans le bloc TX du prototype."""
import base64, re
noms=['graine','caviar','lisse','daim','galuchat','alligator']
bloc="var TX={\n"+",\n".join(
  "  %s:'data:image/png;base64,%s'"%(n,base64.b64encode(open('tools/cuirs/%s.png'%n,'rb').read()).decode())
  for n in noms)+"\n};\n"
p='tiraboschi-atelier-prototype.html'
s=open(p,encoding='utf-8').read()
s2=re.sub(r"var TX=\{\n(?:  \w+:'data:image/png;base64,[^']*',?\n)+\};\n",bloc,s)
assert s2!=s or bloc in s, 'bloc TX introuvable'
open(p,'w',encoding='utf-8').write(s2)
print('TX réinjecté : %d Ko'%(len(s2)//1024))
