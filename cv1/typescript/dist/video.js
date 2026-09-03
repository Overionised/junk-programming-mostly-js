"use strict";
const videos = document.querySelectorAll(".thumb");
videos.forEach(video => {
    video.addEventListener("click", () => {
        if (video.paused) {
            // pause others
            videos.forEach(v => {
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
