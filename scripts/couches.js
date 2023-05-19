const NEIGE = {max: 100.0, min: 0.85, colors: [255, 255, 255], range: 41, speed: 0.4}
const ROCHERS = {max: 0.85, min: 0.7, colors: [82, 82, 82], range: 41, speed: 0.6}
const HERBE = {max: 0.7, min: 0.415, colors: [70, 110, 70], range: 50, speed: 1}
const TERRE = {max: 0.415, min: 0.395, colors: [119, 63, 41], range: 41, speed: 1}
const SABLE = {max: 0.395, min: 0.311, colors: [235, 235, 205], range: 50, speed: 0.8}
const MER = {max: 0.311, min: 0.01, colors: [0, 60, 150], range: 55, speed: 0.3}
const OCEAN = {max: 0.01, min: -100.0, colors: [0, 75, 171], range: 0, speed: 0.2}

const couches = Object.entries({
    NEIGE, ROCHERS, HERBE,
    TERRE, SABLE, MER,
    OCEAN
})

const master = document.querySelector("section.couches-panel > div.configuration")

function toHex(n) {
    var hex = n.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgbToHex(r, g, b) {
    return "#" + toHex(r) + toHex(g) + toHex(b);
}

function hexToRgb(hex) {
    // StackOverflow -> stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return [r, g, b]
}

function paramsNode(inputs) {
    const params = document.createElement("div")
    params.classList.add("params")

    const { min, color, range } = inputs

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
    colorInput.value = rgbToHex(...color)
    rangeInput.value = range

    // Il faudrait que lorsque les valeurs de minInput, colorInput, rangeInput changent, 
    // les valeurs de la variable "couches" changent aussi.
    // On peut utiliser l'événement "input"

    // De plus attention j'ai mis x100 à l'indice pour que ça soit plus lisible. 
    // Ducoup faut bien diviser par 100 lorsqu'on met dans "couches"

    // ensuite il faut faire en sorte que lorsque que l'on change la valeur d'un indice, l'indice au dessus sois inférieur 
    // donc par exemple if(indice > indice_dessus) indice = indice - 5

    // Enfin faudra changer la hauteur de l'élément en fonction de ses indices 
    // avec node.style.height = `${130 + (inputs.max - inputs.min) * 200}px`
    // tel que node est obtenable par document.getElementById("nom_de_la_couche")
    // et que inputs.max et inputs.min sont les indices de la couche
    // 130 c'est la valeur minimum et 200 c'est pour multiplier par 100 et 2 pour avoir une hauteur correcte

    // Et faudra également changer le dégradé de couleur de la couche à chaque fois qu'on change la couleur ou le "range" (juste à coté de la couleur)
    // avec const { bg, grad } = gradient(inputs.color, inputs.range)
    // et ensuite rect.style.background = bg et rect.style.backgroundImage = grad
    // tel que rect est obtenable par document.querySelector("#nom_de_la_couche > .rect")

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

    const { bg, grad } = gradient(inputs.color, inputs.range)
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
    
    const params = paramsNode(inputs, name)

    data.appendChild(params)
    node.appendChild(data)
    master.appendChild(node)
}

couches.forEach(([name, inputs]) => createCouche(name, {
    max: inputs.max,
    min: inputs.min,
    color: inputs.colors,
    range: inputs.range
}))

const pourcentage_entre_indice = (n, max, min) => (n - min) / (max - min)

function couleur_de_couche(n) {
    let couche = couches.find(couche => couche[1].max > n && couche[1].min <= n)
    const couche_name = couche[0]
    couche = couche[1]
    const p = pourcentage_entre_indice(n, couche.max, couche.min)
    
    let rgb = couche_name === "MER" ? [
        0 + Math.floor(25 * p),         
        60 + Math.floor(100 * p),            
        150 + Math.floor(21 * p),
    ] : couche.colors.map(c => c - Math.floor(p * couche.range))
    return {
        rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
        couche: couche_name
    }
}

export { couleur_de_couche, couches }