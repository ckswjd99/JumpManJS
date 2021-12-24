console.log("LOAD SCRIPT: debug.js")

// DEBUG
const DEBUG_PLAYER = new Player(2*GRID, 17*GRID, 2*GRID, 2*GRID, 'jumpman/images/player')
const DEBUG_SCENE = new Scene(40, 40, [0, 0.4])
const DEBUG_CAM = DEBUG_SCENE.camTranslate
const DEBUG_WORLD = new World('debug', DEBUG_SCENE, DEBUG_PLAYER)
NOW_WORLD = DEBUG_WORLD
DEBUG_SCENE.setNeighbors('0-0', null, null, null)

const DEBUG_LAYER = new ObjLayer()
const DEBUG_IMAGE_OBJ = new ImageObject(0, 0, 40*GRID, 40*GRID, 'jumpman/images/sampleImage.jpg')
const DEBUG_PHYSI_OBJS = [
    new PhysicalObject(0*GRID, 38*GRID, 20*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(20*GRID, 38*GRID, 20*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(38*GRID, 0*GRID, 2*GRID, 38*GRID, new Rectangle()),
    new PhysicalObject(0*GRID, 0*GRID, 2*GRID, 38*GRID, new Rectangle()),
    new PhysicalObject(2*GRID, 34*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.LB)),
    new PhysicalObject(34*GRID, 30*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.RB)),
    new PhysicalObject(34*GRID, 34*GRID, 4*GRID, 4*GRID, new Rectangle()),
    new PhysicalObject(26*GRID, 26*GRID, 4*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(24*GRID, 26*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.RT)),
    new PhysicalObject(30*GRID, 26*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.LB)),
    new PhysicalObject(16*GRID, 18*GRID, 4*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(20*GRID, 18*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.LB)),
    new PhysicalObject(14*GRID, 18*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.RB)),
    new PhysicalObject(4*GRID, 14*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.RB)),
    new PhysicalObject(6*GRID, 14*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.LB)),
    new PhysicalObject(6*GRID, 6*GRID, 2*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(22*GRID, -2*GRID, 18*GRID, 4*GRID, new Rectangle()),
    new PhysicalObject(2*GRID, -4*GRID, 8*GRID, 8*GRID, new RightTriangle(null, null, null, null, RAP.LT)),
    new PhysicalObject(18*GRID, -2*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.RB)),
]

DEBUG_LAYER.append(DEBUG_IMAGE_OBJ)
DEBUG_WORLD.nowScene.physLayer.append(...DEBUG_PHYSI_OBJS)
DEBUG_SCENE.append(DEBUG_LAYER)

const DEBUG_SCENE2 = new Scene(40, 40, [0, 0.4])
DEBUG_SCENE2.setNeighbors(null, null, 'startingScene', '0-1')
DEBUG_WORLD.addScene('0-0', DEBUG_SCENE2)

const DEBUG_LAYER2 = new ObjLayer()
const DEBUG_IMAGE_OBJ2 = new ImageObject(0, 0, 40*GRID, 40*GRID, 'jumpman/images/sampleImage.jpg')
const DEBUG_PHYSI_OBJS2 = [
    new PhysicalObject(0*GRID, 0*GRID, 2*GRID, 38*GRID, new Rectangle()),
    new PhysicalObject(38*GRID, 30*GRID, 2*GRID, 10*GRID, new Rectangle()),
    new PhysicalObject(0*GRID, 36*GRID, 4*GRID, 4*GRID, new Rectangle()),
    new PhysicalObject(4*GRID, 36*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.LT)),
    new PhysicalObject(22*GRID, 38*GRID, 18*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(18*GRID, 38*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.RB)),
    new PhysicalObject(34*GRID, 30*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.RB)),
]

DEBUG_LAYER2.append(DEBUG_IMAGE_OBJ2)
DEBUG_SCENE2.physLayer.append(...DEBUG_PHYSI_OBJS2)
DEBUG_SCENE2.append(DEBUG_LAYER2)

const DEBUG_SCENE3 = new Scene(40, 40, [0, 0.4])
DEBUG_SCENE3.setNeighbors(null, '0-0', null, '0-1')
DEBUG_WORLD.addScene('0-1', DEBUG_SCENE3)

const DEBUG_LAYER3 = new ObjLayer()
const DEBUG_IMAGE_OBJ3 = new ImageObject(0, 0, 40*GRID, 40*GRID, 'jumpman/images/sampleImage.jpg')
const DEBUG_PHYSI_OBJS3 = [
    new PhysicalObject(0*GRID, 30*GRID, 2*GRID, 10*GRID, new Rectangle()),
    new PhysicalObject(38*GRID, 30*GRID, 2*GRID, 10*GRID, new Rectangle()),
    new PhysicalObject(0*GRID, 38*GRID, 40*GRID, 2*GRID, new Rectangle()),
    
]

DEBUG_LAYER3.append(DEBUG_IMAGE_OBJ3)
DEBUG_SCENE3.physLayer.append(...DEBUG_PHYSI_OBJS3)
DEBUG_SCENE3.append(DEBUG_LAYER3)



if(1) {
    setInterval(() => {
        NOW_WORLD.update()
        NOW_WORLD.render()
    }, 1/SETTING.fps)
}


// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])