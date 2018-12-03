
const mymap = L.map('mapid');

const kuva = L.icon({iconUrl:'honri.png' });
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiamFpdHp1IiwiYSI6ImNqb3Brbjd2bTFobzIzdm14aWNvcThna2IifQ.ADd7lv4dzajkk5BhdyffZw'
}).addTo(mymap);
const marker =  L.marker([0,0], {icon: kuva}).addTo(mymap);
navigator.geolocation.watchPosition((location)=> {

    const latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
    mymap.setView(latlng, 20);
    marker.setLatLng(latlng);
    console.log(latlng);
    const el = document.getElementsByTagName('p')[0];
    if(el!=undefined) {
        el.remove();
    }
    const body = document.getElementById('paikka');
    const p = document.createElement('p');
    body.appendChild(p);
    p.innerHTML = '<p>' + latlng + '</p>' ;
});

