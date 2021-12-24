console.log("LOAD SCRIPT: setting.js")

// game setting object
const SETTING = {
    fps: 60,
    letterbox: "#000000",
    debugging: true,
    grid: 5
}

let GRID = SETTING.grid

// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])