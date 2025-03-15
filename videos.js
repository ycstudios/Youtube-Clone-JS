
// Handle video playback on video-details.html
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId'); 

    if (videoId && document.getElementById('video-container')) {
        // Create and insert the YouTube iframe player with the video ID
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
            title="YouTube video player"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        `;
    }
});
