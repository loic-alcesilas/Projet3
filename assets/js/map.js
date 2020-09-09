//Recuperer toutes les stations de vélos via l'API JC DECAUX

window.onload = () => {
    map = new OpenLayers.Map("maCarte");
    map.addLayer(new OpenLayers.Layer.OSM());

    var lonLat = new OpenLayers.LonLat(-0.1279688, 51.5077286)
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
}