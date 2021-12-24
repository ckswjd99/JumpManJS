console.log("LOAD SCRIPT: maps.js")

const sampleWorld = {
    "params": {
        "grid": 5
    },
    "world": {
        "name": "Sample World"
    },
    "scenes": [
        {
            "name": "startingScene",
            "col": 40,
            "row": 40,
            "objectLayers": [
                [
                    {
                        "type": "IMAGE", "x": "0 grid", "y": "0 grid", "w": "40 grid", "h": "40 grid",
                        "src": "jumpman/images/sampleImage.jpg"
                    }
                ]
            ],
            "physicalLayer": [
                { "type": "RECT", "x": "0 grid", "y": "38 grid", "w": "20 grid", "h": "2 grid" },
                { "type": "RECT", "x": "20 grid", "y": "38 grid", "w": "20 grid", "h": "2 grid" },
                { "type": "RECT", "x": "38 grid", "y": "0 grid", "w": "2 grid", "h": "38 grid" },
                { "type": "RECT", "x": "0 grid", "y": "0 grid", "w": "2 grid", "h": "38 grid" },
                { "type": "RTRI", "x": "2 grid", "y": "34 grid", "w": "4 grid", "h": "4 grid", "rap": "LB" },
                { "type": "RTRI", "x": "34 grid", "y": "30 grid", "w": "4 grid", "h": "4 grid", "rap": "RB" },
                { "type": "RECT", "x": "34 grid", "y": "34 grid", "w": "4 grid", "h": "4 grid" },
                { "type": "RECT", "x": "26 grid", "y": "26 grid", "w": "4 grid", "h": "2 grid" },
                { "type": "RTRI", "x": "24 grid", "y": "26 grid", "w": "2 grid", "h": "2 grid", "rap": "RT" },
                { "type": "RTRI", "x": "30 grid", "y": "26 grid", "w": "2 grid", "h": "2 grid", "rap": "LB" },
                { "type": "RECT", "x": "16 grid", "y": "18 grid", "w": "4 grid", "h": "2 grid" },
                { "type": "RTRI", "x": "20 grid", "y": "18 grid", "w": "2 grid", "h": "2 grid", "rap": "LB" },
                { "type": "RTRI", "x": "14 grid", "y": "18 grid", "w": "2 grid", "h": "2 grid", "rap": "RB" },
                { "type": "RTRI", "x": "5 grid", "y": "14 grid", "w": "2 grid", "h": "2 grid", "rap": "RB" },
                { "type": "RTRI", "x": "7 grid", "y": "14 grid", "w": "2 grid", "h": "2 grid", "rap": "LB" },
                { "type": "RECT", "x": "6 grid", "y": "6 grid", "w": "2 grid", "h": "2 grid" },
                { "type": "RECT", "x": "22 grid", "y": "-2 grid", "w": "18 grid", "h": "4 grid" },
                { "type": "RTRI", "x": "2 grid", "y": "-4 grid", "w": "8 grid", "h": "8 grid", "rap": "LT" },
                { "type": "RTRI", "x": "18 grid", "y": "-2 grid", "w": "4 grid", "h": "4 grid", "rap": "RB" }
            ],
            "neighbors": {
                "top": "0-0",
                "right": 0,
                "bottom": 0,
                "left": 0
            },
            "gravity": [ 0, 0.5 ]
        },
        {
            "name": "0-0",
            "col": 40,
            "row": 40,
            "objectLayers": [
                [
                    {
                        "type": "IMAGE", "x": "0 grid", "y": "0 grid", "w": "40 grid", "h": "40 grid",
                        "src": "jumpman/images/sampleImage.jpg"
                    }
                ]
            ],
            "physicalLayer": [
                { "type": "RECT", "x": "-2 grid", "y": "0 grid", "w": "4 grid", "h": "38 grid" },
                { "type": "RECT", "x": "38 grid", "y": "30 grid", "w": "4 grid", "h": "10 grid" },
                { "type": "RECT", "x": "0 grid", "y": "36 grid", "w": "4 grid", "h": "4 grid" },
                { "type": "RTRI", "x": "4 grid", "y": "36 grid", "w": "4 grid", "h": "4 grid", "rap": "LT"},
                { "type": "RECT", "x": "22 grid", "y": "38 grid", "w": "18 grid", "h": "2 grid" },
                { "type": "RTRI", "x": "18 grid", "y": "38 grid", "w": "4 grid", "h": "4 grid", "rap": "RB" },
                { "type": "RTRI", "x": "34 grid", "y": "30 grid", "w": "4 grid", "h": "4 grid", "rap": "RB" }
            ],
            "neighbors": {
                "top": 0,
                "right": "0-1",
                "bottom": "startingScene",
                "left": 0
            },
            "gravity": [ 0, 0.5 ]
        },
        {
            "name": "0-1",
            "col": 40,
            "row": 40,
            "objectLayers": [
                [
                    {
                        "type": "IMAGE", "x": "0 grid", "y": "0 grid", "w": "40 grid", "h": "40 grid",
                        "src": "jumpman/images/sampleImage.jpg"
                    }
                ]
            ],
            "physicalLayer": [
                { "type": "RECT", "x": "-2 grid", "y": "30 grid", "w": "4 grid", "h": "10 grid" },
                { "type": "RECT", "x": "38 grid", "y": "30 grid", "w": "4 grid", "h": "10 grid" },
                { "type": "RECT", "x": "0 grid", "y": "38 grid", "w": "40 grid", "h": "2 grid" }
            ],
            "neighbors": {
                "top": 0,
                "right": "0-1",
                "bottom": 0,
                "left": "0-0"
            },
            "gravity": [ 0, 0.5 ]
        }
    ],
    "player": {
        "x": "2 grid",
        "y": "17 grid",
        "w": "2 grid",
        "h": "2 grid",
        "imageDir": "jumpman/images/player",
        "acc": 15,
        "maxSpeed": 75,
        "maxJump": 65,
        "jumpGather": 2,
        "maxAcc": 30,
        "jumpSpeedXGather": 0.05
    }
}

const MAPS = {
    "sampleWorld": sampleWorld
}


// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])