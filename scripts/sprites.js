var images = {}

function charger_images(arr, callback) {
    let nb_image_charge = 0;
    for (let i = 0; i < arr.length; i++){
        const img = new Image();
        img.onload = image_charge;
        img.src = arr[i];
        images[arr[i]] = img;
    }
    
    function image_charge() {
        nb_image_charge++;
        if (nb_image_charge >= arr.length) callback();
    }
}

let chargees = false
function dessiner_image(ctx, image, x, y, width, height) {
    ctx.drawImage(image, x, y, width, height)
}

const maisons = [
    {
        file: "../assets/maison1.png",
        width: 21,
        height: 20
    },
    {
        file: "../assets/maison2.png",
        width: 20,
        height: 17
    },
    {
        file: "../assets/maison3.png",
        width: 22,
        height: 22
    },
    {
        file: "../assets/maison4.png",
        width: 21,
        height: 22
    }
]
const arbres = {
    palmiers: [
        {
            file: "../assets/palmier.png",
            width: 37,
            height: 34
        },
        {
            file: "../assets/palmier2.png",
            width: 37,
            height: 34
        }
    ],
    forets: [
        {
            file: "../assets/arbre.png",
            width: 35,
            height: 38
        },
        {
            file: "../assets/arbre1.png",
            width: 30,
            height: 30
        },
        {
            file: "../assets/arbre2.png",
            width: 30,
            height: 30
        },
        {
            file: "../assets/arbre3.png",
            width: 30,
            height: 30
        },
        {
            file: "../assets/arbre4.png",
            width: 30,
            height: 30
        }
    ]
}

export { charger_images, images, dessiner_image, maisons, arbres }