# -*- coding: utf-8 -*-
"""Compresse la série 360° en WebP et la range dans tools/rot360/.
Le masque descend à 240 px : il ne sert qu'à découper, l'échelle suffit."""
from PIL import Image
import os, sys, glob
SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/rot360'
os.makedirs('tools/rot360', exist_ok=True)
tot = 0
for m in ['graine', 'caviar', 'lisse', 'daim', 'galuchat', 'alligator', 'masque']:
    for i in range(13):
        p = os.path.join(SRC, '%s-%02d.png' % (m, i))
        if not os.path.exists(p):
            print('MANQUE', p); continue
        im = Image.open(p)
        if m == 'masque':
            im = im.resize((240, int(240 * im.height / im.width)), Image.LANCZOS)
            q = 68
        else:
            q = 80
        o = 'tools/rot360/%s-%02d.webp' % (m, i)
        im.save(o, 'WEBP', quality=q, method=6)
        tot += os.path.getsize(o)
# la position 0, en haute définition
HD = sys.argv[2] if len(sys.argv) > 2 else '/tmp/rot360hd'
hdt = 0
for m in ['graine', 'caviar', 'lisse', 'daim', 'galuchat', 'alligator', 'masque']:
    p = os.path.join(HD, '%s-00.png' % m)
    if not os.path.exists(p):
        print('MANQUE HD', p); continue
    im = Image.open(p)
    im = im.resize((760, int(760 * im.height / im.width)), Image.LANCZOS)
    o = 'tools/rot360/hd-%s.webp' % m
    im.save(o, 'WEBP', quality=70 if m == 'masque' else 86, method=6)
    hdt += os.path.getsize(o)
print('série 360° : %d Ko  ·  position 0 HD : %d Ko' % (tot // 1024, hdt // 1024))
print('total embarqué ≈ %d Ko (base64 %d Ko)' % ((tot + hdt) // 1024, (tot + hdt) * 4 // 3 // 1024))
