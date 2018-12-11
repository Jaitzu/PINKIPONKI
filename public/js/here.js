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
console.log(coordinates);
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
map.setBaseLayer(defaultLayers.terrain.traffic);

window.addEventListener('resize', function () { //kartta sopeutuu ikkunaan
    map.getViewPort().resize();
});
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));//ominaisuus jolla kartalla pystyy liikkumaan


var iconUrl = 'honri.png';//MArkerin luonti

var iconOptions = {
// The icon's size in pixel:
    size: new H.math.Size(46, 54),
// The anchorage point in pixel,
// defaults to bottom-center
    anchor: new H.math.Point(14, 34),
};

var markerOptions = {
    icon: new H.map.Icon(iconUrl, iconOptions)
};
const marker = new H.map.Marker(coordinates, markerOptions);
map.addObject(marker);
const cords= {lat:0, lng:0};
const pallo = new H.map.Marker(cords);
map.addObject(pallo);
//pallon uudet koordinaatit

const getCords = () => {
    fetch('./koordinaatit').then((response) => {
        return response.json();
    }).then((json) => {
        const kords = JSON.parse(json[0].ball_coordinates);
        pallo.setPosition(kords);
    });
};
setInterval(getCords, 6000);

var keskitys = 0;
//markerin ja pallon sijainnin päivitys
    function updatePosition(event) {
         var HEREHQcoordinates = {
            lat: event.coords.latitude,
            lng: event.coords.longitude
        };
        marker.setPosition(HEREHQcoordinates);
        if(keskitys === 0) {
            map.setCenter(HEREHQcoordinates);
        }

    }

    navigator.geolocation.watchPosition(updatePosition);

function baall() {
//käyttäjän ja markerin interaktion käynnistäminen
    var minDist = 15,
        markerDist,
        // get all objects added to the map
        objects = map.getObjects(),

        len = map.getObjects().length,
        i;


// iterate over objects and calculate distance between them
    for (i = 1; i < len; i += 1) {
        markerDist = objects[i].getPosition().distance((marker.getPosition()));

        if (markerDist < minDist) {
            markerDist = minDist;

            modaali();



        }
    }
    setInterval(baall, 6000);
}

baall();


//PALLONKAAPPAUS MODAALI
// Get the modal
    var modal = document.getElementById('myModal');
// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
// When the user clicks on the button, open the modal
    function modaali() {
        const pallomodaali = document.getElementById("kaappausModal");
        pallomodaali.style.display = "flex";



    }



//menun avaus ja sulkeminen
var timesClicked =0;
function xFunction(x) {
    timesClicked+=1;
    console.log(timesClicked);
    if(timesClicked > 1){
        x.classList.toggle("change");
        const menumodaali = document.getElementById("menuModal");
        menumodaali.style.display = "none";
        const äxä = document.getElementById("äxä")
        äxä.style.zIndex = "1";
        timesClicked =0;
    }
    else {
        x.classList.toggle("change");
        const menumodaali = document.getElementById("menuModal");
        menumodaali.style.display = "flex";
        const äxä = document.getElementById("äxä")
        äxä.style.zIndex = "2";

    }


}
//-----kartan keskitys----
function keski(){
    keskitys = 0;
}

// When the user clicks anywhere on the map its stops centering the screen to your location until user clicks the centering button
const mappi =document.getElementById("mapid")
mappi.onclick = function() {
    keskitys = 1;

} ;

//---camera
function kamera(){
    const cameramodaali = document.getElementById("cameraModal");
    const start =document.getElementById("start-camera");
    const video =document.getElementById("camera-stream");
    const snap =document.getElementById("snap");
    cameramodaali.style.display = "flex";
    start.style.display = "block";
    video.style.display = "block";
    snap.style.display = "block"

}