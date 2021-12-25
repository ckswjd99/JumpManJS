console.log("LOAD SCRIPT: physics.js")


// vector calculation

const EPSILON = 0.01
const roundVec = (vec) => [Math.round(vec[0]), Math.round(vec[1])]
const normVec = (vec) => Math.sqrt(vec[0]**2 + vec[1]**2)
const smultVec = (vec, scala) => [vec[0]*scala, vec[1]*scala]
const addVec = (vec1, vec2) => [vec1[0]+vec2[0], vec1[1]+vec2[1]]
const subVec = (vec1, vec2) => [vec1[0]-vec2[0], vec1[1]-vec2[1]]
const innerVec = (vec1, vec2) => vec1[0]*vec2[0] + vec1[1]*vec2[1]
const normalizeVec = (vec) => smultVec(vec, 1/normVec(vec))
const projectVec = (dirVec, scalaVec) => {
    return smultVec(dirVec, innerVec(dirVec, scalaVec) / normVec(dirVec) / normVec(dirVec))
}


// physical objects

const SHAPETYPE = new Object()
const shapeNames = ["RECT", "RTRI"]
shapeNames.forEach(shapeName => SHAPETYPE[shapeName] = shapeName)

class Shape {
    constructor() { 
        this.type = null
    }

    everyPoints = () => []
    everyLines = () => {}
    debugRender = (cam) => {}

    /*
    static linesCollide = (line1, line2) => {
        const [p1, p2, p3, p4] = [line1[0], line1[1], line2[0], line2[1]]
        const CCW = (p1, p2, p3) => (p3[1] - p1[1]) * (p2[0] - p1[0]) > (p2[1] - p1[1]) * (p3[0] - p1[0])
        return (CCW(p1, p3, p4) != CCW(p2, p3, p4)) && (CCW(p1, p2, p3) != CCW(p1, p2, p4))
    }
    */

    static lineVertical(line) { return (line[0][0] == line[1][0]) }
    static lineHorizontal(line) { return (line[0][1] == line[1][1]) }
    static lineNormalVector(line) {
        const displacement = subVec(line[1], line[0])
        const rampLength = normVec(displacement)
        const normalVec = [displacement[1]/rampLength, -displacement[0]/rampLength]
        return normalVec
    }

    static linesCollide(line1, line2) {
        let [a, b, c, d] = [line1[0][0], line1[0][1], line1[1][0], line1[1][1]]
        let [p, q, r, s] = [line2[0][0], line2[0][1], line2[1][0], line2[1][1]]

        let det, gamma, lambda;
        det = (c - a) * (s - q) - (r - p) * (d - b)
        if (det === 0) {    // paralell
            let onLine = false
            if(a == c) {   // vertical
                if(a == p) onLine = true
                else onLine = false
            }
            else if(b == d) { // horizontal
                if(b == q) onLine = true
                else onLine = false
            }
            else {  // not vertical, horizontal
                const yIntercept1 = b - (d-b)/(c-a)*a
                const yIntercept2 = q - (s-q)/(r-p)*p
                if((yIntercept1-yIntercept2) == 0) onLine = true
                else onLine = false
            }

            if(!onLine) return false
            else {
                const intersectPoints = []
                if(
                    (line2[0][0] - line1[0][0])*(line2[1][0] - line1[0][0]) <= 0
                    && (line2[0][1] - line1[0][1])*(line2[1][1] - line1[0][1]) <= 0
                ) intersectPoints.push(line1[0])
                if(
                    (line2[0][0] - line1[1][0])*(line2[1][0] - line1[1][0]) <= 0
                    && (line2[0][1] - line1[1][1])*(line2[1][1] - line1[1][1]) <= 0
                ) intersectPoints.push(line1[1])
                if(
                    (line1[0][0] - line2[0][0])*(line1[1][0] - line2[0][0]) <= 0
                    && (line1[0][1] - line2[0][1])*(line1[1][1] - line2[0][1]) <= 0
                ) intersectPoints.push(line2[0])
                if(
                    (line1[0][0] - line2[1][0])*(line1[1][0] - line2[1][0]) <= 0
                    && (line1[0][1] - line2[1][1])*(line1[1][1] - line2[1][1]) <= 0
                ) intersectPoints.push(line2[1])
                
                if(!intersectPoints) return false
                else {
                    return intersectPoints
                }
            }
            
        } else {    // not paralell
            lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det
            gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det
            let intersect = (0 <= lambda && lambda <= 1) && (0 <= gamma && gamma <= 1)
            if(!intersect) return false
            else {
                const intersectPoint = addVec(line1[0], smultVec(subVec(line1[1], line1[0]), lambda))
                return [intersectPoint]
            }
        }
    };

    static polyCollide = (shape1, shape2) => {
        const lines1 = shape1.everyLines()
        const lines2 = shape2.everyLines()
        const intersections = []
        // const normals1 = []
        // const normals2 = []
        for(let i=0; i<lines1.length; i++) {
            for(let j=0; j<lines2.length; j++) {
                const intersection = this.linesCollide(lines1[i], lines2[j])
                if(intersection) {
                    intersections.push(...intersection)
                    // normals1.push(this.lineNormalVector(lines1[i]))
                    // normals2.push(this.lineNormalVector(lines2[j]))
                }
            }
        }
        return intersections
    }

    static pointInsideRect = (point, x, y, w, h) => {
        if(
            x <= point[0] && point[0] <= x+w &&
            y <= point[1] && point[1] <= y+h
        ) return true
        else return false
    }

}

class Rectangle extends Shape {
    constructor(x, y, w, h) {
        super()
        this.type = SHAPETYPE.RECT
        this.x = x
        this.y = y
        this.w = w
        this.h = h
    }

    setParams = (x, y, w, h) => {
        this.x = x !== null ? x : this.x
        this.y = y !== null ? y : this.y
        this.w = w !== null ? w : this.w
        this.h = h !== null ? h : this.h
    }

    everyPoints = () => {
        return [
            [this.x, this.y], 
            [this.x+this.w, this.y],
            [this.x+this.w, this.y+this.h],
            [this.x, this.y+this.h],
        ]
    }

    everyLines = () => {
        const thisPoints = this.everyPoints()
        const result = []
        thisPoints.forEach((_, i, points) => {
            result.push([points[i], points[(i+1)%points.length]])
        })
        return result
    }

    debugRender = (cam) => {
        const tpoints = this.everyPoints().map(point => roundVec(cam(point)))
        CTX.beginPath()
        CTX.strokeStyle = "rgb(47, 79, 79)"
        CTX.fillStyle = "rgb(35, 46, 46)"
        CTX.moveTo(tpoints[0][0], tpoints[0][1])
        CTX.lineTo(tpoints[1][0], tpoints[1][1])
        CTX.lineTo(tpoints[2][0], tpoints[2][1])
        CTX.lineTo(tpoints[3][0], tpoints[3][1])
        CTX.closePath()
        CTX.fill()
        CTX.stroke()
    }

    pointInside = (point) => {
        if(
            this.x <= point[0] && point[0] <= this.x+this.w &&
            this.y <= point[1] && point[1] <= this.y+this.h
        ) return true
        else return false
    }

}


const RAP = { LT: 0, RT: 1, RB: 2, LB: 3 }
class RightTriangle extends Shape {
    constructor(x, y, w, h, rap) {
        super()
        this.type = SHAPETYPE.RTRI
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.rap = rap
        
        const rampLength = Math.sqrt(w**2+h**2)
        this.normalVector = (
            this.rap == RAP.LT ? [h/rampLength, -w/rampLength] :
            this.rap == RAP.RT ? [-h/rampLength, -w/rampLength] :
            this.rap == RAP.RB ? [-h/rampLength, w/rampLength] :
            this.rap == RAP.LB ? [h/rampLength, w/rampLength] : null
        )

    }

    setParams = (x, y, w, h) => {
        this.x = x !== null ? x : this.x
        this.y = y !== null ? y : this.y
        this.w = w !== null ? w : this.w
        this.h = h !== null ? h : this.h
    }

    everyPoints = (asRect = false) => {
        let points = [
            [this.x, this.y], 
            [this.x+this.w, this.y],
            [this.x+this.w, this.y+this.h],
            [this.x, this.y+this.h],
        ]
        if(!asRect) points.splice((this.rap+2)%4, 1)
        return points
    }

    everyLines = (asRect = false) => {
        const thisPoints = this.everyPoints(asRect = false)
        const result = []
        thisPoints.forEach((_, i, points) => {
            result.push([points[i], points[(i+1)%points.length]])
        })
        return result
    }

    debugRender = (cam) => {
        const tpoints = this.everyPoints().map(point => roundVec(cam(point)))
        CTX.beginPath()
        CTX.strokeStyle = "rgb(47, 79, 79)"
        CTX.fillStyle = "rgb(35, 46, 46)"
        CTX.moveTo(tpoints[0][0], tpoints[0][1])
        CTX.lineTo(tpoints[1][0], tpoints[1][1])
        CTX.lineTo(tpoints[2][0], tpoints[2][1])
        CTX.closePath()
        CTX.fill()
        CTX.stroke()
    }

    pointInside = (point) => {
        if(Shape.pointInsideRect(point, this.x, this.y, this.w, this.h)) {
            switch(this.rap) {
                case RAP.LT: {
                    if(point[0] + point[1] <= this.x + this.y + this.w) return true
                    else return false
                }
                case RAP.RT: {
                    if(point[0] - point[1] >= this.x - this.y) return true
                    else return false
                }
                case RAP.RB: {
                    if(point[0] + point[1] >= this.x + this.y + this.w) return true
                    else return false
                }
                case RAP.LB: {
                    if(point[0] - point[1] <= this.x - this.y) return true
                    else return false
                }
            }
        }
        return false
    }
}

// sequential importer
loadScriptFile(scriptsToLoad[++loadIndex])