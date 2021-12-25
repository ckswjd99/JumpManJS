const WRAPPER = document.getElementById("scene_plate")
const CANVAS = document.getElementById("scene_canvas")
const CTX = CANVAS.getContext('2d')

CANVAS.width = WRAPPER.clientWidth
CANVAS.height = WRAPPER.clientHeight

let mouseDown = false
let mouseCoord = { x: 0, y: 0 }
let logicalCoord = { x: 0, y: 0 }
let snappedCoord = { x: 0, y: 0 }

let nowDragging = false
let dragStartLoc = { x: 0, y: 0 }
let dragEndLoc = { x: 0, y: 0 }
let objectSelection = []

let gridStart = { x: 0, y: 0 }
let focal = 1

const keyInputs = {
    arrowUp: false,
    arrowRight: false,
    arrowBottom: false,
    arrowLeft: false,
    delete: false,

}

const deleteSelected = () => {
    for(let i=nowScene["physicalLayer"].length-1; i>=0; i--) {
        if(objectSelection[i]) removePhysicalObject(i)
    }
}

const moveSelected = (x, y) => {
    nowScene["physicalLayer"].map((_, i) => {if(objectSelection[i]) movePhysicalObject(i, x, y)})
}

window.onkeydown = (e) => {
    const dragBox = [
        Math.min(dragStartLoc.x, dragEndLoc.x),
        Math.min(dragStartLoc.y, dragEndLoc.y),
        Math.abs(dragStartLoc.x - dragEndLoc.x),
        Math.abs(dragStartLoc.y - dragEndLoc.y)
    ]

    switch(e.code) {
        case 'KeyD':
        case 'Delete': {
            deleteSelected()
            break
        }
        case 'KeyR': {
            addPhysicalObject("RECT", dragBox[0], dragBox[1], dragBox[2], dragBox[3])
            break
        }
        case 'KeyQ': {
            if(dragBox[2] != dragBox[3]) break
            addPhysicalObject("RTRI", dragBox[0], dragBox[1], dragBox[2], dragBox[3], "LT")
            break
        }
        case 'KeyW': {
            if(dragBox[2] != dragBox[3]) break
            addPhysicalObject("RTRI", dragBox[0], dragBox[1], dragBox[2], dragBox[3], "RT")
            break
        }
        case 'KeyA': {
            if(dragBox[2] != dragBox[3]) break
            addPhysicalObject("RTRI", dragBox[0], dragBox[1], dragBox[2], dragBox[3], "LB")
            break
        }
        case 'KeyS': {
            if(dragBox[2] != dragBox[3]) break
            addPhysicalObject("RTRI", dragBox[0], dragBox[1], dragBox[2], dragBox[3], "RB")
            break
        }
        case 'KeyF': {
            flushScene()
            break
        }
        case 'ArrowUp': {
            moveSelected(0, -paramsData["grid"])
            break
        }
        case 'ArrowRight': {
            moveSelected(paramsData["grid"], 0)
            break
        }
        case 'ArrowDown': {
            moveSelected(0, paramsData["grid"])
            break
        }
        case 'ArrowLeft': {
            moveSelected(-paramsData["grid"], 0)
            break
        }
    }
}

const trackMouse = (e) => {
    const rect = e.target.getBoundingClientRect()
    mouseCoord.x = e.clientX - rect.left
    mouseCoord.y = e.clientY - rect.top
    
    const translated = translateCoord(mouseCoord.x, mouseCoord.y)
    logicalCoord.x = translated[0]
    logicalCoord.y = translated[1]

    const snapped = snapLoc(logicalCoord.x, logicalCoord.y)
    snappedCoord.x = snapped[0]
    snappedCoord.y = snapped[1]

    if(mouseDown) {
        nowDragging = true
        dragEndLoc.x = snappedCoord.x
        dragEndLoc.y = snappedCoord.y
    }
}
CANVAS.onmousemove = trackMouse
CANVAS.onmousedown = () => { 
    mouseDown = true
    dragStartLoc.x = snappedCoord.x
    dragStartLoc.y = snappedCoord.y
    dragEndLoc.x = snappedCoord.x
    dragEndLoc.y = snappedCoord.y
}
CANVAS.onmouseup = () => { 
    mouseDown = false
    nowDragging = false
}

const clearCanvas = () => {
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height)
}

const drawGrid = (col, row) => {
    const GRID = paramsData["grid"]

    const totalWidth = (col+4) * GRID
    const totalHeight = (row+4) * GRID
    focal = CANVAS.width / Math.max(totalWidth, totalHeight)
    gridStart = { x: (CANVAS.width-focal*totalWidth)/2, y: (CANVAS.height-focal*totalHeight)/2 }
    const gridFocal = GRID * focal

    // draw grid
    for(let i=2; i<col+3; i++) {
        CTX.strokeStyle = "#BBBBBB"
        CTX.lineWidth = 1
        CTX.beginPath()
        CTX.moveTo(gridStart.x + i*gridFocal, gridStart.y + gridFocal)
        CTX.lineTo(gridStart.x + i*gridFocal, gridStart.y + (row+3)*gridFocal)
        CTX.closePath()
        CTX.stroke();
    }
    for(let i=2; i<row+3; i++) {
        CTX.strokeStyle = "#BBBBBB"
        CTX.lineWidth = 1
        CTX.beginPath()
        CTX.moveTo(gridStart.x + gridFocal, gridStart.y + i*gridFocal)
        CTX.lineTo(gridStart.x + (col+3)*gridFocal, gridStart.y + i*gridFocal)
        CTX.closePath()
        CTX.stroke();
    }
    CTX.strokeRect(gridStart.x + gridFocal, gridStart.y + gridFocal, (col+2)*gridFocal, (row+2)*gridFocal)

    // draw limit box
    CTX.strokeStyle = "#FF0000"
    CTX.lineWidth = 2
    CTX.strokeRect(gridStart.x + 2*gridFocal, gridStart.y + 2*gridFocal, gridFocal*col, gridFocal*row)
}

const translateCoord = (screenX, screenY) => {
    const [nonOffsetX, nonOffsetY] = [screenX - gridStart.x, screenY - gridStart.y]
    const [logicalX, logicalY] = [nonOffsetX/focal, nonOffsetY/focal]
    return [logicalX - paramsData["grid"]*2, logicalY - paramsData["grid"]*2]
}
const snapLoc = (logicalX, logicalY) => {
    const grid = paramsData["grid"]
    const [gridX, gridY] = [Math.round(logicalX/grid)*grid, Math.round(logicalY/grid)*grid]
    return [gridX, gridY]
}
const translateLoc = (logicalX, logicalY) => {
    const transX = (logicalX + 2*paramsData["grid"])*focal + gridStart.x
    const transY = (logicalY + 2*paramsData["grid"])*focal + gridStart.y
    return [transX, transY]
}

const rectInsideRect = (bounding, target) => {
    const [bx, by, bw, bh] = bounding
    const [tx, ty, tw, th] = target

    if(bx <= tx && tx+tw <= bx+bw && by <= ty && ty + th <= by+bh) return true
    else return false
}

const objectsInsideDragbox = () => {
    const dragBox = [
        Math.min(dragStartLoc.x, dragEndLoc.x),
        Math.min(dragStartLoc.y, dragEndLoc.y),
        Math.abs(dragStartLoc.x - dragEndLoc.x),
        Math.abs(dragStartLoc.y - dragEndLoc.y)
    ]
    return nowScene["physicalLayer"].map(obj => {
        const targetBox = [obj.x, obj.y, obj.w, obj.h]
        return rectInsideRect(dragBox, targetBox)
    })
}

const drawObjects = () => {
    const objs = nowScene.physicalLayer
    objectSelection = objectsInsideDragbox()

    objs.map((obj, i) => {
        CTX.strokeStyle = objectSelection[i] ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.5)"
        CTX.fillStyle = objectSelection[i] ? "rgba(255, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.3)"
        if(obj.type == "RECT") {
            const [coordX, coordY] = translateLoc(obj.x, obj.y)
            CTX.fillRect(coordX, coordY, obj.w*focal, obj.h*focal)
            CTX.strokeRect(coordX, coordY, obj.w*focal, obj.h*focal)
        }
        if(obj.type == "RTRI") {
            const [coordX, coordY] = translateLoc(obj.x, obj.y)
            const points = [
                [coordX, coordY],
                [coordX+obj.w*focal, coordY],
                [coordX+obj.w*focal, coordY+obj.h*focal],
                [coordX, coordY+obj.h*focal]
            ]
            switch(obj.rap) {
                case "LT": { points.splice(2, 1); break; }
                case "RT": { points.splice(3, 1); break; }
                case "RB": { points.splice(0, 1); break; }
                case "LB": { points.splice(1, 1); break; }
            }
            CTX.beginPath()
            CTX.moveTo(points[0][0], points[0][1])
            CTX.lineTo(points[1][0], points[1][1])
            CTX.lineTo(points[2][0], points[2][1])
            CTX.closePath()
            CTX.fill()
            CTX.stroke()
        }
    })
}

const drawCursor = () => {
    const cursorCoord = translateLoc(snappedCoord.x, snappedCoord.y)
    
    CTX.fillStyle = mouseDown ? "rgba(255, 0, 0, 0.5)" : "rgba(0, 255, 0, 0.5)"
    CTX.beginPath()
    CTX.arc(cursorCoord[0], cursorCoord[1], Math.max(paramsData["grid"]*focal/4, 3), 0, 2*Math.PI)
    CTX.closePath()
    CTX.fill()
}

const drawDrag = () => {
    const dragStartCoord = translateLoc(dragStartLoc.x, dragStartLoc.y)
    const dragEndCoord = translateLoc(dragEndLoc.x, dragEndLoc.y)

    if(!nowDragging) {
        if(dragStartCoord[0] == dragEndCoord[0] || dragStartCoord[1] == dragEndCoord[1]) return

        CTX.fillStyle = "rgba(0, 0, 255, 0.2)"
        CTX.strokeStyle = "rgba(0, 0, 255, 0.5)"
        CTX.fillRect(dragStartCoord[0], dragStartCoord[1], dragEndCoord[0] - dragStartCoord[0], dragEndCoord[1] - dragStartCoord[1])
        CTX.strokeRect(dragStartCoord[0], dragStartCoord[1], dragEndCoord[0] - dragStartCoord[0], dragEndCoord[1] - dragStartCoord[1])
    }
    else {
        CTX.fillStyle = "rgba(0, 0, 255, 0.2)"
        CTX.strokeStyle = "rgba(0, 0, 255, 0.5)"
        CTX.fillRect(dragStartCoord[0], dragStartCoord[1], dragEndCoord[0] - dragStartCoord[0], dragEndCoord[1] - dragStartCoord[1])
        CTX.strokeRect(dragStartCoord[0], dragStartCoord[1], dragEndCoord[0] - dragStartCoord[0], dragEndCoord[1] - dragStartCoord[1])
    }
}


const updateCanvas = () => {
    clearCanvas()
    drawGrid(nowScene["col"], nowScene["row"])
    drawObjects()
    drawCursor()
    drawDrag()
}

setInterval(updateCanvas, 1000/30)