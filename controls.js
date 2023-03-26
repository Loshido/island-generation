import { noiseSeed } from "./perlin.js"

const controls = {
    seed: document.getElementById("seed"),
    noise_scale: document.getElementById("noise_scale"),
    resolution: document.getElementById("resolution"),
    rayon_ile: document.getElementById("rayon_ile"),
    multiplicateur: document.getElementById("multiplicateur"),
    octaves: document.getElementById("octaves")
}

let already_initialised = false
export default function initialisation_controls(parametres, regenerate) {
    if(already_initialised) return
    already_initialised = true

    document.getElementById("regenerate").addEventListener("click", () => {
        parametres.seed = Math.floor(Math.random() * 9999999)
        controls.seed.value = parametres.seed
        noiseSeed(parametres.seed)
        regenerate()
    })
    
    document.getElementById("cloud_speed").addEventListener("input", ev => {
        const node = document.getElementById("cloud_speed")
        const value = parseInt(node.value)
        document.querySelector(".slide").style.animationDuration = `${60 - value}s`
    })
    
    document.getElementById("couleurs").addEventListener("click", () => {
        const node = document.getElementById("couleurs")
        parametres.couleurs = !parametres.couleurs
        if(parametres.couleurs) node.setAttribute("status", "active")
        else node.attributes.removeNamedItem("status")
        regenerate()
    })
    
    for(let indice of Object.keys(controls)) {
        controls[indice].value = parametres[indice]
        controls[indice].addEventListener("input", event => {
            let value = parseFloat(controls[indice].value)
            parametres[indice] = value
            if(indice == "seed") noiseSeed(parametres.seed)
            regenerate()
        })
    }
}