import { noise, noiseDetail } from "./perlin.js"

const DENSITE_NUAGE = 0.045
const couleurs = [
    "rgb(240, 240, 240)",
    "rgb(230, 230, 230)",
    "rgb(220, 220, 220)"
]
const tailles = [
    1 / 1.25,
    1 / 1.5,
    1 / 2
]

function generer_nuage() {
    noiseDetail(3, 0.5)
    console.time("generer_nuage")
    let canvas = document.getElementById("nuage");
    let ctx = canvas.getContext("2d");
    const nuage = [
        [],
        [],
        []
    ]
    if(ctx) { 
        for(let x = 0; x < 500; x++) {
            for(let y = 0; y < 500; y++) {
                let n = noise(x * DENSITE_NUAGE, y * DENSITE_NUAGE);

                if(n > 0.85 || n < 0.15) nuage[0].push({x, y})
                else if(n > 0.8 || n < 0.2) nuage[1].push({x, y})
                else if(n > 0.7 || n < 0.3) nuage[2].push({x, y})
            }
        }
        for(const index in nuage) {
            ctx.fillStyle = couleurs[index];
            for(const point of nuage[index]) {
                ctx.fillRect(point.x, point.y, tailles[index], tailles[index]);
            }
        }
    }
    console.timeEnd("generer_nuage")
}

window.addEventListener("load", generer_nuage);