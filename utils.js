const couches = {
    "1-0.74": {
        name: "Neige",
        color: [225, 225, 225],
        gradients: -50
    },
    "0.74-0.725": {
        name: "Montagne",
        color: [180, 180, 180],
        gradients: -80
    },
    "0.725-0.6": {
        name: "Roche",
        color: [82, 82, 82],
        gradients: -41
    },
    "0.6-0.575": {
        name: "Caillou",
        color: [120, 120, 120],
        gradients: -50
    },
    "0.575-0.415": {
        name: "Herbe",
        color: [39, 92, 41],
        gradients: -39
    },
    "0.415-0.375": {
        name: "Terre",
        color: [119, 63, 41],
        gradients: -41
    },
    "0.375-0.34": {
        name: "Sable",
        color: [212, 224, 103],
        gradients: -25
    },
    "0.34-0": {
        name: "Neige",
        color: [0, 0, 0],
        gradients: [0, 0, 255]
    }
}

function TrouverValeursAvecIndexCouche(index) {
    let [max, min] = index.split("-");
        [max, min] = [parseFloat(max), parseFloat(min)]
    return [max, min]
}

function TrouverCoucheAvecHauteur(couches, value) {
    for(const couche in couches) {
        const [max, min] = TrouverValeursAvecIndexCouche(couche)
        if(max >= value && min < value) return couche
    }
    return false
}

function GenererCouleurAvecCoucheEtValeur(couche, hauteurs, valeur) {
    if(typeof couche.gradients === Number) {
        couche.gradients = [couche.gradients, couche.gradients, couche.gradients]
    }
    
    const [max, min] = hauteurs
    const pourcentage_couche = (valeur - min) / (max - min)
    const color = []
    for(let i = 0; i < 3; i++) {
        let c = Math.floor(couche.color[i] + pourcentage_couche * couche.gradients[i])
        c.toString(16)
        color.push(c)
    }
    // return "rgb(" + color.join(", ") + ")"
    return color
}

// Liste des identifiants de chaque couche qui contiennent les informations sur la hauteur de la couche.
function ListeIndexCouches() {
    return Object.keys(couches)
}
