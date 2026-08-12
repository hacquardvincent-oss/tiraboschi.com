# -*- coding: utf-8 -*-
"""Rafaël — modèle Blender + rendu Cycles (path tracing).
La preuve du pipeline photoréaliste : géométrie adoucie (bevel + subdivision),
cuir caviar/alligator depuis les TUILES PHOTO du client (bump + roughness),
bijouterie or métallique avec vraies réflexions, éclairage studio 3 points.

Usage : python3 rafael_cycles.py <matiere: caviar|alligator> <sortie.png> [samples] [resx]
"""
import bpy, bmesh, math, sys

MAT = sys.argv[1] if len(sys.argv) > 1 else 'caviar'
SORTIE = sys.argv[2] if len(sys.argv) > 2 else '/tmp/rafael.png'
SAMPLES = int(sys.argv[3]) if len(sys.argv) > 3 else 96
RESX = int(sys.argv[4]) if len(sys.argv) > 4 else 1280
TUILE = f'/home/user/tiraboschi.com/tools/cuirs/{MAT}.png'

# ── scène vierge ──────────────────────────────────────────────
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = 'CYCLES'
sc.cycles.samples = SAMPLES
sc.cycles.use_denoising = True
sc.render.resolution_x = RESX
sc.render.resolution_y = int(RESX * 0.75)
sc.render.film_transparent = False

def lier(obj):
    sc.collection.objects.link(obj)
    return obj

# ── géométrie utilitaire ──────────────────────────────────────
def maille(nom, bm, bevel=0.0, seg=3, subsurf=0, lisse=True):
    me = bpy.data.meshes.new(nom)
    bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(nom, me)
    if bevel > 0:
        b = ob.modifiers.new('Bevel', 'BEVEL')
        b.width = bevel; b.segments = seg; b.limit_method = 'ANGLE'; b.angle_limit = math.radians(40)
    if subsurf:
        s = ob.modifiers.new('Sub', 'SUBSURF'); s.levels = subsurf; s.render_levels = subsurf
    if lisse:
        for p in me.polygons: p.use_smooth = True
    return lier(ob)

def boite(nom, dx, dy, dz, bevel=0.0, seg=4):
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1)
    bmesh.ops.scale(bm, vec=(dx, dy, dz), verts=bm.verts)
    return maille(nom, bm, bevel=bevel, seg=seg)

# Le sac est posé debout : X = largeur, Y = profondeur, Z = hauteur.
L, H, EP = 3.0, 1.9, 0.34

# ── corps : enveloppe aux arêtes franchement adoucies ─────────
corps = boite('corps', L, EP, H, bevel=0.10, seg=6)
corps.location = (0, 0, H/2)

# très léger galbe : le cuir n'est jamais parfaitement plan
disp = corps.modifiers.new('galbe', 'SIMPLE_DEFORM')
disp.deform_method = 'BEND'; disp.angle = math.radians(2.5); disp.deform_axis = 'Z'

# ── rabat : plaque au V inversé, épaissie et adoucie ──────────
yE, yP = 0.64 * H, 0.30 * H          # hauteur d'épaule des diagonales, pointe du V
bm = bmesh.new()
pts = [(-L/2, 0, H), (L/2, 0, H), (L/2, 0, yE), (0.05, 0, yP), (-0.05, 0, yP), (-L/2, 0, yE)]
vs = [bm.verts.new(p) for p in pts]
bm.faces.new(vs)
rabat = maille('rabat', bm, lisse=False)
so = rabat.modifiers.new('ep', 'SOLIDIFY'); so.thickness = 0.07; so.offset = 1
bv = rabat.modifiers.new('Bevel', 'BEVEL'); bv.width = 0.022; bv.segments = 4
rabat.location = (0, -EP/2 - 0.02, 0.012)

# ── passepoil : boudin le long des diagonales du rabat ────────
def passepoil(x1, z1, x2, z2):
    cu = bpy.data.curves.new('pp', 'CURVE'); cu.dimensions = '3D'
    sp = cu.splines.new('POLY'); sp.points.add(1)
    y = -EP/2 - 0.072            # à demi noyé dans la tranche du rabat
    sp.points[0].co = (x1, y, z1, 1); sp.points[1].co = (x2, y, z2, 1)
    cu.bevel_depth = 0.013; cu.bevel_resolution = 6
    return lier(bpy.data.objects.new('passepoil', cu))
# arrêté à l'aplomb de l'anneau : il file DESSOUS, il ne le traverse pas
pente = (yE - yP) / (L/2)
pp1 = passepoil(L/2 - 0.06, yE - 0.015, 0.30, yP + 0.30 * pente)
pp2 = passepoil(-L/2 + 0.06, yE - 0.015, -0.30, yP + 0.30 * pente)

# ── anneau en D, or, et sa patte de cuir ──────────────────────
bpy.ops.mesh.primitive_torus_add(major_radius=0.25, minor_radius=0.068,
                                 major_segments=64, minor_segments=32)
anneau = bpy.context.active_object
anneau.rotation_euler = (math.radians(90), 0, 0)
anneau.scale = (1, 1, 0.84)
anneau.location = (0, -EP/2 - 0.135, yP + 0.13)
for p in anneau.data.polygons: p.use_smooth = True

patte = boite('patte', 0.15, 0.045, 0.34, bevel=0.02)
patte.location = (0, -EP/2 - 0.105, yP + 0.30)

# ── bandoulière : ruban plat en arche souple ──────────────────
cu = bpy.data.curves.new('strap', 'CURVE'); cu.dimensions = '3D'
sp = cu.splines.new('NURBS'); sp.points.add(4)
for i, (x, y, z) in enumerate([(-L/2 + 0.12, 0, H - 0.03), (-L/2 + 0.02, 0.10, H + 1.15),
                               (0, 0.16, H + 1.95), (L/2 - 0.02, 0.10, H + 1.15),
                               (L/2 - 0.12, 0, H - 0.03)]):
    sp.points[i].co = (x, y, z, 1)
sp.use_endpoint_u = True
# profil plat : un petit rectangle comme objet de biseau → ruban de cuir
prof = bpy.data.curves.new('prof', 'CURVE'); prof.dimensions = '2D'
ps = prof.splines.new('POLY'); ps.points.add(3); ps.use_cyclic_u = True
for i, (x, y) in enumerate([(-0.05, -0.012), (0.05, -0.012), (0.05, 0.012), (-0.05, 0.012)]):
    ps.points[i].co = (x, y, 0, 1)
profob = lier(bpy.data.objects.new('prof', prof))
profob.hide_render = True
cu.bevel_mode = 'OBJECT'; cu.bevel_object = profob
strap = lier(bpy.data.objects.new('strap', cu))

# attaches d'anse
for sx in (-1, 1):
    a = boite(f'att{sx}', 0.09, 0.09, 0.09, bevel=0.03)
    a.location = (sx * (L/2 - 0.12), 0, H - 0.02)
    a.data.materials.clear()
    a['metal'] = True

# ── matériaux ─────────────────────────────────────────────────
def mat_cuir(nom, clearcoat, rough, bump_force, echelle):
    m = bpy.data.materials.new(nom); m.use_nodes = True
    nt = m.node_tree; bsdf = nt.nodes['Principled BSDF']
    bsdf.inputs['Base Color'].default_value = (0.006, 0.006, 0.007, 1)   # noir profond
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Coat Weight'].default_value = clearcoat
    bsdf.inputs['Coat Roughness'].default_value = 0.26
    img = nt.nodes.new('ShaderNodeTexImage')
    img.image = bpy.data.images.load(TUILE)
    img.image.colorspace_settings.name = 'Non-Color'
    img.projection = 'BOX'; img.projection_blend = 0.3
    co = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (echelle, echelle, echelle)
    nt.links.new(co.outputs['Object'], mp.inputs['Vector'])
    nt.links.new(mp.outputs['Vector'], img.inputs['Vector'])
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = bump_force
    bump.inputs['Distance'].default_value = 0.02
    nt.links.new(img.outputs['Color'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    # la brillance suit le relief : les creux du grain sont plus mats
    ramp = nt.nodes.new('ShaderNodeMapRange')
    ramp.inputs['From Min'].default_value = 0.2; ramp.inputs['From Max'].default_value = 0.85
    ramp.inputs['To Min'].default_value = rough + 0.15; ramp.inputs['To Max'].default_value = rough - 0.08
    nt.links.new(img.outputs['Color'], ramp.inputs['Value'])
    nt.links.new(ramp.outputs['Result'], bsdf.inputs['Roughness'])
    return m

def mat_or():
    m = bpy.data.materials.new('or'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (1.0, 0.58, 0.18, 1)
    b.inputs['Metallic'].default_value = 1.0
    b.inputs['Roughness'].default_value = 0.09
    return m

def mat_passepoil():
    m = bpy.data.materials.new('framboise'); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (0.28, 0.02, 0.05, 1)
    b.inputs['Roughness'].default_value = 0.45
    return m

if MAT == 'alligator':
    # écailles LARGES : la vraie peau tient 6 rangs sur la hauteur d'une pochette
    cuir = mat_cuir('alligator', clearcoat=0.55, rough=0.22, bump_force=1.0, echelle=0.30)
else:
    cuir = mat_cuir('caviar', clearcoat=0.28, rough=0.46, bump_force=0.85, echelle=1.6)
orr = mat_or(); pp = mat_passepoil()

for ob in (corps, rabat, patte, strap):
    ob.data.materials.append(cuir)
anneau.data.materials.append(orr)
for ob in sc.collection.objects:
    if ob.get('metal'): ob.data.materials.append(orr)
pp1.data.materials.append(pp); pp2.data.materials.append(pp)

# ── studio : cyclo blanc, trois sources douces ────────────────
bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=30)
sol = maille('cyclo', bm, lisse=False)
msol = bpy.data.materials.new('blanc'); msol.use_nodes = True
msol.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.93, 0.92, 0.90, 1)
msol.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.9
sol.data.materials.append(msol)

world = bpy.data.worlds.new('studio'); sc.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.9, 0.89, 0.87, 1)
world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.22

def lampe(nom, x, y, z, taille, force, rx, rz):
    li = bpy.data.lights.new(nom, 'AREA')
    li.size = taille; li.energy = force
    ob = bpy.data.objects.new(nom, li)
    ob.location = (x, y, z); ob.rotation_euler = (math.radians(rx), 0, math.radians(rz))
    return lier(ob)
lampe('clef', -3.4, -4.4, 5.2, 5.0, 780, 48, -34)     # grande boîte à lumière avant-gauche
lampe('debouche', 4.0, -3.0, 2.6, 4.0, 170, 65, 50)   # débouchage droit
lampe('contre', 0.5, 4.5, 4.6, 3.0, 380, -140, 0)     # contre-jour, détache du fond

# ── caméra : 85 mm, trois quarts, légère plongée ──────────────
cam = bpy.data.cameras.new('cam'); cam.lens = 85
cam.dof.use_dof = True; cam.dof.focus_distance = 9.9; cam.dof.aperture_fstop = 8
co = bpy.data.objects.new('cam', cam)
co.location = (3.0, -9.6, 2.9)
co.rotation_euler = (math.radians(77.5), 0, math.radians(17.5))
lier(co); sc.camera = co

sc.render.filepath = SORTIE
bpy.ops.render.render(write_still=True)
print('rendu →', SORTIE)
