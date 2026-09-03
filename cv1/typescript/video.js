var videos = document.querySelectorAll(".thumb");
videos.forEach(function (video) {
    video.addEventListener("click", function () {
        if (video.paused) {
            // pause others
            videos.forEach(function (v) {
                if (v !== video)
                    v.pause();
            });
            video.play();
        }
        else {
            video.pause();
        }
    });
});
