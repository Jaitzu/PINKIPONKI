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
const makeHTML = (images) => {
    // clear list before adding upated data
    list.innerHTML = '';
    kuvat = [];
    uID = [];
    const karu = document.getElementById('pallokuva');
    karu.innerHTML="";
    console.log('slaidit tyhjenetty');
    images.forEach((image) => {
        const li = document.createElement('li');
        const title = document.createElement('h3');
        title.innerHTML = image.title;
        li.appendChild(title);
        const img = document.createElement('img');
        kuvat.push(image.thumbnail);
        uID.push(image.uID);
        img.src = 'thumbs/' + image.thumbnail;
        img.addEventListener('click', () => {
            fillUpdate(image);
        });
        li.appendChild(img);

        for (var wi=0; wi<kuvat.length; wi++) {
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





frm.addEventListener('submit',sendForm);

getImages();
