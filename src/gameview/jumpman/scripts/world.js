console.log("LOAD SCRIPT: world.js")

let NOW_WORLD = null

class World {
    constructor(name, startingScene, player) {
        this.name = name
        this.scenes = {
            'startingScene': startingScene
        }

        this.nowScene = startingScene
        this.player = player
        
        this.setNowScene('startingScene')
    }

    addScene = (sceneName, scene) => this.scenes[sceneName] = scene
    setNowScene = (sceneName) => {
        this.nowScene = this.scenes[sceneName]
        this.nowScene.player = this.player
    }

    moveSceneTop = () => {
        this.setNowScene(this.nowScene.neighbors.top)
    }
    moveSceneLeft = () => {
        this.setNowScene(this.nowScene.neighbors.left)
    }
    moveSceneBottom = () => {
        this.setNowScene(this.nowScene.neighbors.bottom)
    }
    moveSceneRight = () => {
        this.setNowScene(this.nowScene.neighbors.right)
    }

    update = () => {
        this.nowScene.update()
    }
    render = () => {
        this.nowScene.render()
    }
    
}

class Scene {
    constructor(col, row, gravity=[0, 0.1], maxSlideSpeed=20) {
        this.col = col
        this.row = row
        this.width = col * SETTING.grid
        this.height = row * SETTING.grid
        this.display = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            f: 1
        }
        this.objLayers = []
        this.physLayer = new ObjLayer()
        this.player = null
        this.neighbors = {
            top: undefined,
            left: undefined,
            bottom: undefined,
            right: undefined
        }

        this.setDisplay()

        // physical
        this.gravity = gravity
        this.maxSlideSpeed = maxSlideSpeed
    }

    setDisplay = () => {
        this.display.w = CANVAS.width / CANVAS.height > this.width / this.height
            ? CANVAS.height * this.width / this.height : CANVAS.width
        this.display.h = CANVAS.width / CANVAS.height > this.width / this.height
            ? CANVAS.height : CANVAS.width * this.height / this.width
        this.display.x = (CANVAS.width - this.display.w) / 2
        this.display.y = (CANVAS.height - this.display.h) / 2
        this.display.f = this.display.h / this.height
    }

    setNeighbors = (top, left, bottom, right) => {
        if(top != null) this.neighbors.top = top
        if(left != null) this.neighbors.left = left
        if(bottom != null) this.neighbors.bottom = bottom
        if(right != null) this.neighbors.right = right
    }

    camTranslate = (point) => addVec(smultVec(point, this.display.f), [this.display.x, this.display.y])

    append() {
        this.objLayers.push(...arguments)
    }

    update = () => {
        this.objLayers.forEach(layer => layer.update(1/SETTING.fps))
        this.physLayer.update(1/SETTING.fps)
        this.player.update(1/SETTING.fps)
    }
    render = () => {
        // initialize display
        CTX.fillStyle = SETTING.letterbox
        CTX.fillRect(0, 0, CANVAS.width, CANVAS.height)
        CTX.fillStyle = "rgb(255, 255, 255)"
        CTX.fillRect(this.display.x, this.display.y, this.display.w, this.display.h)

        // render layers
        this.objLayers.forEach(layer => layer.render(this.camTranslate))
        if(SETTING.debugging) this.physLayer.render(this.camTranslate)
        this.player.render(this.camTranslate)
    }

}

class ObjLayer {
    constructor() {
        this.objects = []
    }

    append() {
        this.objects.push(...arguments)
    }

    update = (dt) => this.objects.forEach(obj => obj.update(dt))
    render = (cam) => this.objects.forEach(obj => obj.render(cam))
}


const GOBJTYPE = new Object()
const gobjNames = ["IMAGE", "PHYSICAL", "TRIGGER"]
gobjNames.forEach(gobjName => GOBJTYPE[gobjName] = gobjName)

class GameObject {
    constructor() {
        this.type = null
    }

    update = (dt) => {}
    render = (cam) => {}
}

class ImageObject extends GameObject {
    constructor(x, y, w, h, imagePath) {
        super()
        this.type = GOBJTYPE.IMAGE
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.imageElement = new Image();
        this.imageElement.src = imagePath
    }

    render = (cam) => {
        const [tx, ty] = roundVec(cam([this.x, this.y]))
        const [tw, th] = subVec(roundVec(cam([this.w, this.h])), cam([0, 0]))
        CTX.drawImage(this.imageElement, tx, ty, tw, th)
    }

}

class PhysicalObject extends GameObject {
    constructor(x, y, w, h, shape) {
        super()
        this.type = GOBJTYPE.PHYSICAL
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.shape = shape
    }

    // get shape() {
    //     this._shape.x = this.x
    //     this._shape.y = this.y
    //     this._shape.w = this.w
    //     this._shape.h = this.h
    //     return this._shape
    // }
    // set shape(val) { this._shape = val }

    update = (dt) => {
        this.shape.setParams(this.x, this.y, this.w, this.h)
    }
    render = (cam) => { if(SETTING.debugging) this.shape.debugRender(cam) }
}

class TriggerObject extends GameObject {
    constructor(x, y, w, h, callback) {
        super()
        this.type = GOBJTYPE.TRIGGER
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.shape = new Rectangle(x, y, w, h)
        this.callback = callback
    }

    update = (dt) => {
        const playerShape = NOW_WORLD.player.shape
        const {intersections} = Shape.polyCollide(this.shape, playerShape)
        if(intersections.length !== 0) this.callback()
    }
}

// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])