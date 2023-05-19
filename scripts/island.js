import { noise, noiseDetail, noiseSeed } from "./perlin.js"
import { couleur_de_couche, couches} from "./couches.js"
/*
    generer_ile(resolution, noise_scale, width, height, rayon_ile)

    Fonction qui renvoie une liste de liste de valeurs 
    correspondant à la valeur du bruit de perlin 
    par rapport sa position dans la matrice.
    Elle prend en paramètre d'entrée:
    - la résolution du dessin (très pixelisé ou peu...)
    - la taille du bruit
    - la largeur du dessin
    - la hauteur du dessin
    - le rayon approximatif de l'île 
    - le multiplicateur de la valeur du bruit
    - le nombre d'octaves
    (permettra d'avoir une seule île)
    
*/
// function generer_ile(resolution, noise_scale, width, height, rayon_ile, multiplicateur, octaves, seed, villes, forets) {
function generer_ile(params, width, height) {
    console.time("generer_ile")
    const ile = {}
    const res = params.resolution

    // Fonction qui permet de définir le nombre d'octaves du perlin noise.
    noiseDetail(params.octaves, 0.5)
    noiseSeed(params.seed)
    for(let x = 0; x < width * res; x++) {
        for(let y = 0; y < height * res; y++) {
            let n = noise(x * (1 / res) * params.noise_scale, y * (1 / res) * params.noise_scale)

            // On trouve la distance du point au centre grâce à la formule de Pythagore
            const d = Math.sqrt((x - (width * res) / 2) ** 2 + (y - (height * res) / 2) ** 2)

            // On modifie la valeur du bruit en fonction de la distance 
            // au centre et on le multiplie par le multiplicateur.
            n = (n - d / params.rayon_ile) * params.multiplicateur
            if(n < 0.01) continue
            const { rgb, couche } = couleur_de_couche(n)
            if(ile[couche] === undefined) ile[couche] = []
            if(ile[couche][rgb] === undefined) ile[couche][rgb] = []
            ile[couche][rgb].push({
                x: x * (1 / res),
                y: y * (1 / res),
                n
            });
        }
    }

    const zones = {
        villes: [],
        foret: []
    }

    noiseSeed(-params.seed)
    for(const couleurs in ile["HERBE"]) {
        for(const point of ile["HERBE"][couleurs]) {
            let n = noise(point.x * params.noise_scale, point.y * params.noise_scale)
            if(n > params.villes / 100) {
                point.biome = "ville",
                zones.villes.push(point)
            } else if(n > params.forets / 100) {
                point.biome = "foret"
                zones.foret.push(point)
            } else point.biome = "plaine"
        }
    }

    console.timeEnd("generer_ile")
    return { ile, zones }
}

/*

    dessiner_ile(ctx, resolution, island, octaves)

    Fonction qui dessine sur un canvas les valeurs 
    de l'île avec une couleur qui est obtenu grâce
    à sa hauteur. Le paramètre d'entrée "octaves"
    ajuste la différence entre chaque hauteur.

*/

function dessiner_ile(ctx, resolution, island, couleurs, biomes) {
    console.time("dessiner_ile")

    // On déssine l'océan mais derrière comme on le dessine en premier
    ctx.fillStyle = couleurs ? "rgb(0, 60, 150 )" : "rgb(0, 0, 0)"
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    for(const couche in island) {
        for(const rgb in island[couche]) {
            if(couleurs) ctx.fillStyle = rgb
            for(const point of island[couche][rgb]) {
                if(!couleurs) {
                    const rgb = Math.floor(point.n * 255)
                    ctx.fillStyle = `rgb(${rgb}, ${rgb}, ${rgb})`
                } else if(couche === "HERBE" && biomes) {
                    // if(point.biome === "ville") ctx.fillStyle = "rgb(235, 69, 158)"
                    if(point.biome === "foret") ctx.fillStyle = "rgb(87, 242, 135)"
                    else ctx.fillStyle = "rgb(254, 231, 92)"
                }
                ctx.fillRect(point.x, point.y, 1 / resolution, 1 / resolution)
            }
        }
    }
    console.timeEnd("dessiner_ile")
    console.log(couches)
}

/*

    new_canvas_ctx(width, height)

    Fonction qui créer un élément canvas dans 
    la page et renvoie son context 2D (permet 
    de contrôler le canvas).

*/

function new_canvas_ctx(width, height) {
    const otherIsland = document.querySelector("canvas.island")
    if(otherIsland) otherIsland.remove()

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    canvas.classList.add("island")
    document.body.appendChild(canvas)
    console.debug("canvas created")
    return canvas.getContext("2d")
}

export { new_canvas_ctx, generer_ile, dessiner_ile, couches }