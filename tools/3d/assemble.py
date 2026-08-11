# -*- coding: utf-8 -*-
"""Assemble tiraboschi-3d-prototype.html : gabarit + three.js + tuiles cuir.
Lancer depuis la racine du depot : python3 tools/3d/assemble.py"""
import base64, json
# Prérequis : npm install three@0.128 (à la racine du dépôt ou dans tools/3d)
import os
for cand in ['node_modules/three/build/three.min.js','tools/3d/node_modules/three/build/three.min.js']:
    if os.path.exists(cand): three=open(cand,encoding='utf-8').read(); break
else: raise SystemExit('three.min.js introuvable — npm install three@0.128')
tuiles={n:'data:image/png;base64,'+base64.b64encode(open('tools/cuirs/%s.png'%n,'rb').read()).decode()
        for n in ['graine','caviar','lisse','daim','galuchat','alligator']}
NU=[('noir-absolu','Noir Absolu','#0d0d0d'),('noir','Noir','#161616'),('anthracite','Anthracite','#2b2b2e'),
('ardoise','Ardoise','#3a3d42'),('graphite','Graphite','#4a4d52'),('etain','Étain','#6b6e73'),
('gris-perle','Gris Perle','#9a9da2'),('tourterelle','Gris Tourterelle','#b3b0a8'),('argile','Argile','#c7c2b8'),
('craie','Craie','#efe9dd'),('blanc-casse','Blanc Cassé','#f4f0e6'),('ivoire','Ivoire','#e6dcc8'),
('ecru','Écru','#ddd2ba'),('sable','Sable','#d2c3a4'),('lin','Lin','#c9bda3'),('parchemin','Parchemin','#c2b394'),
('miel','Miel','#c08b3e'),('camel-clair','Camel Clair','#c9a06a'),('camel','Camel','#b8874a'),
('fauve','Fauve','#a8703a'),('caramel','Caramel','#a86a30'),('whisky','Whisky','#96602c'),
('cognac','Cognac','#8f5424'),('havane','Havane','#7d4a24'),('noisette','Noisette','#6f4c31'),
('tabac','Tabac','#6b4526'),('ecorce','Écorce','#5a4030'),('chocolat','Chocolat','#4e3324'),
('moka','Moka','#3d2a1f'),('ebene','Ébène','#2e211a'),('brique','Brique','#9c4530'),
('terracotta','Terracotta','#b05a3c'),('cardinal','Rouge Cardinal','#a01f28'),('rouge-profond','Rouge Profond','#7d1c22'),
('grenat','Grenat','#6d2530'),('bordeaux','Bordeaux','#5e1f2c'),('vieux-rose','Vieux Rose','#bf8a86'),
('rose-poudre','Rose Poudré','#d8b3ad'),('prune','Prune','#5b3348'),('aubergine','Aubergine','#452a3c'),
('amethyste','Améthyste','#6b4a72'),('bleu-nuit','Bleu Nuit','#1c2438'),('marine','Marine','#243352'),
('prusse','Bleu de Prusse','#28455e'),('bleu-ardoise','Bleu Ardoise','#41607d'),('celadon','Céladon','#7d9aa6'),
('sauge','Sauge','#93a087'),('kaki','Kaki','#5d6146'),('olive','Olive','#71703f'),('sapin','Sapin','#2b4a38'),
('vert-empire','Vert Empire','#1e3a30'),('bouteille','Vert Bouteille','#24523c')]
g=open('tools/3d/gabarit-3d.html',encoding='utf-8').read()
html=(g.replace('/*__THREE__*/',three)
 .replace('"__TUILES__"',json.dumps(tuiles))
 .replace('"__NUANCES__"',json.dumps([{'id':i,'nom':n,'hex':h} for i,n,h in NU],ensure_ascii=False)))
open('tiraboschi-3d-prototype.html','w',encoding='utf-8').write(html)
print('assemblé : %d Ko'%(len(html)//1024))
