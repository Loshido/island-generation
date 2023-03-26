import { noise } from "./perlin.js"
/*
    generer_ile(resolution, noise_scale, width, height, rayon_ile)
mo
    Fonction qui renvoie une liste de liste de valeurs 
    correspondant à la valeur du bruit de perlin 
    par rapport sa position dans la matrice.
    Elle prend en paramètre d'entrée:
    - la résolution du dessin (très pixelisé ou peu...)
    - la taille du bruit
    - la largeur du dessin
    - la hauteur du dessin
    - le rayon approximatif de l'île 
    (permettra d'avoir une seule île)
    
*/
function generer_ile(resolution, noise_scale, width, height, rayon_ile, multiplicateur, densite) {
    console.debug("fn - generer_ile", {
        resolution, noise_scale,
        width, height, rayon_ile
    })
    console.time("generer_ile")
    const island = []
    const arbres = []
    for(let x = 0; x < width * resolution; x++) {
        for(let y = 0; y < height * resolution; y++) {
            let n = noise(x * (1 / resolution) * noise_scale, y * (1 / resolution) * noise_scale)
            const d = Math.sqrt((x - (width * resolution) / 2) ** 2 + (y - (height * resolution) / 2) ** 2)
            n = (n - d / rayon_ile) * multiplicateur

            if (n > 0.311 && n < 0.395 && Math.floor(Math.random() * 100) == 1) {
                arbres.push({
                    x: x * (1 / resolution),
                    y: y * (1 / resolution),
                    n,
                    type: "palmier"
                })
            } else {
                const couleur =  couleur_de_couche(n)
                if(island[couleur] == undefined) island[couleur] = []
                island[couleur].push({
                    x: x * (1 / resolution),
                    y: y * (1 / resolution),
                    n
                });
            }
        }
    }
    console.timeEnd("generer_ile")
    return { island, arbres }
}

const pourcentage_entre_indice = (n, max, min) => (n - min) / (max - min)
const NEIGE = {max: 100.0, min: 0.85, colors: [255, 255, 255], range: 41}
const ROCHERS = {max: 0.85, min: 0.7, colors: [82, 82, 82], range: 41}
const HERBE = {max: 0.7, min: 0.415, colors: [70, 110, 70], range: 50}
const TERRE = {max: 0.415, min: 0.395, colors: [119, 63, 41], range: 41}
const SABLE = {max: 0.395, min: 0.311, colors: [235, 235, 205], range: 50}
const EAU_CLAIRE = {max: 0.311, min: 0.01, colors: [108, 166, 206], range: 0}
const OCEAN = {max: 0.01, min: -100.0, colors: [50, 80, 175], range: 0}
const couches = Object.entries({
    NEIGE, ROCHERS, HERBE,
    TERRE, SABLE, EAU_CLAIRE,
    OCEAN
})

/*

    couleur_de_couche(n)w

    Fonction qui renvoie la couleur de la couche 
    pour une hauteur n. Elle parcourt toutes les
    couches et vérifie que n est supérieur ou 
    égale à la couche entrain d'être parcouru
    si cette condition est rempli elle renvoie
    immédiatement la couleur.

*/
function couleur_de_couche(n) {
    let couche = couches.find(couche => couche[1].max > n && couche[1].min <= n)
    const couche_name = couche[0]
    couche = couche[1]
    const p = pourcentage_entre_indice(n, couche.max, couche.min)
    
    let rgb = couche_name == "EAU_CLAIRE" ? [
        couche.colors[0] - Math.floor((1 - p) * 58),
        couche.colors[1] - Math.floor((1 - p) * 86),
        couche.colors[2] - Math.floor((1 - p) * 31)
    ] : couche.colors.map(c => c - Math.floor(p * couche.range))
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
}

/*

    dessiner_ile(ctx, resolution, island, octaves)

    Fonction qui dessine sur un canvas les valeurs 
    de l'île avec une couleur qui est obtenu grâce
    à sa hauteur. Le paramètre d'entrée "octaves"
    ajuste la différence entre chaque hauteur.

*/

function dessiner_ile(ctx, resolution, island) {
    console.debug("fn - dessiner_ile", {
        ctx, resolution, island
    })
    console.time("dessiner_ile")
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for(const couleur in island) {
        ctx.fillStyle = couleur
        for(const point of island[couleur]) {
            ctx.fillRect(point.x, point.y, 1 / resolution, 1 / resolution)
        }
    }
    console.timeEnd("dessiner_ile")
}

const palmer = new Image()
palmer.src = "./arbres/palmier.png"
function dessiner_arbres(ctx, resolution, arbres) {
    console.debug("fn - dessiner_arbres", {
        ctx, resolution, arbres
    })
    console.time("dessiner_arbres")
    for(const arbre of arbres) {
        const type = palmer
        const taille = 4 * (1 / resolution)
        ctx.drawImage(type, arbre.x - taille / 2, arbre.y - taille / 2, taille, taille)
    }
    console.timeEnd("dessiner_arbres")
}

/*

    new_canvas_ctx(width, height)

    Fonction qui créer un élément canvas dans 
    la page et renvoie son context 2D (permet 
    de contrôler le canvas).

*/

let cv = false
function new_canvas_ctx(width, height) {
    if(cv) document.querySelector("canvas").remove()
    cv = true

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    document.body.appendChild(canvas)
    console.debug("canvas created")
    return canvas.getContext("2d")
}

export { new_canvas_ctx, generer_ile, dessiner_ile, dessiner_arbres}