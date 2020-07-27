// Variables d'ensemble
let compteur = 0
let timer
let elements
let slides
let slideWidth


window.onload = () => {
    const diapo = document.querySelector(".diapo")
    elements = document.querySelector(".elements")
    slides = Array.from(elements.children)

    //On calcule la largeur visible du diaporama
    slideWidth = diapo.getBoundingClientRect().width

    let next = document.querySelector("#nav-droite")
    let prev = document.querySelector("#nav-gauche")
    let pause = document.querySelector("#pause")
    let play = document.querySelector("#play")

    next.addEventListener("click", slideNext)
    prev.addEventListener("click", slidePrev)
    pause.addEventListener("click", slidePause)
    play.addEventListener("click", slidePlay)

    // Changer de slide tous les 5sec
    timer = setInterval(slideNext, 5000)

    // RESPONSIVE 
    window.addEventListener("resize", () => {
        slideWidth = diapo.getBoundingClientRect().width
        slideNext()
    })

    }

function slideNext() {
    compteur++
    if(compteur == slides.length) {
        compteur = 0
    }
    let decal = -slideWidth * compteur
    elements.style.transform = `translateX(${decal}px)`
}

function slidePrev() {
    compteur--
    if (compteur < 0) {
        compteur = slides.length - 1
    }
    let decal = -slideWidth * compteur
    elements.style.transform = `translateX(${decal}px)`
}

function slidePause() {
    //ajouter la classe d-none à #pause
    // retirer la classe d-none à #play
    document.getElementById('pause').display = "none";
    document.getElementById('play').display = "block";
    clearInterval(timer);
}

function slidePlay() {
    //retirer la classe d-none à #pause
    // ajouter la classe d-none à #play
    document.getElementById('pause').display = "block";
    document.getElementById('play').display = "none";
    timer = setInterval(slideNext, 5000)
}


