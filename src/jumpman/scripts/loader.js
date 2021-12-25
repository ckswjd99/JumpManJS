console.log("LOAD SCRIPT: loader.js")

const parseAmount = (amount, grid) => {
    if(typeof(amount) === "number") return amount
    const isGrid = amount.indexOf("grid")
    if(isGrid != -1) {
        return parseFloat(amount.slice(0, isGrid)) * grid
    }
    else return parseFloat(amount)
}

const parseObject = (jsonObject) => {
    const x = parseAmount(jsonObject["x"], GRID)
    const y = parseAmount(jsonObject["y"], GRID)
    const w = parseAmount(jsonObject["w"], GRID)
    const h = parseAmount(jsonObject["h"], GRID)

    switch(jsonObject.type) {
        case "IMAGE": {
            const src = jsonObject["src"]
            return new ImageObject(x, y, w, h, src)
        }
        case "RECT": {
            return new PhysicalObject(x, y, w, h, new Rectangle(null, null, null, null))
        }
        case "RTRI": {
            const rap = jsonObject["rap"]
            return new PhysicalObject(x, y, w, h, new RightTriangle(null, null, null, null, RAP[rap]))
        }
    }
}

const loadJsonMap = (jsonObject) => {
    // SET PARAMS
    const rawParams = jsonObject["params"]
    GRID = rawParams["grid"]

    // SET WORLD
    const rawWorld = jsonObject["world"]
    const world = new World(rawWorld["name"])

    // SET SCENES
    const rawScenes = jsonObject["scenes"]
    Object.values(rawScenes).map(rawScene => {
        const sceneName = rawScene["name"]
        const sceneCol = rawScene["col"]
        const sceneRow = rawScene["row"]
        const sceneObjectLayers = rawScene["objectLayers"].map(layer => new ObjLayer(...layer.map(obj => parseObject(obj))))
        const scenePhysicalLayer = rawScene["physicalLayer"].map(obj => parseObject(obj))
        const sceneNeighbors = rawScene["neighbors"]
        const sceneGravity = rawScene["gravity"]
        
        const scene = new Scene(sceneCol, sceneRow, sceneGravity)
        scene.objLayers.push(...sceneObjectLayers)
        scene.physLayer.append(...scenePhysicalLayer)
        scene.setNeighbors(sceneNeighbors["top"], sceneNeighbors["left"], sceneNeighbors["bottom"], sceneNeighbors["right"])

        world.addScene(sceneName, scene)
    })
    

    // SET PLAYER
    const rawPlayer = jsonObject["player"]
    {
        const x = parseAmount(rawPlayer["x"], GRID)
        const y = parseAmount(rawPlayer["y"], GRID)
        const w = parseAmount(rawPlayer["w"], GRID)
        const h = parseAmount(rawPlayer["h"], GRID)
        const imageDir = rawPlayer["imageDir"]

        const player = new Player(x,y , w, h, imageDir)

        if("acc" in rawPlayer) player.acc = rawPlayer["acc"]
        if("maxSpeed" in rawPlayer) player.maxSpeed = rawPlayer["maxSpeed"]
        if("maxJump" in rawPlayer) player.maxJump = rawPlayer["maxJump"]
        if("jumpGather" in rawPlayer) player.jumpGather = rawPlayer["jumpGather"]
        if("maxAcc" in rawPlayer) player.maxAcc = rawPlayer["maxAcc"]
        if("jumpSpeedXGather" in rawPlayer) player.jumpSpeedXGather = rawPlayer["jumpSpeedXGather"]

        world.player = player
    }

    world.setNowScene("startingScene")

    NOW_WORLD = world
}

const runWorld = () => {
    return setInterval(() => {
        NOW_WORLD.update();
        NOW_WORLD.render();
    }, 1/SETTING.fps)
}

loadJsonMap(MAPS["sampleWorld"])
runWorld()


// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])