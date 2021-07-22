// Objet diaporama
var Diaporama = {
    items: document.getElementsByClassName("item"), // Attribut de s�lection des figures
    imageNum: 0, // Attribut qui permet de parcourir les images


    // M�thode qui r�cup�re les touches du clavier et actionne le diaporama en fonction de la touche
    infosClavier: function (e) {
        if (e.keyCode === 39) {
            document.addEventListener("keydown", this.suivant()); // Appui sur la touche =>
        } else if (e.keyCode === 37) {
            document.addEventListener("keydown", this.precedent()); // Appui sur la touche <=
        }
    },

    // M�thode qui fait fonctionner le diaporama en avant
    suivant: function () {
        this.items[this.imageNum].style.opacity = "0"; // Fait dispara�tre l'image active
        if (this.imageNum === 4) { // Si le diaporama est � la derni�re image
            this.imageNum = 0; // On repasse l'attribut � 0 pour faire r�appara�tre la premi�re image
        } else { // Sinon on passe � l'image suivante
            this.imageNum++; // En augmentant de 1 l'attribut
        }
        this.items[this.imageNum].style.opacity = "1"; // Fait appara�tre l'image suivante
        
    },

    // M�thode qui fait fonctionner le diaporama en arri�re
    precedent: function () {
        this.items[this.imageNum].style.opacity = "0"; // Fait dispara�tre l'image active
        if (this.imageNum === 0) { // Si le diaporama est � la premi�re image
            this.imageNum = 4; // On passe l'attribut � 4 pour faire r�appara�tre l'image pr�c�dente
        } else { // Sinon on passe � l'image pr�c�dente
            this.imageNum--; // En diminuant de 1 la valeur de l'attribut
        }
        this.items[this.imageNum].style.opacity = "1"; // Fait appara�tre l'image pr�c�dente
    },

    pause: function () {
        document.querySelector('#pause').classList.add("d-none");
        document.querySelector('#play').classList.remove("d-none");
        clearInterval(timer);
    },

    play: function () {
        document.querySelector('#play').classList.add("d-none");
        document.querySelector('#pause').classList.remove("d-none");
        timer = setInterval(Diaporama.suivant.bind(Diaporama), 5000);

    }

}
timer = setInterval(Diaporama.suivant.bind(Diaporama), 5000);

// Le bouton droit appel la m�thode "suivant" du diaporama
document.getElementById("bouttonDroit").addEventListener("click", Diaporama.suivant.bind(Diaporama));
//bouton pause pour stop le timer qui appel la m�thode pause
document.getElementById("pause").addEventListener("click", Diaporama.pause.bind(Diaporama));
//bouton play pour redemarrer le timer qui appel la m�thode play
document.getElementById("play").addEventListener("click", Diaporama.play.bind(Diaporama));

// Le bouton gauche appel la m�thode "pr�c�dent" du diaporama
document.getElementById("bouttonGauche").addEventListener("click", Diaporama.precedent.bind(Diaporama));

// Gestion de l'appui et du rel�chement d'une touche du clavier
document.addEventListener("keydown", Diaporama.infosClavier.bind(Diaporama));