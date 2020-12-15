
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

    //MENTORAT
    var booking = JSON.parse(localStorage.getItem('booking'));

    //MENTORAT
    if (localStorage.getItem('booking') != null && booking.number == infos.number) {
        infos.available_bikes--;
    }


    if (localStorage.getItem('booking') != null) {
        $('#book').append('<p id="alreadyreservation"> Vous avez déjà une réservation en cours, si vous cliquez sur le bouton réserver elle sera alors remplacée par cette nouvelle réservation</p>');
    } else{
        // document.getElementById("alreadyreservation").remove();
    }

    document.getElementById('stationinfo').classList.replace("d-none", "d-initial");
    document.getElementById('map-container').classList.replace("col-12", "col-8");
    document.getElementById('stationAddress').textContent = (infos.address);
    document.getElementById('stationName').textContent = (infos.name);
    document.getElementById('stationStatus').textContent = (infos.status);
    document.getElementById('stationBike').textContent = (infos.available_bikes + '/' + infos.bike_stands);
    document.getElementById('stationStand').textContent = (infos.available_bike_stands + '/' + infos.bike_stands);
    document.getElementById('number').value = infos.number;
}

/***************************************************************************************/
/************** SUBMIT FORM, SET AND OBJECT AND SAVE IT ON LOCAL STORAGE **************/
/**************************************************************************************/
document.getElementById("book").addEventListener("submit", submitForm);
function submitForm() {
    //Get all value from the form
    var number = document.getElementById('number').value;
    var firstname = document.getElementById("lastname").value;
    var lastname = document.getElementById("firstname").value;

    // Secure that firstname and lastname are not empty
    var Nom = document.getElementById('lastname').value;
    var Prénom = document.getElementById('firstname').value;
    // Contrôle sur le nom
    if (Nom.length == 0 || Prénom.length == 0) {
        alert('Vous devez compléter votre nom et prénom !');
        return false;
    }
    //TEST IF CANVAS SIGNATURE IS TRUE, ELSE ALERT AND RETURN FALSE

    //Set an object with values
    var object = {
        number: number,
        firstname: firstname,
        lastname: lastname,
        bookingtime: Date.now()
    }
    //Set object into local storage convert into string
    localStorage.setItem("booking", JSON.stringify(object));
    setHtmlBooking();
}

/*************************************************************************************************/
/************** GET BOOKING FROM LOCAL STORAGE? VIEW HTML FOR BOOKING AND SET VALUE **************/
/************************************************************************************************/
function setHtmlBooking() {
    document.getElementById('infoReservation').classList.replace("d-none", "d-initial");
     $('#infoReservation').append('<p id="expired">Vélo réservé à la station <span id="bookingStation"></span> par <span id="bookingFirstname"></span> <span id="bookingLastname"></span></p>');
     $('#infoReservation').append('<p id="infoTime">Temps restant : <span id="bookingTime"></span></p>');

    //Get booking from local storage convert into object
    var booking = JSON.parse(localStorage.getItem('booking'));

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            document.getElementById('bookingStation').textContent = JSON.parse(this.responseText).name;
        }
    };
    request.open("GET", "https://api.jcdecaux.com/vls/v3/stations/" + booking.number + "?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
    request.send();

    //Set html content
    document.getElementById('bookingStation').textContent = booking.number;
    document.getElementById('bookingFirstname').textContent = booking.firstname;
    document.getElementById('bookingLastname').textContent = booking.lastname;
    //Set timer first time
    timeLeft();
    //set interval to refresh timer every second
    setInterval(timeLeft, 1000);
}

/*************************************************************************************************/
/************** SET HTML BOOKING IF THERE IS SOME BOOKING IN LOCAL STORAGE **********************/
/************************************************************************************************/
//if local storage exist, set html and set interval to refresh every seconds
if (localStorage.getItem('booking') !=null) {
    setHtmlBooking();
    timeLeft();
    setInterval(timeLeft, 1000);
}

/**********************************************/
/************** COMPTEUR **********************/
/**********************************************/

//If timer is end, remove local storage and set message to expired
function removeBooking() {
    localStorage.removeItem('booking');
}

//This function update timer on html code
function timeLeft(){
    var now = new Date(JSON.parse(localStorage.getItem('booking')).bookingtime);
    var endDate = new Date();
    var diff = endDate - now;
    var minutes = 20 - (Math.ceil((diff % 3.6e6) / 6e4));
    var seconds = 60 - (Math.ceil((diff % 6e4) / 1000));
     
    document.getElementById('bookingTime').textContent = minutes + " minutes et " + seconds + " secondes";

    //If there is no time, remove booking
    if (minutes <= 0 && seconds == 0) {
        removeBooking();
        $('#infoReservation').append('<p>Votre réservation a expirée</p>');
        document.getElementById("expired").remove();
        document.getElementById("infoTime").remove();
    }

}