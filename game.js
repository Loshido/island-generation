let [top, left] = [0, 0]
const INTERVALLE = 15
const users = []

function stepY(canvas, value) {
    if(top + value > canvas.height * 1.5 || top + value < -canvas.height * 1.5) return
    top += value
    canvas.style.top = `${top}px`
}

function stepX(canvas, value) {
    if(left + value > canvas.width * 1.5 || left + value < -canvas.width * 1.5) return
    left += value
    canvas.style.left = `${left}px`
}

const keys = {
    "z": function(canvas) {
        stepY(canvas, INTERVALLE)
    },
    "s": function(canvas) {
        stepY(canvas, -INTERVALLE)
    },
    "d": function(canvas) {
        stepX(canvas, -INTERVALLE)
    },
    "q": function(canvas) {
        stepX(canvas, INTERVALLE)
    },
    "x": function(canvas) {
        users.forEach(user => document.getElementById(user).remove())
        canvas.classList.remove("playing")
        document.removeEventListener("keypress", gameStart)
        document.body.classList.remove("playing")
    }
}

function gameStart() {
    const canvas = document.getElementById("island")
    canvas.classList.add("playing")
    document.body.classList.add("playing")
    setTimeout(() => {
        createUser("rgb(255, 0, 0)", 10, 10, "user1")
        document.addEventListener("keypress", ev => {
            keys[ev.key](canvas)
        })
    }, 500);
}

function createUser(color, width, height, name) {
    const [w, h] = [window.innerWidth, window.innerHeight]
    const user = document.createElement("canvas")
    user.id = name
    user.classList.add("user")
    user.width = w
    user.height = h
    document.body.appendChild(user)
    const ctx = user.getContext("2d")
    ctx.fillStyle = color
    ctx.fillRect(w / 2 - width / 2, h / 2 - height / 2, width, height)
    
    users.push(name)
    return ctx
}

export { gameStart }