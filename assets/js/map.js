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
        var response = JSON.parse(this.responseText);
    }
};
request.open("GET", "https://api.jcdecaux.com/vls/v1/stations?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5");
request.send();

ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=rouen&apiKey=fefa77128452c1aa0a3a63dd7a9f67bfcbcef4d5",
    function (reponse) {
        var rent = JSON.parse(reponse);
        rent.forEach(function (station) {
            var markers = new OpenLayers.Layer.Markers("Markers");
        })
    })


