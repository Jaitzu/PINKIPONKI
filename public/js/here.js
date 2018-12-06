//-----KARTTA-------
var platform = new H.service.Platform({
    useCIT: true,
    app_id: '8xEeDA9jHD0gRWnKEqHK', // // <-- ENTER YOUR APP ID HERE
    app_code: '0fJSi3golHWCNHb3GZeKqg', // <-- ENTER YOUR APP CODE HERE
    useHTTPS: true
});
var defaultLayers = platform.createDefaultLayers();
var mapPlaceholder = document.getElementById('mapid');


var coordinates = { //kartan keskityksen koordinaatit
    lat: 52.530974, // HERE HQ in Berlin, Germany
    lng: 13.384944
};

var mapOptions = {
    center: coordinates,
    zoom: 18,
    width: 100,
    height: 100
};

var map = new H.Map(  //kartan initilaatio
    mapPlaceholder,
    defaultLayers.normal.map,
    mapOptions);
map.setBaseLayer(defaultLayers.satellite.traffic);

window.addEventListener('resize', function () { //kartta sopeutuu ikkunaan
    map.getViewPort().resize();
});
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));//ominaisuus jolla kartalla pystyy liikkumaan


var iconUrl = 'honri.png';//MArkerin luonti

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
const cords= {lat:60.221121, lng:24.804828};
const pallo = new H.map.Marker(cords);
map.addObject(pallo);


console.log(coordinates);
console.log(cords + 'Täsäsäsäsäsäs');
//pallon uudet koordinaatit
var korts={
};
function Cordinates() {
    korts = {
        lat: 60.221 + Math.random() * 0.001,
        lng: 24.804 + Math.random() * 0.001

    };
    pallo.setPosition(korts);
    console.log('vittu' +cords)
}

//markerin ja pallon sijainnin päivitys
    function updatePosition(event) {
         var HEREHQcoordinates = {
            lat: event.coords.latitude,
            lng: event.coords.longitude
        };
        marker.setPosition(HEREHQcoordinates);
        map.setCenter(HEREHQcoordinates);


    }

    navigator.geolocation.watchPosition(updatePosition);

function baall() {
//käyttäjän ja markerin interaktion käynnistäminen
    var minDist = 10,
        markerDist,
        // get all objects added to the map
        objects = map.getObjects(),

        len = map.getObjects().length,
        i;


// iterate over objects and calculate distance between them
    for (i = 1; i < len; i += 1) {
        markerDist = objects[i].getPosition().distance((marker.getPosition()));
        console.log(markerDist);
        if (markerDist < minDist) {
            markerDist = minDist;
            modaali();
            console.log('pallo on napattu saatana');
        }
    }
    setInterval(baall, 1000);
}

baall();

// Get the modal
    var modal = document.getElementById('myModal');


// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
    function modaali() {
        modal.style.display = "block";

    }


// When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    };



