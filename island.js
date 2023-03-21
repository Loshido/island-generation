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
    (permettra d'avoir une seule île)
    
*/
function generer_ile(resolution, noise_scale, width, height, rayon_ile) {
    console.debug("fn - generer_ile", {
        resolution, noise_scale,
        width, height, rayon_ile
    })
    console.time("generer_ile")
    const ile = []
    for(let x = 0; x < width * resolution; x++) {
        const row = []
        for(let y = 0; y < height * resolution; y++) {
            let n = noise(x * (1 / resolution) * noise_scale, y * (1 / resolution) * noise_scale)
            const d = Math.sqrt((x - (w * resolution) / 2) ** 2 + (y - (h * resolution) / 2) ** 2)
            n = n - d / rayon_ile
            
            row.push(n)
        }
        ile.push(row)
    }
    console.timeEnd("generer_ile")
    return ile
}

/*
    couches = {}

    Matrice des couches, 
    il s'agit d'un objet contenant des fonctions 
    qui renvoie la couleur pour une hauteur n.

    ps: Un objet permet de contenir plusieurs 
    variables accéssible par des "clés" (keys), 
    sous cette forme :

    let objet = {
        key: true,
        "en chaine de caractère": n => n
    }
    objet.key // true
    objet["en chaine de caractère"](10) // 10 

    Vous devez également savoir que en JavaScript
    une variable peut contenir une fonction sous 
    la forme fléchée ou traditionnele :
    
    let x = (n) => n + 1
    let y = function(n) {
        return n + 2
    }
    console.log(x(10)) // 11
    console.log(y(12)) // 14

*/
const pourcentage_entre_indice = (n, max, min) => (n - min) / (max - min)
const couches = {
    "0.74": n => {
        let rgb = Math.floor(255 - n * 50).toString()
        return `rgb(${ rgb }, ${ rgb }, ${ rgb })` // Neige
    },
    "0.725": n => {
        const p = Math.floor(pourcentage_entre_indice(n, 0.74, 0.725) * 80)
        let rgb = 180 - p
        return `rgb(${ rgb }, ${ rgb }, ${ rgb })` // Montagne
    },
    "0.6": n => {
        const p = Math.floor(pourcentage_entre_indice(n, 0.725, 0.6) * 41)
        let rgb = (82 - p).toString()
        return `rgb(${ rgb }, ${ rgb }, ${ rgb })` // Rochers
    },
    "0.575": n => {
        const p = Math.floor(pourcentage_entre_indice(n, 0.6, 0.575) * 50)
        let rgb = 120 - p
        return `rgb(${ rgb }, ${ rgb }, ${ rgb })` // Cailloux
    },
    "0.415": n => {
        const p = Math.floor(pourcentage_entre_indice(n, 0.575, 0.415) * 50)
        let rgb = [70 - p, 110 - p, 70 - p]
        return "rgb(" + rgb.join(",") + ")" // Herbe
    },
    "0.375": n => {
        const p = Math.floor(pourcentage_entre_indice(n, 0.415, 0.375) * 41)
        let rgb = [119 - p, 63 - p, 41 - p]
        return "rgb(" + rgb.join(",") + ")" // Terre
    },
    "0.34": n => {
        const p = pourcentage_entre_indice(n, 0.375, 0.34)
        let rgb = [
            235 - Math.floor(p * 50),
            235 - Math.floor(p * 75),
            205 - Math.floor(p * 25)
        ]
        return "rgb(" + rgb.join(",") + ")" // Sable
    },
    "0.01": n => {
        const p = pourcentage_entre_indice(n, 0.01, 0.34)
        let rgb = [
            0,
            75,
            255 - Math.floor(p * (255 - 200))
        ]
        return "rgb(" + rgb.join(",") + ")" // Mer
    },
    "-100.0": () => "rgb(25, 75, 200)" // Ocean
}

/*

    couleur_de_couche(n)

    Fonction qui renvoie la couleur de la couche 
    pour une hauteur n. Elle parcourt toutes les
    couches et vérifie que n est supérieur ou 
    égale à la couche entrain d'être parcouru
    si cette condition est rempli elle renvoie
    immédiatement la couleur.

    ps: la fonction "parseFloat" permet de 
    transformer une valeur de type chaine 
    de caractère (ou autre) directement en float;
    tel que :

    parseFloat("1.0") // 1.0
    parseFloat(true) // NaN

*/
function couleur_de_couche(n) {
    for(const couche in couches) {
        const h = parseFloat(couche)
        if(n >= h) return couches[couche](n)
    }
}

/*

    dessiner_ile(ctx, resolution, island, octaves)

    Fonction qui dessine sur un canvas les valeurs 
    de l'île avec une couleur qui est obtenu grâce
    à sa hauteur. Le paramètre d'entrée "octaves"
    ajuste la différence entre chaque hauteur.

*/

function dessiner_ile(ctx, resolution, island, octaves) {
    console.debug("fn - dessiner_ile", {
        ctx, resolution, island, octaves
    })
    console.time("dessiner_ile")
    for(const x in island) {
        for(const y in island[x]) {
            const n = island[x][y] * octaves
            ctx.fillStyle = couleur_de_couche(n)
            ctx.fillRect(x * (1 / resolution), y * (1 / resolution), 1 / resolution, 1 / resolution)
        }
    }
    console.timeEnd("dessiner_ile")
}

/*

    new_canvas_ctx(width, height)

    Fonction qui créer un élément canvas dans 
    la page et renvoie son context 2D (permet 
    de contrôler le canvas).

*/

let cv = false
function new_canvas_ctx(width, height) {
    if(cv) document.getElementById("island").remove()
    cv = true

    const canvas = document.createElement("canvas")
    canvas.id = "island"
    canvas.width = width
    canvas.height = height
    document.body.appendChild(canvas)
    console.debug("canvas created")
    return canvas.getContext("2d")
}