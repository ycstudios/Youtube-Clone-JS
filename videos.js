
// Handle video playback on video-details.html
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId'); 

    if (videoId && document.getElementById('video-container')) {
        // Create and insert the YouTube iframe player with the video ID
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = `
            <iframe
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }
});
console.log("Script loaded and running...");

