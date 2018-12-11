'use strict';
let originalData = null;
// read userID from cookie
console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);




const createArticle = (image, title, texts, id, user) => {
    console.log('user', user);
    let text = '';
    for (let t of texts) {
        text += `<p>${t}</p>`;
    }

    let html = `<img src="${image}" alt="${title}">
                <h3 class="card-title">${title}</h3>
                <p>${text}</p>
                <p><button>View</button>`;
    if (user == userID) {
        console.log('match');
        html += `<button>Modify</button>
    <button onclick="deleteImage(${id})">Delete</button></p>`;
    }

    return html;
};

const categoryButtons = (items) => {
    items = removeDuplicates(items, 'category');
    console.log(items);
    document.querySelector('#categories').innerHTML = '';
    for (let item of items) {
        const button = document.createElement('button');
        button.class = 'btn btn-secondary';
        button.innerText = item.category;
        document.querySelector('#categories').appendChild(button);
        button.addEventListener('click', () => {
            sortItems(originalData, item.category);
        });
    }
};

const sortItems = (items, rule) => {
    const newItems = items.filter(item => item.category === rule);
    // console.log(newItems);
    update(newItems);
};

const getData = () => {
    fetch('./images').then(response => {
        return response.json();
    }).then(items => {
        originalData = items;
        update(items);
    });

};

const removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
};

const update = (items) => {
    categoryButtons(items);
    document.querySelector('main').innerHTML = '';
    for (let item of items) {
        // console.log(item);
        const article = document.createElement('article');
        const time = moment(item.time);
        article.innerHTML = createArticle(item.thumbnail, item.title, [
            '<small>' + time.format('dddd, MMMM Do YYYY, HH:mm') + '</small>',
            item.details], item.mID, item.userID);

        // select image to modify form
        try {
            article.querySelector('button:nth-of-type(2)').
            addEventListener('click', () => {
                console.log(item);
                fillUpdate(item);
            });
        } catch (e) {

        }

        document.querySelector('main').appendChild(article);
    }
};



// insert and update image


const frm = document.querySelector('#mediaform');
//const updatefrm = document.querySelector('#updateform');
const list = document.querySelector('#pallokuva');
const searchfrm = document.querySelector('#photohaku');
/*
const img = document.querySelector('#image');
const aud = document.querySelector('#aud');
const vid = document.querySelector('#vid');
*/


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


    for (var wi=0; wi<kuvat.length; wi++) {
        const divi = document.createElement("div");
        const p = document.createElement("p");
        divi.setAttribute('class', 'slaidi');
        divi.innerHTML = "<img src=thumbs/" + kuvat[wi] + "><h2>" + uID[wi] + "</h2><h2 class='like'>Likes: " + likes[wi] + "<h2><button class='uppi' onclick='upVote("+ mID[wi] +")'></button>";
        karu.appendChild(divi);
        divi.appendChild(p);
    }

    karu.innerHTML += '<a class="prev" onclick="plusSlides(-1)">&#10094;</a>';
    karu.innerHTML += '<a class="next" onclick="plusSlides(1)">&#10095;</a>';


    showSlides(slideIndex);

    /*
    let slaidiIndeksi = 0;
    slideshow();

    function slideshow() {
        const slaidit = document.getElementsByClassName('slaidi');
        for (var io=0; io<slaidit.length; io++) {
            slaidit[io].style.display = "none";
        }
        slaidiIndeksi++;
        if(slaidiIndeksi>slaidit.length) {slaidiIndeksi = 1}
        slaidit[slaidiIndeksi-1].style.display = "block";
        clearInterval(slideshow);
        setTimeout(slideshow, 2000);
    }
*/
};



function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slaidit = document.getElementsByClassName("slaidi");
    if (n > slaidit.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slaidit.length}
    for (var i = 0; i < slaidit.length; i++) {
        slaidit[i].style.display = "none";
    }
    slaidit[slideIndex-1].style.display = "block";
}

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

const getImages = () => {
  fetch('./images').then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    makeHTML(json)
  });
};


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
