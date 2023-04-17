import { dessiner_image, maisons, arbres, images, charger_images } from "./sprites.js"

const DENSITE_FORET = 0.075;
// const DENSITE_VILLES = 0.1;
const DENSITE_PALMIERS = 0.0125

function generer_biomes(ctx, resolution, zones) {
    console.time("generer_biomes")
    // Forêts,
    generer_zone(ctx, zones.forets, resolution * 2, arbres.forets, DENSITE_FORET)

    // Villes
    // generer_zone(ctx, zones.villes, resolution * 5, maisons, DENSITE_VILLES)

    // Palmiers
    let palmiers = []
    for(const couleurs in zones.palmiers) {
        palmiers.push(...zones.palmiers[couleurs])
    }
    generer_zone(ctx, palmiers, resolution * 2, arbres.palmiers, DENSITE_PALMIERS)
    console.timeEnd("generer_biomes")
}

function generer_zone(ctx, zone, resolution, sprites, densite) {
    const positions_sprites = {}
    for(const sprite in sprites) {
        positions_sprites[sprites[sprite].file] = []
    }

    for(const point of zone) {
        if(Math.random() < densite) {
            const sprite = sprites[Math.floor(Math.random() * sprites.length)]
            positions_sprites[sprite.file].push({
                x: point.x, 
                y: point.y,
                width: sprite.width,
                height: sprite.height
            })
        }
    }

    for(const sprite in positions_sprites) {
        charger_images([sprite], () => {
            for(const position of positions_sprites[sprite]) {
                dessiner_image(ctx, images[sprite], position.x, position.y, position.width * resolution, position.height * resolution)
            }
        })
    }
}

export { generer_biomes }