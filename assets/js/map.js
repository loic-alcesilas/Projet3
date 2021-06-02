
/************************************/
/************** SET MAP ************/
/************************************/
var map = L.map('maCarte').setView([49.4431, 1.0993], 16);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9pY29jIiwiYSI6ImNrZmkyNG13ajAycWgzMHFqanBvN3J5MTAifQ.AEuScT5GN9h-CXKSd69VFA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibG9pY29jIiwiYSI6ImNrZmkyNG13ajAycWgzMHFqanBvN3J5MTAifQ.AEuScT5GN9h-CXKSd69VFA'
}).addTo(map);

/*************************************************************************************************/
/************** REQUEST TO JC DECAUX API TO GET STATION AND SET MARKERS *************************/
/************************************************************************************************/
var request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var responses = JSON.parse(this.responseText);
        responses.forEach(function (response) {
            var marker = L.marker([response['position']['lat'], response['position']['lng']]);

            //Handle click on marker
            marker.on('click', onMarkerClick.bind(this, response)
            );

            marker.addTo(map);

            marker = L.circleMarker([response['position']['lat'], response['position']['lng']], { fillColor: 'red' });
            marker.addTo(map);
        });
    }
};
request.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
request.send();

/************************************************************/
/************** SET HTML STATION INFOS AND FORM ************/
/***********************************************************/
var onMarkerClick = function(infos) {

    // on creer une variable qui recupere les donnes de reservation
    var booking = JSON.parse(localStorage.getItem('booking'));

    // Si une reservation est effectuer on enleve un velo 
    var available_bikes=infos.available_bikes;
    if (localStorage.getItem('booking') != null && booking.number == infos.number) {
        available_bikes=infos.available_bikes-1;
    }
    // si il ya reservation alerter l'utilisateur quelle sera supprimer si une nouvelle est enregistrer
    if (localStorage.getItem('booking') != null ) {
        var element = document.getElementById('alreadyreservation');
        if(!element){
            var parentDiv = document.createElement('p');
            parentDiv.id = 'alreadyreservation';
            var text = document.createTextNode("Vous avez déjà une réservation en cours, si vous cliquez sur le bouton réserver elle sera alors remplacée par cette nouvelle réservation");
            parentDiv.appendChild(text);
            document.getElementById('book').append(parentDiv);
        }
    }

    var tailleCarte = document.getElementById('maCarte');
    tailleCarte.style.height = '780px';

    // ajuster la taille de la carte a celle de l'écran
    function resizePage()
{
    var Largeur = $(window).width();
    if(Largeur < 768) {
        var tailleCarte = document.getElementById('maCarte');
        tailleCarte.style.height = '300px';
    }
}
$(window).resize(resizePage);
resizePage(); // Appel de la fonction à l'affichage de la page.

    // recuperation des infos dans le html 
    document.getElementById('stationinfo').classList.replace("d-none", "d-initial");
    document.getElementById('map-container').classList.replace("col-12", "col-8");
    document.getElementById('stationAddress').textContent = (infos.address);
    document.getElementById('stationName').textContent = (infos.name);
    document.getElementById('stationStatus').textContent = (infos.status);
    document.getElementById('stationBikeValue').textContent = (available_bikes );
    document.getElementById('stationBikeTotal').textContent = (infos.bike_stands );
    document.getElementById('stationStand').textContent = (infos.available_bike_stands + '/' + infos.bike_stands);
    document.getElementById('number').value = infos.number;
}

/***************************************************************************************/
/************** SUBMIT FORM, SET AND OBJECT AND SAVE IT ON LOCAL STORAGE **************/
/**************************************************************************************/
document.getElementById("book").addEventListener("submit", submitForm);
function submitForm(event) {
    event.preventDefault();
    // recuperation des valeur du Form 
    var number = document.getElementById('number').value;
    var firstname = document.getElementById("lastname").value;
    var lastname = document.getElementById("firstname").value;

    // Securiser que le nom et prenom ne soit pas vide
    var Nom = document.getElementById('lastname').value;
    var Prénom = document.getElementById('firstname').value;
    // Contrôle sur le nom
    if (Nom.length == 0 || Prénom.length == 0) {
        alert('Vous devez compléter votre nom et prénom !');
        return false;
    }

    //Mise en place d'un object et ses valeurs
    var object = {
        number: number,
        firstname: firstname,
        lastname: lastname,
        bookingtime: Date.now()
    }
  
    //Mise en place de l'object dans le local storage convertit en character
    localStorage.setItem("booking", JSON.stringify(object));
    setHtmlBooking();
}

/*************************************************************************************************/
/************** GET BOOKING FROM LOCAL STORAGE? VIEW HTML FOR BOOKING AND SET VALUE **************/
/************************************************************************************************/
function setHtmlBooking() {
    // si il ya deja une reservation on la remove
    var element = document.getElementById('infoReservation');
    if(element){
        element.remove();
    }
    //On prend le booking du local storage pour le convertir en object
    var booking = JSON.parse(localStorage.getItem('booking'));
    console.log(booking);

    // on creer la div infoReservation et on la place 
    var parentDiv = document.createElement('div');
    parentDiv.id = 'infoReservation';
    document.getElementsByTagName('main')[0].appendChild(parentDiv);

    // on ajoute le compteur BookingTime au panneau reservation 
    var time = document.createElement('p');
    time.id = 'infoTime';
    var timeText = document.createTextNode("Temps restant : ");
    var timeSpan = document.createElement('span');
    timeSpan.id = "bookingTime";

    
    time.appendChild(timeText);
    time.appendChild(timeSpan);
    parentDiv.appendChild(time);

    // on ajoute la station,nom et prenom au panneau de reservation 
    var infos=document.createElement('p');
    infos.id="bookingInfos";
    var infosText=document.createTextNode("Vélo réservé à la station ");
    var infosSpan=document.createElement('span');
    infosSpan.id="bookingStation";
    var infosText2=document.createTextNode(" par ");
    var infosSpan2=document.createElement('span');
    infosSpan2.id="bookingName";
    infosSpan2.innerHTML=booking.firstname + ' '  + booking.lastname

    // on appel l'api pour avoir le numero de station
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
           infosSpan.innerHTML=JSON.parse(this.responseText).name;
        }
    };
    request.open("GET", "https://api.jcdecaux.com/vls/v3/stations/" + booking.number + "?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
    request.send();

    infos.appendChild(infosText);
    infos.appendChild(infosSpan);
    infos.appendChild(infosText2);
    infos.appendChild(infosSpan2);

    parentDiv.appendChild(infos);

    var bikeValue=document.getElementById('stationBikeValue').textContent;
    document.getElementById('stationBikeValue').innerHTML=parseInt(bikeValue)-1;

    //On execute la fonction du timer 
    timeLeft();
    //rafraichir le timer toutes les secondes
    setInterval(timeLeft, 1000);
}

/*************************************************************************************************/
/************** SET HTML BOOKING IF THERE IS SOME BOOKING IN LOCAL STORAGE **********************/
/************************************************************************************************/

//si il ya un local storage set html et set interval pour rafraichir toutes les secondes
if (localStorage.getItem('booking') !=null) {
    setHtmlBooking();
    timeLeft();
    setInterval(timeLeft, 1000);
}

/**********************************************/
/************** COMPTEUR **********************/
/**********************************************/


//quand le timer est fini remove local storage et message d'expiration
function removeBooking() {
    localStorage.removeItem('booking');
    document.getElementById("bookingInfos").remove();
    document.getElementById("infoTime").remove();
    var expired = document.createElement('p');
    var expiredText = document.createTextNode("Votre réservation a expirée");
    expired.appendChild(expiredText);

    document.getElementById('infoReservation').appendChild(expired);
}


//cette function met a jour le timer du code html 
function timeLeft(){
    var now = new Date(JSON.parse(localStorage.getItem('booking')).bookingtime);
    var endDate = new Date();
    var diff = endDate - now;
    var minutes = 20 - (Math.ceil((diff % 3.6e6) / 6e4));
    var seconds = 60 - (Math.ceil((diff % 6e4) / 1000));

    document.getElementById('bookingTime').textContent = minutes + " minutes et " + seconds + " secondes";

    //quand le timer est a 0 executer la function remove booking
    if (minutes <= 0 && seconds == 0) {
        removeBooking();
    }
}