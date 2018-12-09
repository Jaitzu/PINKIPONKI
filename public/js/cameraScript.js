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
        const hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        const width = video.videoWidth,
            height = video.videoHeight;
        //canvas ja kuva samoihin kokoihin
        if (width && height) {
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            context.drawImage(video, 0, 0, width, height);

            // Canvas URL:iksi
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
