# -*- coding: utf-8 -*-
"""Assemble tiraboschi-maison-demo.html : gabarit + tuiles + rendus + nuances.
Lancer depuis la racine du dépôt : python3 tools/demo/assembler.py"""
import base64, json, sys, os

GAB = sys.argv[1] if len(sys.argv) > 1 else 'tools/demo/gabarit-maison.html'

def b64(p, mime='image/webp'):
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(p, 'rb').read()).decode())

TUILES = {m: b64('tools/demo/%s.webp' % m)
          for m in ['graine', 'caviar', 'lisse', 'daim', 'galuchat', 'alligator']}
# position 0 en haute définition — même studio et même cadrage que la série 360°,
# pour que la pièce au repos ne saute pas quand on la fait tourner
RENDUS = {m: b64('tools/rot360/hd-%s.webp' % m)
          for m in ['graine', 'caviar', 'lisse', 'daim', 'galuchat', 'alligator', 'masque']}

N = lambda i, n, h: {'id': i, 'nom': n, 'hex': h}
NUANCES = [
 N('noir-absolu','Noir Absolu','#0d0d0d'), N('noir','Noir','#161616'),
 N('anthracite','Anthracite','#2b2b2e'), N('ardoise','Ardoise','#3a3d42'),
 N('graphite','Graphite','#4a4d52'), N('etain','Étain','#6b6e73'),
 N('gris-perle','Gris Perle','#9a9da2'), N('tourterelle','Gris Tourterelle','#b3b0a8'),
 N('argile','Argile','#c7c2b8'), N('craie','Craie','#efe9dd'),
 N('blanc-casse','Blanc Cassé','#f4f0e6'), N('ivoire','Ivoire','#e6dcc8'),
 N('ecru','Écru','#ddd2ba'), N('sable','Sable','#d2c3a4'),
 N('lin','Lin','#c9bda3'), N('parchemin','Parchemin','#c2b394'),
 N('miel','Miel','#c08b3e'), N('camel-clair','Camel Clair','#c9a06a'),
 N('camel','Camel','#b8874a'), N('fauve','Fauve','#a8703a'),
 N('caramel','Caramel','#a86a30'), N('whisky','Whisky','#96602c'),
 N('cognac','Cognac','#8f5424'), N('havane','Havane','#7d4a24'),
 N('noisette','Noisette','#6f4c31'), N('tabac','Tabac','#6b4526'),
 N('ecorce','Écorce','#5a4030'), N('chocolat','Chocolat','#4e3324'),
 N('moka','Moka','#3d2a1f'), N('ebene','Ébène','#2e211a'),
 N('brique','Brique','#9c4530'), N('terracotta','Terracotta','#b05a3c'),
 N('cardinal','Rouge Cardinal','#a01f28'), N('rouge-profond','Rouge Profond','#7d1c22'),
 N('grenat','Grenat','#6d2530'), N('bordeaux','Bordeaux','#5e1f2c'),
 N('vieux-rose','Vieux Rose','#bf8a86'), N('rose-poudre','Rose Poudré','#d8b3ad'),
 N('prune','Prune','#5b3348'), N('aubergine','Aubergine','#452a3c'),
 N('amethyste','Améthyste','#6b4a72'), N('bleu-nuit','Bleu Nuit','#1c2438'),
 N('marine','Marine','#243352'), N('prusse','Bleu de Prusse','#28455e'),
 N('bleu-ardoise','Bleu Ardoise','#41607d'), N('celadon','Céladon','#7d9aa6'),
 N('sauge','Sauge','#93a087'), N('kaki','Kaki','#5d6146'),
 N('olive','Olive','#71703f'), N('sapin','Sapin','#2b4a38'),
 N('vert-empire','Vert Empire','#1e3a30'), N('bouteille','Vert Bouteille','#24523c'),
]

# ── la séquence 360° : 13 positions par matière (0°→180°), le reste en miroir
ROT = {}
for m in ['graine', 'caviar', 'lisse', 'daim', 'galuchat', 'alligator', 'masque']:
    ROT[m] = [b64('tools/rot360/%s-%02d.webp' % (m, i)) for i in range(13)]

s = open(GAB, encoding='utf-8').read()
s = (s.replace('"__TUILES__"', json.dumps(TUILES))
      .replace('"__RENDUS__"', json.dumps(RENDUS))
      .replace('"__ROT__"', json.dumps(ROT))
      .replace('"__NUANCES__"', json.dumps(NUANCES, ensure_ascii=False)))
open('tiraboschi-maison-demo.html', 'w', encoding='utf-8').write(s)
print('assemblé : %d Ko' % (len(s) // 1024))
