import { noise } from "./perlin.js"

const DENSITE_NUAGE = 0.09
function generer_nuage() {
    console.time("generer_nuage")
    let canvas = document.getElementById("nuage");
    let ctx = canvas.getContext("2d");
    if(ctx) { 
        for(let x = 0; x < 500; x++) {
            for(let y = 0; y < 500; y++) {
                let n = noise(x * DENSITE_NUAGE, y * DENSITE_NUAGE);

                if(n > 0.85) { 
                    ctx.fillStyle = "rgba( 240, 240, 240, 1)";
                    ctx.fillRect(x, y, 1 / 1.25, 1 / 1.25);
                }
                else if(n > 0.8){
                    ctx.fillStyle = "rgba( 230, 230, 230, 1)";
                    ctx.fillRect(x, y, 1 / 1.5, 1 / 1.5);
                }
                else if(n > 0.7){
                    ctx.fillStyle = "rgba( 220, 220, 220, 1)";
                    ctx.fillRect(x, y, 1 / 2, 1 / 2);
                }

            }
        }
    }
    console.timeEnd("generer_nuage")
}

window.addEventListener("load", generer_nuage);