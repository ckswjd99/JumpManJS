console.log("LOAD SCRIPT: init.js")

// initialize canvas
const WRAPPER = document.getElementById("JumpMan")
const CANVAS = document.createElement("canvas")
const CTX = CANVAS.getContext('2d')

WRAPPER.appendChild(CANVAS)
const updateCanvas = () => {
    CANVAS.width = WRAPPER.clientWidth
    CANVAS.height = WRAPPER.clientHeight
}

// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])