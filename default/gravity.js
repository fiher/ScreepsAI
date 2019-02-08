/**
 * requestAnimationFrame
 */
console.log('fooock')
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60)
        }
})()

class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }
    static combineVectors(vectorA, vectorB) {
        return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y)
    }
    static subtractVectors(vectorA, vectorB) {
        return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y)
    }
    static createRandomVector() {
        return new Vector(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        )
    }
    set(x = 0, y = 0) {
        if (typeof x === "object") {
            x = x.x
            y = x.y
        }
        this.x = x
        this.y = y
    }
    addVector(Vector) {
        this.x += Vector.x
        this.y += Vector.y
    }
    subtractVector(Vector) {
        this.x -= Vector.x
        this.y -= Vector.y
    }
    scale(scale) {
        this.x *= scale
        this.y *= scale
    }
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    getLengthSq() {
        return this.x * this.x + this.y * this.y
    }
    normalize() {
        let magnitute = Math.sqrt(this.x * this.x + this.y * this.y)
        if (magnitute) {
            this.x /= magnitute
            this.y /= magnitute
        }
        return this
    }
    angle() {
        return Math.atan2(this.y, this.x)
    }
    angleTo(v) {
        let dx = v.x - this.x
        let dy = v.y - this.y
        return Math.atan2(dy, dx)
    }
    distanceTo(v) {
        let dx = v.x - this.x
        let dy = v.y - this.y
        return Math.sqrt(dx * dx + dy * dy)
    }
    distanceToSq(v) {
        let dx = v.x - this.x
        let dy = v.y - this.y
        return dx * dx + dy * dy
    }
    lerp(v, t) {
        this.x += (v.x - this.x) * t
        this.y += (v.y - this.y) * t
        return this
    }
    clone() {
        return new Vector(this.x, this.y)
    }
    toString() {
        return `(x:${this.x}, y:${this.y})`
    }
}
class GravityPoint {
    constructor(x, y, radius, targets) {
        this.RADIUS_LIMIT = 65
        this.INTERFERENCE_TO_POINT = true
        this.interferenceToPoint = 0
        this.radius = radius
        this.currentRadius = radius * 0.5
        this.collapsing = false
        this.x = x
        this.y = y
        this._dragDistance = null
        this.dragging = false
        this.destroyed = false
        this._easeRadius = 0
        this._targets = {
            particles: targets.particles || [],
            gravities: targets.gravities || []
        }

    }
    interferenceToPoint(interference) {
        this.INTERFERENCE_TO_POINT = interference
    }
    hitTest(p) {
        return this.distanceTo(p) < this.radius
    }
    startDrag(dragStartPoint) {
        this._dragDistance = Vector.sub(dragStartPoint, this)
        this.dragging = true
    }
    drag(dragToPoint) {
        this.x = dragToPoint.x - this._dragDistance.x
        this.y = dragToPoint.y - this._dragDistance.y
    }
    endDrag() {
        this._dragDistance = null
        this.dragging = false
    }
    addSpeed(d) {
        this._speed = this._speed.addVector(d)
    }
    collapse(e) {
        this.currentRadius *= 1.75
        this._collapsing = true
    }
    render(ctx) {
        if (this.destroyed) return

        let particles = this._targets.particles
        let i = 0
        let len = particles.length
        partciles.forEach(particle => {
            particle.addSpeed(Vector.sub(this, particles[i]).normalize().scale(this.gravity))
        })

        this._easeRadius = (this._easeRadius + (this.radius - this.currentRadius) * 0.07) * 0.95
        this.currentRadius += this._easeRadius
        if (this.currentRadius < 0) {
            this.currentRadius = 0
        }

        if (this._collapsing) {
            this.radius *= 0.75
            if (this.currentRadius < 1) this.destroyed = true
            this._draw(ctx)
            return
        }

        let gravities = this._targets.gravities
        let absorb
        let area = this.radius * this.radius * Math.PI
        gravities.forEach(gravity => {
            if (gravity === this || gravity.destroyed) {
                return
            }
            if ((this.currentRadius >= gravity.radius || this.dragging) &&
                this.distanceTo(gravity) < (this.currentRadius + gravity.radius) * 0.85
            ) {
                gravity.destroyed = true
                this.gravity += gravity.gravity
                let absorp = Vector.sub(gravity, this).scale(gravity.radius / this.radius * 0.5)
                this.addSpeed(absorp)

                let gravityArea = gravity.radius * gravity.radius * Math.PI
                this.currentRadius = Math.sqrt((area + gravityArea * 3) / Math.PI)
                this.radius = Math.sqrt((area + gravityArea) / Math.PI)
            }
            gravity.addSpeed(Vector.sub(this, gravity).normalize().scale(this.gravity))
        })
        if (GravityPoint.interferenceToPoint && !this.dragging) {
            this.add(this._speed)
            this._speed = new Vector()
        }
        if (this.currentRadius > GravityPoint.RADIUS_LIMIT) {
            this.collapse()
        }
        this._draw(ctx)
    }
    _draw(ctx) {
        let grd
        let r = Math.random() * this.currentRadius * 0.7 + this.currentRadius * 0.3
        ctx.save()

        grd = ctx.createRadialGradient(this.x, this.y, this.radius, this.x, this.y, this.radius * 5)
        grd.addColorStop(0, 'rgba(0, 0, 0, 0.1)')
        grd.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 5, 0, Math.PI * 2, false)
        ctx.fillStyle = grd
        ctx.fill()

        grd = ctx.createRadialGradient(this.x, this.y, r, this.x, this.y, this.currentRadius)
        grd.addColorStop(0, 'rgba(0, 0, 0, 1)')
        grd.addColorStop(1, Math.random() < 0.2 ? 'rgba(255, 196, 0, 0.15)' : 'rgba(103, 181, 191, 0.75)')
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2, false)
        ctx.fillStyle = grd
        ctx.fill()
        ctx.restore()
    }
}
class Particle {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
        this._latest = new Vector()
        this._speed = new Vector()
    }
    addSpeed(d) {
        this._speed.addVector(d)
    }
    update() {
        if (this._speed.getLength() > 12) {
            this._speed.normalize().scale(12)
        }
        this._latest.set(this)
        this.addSpeed(this._speed)
    }

    render(ctx) {
        if (this._speed.getLength() > 12) this._speed.normalize().scale(12)

        this._latest.set(this)
        this.add(this._speed)

        ctx.save()
        ctx.fillStyle = ctx.strokeStyle = '#fff'
        ctx.lineCap = ctx.lineJoin = 'round'
        ctx.lineWidth = this.radius * 2
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this._latest.x, this._latest.y)
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.restore()
    }
}
let BACKGROUND_COLOR = 'rgba(11, 51, 56, 1)'
let PARTICLE_RADIUS = 1
let G_POINT_RADIUS = 10
let G_POINT_RADIUS_LIMITS = 65
let canvas = document.getElementById('c')
let context = canvas.getContext('2d')
let bufferCvs = document.createElement('canvas')
let bufferCtx = bufferCvs.getContext('2d')
let screenWidth = canvas.width = window.innerWidth
let screenHeight = canvas.height = window.innerHeight
let mouse = new Vector()
let gravities = []
let particles = []
let cx = canvas.width * 0.5
let cy = canvas.height * 0.5
let grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy))
let gui = new dat.GUI()
let control = {
    particleNum: 100
}


function resize(event) {
    screenWidth = canvas.width = window.innerWidth
    screenHeight = canvas.height = window.innerHeight
    bufferCvs.width = screenWidth
    bufferCvs.height = screenHeight
    context = canvas.getContext('2d')
    bufferCtx = bufferCvs.getContext('2d')

    let cx = canvas.width * 0.5
    let cy = canvas.height * 0.5

    grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy))
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.35)')
}

function mouseMove(event) {
    mouse.set(event.clientX, event.clientY)
    let hit = true
    gravities.forEach(gravity => {
        if ((!hit && gravity.hitTest(mouse)) || gravity.dragging)
            gravity.isMouseOver = hit = true
        else {
            gravity.isMouseOver = false
        }
    })
    canvas.style.cursor = hit ? 'pointer' : 'default'
}

function mouseDown(element) {
    console.log('fock')
    gravities.forEach(gravity => {
        if (gravity.isMouseOver) {
            gravity.startDrag(mouse)
            return
        }
    })
    gravities.push(new GravityPoint(element.clientX, element.clientY, G_POINT_RADIUS, {
        particles: particles,
        gravities: gravities
    }))
    console.log(gravities)
}

function mouseUp(element) {
    gravities.forEach(gravity => {
        if (gravity.dragging) {
            gravity.endDrag()
            return
        }
    })
}

function doubleClick(element) {
    gravities.forEach(gravity => {
        if (gravity.isMouseOver) {
            gravity.collapse()
            return
        }
    })
}

function addParticles(num) {

    while (num-- > 0) {
        let particle = new Particle(
            Math.floor(Math.random() * screenWidth - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
            Math.floor(Math.random() * screenHeight - PARTICLE_RADIUS * 2) + 1 + PARTICLE_RADIUS,
            PARTICLE_RADIUS
        )
        particle.addSpeed(Vector.createRandomVector())
        particles.push(particle)
    }

}

function removeParticle(num) {
    particles = []
}

window.addEventListener('resize', resize, false)
addParticles(control.particleNum)
addParticles(control.particleNum)
canvas.addEventListener('mousemove', mouseMove, false)
canvas.addEventListener('mousedown', mouseDown, false)
canvas.addEventListener('mouseup', mouseUp, false)
canvas.addEventListener('dblclick', doubleClick, false)

gui.add(control, 'particleNum', 0, 500).step(1).name('Particle Num').onChange(function () {
    let particles = (control.particleNum | 0) - particles.length
    if (particles > 0) {
        addParticles(n)
    } else if (n < 0) {
        removeParticle(-particles)
    }
})
gui.add(GravityPoint.prototype, 'interferenceToPoint').name('Interference Between Point')
gui.close()

function loop() {
    var i, len, g, p

    context.save()
    context.fillStyle = BACKGROUND_COLOR
    context.fillRect(0, 0, screenWidth, screenHeight)
    context.fillStyle = grad
    context.fillRect(0, 0, screenWidth, screenHeight)
    context.restore()
    gravities = gravities.filter(gravity => !gravity.destroyed)
    gravities.forEach(gravity => {
        if (gravity.dragging) {
            gravity.drag(mouse)
        }
    })
    bufferCtx.save()
    bufferCtx.globalCompositeOperation = 'destination-out'
    bufferCtx.globalAlpha = 0.35
    bufferCtx.fillRect(0, 0, screenWidth, screenHeight)
    bufferCtx.restore()

    // パーティクルをバッファに描画
    // for (i = 0, len = particles.length; i < len; i++) {
    //     particles[i].render(bufferCtx);
    // }
    bufferCtx.save()
    bufferCtx.fillStyle = bufferCtx.strokeStyle = '#fff'
    bufferCtx.lineCap = bufferCtx.lineJoin = 'round'
    bufferCtx.lineWidth = PARTICLE_RADIUS * 2
    bufferCtx.beginPath()
    particles.forEach(particle => {
        particle.update()
        bufferCtx.moveTo(particle.x, particle.y)
        bufferCtx.lineTo(particle._latest.x, particle._latest.y)
    })

    bufferCtx.stroke()
    bufferCtx.beginPath()
    particles.forEach(particle => {
        bufferCtx.moveTo(particle.x, particle.y)
        bufferCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false)
    })
    bufferCtx.fill()
    bufferCtx.restore()
    context.drawImage(bufferCvs, 0, 0)
    requestAnimationFrame(loop)
}
loop()