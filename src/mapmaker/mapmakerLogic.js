let paramsData = { "grid": 0 }
let worldData = {}
let sceneDataList = {}
let playerData = {}

let nowScene = {
    "name": "",
    "col": 0,
    "row": 0,
    "objectLayers": [[]],
    "physicalLayer": [],
    "neighbors": {},
    "gravity": [0, 0]
}

const updateParamsData = () => {
    const grid = document.getElementById("grid_size").value

    paramsData["grid"] = grid
}

const updateWorldData = () => {
    const worldName = document.getElementById("world_name").value

    worldData["name"] = worldName
}

const updateNowScene = () => {
    const sceneName = document.getElementById("sparam_name").value

    const row = parseInt(document.getElementById("sparam_row").value)
    const col = parseInt(document.getElementById("sparam_col").value)
    const top = document.getElementById("sparam_top").value
    const left = document.getElementById("sparam_left").value
    const bottom = document.getElementById("sparam_bottom").value
    const right = document.getElementById("sparam_right").value
    const gravX = parseFloat(document.getElementById("sparam_gravX").value)
    const gravY = parseFloat(document.getElementById("sparam_gravY").value)

    nowScene["name"] = sceneName

    nowScene["row"] = row
    nowScene["col"] = col
    nowScene["neighbors"]["top"] = top
    nowScene["neighbors"]["left"] = left
    nowScene["neighbors"]["bottom"] = bottom
    nowScene["neighbors"]["right"] = right
    console.log(gravX, gravY)
    nowScene["gravity"] = [gravX, gravY]
}

const updatePlayerData = () => {
    const x = document.getElementById("pparam_x").value
    const y = document.getElementById("pparam_y").value
    const w = document.getElementById("pparam_w").value
    const h = document.getElementById("pparam_h").value
    const acc = document.getElementById("pparam_acc").value
    const maxSpeed = document.getElementById("pparam_maxSpeed").value
    const maxJump = document.getElementById("pparam_maxJump").value
    const jumpGather = document.getElementById("pparam_jumpGather").value
    const maxAcc = document.getElementById("pparam_maxAcc").value
    const jumpSpeedXGather = document.getElementById("pparam_jumpSpeedXGather").value
    const imageDir = document.getElementById("pparam_imageDir").value

    playerData["x"] = x
    playerData["y"] = y
    playerData["w"] = w
    playerData["h"] = h
    playerData["acc"] = acc
    playerData["maxSpeed"] = maxSpeed
    playerData["maxJump"] = maxJump
    playerData["jumpGather"] = jumpGather
    playerData["maxAcc"] = maxAcc
    playerData["jumpSpeedXGather"] = jumpSpeedXGather
    playerData["imageDir"] = imageDir
}

const renderSceneList = () => {
    const sceneListElement = document.getElementById("scene_list")
    sceneListElement.innerHTML = ""
    Object.values(sceneDataList).map(sceneData => {
        const listElement = document.createElement("li")
        listElement.innerHTML = 
            `<div>
                <p style="padding-right: 20px;">${sceneData.name}</p>
                <button onclick='loadScene("${sceneData.name}")'>Load</button>
                <button onclick='removeScene("${sceneData.name}")'>Delete</button>
            </div>`
        sceneListElement.appendChild(listElement)
    })
}

const renderObjectList = () => {
    const objectListElement = document.getElementById("object_list")
    objectListElement.innerHTML = ""
    nowScene["physicalLayer"].map(obj => {
        const listElement = document.createElement("li")
        const infoString = `x: ${obj.x}, y: ${obj.y}, w: ${obj.w}, h:${obj.h}`
        listElement.innerHTML = `<div class="object_thumb">${obj.type}</div><div class="object_info">${infoString}</div>`
        objectListElement.appendChild(listElement)
    })
}

const addPhysicalObject = (type, x, y, w, h, rap) => {
    const physObj = {type, x, y, w, h}
    if(type == "RTRI") physObj["rap"] = rap

    nowScene["physicalLayer"].push(physObj)
}

const removePhysicalObject = (index) => {
    nowScene["physicalLayer"].splice(index, 1)
}

const movePhysicalObject = (index, x, y) => {
    nowScene["physicalLayer"][index].x += x
    nowScene["physicalLayer"][index].y += y
}

const saveScene = () => {
    updateNowScene()
    if(nowScene.name in sceneDataList) {
        const cover = confirm(`Scene named ${nowScene.name} exists. Overwrite?`)
        if(cover) sceneDataList[nowScene.name] = nowScene
    }
    else {
        sceneDataList[nowScene.name] = nowScene
    }
    renderSceneList()
}

const loadScene = (sceneName) => {
    if(!(sceneName in sceneDataList)) {
        console.log(`sceneName ${sceneName} does not exist!`)
        return
    }
    
    nowScene = JSON.parse(JSON.stringify(sceneDataList[sceneName]))

    document.getElementById("sparam_name").value = nowScene.name

    document.getElementById("sparam_row").value = nowScene["row"]
    document.getElementById("sparam_col").value = nowScene["col"]
    document.getElementById("sparam_top").value = nowScene["neighbors"]["top"]
    document.getElementById("sparam_left").value = nowScene["neighbors"]["left"]
    document.getElementById("sparam_bottom").value = nowScene["neighbors"]["bottom"]
    document.getElementById("sparam_right").value = nowScene["neighbors"]["right"]
    document.getElementById("sparam_gravX").value = nowScene["gravity"][0]
    document.getElementById("sparam_gravY").value = nowScene["gravity"][1]

    // load physobjs with
    renderObjectList()
}

const removeScene = (sceneName) => {
    if(!(sceneName in sceneDataList)) {
        console.log(`sceneName ${sceneName} does not exist!`)
        return
    }
    if(confirm(`Really delete scene ${sceneName}?`)) delete sceneDataList[sceneName]
}

const flushScene = () => {
    nowScene = {
        "name": "",
        "col": 0,
        "row": 0,
        "objectLayers": [[]],
        "physicalLayer": [],
        "neighbors": {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        "gravity": [0, 0]
    }

    document.getElementById("sparam_name").value = nowScene.name

    document.getElementById("sparam_row").value = nowScene["row"]
    document.getElementById("sparam_col").value = nowScene["col"]
    document.getElementById("sparam_top").value = nowScene["neighbors"]["top"]
    document.getElementById("sparam_left").value = nowScene["neighbors"]["left"]
    document.getElementById("sparam_bottom").value = nowScene["neighbors"]["bottom"]
    document.getElementById("sparam_right").value = nowScene["neighbors"]["right"]
    document.getElementById("sparam_gravX").value = nowScene["gravity"][0]
    document.getElementById("sparam_gravY").value = nowScene["gravity"][1]
}


// IMPORT & EXPORT
const parseAmount = (amount, grid) => {
    if(typeof(amount) === "number") return amount

    const isGrid = amount.indexOf("grid")
    if(isGrid != -1) {
        return parseFloat(amount.slice(0, isGrid)) * grid
    }
    else return parseFloat(amount)
}

const importParamsData = (paramsObj) => {
    paramsData["grid"] = paramsObj["grid"]
}

const importWorldData = (worldObj) => {
    worldData["name"] = worldObj["name"]
}

const importObject = (gameObj) => {
    const result = {}
    const grid = paramsData["grid"]
    
    result["type"] = gameObj["type"]
    result["x"] = parseAmount(gameObj["x"], grid)
    result["y"] = parseAmount(gameObj["y"], grid)
    result["w"] = parseAmount(gameObj["w"], grid)
    result["h"] = parseAmount(gameObj["h"], grid)
    if("rap" in gameObj) result["rap"] = gameObj["rap"]
    return result
}

const importSceneData = (sceneObj) => {
    const result = {}

    result["name"] = sceneObj["name"]
    result["col"] = sceneObj["col"]
    result["row"] = sceneObj["row"]
    result["objectLayers"] = sceneObj["objectLayers"].map(layer => layer.map(obj => importObject(obj)))
    result["physicalLayer"] = sceneObj["physicalLayer"].map(obj => importObject(obj))
    result["neighbors"] = sceneObj["neighbors"]
    result["gravity"] = sceneObj["gravity"]

    return result
}

const importSceneDataList = (sceneObjList) => {
    console.log(sceneObjList)
    sceneDataList = {}
    sceneObjList.forEach(sceneObj => {
        const importedScene = importSceneData(sceneObj)
        sceneDataList[importedScene.name] = importedScene
    })
}

const importPlayer = (playerObj) => {
    const grid = paramsData["grid"]
    
    playerData["x"] = parseAmount(playerObj["x"], grid)
    playerData["y"] = parseAmount(playerObj["y"], grid)
    playerData["w"] = parseAmount(playerObj["w"], grid)
    playerData["h"] = parseAmount(playerObj["h"], grid)
    playerData["acc"] = playerObj["acc"]
    playerData["maxSpeed"] = playerObj["maxSpeed"]
    playerData["maxJump"] = playerObj["maxJump"]
    playerData["jumpGather"] = playerObj["jumpGather"]
    playerData["maxAcc"] = playerObj["maxAcc"]
    playerData["jumpSpeedXGather"] = playerObj["jumpSpeedXGather"]
    playerData["imageDir"] = playerObj["imageDir"]
}

const importMapObject = (mapObject) => {
    importParamsData(mapObject["params"])
    importWorldData(mapObject["world"])
    importSceneDataList(Object.values(mapObject["scenes"]))
    importPlayer(mapObject["player"])

    renderSceneList()
}

const importMapFile = () => {
    const inputFile = document.createElement("input")
    inputFile.type = "file"
    inputFile.accept = "application/JSON"

    inputFile.onchange = e => {
        const file = e.target.files[0]
        const reader = new FileReader()
        
        reader.onload = () => {
            importMapObject(JSON.parse(reader.result))
        }
        reader.readAsText(file)
    }
    inputFile.click()
    inputFile.remove()
}

let mapBuffer = null
const saveMapFile = () => {
    const mapObject = {
        params: paramsData,
        world: worldData,
        scenes: sceneDataList,
        player: playerData
    }

    const mapJSON = JSON.stringify(mapObject)
    const blobData = new Blob([mapJSON], {"type": "text/plain"})
    if(mapBuffer !== null) window.URL.revokeObjectURL(mapBuffer)
    mapBuffer = window.URL.createObjectURL(blobData)

    const link = document.createElement('a')
    link.setAttribute("download", `${worldData["name"]}.json`)
    link.href = mapBuffer
    link.dispatchEvent(new MouseEvent("click"))
    link.remove()
}