'use strict';
let originalData = null;
// read userID from cookie
console.log(document.cookie);
const userID = document.cookie.split('=')[1];
console.log('userID is', userID);
document.querySelector('#reset-button').addEventListener('click', () => {
    update(originalData);
});

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
const list = document.querySelector('#imagelist');
const searchfrm = document.querySelector('#photohaku');
/*
const img = document.querySelector('#image');
const aud = document.querySelector('#aud');
const vid = document.querySelector('#vid');
*/

const fillUpdate = (image) => {
  console.log(image);
  document.querySelector('#updateform input[name=mID]').value = image.mID;
  document.querySelector('#updateform input[name=category]').value = image.category;
  document.querySelector('#updateform input[name=title]').value = image.title;
  document.querySelector('#updateform input[name=details]').value = image.details;
  document.querySelector('#updateform button').removeAttribute('disabled');
};

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


        const a = document.createElement('a');
        a.innerText = 'delete';
        a.setAttribute('href', '/images/' + image.mID);
        a.addEventListener('click', (evt) => {
            evt.preventDefault();
            const url = evt.target.href;
            const settings = {
                method: 'delete',
            };
            fetch(url, settings).then((response)=>{
                return response.json();
            }).then((json)=>{
                console.log(json);
                getImages();
            });
        });
        li.appendChild(a);
        list.appendChild(li);
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
