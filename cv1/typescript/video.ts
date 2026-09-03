const videos = document.querySelectorAll<HTMLVideoElement>(".thumb");

videos.forEach(video => {
    video.addEventListener("click", () => {
        if (video.paused) {
            // pause others
            videos.forEach(v => {
                if (v !== video) v.pause();
            });
            video.play();
        } else {
            video.pause();
        }
    });
});