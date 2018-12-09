'use strict';
let originalData = null;
// read userID from cookie
console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);
document.querySelector('#reset-button').addEventListener('click', () => {
    update(originalData);
});
//----camera-----
let picurl;
document.addEventListener('DOMContentLoaded', function () {

    const video = document.querySelector('#camera-stream');
    const image = document.querySelector('#snap');
    const start_camera = document.querySelector('#start-camera');
    const controls = document.querySelector('.controls');
    const take_photo_btn = document.querySelector('#take-photo');
    const delete_photo_btn = document.querySelector('#delete-photo');
    const download_photo_btn = document.querySelector('#download-photo');
    const error_message = document.querySelector('#error-message');

    //Selain kohtainen kysely kameran toiminnalisuudesta
    navigator.getMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);


    if (!navigator.getMedia) {
        displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.");
    } else {
        // Kamera lupa
        navigator.getMedia(
            {video: true},

            function (stream) {
                video.src = window.URL.createObjectURL(stream);

                // Kameran stream päälle
                video.play();
                video.onplay = function () {
                    showVideo();
                };
            },
            function (err) {
                displayErrorMessage("There was an error with accessing the camera stream: " + err.name, err);
            }
        );

    }

    //Nappula kameran käynnistämiseen
    start_camera.addEventListener("click", function (evt) {
        evt.preventDefault();
        video.play();
        showVideo();

    });

    take_photo_btn.addEventListener("click", function (evt) {
        evt.preventDefault();

        var snap = takeSnapshot();

        image.setAttribute('src', snap);
        image.classList.add("visible");

        // Nappulat hide/show
        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");

        download_photo_btn.href = snap;
        video.pause();

    });

    //Delete nappula toiminnalisuus
    delete_photo_btn.addEventListener("click", function (e) {
        e.preventDefault();

        image.setAttribute('src', "");
        image.classList.remove("visible");

        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

        video.play();
    });

    //Ikonit näkyville
    function showVideo() {
        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }

    function takeSnapshot() {
        const hidden_canvas = document.querySelector('canvas');
          const  context = hidden_canvas.getContext('2d');

        const width = video.videoWidth,
            height = video.videoHeight;
        //canvas ja kuva samoihin kokoihin
        if (width && height) {
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            context.drawImage(video, 0, 0, width, height);

            // Canvas URL:iksi
            picurl = hidden_canvas.toDataURL('image/png');
            return hidden_canvas.toDataURL('image/png');


        }
    }

    function displayErrorMessage(error_msg, err) {
        err = err || "";
        if (err) {console.error(err);}

        error_message.innerText = error_msg;

        hideUI();
        error_message.classList.add("visible");
    }

    //Hide/show elementit
    function hideUI() {
        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
    }

});
//----



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
const updatefrm = document.querySelector('#updateform');
const list = document.querySelector('#pallokuva');
const searchfrm = document.querySelector('#photohaku');
/*
const img = document.querySelector('#image');
const aud = document.querySelector('#aud');
const vid = document.querySelector('#vid');
*/



const makeHTML = (images) => {
    // clear list before adding upated data
    list.innerHTML = '';
    images.forEach((image) => {
        const li = document.createElement('li');
        const title = document.createElement('h3');
        title.innerHTML = image.title;
        li.appendChild(title);
        const img = document.createElement('img');
        img.src = 'thumbs/' + image.thumbnail;
        img.addEventListener('click', () => {
            fillUpdate(image);
        });
        li.appendChild(img);

        for (var wi=0; wi<kuvat.length; wi++) {
            const karu = document.getElementsByTagName('div')[1];
            const divi = document.createElement("div");
            const p = document.createElement("p");
            divi.setAttribute('class', 'slaidi');
            console.log('in');
            divi.innerHTML = "<h2>" + uID[wi] + "</h2>" + "<img src=thumbs/" + kuvat[wi] + ">";
            karu.appendChild(divi);
            divi.appendChild(p);
        }

        console.log('täh');

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
            setTimeout(slideshow, 2000);
        }



    });
}

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
  const fd = new FormData(picurl);
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

const sendUpdate = (evt) => {
  evt.preventDefault();
  // get data from updatefrm and put it to body
  const data = JSON.stringify([
    updatefrm.querySelector('input[name="category"]').value,
    updatefrm.querySelector('input[name="title"]').value,
    updatefrm.querySelector('input[name="details"]').value,
    updatefrm.querySelector('input[name="mID"]').value,
  ]);
  const settings = {
    method: 'PATCH',
    body: data,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };
  // app.patch('/images'.... needs to be implemented to index.js (remember body-parser)
  fetch('./images', settings).then((response) => {
    console.log('makkaraa');
    return response.json();
  }).then((json) => {
    console.log(json);
    updatefrm.reset();
    document.querySelector('#updateform button').setAttribute('disabled', 'disabled');
    // update list
    getImages();
  });
};
const sendSearch = (evt) => {
    evt.preventDefault();
    const data = searchfrm.querySelector('input[name="category"]').value;

    console.log('data', data);

    console.log('vaih2');
    fetch('./search/'+ data).then((response)=>{
        console.log('fetchonnistui');
        return response.json();
        console.log('fetchonnistui');
    }).then((json)=>{
        console.log('prkl' + json);
        makeHTML(json);
    });
};



frm.addEventListener('submit', sendForm);
updatefrm.addEventListener('submit', sendUpdate);
searchfrm.addEventListener('submit', sendSearch);
getImages();
