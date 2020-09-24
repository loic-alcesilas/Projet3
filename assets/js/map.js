//Recuperer toutes les stations de vélos via l'API JC DECAUX

// carte et ajout du marqueurs 
map = new OpenLayers.Map("maCarte");
map.addLayer(new OpenLayers.Layer.OSM());

var lonLat = new OpenLayers.LonLat(1.0993, 49.4431)
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );

var zoom = 16;

//Boucle sur l'objet ou le tableau renvoyé par JC Decaux et ajouter à chaque fois le marqueur

var markers = new OpenLayers.Layer.Markers("Markers");
map.addLayer(markers);

markers.addMarker(new OpenLayers.Marker(lonLat));

map.setCenter(lonLat, zoom);

//ajout de l'api JcDecaux

var request = new XMLHttpRequest();
request.onreadystatechange = function () {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var responses = JSON.parse(this.responseText);
        responses.forEach(function (response) {
            var markers = new OpenLayers.Layer.Markers("Markers");

            var lonLat = new OpenLayers.LonLat(response['position']['lng'], response['position']['lat'])
                .transform(
                    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
                    map.getProjectionObject() // to Spherical Mercator Projection
                );
            map.addLayer(markers);

            markers.addMarker(new OpenLayers.Marker(lonLat));

            map.setCenter(lonLat, zoom);
            console.log(response);
        });
    }
};
request.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
request.send();

//ajout du panneau d'information au click

let stationinformations = document.getElementById('stationinfo');

$(document).ready(function () {

    $(L.marker).click(function () {
        function display() {
            stationinformations.classList.replace("invisible", "visible");
        }
        display();
    })
})



