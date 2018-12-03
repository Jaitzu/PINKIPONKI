var platform = new H.service.Platform({
    useCIT: true,
    app_id: '8xEeDA9jHD0gRWnKEqHK', // // <-- ENTER YOUR APP ID HERE
    app_code: '0fJSi3golHWCNHb3GZeKqg', // <-- ENTER YOUR APP CODE HERE
    useHTTPS: true
});

var defaultLayers = platform.createDefaultLayers();
var mapPlaceholder = document.getElementById('mapid');

//---kartan keskityksen koordinaatit
var coordinates = {
    lat: 52.530974, // HERE HQ in Berlin, Germany
    lng: 13.384944
};

var mapOptions = {
    center: coordinates,
    zoom: 14,
    width: 100,
    height: 100
}
//----kartan initilaatio
var map = new H.Map(
    mapPlaceholder,
    defaultLayers.normal.map,
    mapOptions);
map.setBaseLayer(defaultLayers.satellite.traffic);

//---kartta sopeutuu ikkunaan
window.addEventListener('resize', function () {
    map.getViewPort().resize();
});
//---ominaisuus jolla kartalla pystyy liikkumaan
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

//-------MArkerin luonti
var iconUrl = 'honri.png';

var iconOptions = {
// The icon's size in pixel:
    size: new H.math.Size(26, 34),
// The anchorage point in pixel,
// defaults to bottom-center
    anchor: new H.math.Point(14, 34),

};

var markerOptions = {
    icon: new H.map.Icon(iconUrl, iconOptions)
};

const marker = new H.map.Marker(coordinates, markerOptions);
map.addObject(marker);

function updatePosition (event) {
    var HEREHQcoordinates = {
        lat: event.coords.latitude,
        lng: event.coords.longitude
    };

    marker.setPosition(HEREHQcoordinates);
    map.setCenter(HEREHQcoordinates);
}

navigator.geolocation.watchPosition(updatePosition);