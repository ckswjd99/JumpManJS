console.log("LOAD SCRIPT: player.js")

// key event handler
window.onkeydown = (e) => {
    if(e.code == "ArrowRight") KEYINPUTS.arrowRight = true
    if(e.code == "ArrowLeft") KEYINPUTS.arrowLeft = true
    if(e.code == "Space") KEYINPUTS.space = true
}

window.onkeyup = (e) => {
    if(e.code == "ArrowRight") KEYINPUTS.arrowRight = false
    if(e.code == "ArrowLeft") KEYINPUTS.arrowLeft = false
    if(e.code == "Space") KEYINPUTS.space = false
}

const KEYINPUTS = {
    arrowRight: false,
    arrowLeft: false,
    space: false
}

const PLAYER_STATE = {}
const playerStates = ["IDLE", "WALK", "JUMPREADY", "JUMP", "FALL", "FELL"]
playerStates.forEach(state => PLAYER_STATE[state] = state)

class Player {
    constructor(x, y, w, h, imageDir) {
        // physicals
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.imageDir = imageDir
        this.image = {}
        this.loadImage()

        this._cx = this.x+w/2
        this._cy = this.y+h/2

        this.acc = 15
        this.maxSpeed = 65
        
        this.maxJump = 60
        this.jumpGauge = 0
        this.jumpGather = 1
        this.jumpSpeedX = null
        this.maxAcc = 30
        this.jumpSpeedXGather = 0.05

        this.sx = 0
        this.sy = 0

        this._shape = new Rectangle(this.x, this.y, this.w, this.h)

        this.controllable = false

        this.state = PLAYER_STATE.JUMP
    }

    get cx() { 
        this._cx = x+w/2 
        return this._cx
    }
    get cy() { 
        this._cy = y+h/2 
        return this._cy
    }
    
    get shape() {
        this._shape.x = this.x
        this._shape.y = this.y
        return this._shape
    }
    
    set cx(val) { this._cx = val }
    set cy(val) { this._cy = val }
    set shape(val) { this._shape = val }

    loadImage = () => {
        this.image['idle'] = new Image()
        this.image['idle'].src = this.imageDir + "/idle.png";
        this.image['walk'] = new Image()
        this.image['walk'].src = this.imageDir + "/walk.png";
        this.image['jumpGather'] = new Image()
        this.image['jumpGather'].src = this.imageDir + "/jumpGather.png";
        this.image['jump'] = new Image()
        this.image['jump'].src = this.imageDir + "/jump.png";
        this.image['fall'] = new Image()
        this.image['fall'].src = this.imageDir + "/fall.png";
        this.image['fell'] = new Image()
        this.image['fell'].src = this.imageDir + "/fell.png";
    }

    update = (dt) => {

        // handle key inputs
        if(this.controllable) {
            this.sx = 0
            if(KEYINPUTS.arrowRight) {
                this.state = PLAYER_STATE.WALK
                if(this.jumpSpeedX === null) this.sx += this.acc
            }
            else {
                if(this.state == PLAYER_STATE.WALK) this.state = PLAYER_STATE.IDLE
            }
            if(KEYINPUTS.arrowLeft) {
                this.state = PLAYER_STATE.WALK
                if(this.jumpSpeedX === null) this.sx -= this.acc
            }
            else {
                if(this.state == PLAYER_STATE.WALK) this.state = PLAYER_STATE.IDLE
            }
            if(KEYINPUTS.space) {
                this.state = PLAYER_STATE.JUMPREADY
                if(this.jumpSpeedX === null) {
                    this.jumpSpeedX = this.sx
                    this.sx = 0
                }
                if(KEYINPUTS.arrowRight) {
                    this.jumpSpeedX = Math.min(this.jumpSpeedX+this.jumpSpeedXGather, this.maxAcc)
                }
                else if(this.jumpSpeedX > 0) {
                    this.jumpSpeedX = Math.max(this.jumpSpeedX-this.jumpSpeedXGather, 0)
                }
                if(KEYINPUTS.arrowLeft) {
                    this.jumpSpeedX = Math.max(this.jumpSpeedX-this.jumpSpeedXGather, -this.maxAcc)
                }
                else if(this.jumpSpeedX < 0) {
                    this.jumpSpeedX = Math.min(this.jumpSpeedX+this.jumpSpeedXGather, 0)
                }
                this.jumpGauge = Math.min(this.jumpGauge+this.jumpGather, this.maxJump)
            }
            else if(this.jumpGauge > 0) {
                this.state = PLAYER_STATE.JUMP
                this.sy = -this.jumpGauge
                this.sx = this.jumpSpeedX
                this.jumpGauge = 0
                this.jumpSpeedX = null
                this.controllable = false
            }
        }
        
        // scene move check
        if(this.y < -EPSILON) {
            NOW_WORLD.moveSceneTop()
            this.y = NOW_WORLD.nowScene.height - EPSILON
        }
        if(this.y > NOW_WORLD.nowScene.height + EPSILON) {
            NOW_WORLD.moveSceneBottom()
            this.y = EPSILON
        }
        if(this.x < -EPSILON) {
            NOW_WORLD.moveSceneLeft()
            this.x = NOW_WORLD.nowScene.width - this.w - EPSILON
        }
        if(this.x > NOW_WORLD.nowScene.width - this.w + EPSILON) {
            NOW_WORLD.moveSceneRight()
            this.x = EPSILON
        }
        
        // collision check
        let dp = smultVec([this.sx, this.sy], dt)
        const walls = NOW_WORLD.nowScene.physLayer.objects
        
        // x axis check
        this.x += dp[0]
        let xRectCollide = false
        let xRtriCollide = false

        // check rect collide then resolve
        walls.forEach(wall => {
            const nowShape = this.shape
            const intersections = Shape.polyCollide(nowShape, wall.shape)
            if(intersections.length == 0) return

            if(wall.shape.type == SHAPETYPE.RECT) {
                xRectCollide = true
                this.x = dp[0] > 0 ? wall.x - this.w - EPSILON : wall.x + wall.w + EPSILON
            }
        })

        // check rtri collide then resolve
        walls.forEach(wall => {
            if(xRectCollide) return

            const nowShape = this.shape
            const intersections = Shape.polyCollide(nowShape, wall.shape)
            if(intersections.length == 0) return

            if(wall.shape.type == SHAPETYPE.RTRI) {
                if(wall.shape.rap == RAP.LT) {
                    if(dp[0] < 0 && wall.shape.pointInside([nowShape.x, nowShape.y])) {
                        xRtriCollide = RAP.LT
                        this.x = Math.max(intersections[0][0], intersections[1][0]) + EPSILON
                    }
                    else {
                        xRectCollide = true
                        this.x = dp[0] > 0 ? wall.x - this.w - EPSILON : wall.x + wall.w + EPSILON
                    }
                }
                else if(wall.shape.rap == RAP.RT) {
                    if(dp[0] > 0 && wall.shape.pointInside([nowShape.x+nowShape.w, nowShape.y])) {
                        xRtriCollide = RAP.RT
                        this.x = Math.min(intersections[0][0], intersections[1][0]) - this.w - EPSILON
                    }
                    else {
                        xRectCollide = true
                        this.x = dp[0] > 0 ? wall.x - this.w - EPSILON : wall.x + wall.w + EPSILON
                    }
                }
                else if(wall.shape.rap == RAP.RB) {
                    if(dp[0] > 0 && wall.shape.pointInside([nowShape.x+nowShape.w, nowShape.y+nowShape.h])) {
                        xRtriCollide = RAP.RB
                        this.x = Math.min(intersections[0][0], intersections[1][0]) - this.w - EPSILON
                    }
                    else {
                        xRectCollide = true
                        this.x = dp[0] > 0 ? wall.x - this.w - EPSILON : wall.x + wall.w + EPSILON
                    }
                }
                else if(wall.shape.rap == RAP.LB) {
                    if(dp[0] < 0 && wall.shape.pointInside([nowShape.x, nowShape.y+nowShape.w])) {
                        xRtriCollide = RAP.LT
                        this.x = Math.max(intersections[0][0], intersections[1][0]) + EPSILON
                    }
                    else {
                        xRectCollide = true
                        this.x = dp[0] > 0 ? wall.x - this.w - EPSILON : wall.x + wall.w + EPSILON
                    }
                }
            }
        })


        // y axis check
        this.y += dp[1]
        let yRectCollide = false
        let yRtriCollide = false

        // check rect collide
        walls.forEach(wall => {
            const nowShape = this.shape
            const intersections = Shape.polyCollide(nowShape, wall.shape)
            if(intersections.length == 0) return

            if(wall.shape.type == SHAPETYPE.RECT) {
                yRectCollide = true
                this.y = dp[1] > 0 ? wall.y - this.h - EPSILON : wall.y + wall.h + EPSILON
            }
        })

        // check rtri collide
        walls.forEach(wall => {
            if(yRectCollide) return

            const nowShape = this.shape
            const intersections = Shape.polyCollide(nowShape, wall.shape)
            if(intersections.length == 0) return

            if(wall.shape.type == SHAPETYPE.RTRI) {
                if(wall.shape.rap == RAP.LT) {
                    if(dp[1] < 0 && wall.shape.pointInside([nowShape.x, nowShape.y])) {
                        yRtriCollide = RAP.LT
                        this.y = Math.max(intersections[0][1], intersections[1][1]) + EPSILON
                    }
                    else {
                        yRectCollide = true
                        this.y = dp[1] > 0 ? wall.y - this.h - EPSILON : wall.y + wall.h + EPSILON
                    }
                }
                else if(wall.shape.rap == RAP.RT) {
                    if(dp[1] < 0 && wall.shape.pointInside([nowShape.x+nowShape.w, nowShape.y])) {
                        yRtriCollide = RAP.RT
                        this.y = Math.max(intersections[0][1], intersections[1][1]) + EPSILON
                    }
                    else {
                        yRectCollide = true
                        this.y = dp[1] > 0 ? wall.y - this.h - EPSILON : wall.y + wall.h + EPSILON
                    }
                }
                else if(wall.shape.rap == RAP.RB) {
                    if(dp[1] > 0 && wall.shape.pointInside([nowShape.x+nowShape.w, nowShape.y+nowShape.h])) {
                        yRtriCollide = RAP.RB
                        this.y = Math.min(intersections[0][1], intersections[1][1]) - this.h - EPSILON
                    }
                    else {
                        yRectCollide = true
                        this.y = dp[1] > 0 ? wall.y - this.h - EPSILON : wall.y + wall.h + EPSILON
                        console.log(this.y)
                    }
                }
                else if(wall.shape.rap == RAP.LB) {
                    if(dp[1] > 0 && wall.shape.pointInside([nowShape.x, nowShape.y+nowShape.w])) {
                        yRtriCollide = RAP.LB
                        this.y = Math.min(intersections[0][1], intersections[1][1]) - this.h - EPSILON
                    }
                    else {
                        yRectCollide = true
                        this.y = dp[1] > 0 ? wall.y - this.h - EPSILON : wall.y + wall.h + EPSILON
                    }
                }
            }
        })

        // speed resolve
        if(xRectCollide) {
            this.state = PLAYER_STATE.FALL
            this.sx = -this.sx
        }
        if(yRectCollide && dp[1] < 0) this.sy = -this.sy
        if(yRectCollide && dp[1] >= 0) {
            if(this.state == PLAYER_STATE.FALL) this.state = PLAYER_STATE.FELL
            else if(this.state != PLAYER_STATE.FELL && this.jumpSpeedX === null) this.state = PLAYER_STATE.IDLE
            this.sy = 0
            this.sx = 0
            this.controllable = true
        }
        else {
            this.controllable = false
        }
        if(!xRectCollide && !yRectCollide && xRtriCollide) {
            this.state = PLAYER_STATE.FALL
            this.sx += Math.sign(this.sx) * 0.1
            this.sy += Math.sign(this.sy) * 0.1
            if(xRtriCollide == RAP.LT) {
                [this.sx, this.sy] = projectVec([1, -1], [this.sx, this.sy])
            }
            if(xRtriCollide == RAP.RB) {
                [this.sx, this.sy] = projectVec([-1, 1], [this.sx, this.sy])
            }
            if(xRtriCollide == RAP.RT) {
                [this.sx, this.sy] = projectVec([1, 1], [this.sx, this.sy])
            }
            if(xRtriCollide == RAP.RT || xRtriCollide == RAP.LB) {
                [this.sx, this.sy] = projectVec([1, 1], [this.sx, this.sy])
            }
        }
        if(!xRectCollide && !yRectCollide && !xRtriCollide && yRtriCollide) {
            this.state = PLAYER_STATE.FALL
            this.sx += Math.sign(this.sx) * 0.1
            this.sy += Math.sign(this.sy) * 0.1
            if(yRtriCollide == RAP.LT || yRtriCollide == RAP.RB) {
                [this.sx, this.sy] = projectVec([1, -1], [this.sx, this.sy])
            }
            if(yRtriCollide == RAP.RT || yRtriCollide == RAP.LB) {
                [this.sx, this.sy] = projectVec([1, 1], [this.sx, this.sy])
            }
        }

        // gravity
        [this.sx, this.sy] = addVec([this.sx, this.sy], NOW_WORLD.nowScene.gravity)
        
        // speed limit
        if(Math.abs(this.sx) > this.maxSpeed) {
            [this.sx, this.sy] = smultVec([this.sx, this.sy], this.maxSpeed / normVec([this.sx, this.sy]))
        }

        
        

        
        
    }
    
    render = (cam) => {
        console.log(this.state)
        const [tx, ty] = roundVec(cam([this.x, this.y]))
        const [tw, th] = subVec(roundVec(cam([this.w, this.h])), cam([0, 0]))

        if(this.state == PLAYER_STATE.IDLE) CTX.drawImage(this.image.idle, tx, ty, tw, th)
        if(this.state == PLAYER_STATE.WALK) CTX.drawImage(this.image.walk, tx, ty, tw, th)
        if(this.state == PLAYER_STATE.JUMPREADY) CTX.drawImage(this.image.jumpGather, tx, ty, tw, th)
        if(this.state == PLAYER_STATE.JUMP) CTX.drawImage(this.image.jump, tx, ty, tw, th)
        if(this.state == PLAYER_STATE.FALL) CTX.drawImage(this.image.fall, tx, ty, tw, th)
        if(this.state == PLAYER_STATE.FELL) CTX.drawImage(this.image.fell, tx, ty, tw, th)
    }
}

// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])