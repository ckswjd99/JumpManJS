// Import JS files in need

const loadScriptFile = (filename) => {
    if(!filename) return
    
    const bodyElement = document.getElementsByTagName("body")[0];
    const scriptElement = document.createElement("script");
    scriptElement.setAttribute("type", "text/javascript");
    scriptElement.setAttribute("src", filename);
    bodyElement.appendChild(scriptElement);
}

const scriptsToLoad = [
    "jumpman/scripts/init.js",
    "jumpman/scripts/setting.js",
    "jumpman/scripts/physics.js",
    "jumpman/scripts/world.js",
    "jumpman/scripts/player.js",
    "jumpman/scripts/debug.js"
]

let loadIndex = 0
loadScriptFile(scriptsToLoad[loadIndex])
