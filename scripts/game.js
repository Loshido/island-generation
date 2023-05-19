import { couches } from "./island.js"

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if ("code" in e) {
        switch(e.code) {
            case "Unidentified":
                break;
            case "ArrowRight":
            case "Right": // IE <= 9 and FF <= 36
            case "KeyD":
                rightPressed = true;
                return;
            case "ArrowLeft":
            case "Left": // IE <= 9 and FF <= 36
            case "KeyA":
                leftPressed = true;
                return;
            case "ArrowUp":
            case "Up": // IE <= 9 and FF <= 36
            case "KeyW":
                upPressed = true;
                return;
            case "ArrowDown":
            case "Down": // IE <= 9 and FF <= 36
            case "KeyS":
                downPressed = true;
                return;
            default:
                return;
        }
    }
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
    if(e.keyCode == 40) {
        downPressed = true;
    }
    else if(e.keyCode == 38) {
        upPressed = true;
    }
}
function keyUpHandler(e) {
    if ("code" in e) {
        switch(e.code) {
            case "Unidentified":
                break;
            case "ArrowRight":
            case "Right": // IE <= 9 and FF <= 36
            case "KeyD":
                rightPressed = false;
                return;
            case "ArrowLeft":
            case "Left": // IE <= 9 and FF <= 36
            case "KeyA":
                leftPressed = false;
                return;
            case "ArrowUp":
            case "Up": // IE <= 9 and FF <= 36
            case "KeyW":
                upPressed = false;
                return;
            case "ArrowDown":
            case "Down": // IE <= 9 and FF <= 36
            case "KeyS":
                downPressed = false;
                return;
            default:
                return;
        }
    }
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
    if(e.keyCode == 40) {
        downPressed = false;
    }
    else if(e.keyCode == 38) {
        upPressed = false;
    }
}

export default function game(resolution, island, w, h) {
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    canvas.id = "game"
    document.body.append(canvas)
    
    const ctx = canvas.getContext("2d")
    ctx.imageSmoothingEnabled = false

    const ile = []
    for(const couches in island) {
        for(const couleurs in island[couches]) {
            for(const point of island[couches][couleurs]) {
                if(ile[point.x] === undefined) ile[point.x] = []
                ile[point.x][point.y] = point.n
            }
        }
    }
    
    const biomes = {}
    for(const couche in couches) {
        const name = couches[couche][0]
        biomes[name] = {
            max: couches[couche][1].max,
            min: couches[couche][1].min,
            speed: couches[couche][1].speed,
        }
    }
    
    let speed = 1
    function getSpeedfromBiome(n) {
        if(n === undefined) return speed
        for(const biome in biomes) {
            if(n >= biomes[biome].min && n <= biomes[biome].max) return biomes[biome].speed
        }
        return speed
    }

    
    let [x, y] = [w / 2, h / 2]
    console.log(x, y)

    function draw() {
        ctx.clearRect(0, 0, w, h)

        const nx = ile[Math.round(x)]
        if(nx !== undefined) {
            const n = nx[Math.round(y)]
            speed = getSpeedfromBiome(n)
        }
        
        if(rightPressed) x += (1 / resolution / 10) * speed;
        else if(leftPressed) x -= (1 / resolution / 10) * speed;
        if(downPressed) y += (1 / resolution / 10) * speed;
        else if(upPressed) y -= (1 / resolution / 10) * speed;
        
        ctx.fillStyle = "red"
        ctx.fillRect(x, y, 2 * 1 / resolution, 2 * 1 / resolution)

        requestAnimationFrame(draw)
    }
    draw()
}