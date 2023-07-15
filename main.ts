const canvas = document.createElement('canvas') as HTMLCanvasElement
canvas.width = 300
canvas.height = 580
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

const PLAYER_WIDTH: number = 10
const PLAYER_HEIGHT: number = 10
const OBSTACLE_HEIGHT: number = 20
const OBSTACLE_WIDTH: number = 60

const ENEMIES = [3, 4, 5]

type ObstableType = {
    type: number
    width: number
    height: number
    x: number
    y: number
}

class Scene {
    private mapList: Array<Array<number>>
    public obstacles: Array<ObstableType> = []
    constructor() {
        this.mapList = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 1, 0, 0, 1],
            [0, 0, 0, 0, 0],
        ]

        this.obstacles = this.init()
    }

    init() {
        const arr: Array<ObstableType> = []
        const all = this.mapList

        for (const idx in all) {
            for (const idxX in all[idx]) {
                const value = all[idx][idxX]

                const obj: ObstableType = {
                    type: value,
                    y: OBSTACLE_HEIGHT * parseInt(idx),
                    x: OBSTACLE_WIDTH * parseInt(idxX),
                    width: OBSTACLE_WIDTH,
                    height: OBSTACLE_HEIGHT
                }

                arr.push(obj)
            }
        }

        return arr
    }

    updateObstables(obstacles: Array<ObstableType>) {
        this.obstacles = obstacles
    }

    getObstables(): Array<ObstableType> {
        return this.obstacles
    }

    vector(): Array<Array<number>> {

        return this.mapList
    }

    appendVectorToTop(arr: Array<number>) {
        this.mapList = [arr, ...this.mapList]
    }
}

type PlayerType = {
    x: number,
    y: number,
    height: number,
    width: number,
}

class Player {
    private x: number
    private gravity: number = 0.1
    private y: number
    private accumulatorGravity: number = 0
    private height: number
    private width: number
    private jump: boolean = false
    private move: number = 2

    private right: boolean;
    private left: boolean;

    constructor({ x, y, width, height }: PlayerType) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }

    getMove() {
        return this.move
    }

    setMove(n: number) {
        this.move = n
    }

    getRight() {
        return this.right
    }

    getLeft() {
        return this.left
    }

    setRight(b: boolean) {
        this.right = b
    }

    setLeft(b: boolean) {
        this.left = b
    }

    getGravity() {
        return this.gravity
    }

    setJump(b: boolean) {
        this.jump = b
    }

    isJump() {
        return this.jump
    }

    setAccumulatorGravity(acc: number) {
        this.accumulatorGravity = acc
    }

    getAccumulatorGravity() {
        return this.accumulatorGravity
    }

    getX() {
        return this.x
    }

    setX(x: number) {
        this.x = x
    }

    getY() {
        return this.y
    }

    setY(y: number) {
        this.y = y
    }

    getW() {
        return this.width
    }

    getH() {
        return this.height
    }
}

const mapScene = new Scene()


const myPlayer: PlayerType = {
    x: 10,
    y: mapScene.obstacles[0].y - mapScene.obstacles[0].height,
    height: PLAYER_HEIGHT,
    width: PLAYER_WIDTH
}

const player = new Player(myPlayer)

function renderPlayer() {
    ctx.fillStyle = 'red'
    ctx.fillRect(player.getX(), player.getY(), player.getW(), player.getH())
}

function renderEnemies() {

    for (const ob of mapScene.obstacles) {
        if (ob.type === 3) {
            ctx.fillStyle = 'green'
            ctx.fillRect(ob.x, ob.y, ob.width, ob.height)
        }
    }
}

function renderMapScene() {

    for (const ob of mapScene.obstacles) {
        if (ob.type === 1) {
            ctx.fillStyle = 'blue'
            ctx.fillRect(ob.x, ob.y, ob.width, ob.height)
        }

        if (ob.type === 2) {
            ctx.fillStyle = 'red'
            ctx.fillRect(ob.x, ob.y, ob.width, ob.height)
        }

        if (ob.type === 0) {
            ctx.fillStyle = 'black'
            ctx.fillRect(ob.x, ob.y, ob.width, ob.height)
        }
    }
}

type ObjectCollideType = {
    top: boolean
    bottom: boolean
    left: boolean
    right: boolean
}

class World {
    private player: Player

    constructor(
        player: Player
    ) {
        this.player = player
    }

    checkObstacleCollide(a: Player, b: ObstableType) {

        return !(
            ((a.getY() + a.getH()) < (b.y)) ||
            (a.getY() > (b.y + b.height)) ||
            ((a.getX() + a.getW()) < b.x) ||
            (a.getX() > (b.x + b.width))
        );
    }

    collide(personagem: Player, barra: ObstableType) {

        const distX = (personagem.getX() + personagem.getW() / 2) - (barra.x + barra.width / 2)
        const distY = (personagem.getY() + personagem.getH() / 2) - (barra.y + barra.height / 2)

        const sumW = (personagem.getW() + barra.width) / 2
        const sumH = (personagem.getH() + barra.height) / 2

        if (Math.abs(distX) < sumW && Math.abs(distY) < sumH) {

            const overX = sumW - Math.abs(distX)
            const overY = sumH - Math.abs(distY)

            if (overX > overY) {
                personagem.setAccumulatorGravity(0.8)

                if (distY > 0) {
                    const y = personagem.getY() + overY
                    personagem.setY(y)
                }
                else {
                    const y = personagem.getY() - (overY)
                    personagem.setY(y)
                }

                console.log('overX')

            }

            if (overY > overX) {
                if (distX > 0) {
                    const x = personagem.getX() + overX
                    personagem.setX(x)
                }
                else {
                    const x = personagem.getX() - overX
                    personagem.setX(x)
                }

                console.log('overY')
            }
        }
    }

    handleGravity() {
        const acc = this.player.getAccumulatorGravity() + player.getGravity()
        this.player.setAccumulatorGravity(acc)
        this.player.setY(this.player.getY() + this.player.getAccumulatorGravity())
    }

    checkCollideObstacle() {

        if (this.player.isJump()) {
            this.player.setY(this.player.getY() - 1)

            this.player.setAccumulatorGravity(this.player.getGravity() * -35)
            this.player.setJump(false)
            return
        }

        for (const obstacle of mapScene.obstacles) {
            if (obstacle.type === 0) continue

            // if (this.checkObstacleCollide(player, obstacle)) {
            this.collide(player, obstacle)
            // }
        }

        this.handleGravity()
    }
}

const world = new World(player)

function update() {
    const move = 2
    if (player.getRight()) {
        player.setX(player.getX() + move)
    }

    if (player.getLeft()) {
        player.setX(player.getX() - move)
    }
}


function handlePlartformDown() {
    const c = [0, 0, 0, 0, 0]

    const n = Number(Math.floor(Math.random() * c.length))

    let arr = []

    let i = 0;

    while (i < n) {
        const na = Number(Math.floor(Math.random() * c.length)) as never

        if (i >= n) {
            break
        }

        if (!arr.includes(na)) {
            arr.push(na)
            i++
        }
    }

    for (const p of arr) {
        c[p] = 2
    }

    return c
}

setInterval(() => {
    const params = handlePlartformDown()

    const pa: ObstableType[] = []

    for (let i in params) {

        if (params[i] !== 0) {

            const o: ObstableType = {
                type: 1,
                y: OBSTACLE_HEIGHT,
                x: OBSTACLE_WIDTH * parseInt(i),
                width: OBSTACLE_WIDTH,
                height: OBSTACLE_HEIGHT
            }

            pa.push(o)
        }
    }

    mapScene.obstacles = [...pa, ...mapScene.obstacles]
}, 1000)

function moveAllPlatforms() {
    for (const i in mapScene.obstacles) {
        mapScene.obstacles[i].y += 0.5
    }
}

function loop() {

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    renderMapScene()
    renderEnemies()

    renderPlayer()
    world.checkCollideObstacle()
    moveAllPlatforms()

    update()
    requestAnimationFrame(loop)
}

loop()

document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') {
        player.setLeft(false)
        player.setRight(false)
    }

    if (e.code === 'ArrowRight') {
        player.setLeft(false)
        player.setRight(false)
    }

})

document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft') {
        player.setLeft(true)
        player.setRight(false)
    }

    if (e.code === 'ArrowRight') {
        player.setRight(true)
        player.setLeft(false)

    }

    if (e.code === 'Space') {
        player.setJump(true)
    }
})

document.body.appendChild(canvas)