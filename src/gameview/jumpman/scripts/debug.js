console.log("LOAD SCRIPT: debug.js")

// DEBUG
const DEBUG_PLAYER = new Player(2*GRID, 17*GRID, 2*GRID, 2*GRID, 'jumpman/images/player')
const DEBUG_SCENE = new Scene(40, 40, [0, 0.4])
const DEBUG_CAM = DEBUG_SCENE.camTranslate
const DEBUG_WORLD = new World('debug', DEBUG_SCENE, DEBUG_PLAYER)
NOW_WORLD = DEBUG_WORLD

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
    new PhysicalObject(4*GRID, 14*GRID, 2*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(6*GRID, 14*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.LB)),
    new PhysicalObject(6*GRID, 6*GRID, 2*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(20*GRID, 0*GRID, 20*GRID, 2*GRID, new Rectangle()),
    new PhysicalObject(2*GRID, 0*GRID, 4*GRID, 4*GRID, new RightTriangle(null, null, null, null, RAP.LT)),
    new PhysicalObject(18*GRID, 0*GRID, 2*GRID, 2*GRID, new RightTriangle(null, null, null, null, RAP.RB)),

    
]

DEBUG_LAYER.append(DEBUG_IMAGE_OBJ)
DEBUG_WORLD.nowScene.physLayer.append(...DEBUG_PHYSI_OBJS)
DEBUG_SCENE.append(DEBUG_LAYER)

const rect1 = new Rectangle(0, 0, 10, 10)
const rect2 = new Rectangle(5, 5, 10, 10)


if(1) {
    setInterval(() => {
        NOW_WORLD.update()
        NOW_WORLD.render()
    }, 1/SETTING.fps)
}


// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])