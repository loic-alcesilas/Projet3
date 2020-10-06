var map = L.map('maCarte').setView([49.4431,1.0993], 16);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibG9pY29jIiwiYSI6ImNrZmkyNG13ajAycWgzMHFqanBvN3J5MTAifQ.AEuScT5GN9h-CXKSd69VFA', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibG9pY29jIiwiYSI6ImNrZmkyNG13ajAycWgzMHFqanBvN3J5MTAifQ.AEuScT5GN9h-CXKSd69VFA'
}).addTo(map);

//essaie d'ajout des info sur la panneau 
var onMarkerClick = function (infos) {
    document.getElementById('stationinfo').classList.replace("d-none", "d-initial");
    document.getElementById('map-container').classList.replace("col-12", "col-8");
    document.getElementById('stationAddress').textContent = (infos.address);
    document.getElementById('stationName').textContent = (infos.name);
    document.getElementById('stationStatus').textContent = (infos.status);
    document.getElementById('stationBike').textContent = (infos.available_bikes+'/'+infos.bike_stands);
    document.getElementById('stationStand').textContent = (infos.available_bike_stands +'/'+infos.bike_stands);
    document.getElementById('number').value = infos.number;
}

document.getElementById("book").addEventListener("submit", submitForm);

function  submitForm(){
    var number= document.getElementById('number').value;
    var firstname=document.getElementById("lastname").value;
    var lastname=document.getElementById("firstname").value;

    //si number ou firstname ou lastname est vide alors je mets une alert js avec un message
    //Si pas de signature, une alerte
    //Sinon si tout est bon alros on fait l'objet et on l'ajoute
    var object = {
        number: number,
        name: firstname,
        firstname: lastname,
        'bookingtime':new Date()
    }
    localStorage.setItem("book", JSON.stringify(object));

    //Ajouter en dessous du panneau al réservation
}

//number
//nom
//prenom
var request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var responses = JSON.parse(this.responseText);
        responses.forEach(function (response) {
            console.log(response);
            var marker = L.marker([response['position']['lat'], response['position']['lng']]);

            //Handle click on marker
            marker.on('click', onMarkerClick.bind(this, response)
            );

            marker.addTo(map);

            marker = L.circleMarker([response['position']['lat'],response['position']['lng']], {fillColor: 'red'});
            marker.addTo(map);
        });
    }
};
request.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
request.send();

if (storageAvailable('stationinfo')) {
    // Nous pouvons utiliser localStorage
}
else {
    // Malheureusement, localStorage n'est pas disponible
}