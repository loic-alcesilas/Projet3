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
var onMarkerClick = function (infos) {
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
document.getElementById("book").addEventListener("submit", submitForm, submitbutton);
function submitForm() {
    //Get all value from the form
    var number = document.getElementById('number').value;
    var firstname = document.getElementById("lastname").value;
    var lastname = document.getElementById("firstname").value;


    //Si il manque le prenom ou le nom ou que la signature est false alors on met une larte
    submitbutton.onclick = showAlert;
    function showAlert() {
        // Récupérer la valeur des champs nom et prénom
        var Nom = document.getElementById('lastname').value;
        var Prénom = document.getElementById('firstname').value;
        // Contrôle sur le nom
        if ((Nom == "") || (Prénom == "")) {
            alert('Vous devez compléter votre nom et prénom !');
            // Permet de bloquer l'envoi du formulaire
            return false;
        }
        else { 
            //Set an object with values
            var object = {
                number: number,
                firstname: firstname,
                lastname: lastname,
                bookingtime: Date.now()
            }
            //Set object into local storage convert into string
            localStorage.setItem("booking", JSON.stringify(object));

            //call function to set HTML Booking
            setHtmlBooking();
        }
    }        

}


/*************************************************************************************************/
/************** GET BOOKING FROM LOCAL STORAGE? VIEW HTML FOR BOOKING AND SET VALUE **************/
/************************************************************************************************/
function setHtmlBooking(){
    document.getElementById('infoReservation').classList.replace("d-none", "d-initial");
    //Get booking from local storage convert into object
    var booking = JSON.parse(localStorage.getItem('booking'));

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            document.getElementById('bookingStation').textContent = JSON.parse(this.responseText).name;
        }
    };
    request.open("GET", "https://api.jcdecaux.com/vls/v3/stations/"+booking.number+"?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
    request.send();

    //Set html content
    document.getElementById('bookingStation').textContent = booking.number;
    document.getElementById('bookingFirstname').textContent = booking.firstname;
    document.getElementById('bookingLastname').textContent = booking.lastname;
}

/*************************************************************************************************/
/************** SET HTML BOOKING IF THERE IS SOME BOOKING IN LOCAL STORAGE **********************/
/************************************************************************************************/
if(JSON.parse(localStorage.getItem('booking'))){
    setHtmlBooking();
}

/**********************************************/
/************** COMPTEUR **********************/
/**********************************************/
setInterval(getTime(), 60 * 1000);

function getTime(){
    var today = new Date();
    var Booking = new Date(JSON.parse(localStorage.getItem('booking')).bookingtime);
    var diffMs = (today - Booking); // milliseconds between now & Christmas
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    var diffSec = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    document.getElementById('bookingTime').textContent = diffMins;
}



console.log(new Date(JSON.parse(localStorage.getItem('booking')).bookingtime));
console.log(new Date(Date.now()));

