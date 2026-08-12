# -*- coding: utf-8 -*-
"""Rendus Cycles de la Rafaël pour l'Atelier — voie A (pré-calculé).

Une image par MATIÈRE, en base NEUTRE et sur fond TRANSPARENT :
le navigateur applique ensuite la nuance (mix-blend-mode: color), ce qui
donne 6 × 52 = 312 combinaisons à partir de 6 rendus.

Usage : python3 atelier_renders.py <matiere> <sortie.png> [samples] [largeur]
"""
import bpy, bmesh, math, sys

MAT = sys.argv[1] if len(sys.argv) > 1 else 'caviar'
SORTIE = sys.argv[2] if len(sys.argv) > 2 else '/tmp/rafael.png'
SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 150
RESX = int(sys.argv[4]) if len(sys.argv) > 4 else 1000
TUILE = f"/home/user/tiraboschi.com/tools/cuirs/{MAT if MAT != 'masque' else 'caviar'}.png"

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.render.resolution_x = RESX
sc.render.resolution_y = int(RESX * 1.12)
sc.render.film_transparent = True          # fond transparent : la scène de l'Atelier passe dessous
sc.render.image_settings.color_mode = 'RGBA'

def lier(o):
    sc.collection.objects.link(o); return o

def maille(nom, bm, bevel=0.0, seg=4, lisse=True):
    me = bpy.data.meshes.new(nom); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nom, me)
    if bevel > 0:
        b = ob.modifiers.new('Bevel', 'BEVEL')
        b.width = bevel; b.segments = seg
        b.limit_method = 'ANGLE'; b.angle_limit = math.radians(40)
    if lisse:
        for p in me.polygons: p.use_smooth = True
    return lier(ob)

def boite(nom, dx, dy, dz, bevel=0.0, seg=5):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    bmesh.ops.scale(bm, vec=(dx, dy, dz), verts=bm.verts)
    return maille(nom, bm, bevel=bevel, seg=seg)

L, H, EP = 3.0, 1.9, 0.34

corps = boite('corps', L, EP, H, bevel=0.10, seg=6)
corps.location = (0, 0, H/2)
g = corps.modifiers.new('galbe', 'SIMPLE_DEFORM')
g.deform_method = 'BEND'; g.angle = math.radians(2.5); g.deform_axis = 'Z'

yE, yP = 0.64 * H, 0.30 * H
bm = bmesh.new()
vs = [bm.verts.new(p) for p in
      [(-L/2, 0, H), (L/2, 0, H), (L/2, 0, yE), (0.05, 0, yP), (-0.05, 0, yP), (-L/2, 0, yE)]]
bm.faces.new(vs)
rabat = maille('rabat', bm, lisse=False)
so = rabat.modifiers.new('ep', 'SOLIDIFY'); so.thickness = 0.07; so.offset = 1
bv = rabat.modifiers.new('Bevel', 'BEVEL'); bv.width = 0.022; bv.segments = 4
rabat.location = (0, -EP/2 - 0.02, 0.012)

def passepoil(x1, z1, x2, z2):
    cu = bpy.data.curves.new('pp', 'CURVE'); cu.dimensions = '3D'
    sp = cu.splines.new('POLY'); sp.points.add(1)
    y = -EP/2 - 0.072
    sp.points[0].co = (x1, y, z1, 1); sp.points[1].co = (x2, y, z2, 1)
    cu.bevel_depth = 0.013; cu.bevel_resolution = 6
    return lier(bpy.data.objects.new('pp', cu))
pente = (yE - yP) / (L/2)
pp1 = passepoil(L/2 - 0.06, yE - 0.015, 0.30, yP + 0.30 * pente)
pp2 = passepoil(-L/2 + 0.06, yE - 0.015, -0.30, yP + 0.30 * pente)

bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.068,
                                 major_segments=64, minor_segments=32)
anneau = bpy.context.active_object
anneau.rotation_euler = (math.radians(90), 0, 0)
anneau.scale = (1, 1, 0.84)
anneau.location = (0, -EP/2 - 0.135, yP + 0.13)
for p in anneau.data.polygons: p.use_smooth = True

patte = boite('patte', 0.15, 0.045, 0.34, bevel=0.02)
patte.location = (0, -EP/2 - 0.105, yP + 0.30)

cu = bpy.data.curves.new('strap', 'CURVE'); cu.dimensions = '3D'
sp = cu.splines.new('NURBS'); sp.points.add(4)
for i, p in enumerate([(-L/2 + 0.12, 0, H - 0.03), (-L/2 + 0.02, 0.10, H + 1.15),
                       (0, 0.16, H + 1.95), (L/2 - 0.02, 0.10, H + 1.15),
                       (L/2 - 0.12, 0, H - 0.03)]):
    sp.points[i].co = (*p, 1)
sp.use_endpoint_u = True
prof = bpy.data.curves.new('prof', 'CURVE'); prof.dimensions = '2D'
ps = prof.splines.new('POLY'); ps.points.add(3); ps.use_cyclic_u = True
for i, (x, y) in enumerate([(-0.05, -0.012), (0.05, -0.012), (0.05, 0.012), (-0.05, 0.012)]):
    ps.points[i].co = (x, y, 0, 1)
profob = lier(bpy.data.objects.new('prof', prof)); profob.hide_render = True
cu.bevel_mode = 'OBJECT'; cu.bevel_object = profob
strap = lier(bpy.data.objects.new('strap', cu))

attaches = []
for sx in (-1, 1):
    a = boite(f'att{sx}', 0.09, 0.09, 0.09, bevel=0.03)
    a.location = (sx * (L/2 - 0.12), 0, H - 0.02)
    attaches.append(a)

# ── matériaux : base NEUTRE (le navigateur teintera) ──────────
def mat_cuir(nom, coat, rough, bumpf, ech):
    m = bpy.data.materials.new(nom); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.006, 0.006, 0.007, 1)  # vitrine : le noir dense de la maison
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = 0.26
    img = nt.nodes.new('ShaderNodeTexImage')
    img.image = bpy.data.images.load(TUILE)
    img.image.colorspace_settings.name = 'Non-Color'
    img.projection = 'BOX'; img.projection_blend = 0.3
    co = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (ech, ech, ech)
    nt.links.new(co.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], img.inputs['Vector'])
    bu = nt.nodes.new('ShaderNodeBump')
    bu.inputs['Strength'].default_value = bumpf; bu.inputs['Distance'].default_value = 0.035
    nt.links.new(img.outputs['Color'], bu.inputs['Height'])
    nt.links.new(bu.outputs['Normal'], b.inputs['Normal'])
    rg = nt.nodes.new('ShaderNodeMapRange')
    rg.inputs['From Min'].default_value = 0.2; rg.inputs['From Max'].default_value = 0.85
    rg.inputs['To Min'].default_value = min(1.0, rough + 0.30); rg.inputs['To Max'].default_value = max(0.03, rough - 0.16)
    nt.links.new(img.outputs['Color'], rg.inputs['Value'])
    nt.links.new(rg.outputs['Result'], b.inputs['Roughness'])
    return m

REGLAGES = {
    'graine':    dict(coat=0.15, rough=0.60, bumpf=1.6, ech=1.30),
    'caviar':    dict(coat=0.22, rough=0.44, bumpf=1.5, ech=1.60),
    'lisse':     dict(coat=0.50, rough=0.20, bumpf=0.5, ech=1.00),
    'daim':      dict(coat=0.00, rough=0.90, bumpf=1.0, ech=1.40),
    'galuchat':  dict(coat=0.55, rough=0.24, bumpf=2.0, ech=1.90),
    'alligator': dict(coat=0.50, rough=0.20, bumpf=1.8, ech=0.30),
}
cuir = mat_cuir(MAT if MAT in REGLAGES else 'caviar', **REGLAGES.get(MAT, REGLAGES['caviar']))

orr = bpy.data.materials.new('or'); orr.use_nodes = True
bo = orr.node_tree.nodes['Principled BSDF']
bo.inputs['Base Color'].default_value = (1.0, 0.58, 0.18, 1)
bo.inputs['Metallic'].default_value = 1.0
bo.inputs['Roughness'].default_value = 0.09

ppm = bpy.data.materials.new('pp'); ppm.use_nodes = True
bp = ppm.node_tree.nodes['Principled BSDF']
bp.inputs['Base Color'].default_value = (0.28, 0.02, 0.05, 1)
bp.inputs['Roughness'].default_value = 0.45

for ob in (corps, rabat, patte, strap):
    ob.data.materials.append(cuir)
anneau.data.materials.append(orr)
for a in attaches: a.data.materials.append(orr)
pp1.data.materials.append(ppm); pp2.data.materials.append(ppm)

# ── sol : capteur d'ombre (garde l'alpha) ────────────────────
bm = bmesh.new(); bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30)
sol = maille('sol', bm, lisse=False)
sol.is_shadow_catcher = True

# ── studio : boîte à lumière large + débouchage + contre ─────
world = bpy.data.worlds.new('w'); sc.world = world; world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (1, 1, 1, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.42

def lampe(nom, loc, taille, force, rot):
    li = bpy.data.lights.new(nom, 'AREA'); li.size = taille; li.energy = force
    ob = bpy.data.objects.new(nom, li); ob.location = loc
    ob.rotation_euler = tuple(math.radians(a) for a in rot)
    return lier(ob)
lampe('clef', (-2.6, -4.6, 5.0), 5.0, 780, (44, 0, -26))
lampe('debouche', (3.6, -3.4, 2.4), 4.5, 260, (66, 0, 46))
lampe('contre', (0.4, 4.2, 4.4), 3.5, 420, (-142, 0, 0))

# ── caméra : quasi frontale, la pièce centrée et cadrée serré ─
cam = bpy.data.cameras.new('c'); cam.lens = 105
co = bpy.data.objects.new('c', cam)
co.location = (0.55, -12.2, 2.62)
co.rotation_euler = (math.radians(85.5), 0, math.radians(2.8))
lier(co); sc.camera = co

if MAT == 'masque':
    # Passe de masque : seul le CUIR reste opaque. Le navigateur s'en sert
    # comme mask-image pour que la teinte n'atteigne jamais l'or ni le passepoil.
    blanc = bpy.data.materials.new('blanc'); blanc.use_nodes = True
    nt = blanc.node_tree
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL': nt.nodes.remove(n)
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (1, 1, 1, 1)
    nt.links.new(em.outputs['Emission'], nt.nodes['Material Output'].inputs['Surface'])
    for ob in (corps, rabat, patte, strap):
        ob.data.materials.clear(); ob.data.materials.append(blanc)
    for ob in [anneau, pp1, pp2] + attaches:
        ob.is_holdout = True                     # découpe l'alpha : zone protégée
    sol.is_shadow_catcher = False
    sol.hide_render = True
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0
    sc.cycles.samples = 24

sc.render.filepath = SORTIE
bpy.ops.render.render(write_still=True)
print('rendu →', SORTIE)
