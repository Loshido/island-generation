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
// variable qui permet de ne pas réinitialiser les controls à chaque fois qu'on génère une nouvelle île

// "export default" permet d'exporter la fonction initialisation_controls
// afin de la récuperer un autre fichier de cette façon `import initialisation_controls from "./controls.js"`
export default function initialisation_controls(parametres, regenerate) {
    if(already_initialised) return
    already_initialised = true

    document.getElementById("regenerate").addEventListener("click", () => {
        // Génération d'un nombre aléatoire entre 0 et 9999999
        parametres.seed = Math.floor(Math.random() * 9999999)
        controls.seed.value = parametres.seed
        
        // On change la seed pour changer la génération du bruit dans le fichier perlin.js
        noiseSeed(parametres.seed)

        // On regénère et redessine l'île pour faire apparaitre les changements
        regenerate() 
    })
    
    document.getElementById("cloud_speed").addEventListener("input", ev => {
        const node = document.getElementById("cloud_speed")

        // On récupère la valeur de l'entrée IHM
        const value = parseInt(node.value)

        // On change la durée de l'animation sur les nuages
        // ça permet de les faire bouger plus ou moins vite
        document.querySelector(".slide").style.animationDuration = `${60 - value}s`
    })
    
    document.getElementById("couleurs").addEventListener("click", () => {
        const node = document.getElementById("couleurs")

        // Tips pour inverser la valeur d'une variable booléenne
        parametres.couleurs = !parametres.couleurs

        // On ajoute ou on supprime l'attribut "status" de la balise "couleurs" 
        // plutôt qu'utiliser une variable afin de pouvoir changer la vitesse 
        // des nuages depuis partout dans le js
        if(parametres.couleurs) node.setAttribute("status", "active")
        else node.attributes.removeNamedItem("status")
        regenerate()
    })
    
    // On parcourt les entrées du tableau "controls" afin de les initialiser
    for(let indice of Object.keys(controls)) {
        controls[indice].value = parametres[indice]
        
        // On ajoute un écouteur d'événement sur chaque entrée
        controls[indice].addEventListener("input", event => {
            let value = parseFloat(controls[indice].value)
            parametres[indice] = value
            if(indice == "seed") noiseSeed(parametres.seed)
            regenerate()
        })
    }
}