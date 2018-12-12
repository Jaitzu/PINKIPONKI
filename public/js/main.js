'use strict';
let originalData = null;
// read userID from cookie
console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);



const frm = document.querySelector('#mediaform');
const list = document.querySelector('#pallokuva');


//kuvien tietojen haku ja liittäminen listaan
let kuvat = [];
let uID = [];
let mID = [];
let likes =[];
let slideIndex = 1;
const makeHTML = (images) => {
    // clear list before adding upated data
    list.innerHTML = '';
    kuvat = [];
    uID = [];
    const karu = document.getElementById('pallokuva');
    karu.innerHTML="";
    console.log('slaidit tyhjenetty');
    images.forEach((image) => {
        kuvat.push(image.thumbnail);
        uID.push(image.details);
        mID.push(image.media_ID);
        likes.push(image.points);
        });

//kuvien ja tietojen tulostus
    for (var wi=0; wi<kuvat.length; wi++) {
        const divi = document.createElement("div");
        const p = document.createElement("p");
        divi.setAttribute('class', 'slaidi');
        divi.innerHTML = "<img src=thumbs/" + kuvat[wi] + "><h2>" + uID[wi] + "</h2><h2 class='like'>Likes: " + likes[wi] + "</h2><button class='uppi' onclick='upVote("+ mID[wi] +")'></button>";
        karu.appendChild(divi);
        divi.appendChild(p);
    }
//karusellin ohjaimet
    karu.innerHTML += '<a class="prev" onclick="plusSlides(-1)">&#10094;</a>';
    karu.innerHTML += '<a class="next" onclick="plusSlides(1)">&#10095;</a>';


    showSlides(slideIndex);

};


//kuvien selaaminen
function plusSlides(n) {
    showSlides(slideIndex += n);
}
//karusellin luonti
function showSlides(n) {
    let slaidit = document.getElementsByClassName("slaidi");
    if (n > slaidit.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slaidit.length}
    for (var i = 0; i < slaidit.length; i++) {
        slaidit[i].style.display = "none";
    }
    slaidit[slideIndex-1].style.display = "block";
}
//kuvien tykkäys
const upVote = (image) => {
    const data = JSON.stringify({
        imId: image,
    });
    console.log(image);
    const settings = {
        method: 'PATCH',
        body: data,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
        },
    };
    // app.patch('/images'.... needs to be implemented to index.js (remember body-parser)
    fetch('./vote', settings).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);
        getData();
    });

};
//kuvien haku
const getImages = () => {
  fetch('./images').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    makeHTML(json)
  });
};

//kuvien lähettäminen tietomkantaan
const sendForm = (evt) => {
  evt.preventDefault();
  const fd = new FormData(frm);
  console.log('fd='+ fd);
  const settings = {
    method: 'post',
    body: fd,
  };

  fetch('./upload', settings).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    // update list
    makeHTML(json);
  });
};
//kordinaattien päivitys ja kaappausmodalin sisällön piilotus/näyttö
const paavita = () => {
    const pallomodaali = document.getElementById("kaappausModal");
    const media = document.getElementById("mediaform");
    const kuva = document.getElementById("pallokuva");
    const potku = document.getElementById("potku");
    media.style.display ="block";
    kuva.style.display="none";
    potku.style.display="none";
    pallomodaali.style.display = "none";
    const settings = {
        method: 'PATCH'
        }

    // app.patch('/images'.... needs to be implemented to index.js (remember body-parser)
    fetch('./paivita', settings).then((response) => {
        return response.json();
    }).then((json) => {
        console.log(json);

    })

};
//kaappaus modaalin sisällön piilotus/näyttö
function hide(){
    const media = document.getElementById("mediaform");
    const kuva = document.getElementById("pallokuva");
    const potku = document.getElementById("potku");
    media.style.display ="none";
    kuva.style.display="flex";
    potku.style.display="block";
}



frm.addEventListener('submit',sendForm);

getImages();
