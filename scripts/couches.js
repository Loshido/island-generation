const event = new Event("couches-changed")

let lastRegeneration = Date.now()
function call_regeneration(dt) {
    const now = Date.now()
    if(dt === null || lastRegeneration + dt < now) {
        document.dispatchEvent(event)
        lastRegeneration = now
    }
}

/////////////////////////////////////////////////////////////
// document.dispatchEvent(event) permet de régénerer l'île //
/////////////////////////////////////////////////////////////

const couches = {}
couches["NEIGE"] = {max: 100.0, min: 0.85, colors: [255, 255, 255], range: 41, speed: 0.4}
couches["ROCHERS"] = {max: 0.85, min: 0.7, colors: [82, 82, 82], range: 41, speed: 0.6}
couches["HERBE"] = {max: 0.7, min: 0.415, colors: [70, 110, 70], range: 50, speed: 1}
couches["TERRE"] = {max: 0.415, min: 0.395, colors: [119, 63, 41], range: 41, speed: 1}
couches["SABLE"] = {max: 0.395, min: 0.311, colors: [235, 235, 205], range: 50, speed: 0.8}
couches["MER"] = {max: 0.311, min: 0.01, colors: [0, 60, 150], range: 55, speed: 0.3}
couches["OCEAN"] = {max: 0.01, min: -100.0, colors: [0, 75, 171], range: 0, speed: 0.2}
const couches_keys = Object.keys(couches)

const master = document.querySelector("section.couches-panel > div.configuration")

function toHex(n) {
    var hex = n.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

function paramsNode(inputs, Couche, nodes) {
    const { rect, node } = nodes
    const params = document.createElement("div")
    params.classList.add("params")

    const { min, colors, range } = inputs

    params.innerHTML = `
        <div class="indices">
            <h2>indices</h2>
            <input type="number" class="min" min="0" max="100" step="1">
        </div>
        <div class="colors">
            <h2>couleurs</h2>
            <div class="inputs">
                <input type="color">
                +
                <input type="number" step="1" max="255" min="0">
            </div>
        </div>`

    const minInput = params.querySelector(".min")
    const colorInput = params.querySelector(".colors input[type=color]")
    const rangeInput = params.querySelector(".colors input[type=number]")


    
    minInput.value = min * 100
    minInput.addEventListener("input", () => {
        const value = parseInt(minInput.value) / 100
        couches[Couche].min = value

        const previousCoucheIndex = couches_keys.findIndex(key => key === Couche) + 1
        const previousCouche = couches_keys[previousCoucheIndex]
        if(previousCouche) couches[previousCouche].max = value
        node.style.height = `${130 + (couches[Couche].max - couches[Couche].min) * 200}px`
        
        call_regeneration(50)
    })

    let lastInput = Date.now()
    colorInput.value = rgbToHex(...colors)
    colorInput.addEventListener("input", () => {
        if(Date.now() - lastInput < 200) return
        lastInput = Date.now()

        const value = hexToRgb(colorInput.value)
        couches[Couche].colors = value

        // Carré représentant la couleur de la couche
        const range = parseInt(rangeInput.value)
        const { bg, grad } = gradient(value, range)
        rect.style.background = bg
        rect.style.backgroundImage = grad

        call_regeneration(null)
    })

    rangeInput.value = range
    rangeInput.addEventListener("input", () => {
        const value = parseInt(rangeInput.value)
        couches[Couche].range = value

        // Carré représentant la couleur de la couche
        const colors = hexToRgb(colorInput.value)
        const { bg, grad } = gradient(colors, value)
        rect.style.background = bg
        rect.style.backgroundImage = grad

        call_regeneration(150)
    })
    
    return params
}

// Fonction qui créer un dégradé de couleur de la couleur de la couche de base
// et de la couleur de la couche lorsqu'elle est à son indice minimum
function gradient(color, range) {
    const rgb = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    const bg = `background: ${rgb};`
    const grad = `linear-gradient(0, ${rgb}, rgb(${color[0] - range }, ${ color[1] - range}, ${ color[2] - range }))`

    return { bg, grad }
}

function createCouche(name, inputs) {
    const node = document.createElement("div")
    node.classList.add("couche")
    node.id = name

    const rect = document.createElement("div")
    rect.classList.add("rect")
    node.appendChild(rect)

    const { bg, grad } = gradient(inputs.colors, inputs.range)
    rect.style.background = bg
    rect.style.backgroundImage = grad

    // On change la hauteur d'élément en fonction de ses indices
    // ça permet de pouvoir visualiser la taille des couches
    node.style.height = `${130 + (inputs.max - inputs.min) * 200}px`

    const data = document.createElement("div")
    data.classList.add("data")

    const h1 = document.createElement("h1")
    h1.innerText = name
    h1.style.textTransform = "capitalize"
    data.appendChild(h1)
    
    const params = paramsNode(inputs, name, {rect, node})

    data.appendChild(params)
    node.appendChild(data)
    master.appendChild(node)
}


for(const couche in couches) {
    createCouche(couche, couches[couche])
}

function get_couche(n) {
    for(const couche in couches) {
        if(couches[couche].max > n && couches[couche].min <= n) return [couche, couches[couche]]
    }
    return ["MER", "undefined"]
}

const pourcentage_entre_indice = (n, max, min) => (n - min) / (max - min)
function couleur_de_couche(n) {
    let [ couche, data ] = get_couche(n)
    if(data === undefined) return { rgb: "rgb(0, 0, 0)", couche}
    const p = pourcentage_entre_indice(n, data.max, data.min)
    
    let rgb = couche === "MER" ? [
        0 + Math.floor(25 * p),         
        60 + Math.floor(100 * p),            
        150 + Math.floor(21 * p),
    ] : data.colors.map(c => c - Math.floor(p * data.range))
    return {
        rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        couche
    }
}

export { couleur_de_couche, couches }