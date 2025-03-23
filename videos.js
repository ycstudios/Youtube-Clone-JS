
// Handle video playback on video-details.html
// Store API key in a constant - replace YOUR_API_KEY with your actual YouTube API key
const API_KEY = "AIzaSyCiiI8KaUKPCPv7XRn8LLc605P9sywljIU"; // Replace this with your actual YouTube API key

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId'); // Note: Using 'videoId' parameter name
    console.log("Current Video ID:", videoId);
    
    const videoPlayerContainer = document.querySelector("#video-player");
    const video_http = "https://www.googleapis.com/youtube/v3/videos?";
    const channel_https = "https://www.googleapis.com/youtube/v3/channels?";
    const related_videos_http = "https://www.googleapis.com/youtube/v3/search?";
    
    // Basic iframe embed for video-container element (as per your code)
    if (videoId && document.getElementById('video-container')) {
        // Create and insert the YouTube iframe player with the video ID
        const videoContainer = document.getElementById('video-container');
        videoContainer.innerHTML = `
            <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
            title="YouTube video player"
            frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        `;
    }
    
    // Enhanced player with related videos and channel info
    if (videoId && videoPlayerContainer) {
        fetch(video_http + new URLSearchParams({
            key: API_KEY,
            part: "snippet,statistics",
            id: videoId,
        }))
        .then((res) => res.json())
        .then((data) => {
            console.log("Video Data:", data);
            if (!data.items || data.items.length === 0) {
                console.error("Video data not found");
                return;
            }

            const videoTitle = data.items[0].snippet.title;
            const channelId = data.items[0].snippet.channelId;
            const likeCount = data.items[0].statistics.likeCount;

            fetch(channel_https + new URLSearchParams({
                key: API_KEY,
                part: "snippet",
                id: channelId,
            }))
            .then((res) => res.json())
            .then((channelData) => {
                if (!channelData.items || channelData.items.length === 0) {
                    console.error("Channel data not found");
                    return;
                }

                const channelThumbnail = channelData.items[0].snippet.thumbnails.default.url;
                videoPlayerContainer.innerHTML = `
                    <div class="video-div">
                        <div class="videoPage-video-container">
                            <iframe class="videoPage-video" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                            <h1 class="videoPage-title">${data.items[0].snippet.title}</h1>
                        </div>                    

                        <div class="videoPage-channel">
                            <div class="videoPage-channel-container">
                                <div class="videoPage-channel-icon-container">
                                    <img src="${channelThumbnail}" class="videoPage-channel-icon" alt="">
                                    <p class="videoPage-channel-text">${data.items[0].snippet.channelTitle}</p>
                                </div>

                                <div class="videoPage-likes-dislikes">
                                    <button id="like-button"><i class="fa-solid fa-thumbs-up"></i> ${likeCount}</button>
                                    <button id="dislike-button"><i class="fa-solid fa-thumbs-down"></i></button>
                                </div>
                            </div>

                            <div class="videoPage-description-text">
                                <p>Description</p>
                                <p id="description">${data.items[0].snippet.description}</p>
                                <button id="see-more-button">See More</button>
                            </div>
                        </div>
                    </div>

                    <div class="related-videos-container">
                        <h2>Related Videos</h2>
                        <div id="related-videos">Loading...</div>
                    </div>
                `;

                document.getElementById("like-button").addEventListener("click", () => console.log("Liked!"));
                document.getElementById("dislike-button").addEventListener("click", () => console.log("Disliked!"));

                const seeMoreButton = document.getElementById("see-more-button");
                const description = document.getElementById("description");
                seeMoreButton.addEventListener("click", () => {
                    if (seeMoreButton.innerText === "See More") {
                        description.style.display = "block";
                        seeMoreButton.innerText = "See Less";
                    } else {
                        description.style.display = "-webkit-box";
                        seeMoreButton.innerText = "See More";
                    }
                });

                // Fetch Related Videos
                fetch(related_videos_http + new URLSearchParams({
                    key: API_KEY,
                    part: "snippet",
                    relatedToVideoId: videoId,
                    type: "video",
                    maxResults: 10
                }))
                .then((res) => res.json())
                .then((relatedVideosData) => {
                    console.log("Related Videos Response:", relatedVideosData);

                    setTimeout(() => {
                        const relatedVideosContainer = document.getElementById("related-videos");
                        relatedVideosContainer.innerHTML = ""; // Clear previous content

                        if (!relatedVideosData.items || relatedVideosData.items.length === 0) {
                            console.warn("No related videos found! Switching to search by title.");
                            fetch(related_videos_http + new URLSearchParams({
                                key: API_KEY,
                                part: "snippet",
                                q: videoTitle, // Search using video title instead
                                type: "video",
                                maxResults: 10
                            }))
                            .then((res) => res.json())
                            .then((searchData) => {
                                console.log("Search Data Response:", searchData);

                                if (!searchData.items || searchData.items.length === 0) {
                                    relatedVideosContainer.innerHTML = "<p>No related videos found.</p>";
                                    return;
                                }

                                searchData.items.forEach((item) => {
                                    if (item.id && item.id.videoId) {
                                        const video = item.snippet;
                                        const videoElement = document.createElement("div");
                                        videoElement.classList.add("related-video");
                                        videoElement.innerHTML = `
                                            <a href="video.html?videoId=${item.id.videoId}">
                                                <img src="${video.thumbnails.default.url}" alt="${video.title}">
                                                <p>${video.title}</p>
                                                <p>${video.channelTitle}</p>
                                                <p>${new Date(video.publishedAt).toLocaleDateString()}</p>
                                            </a>
                                        `;
                                        relatedVideosContainer.appendChild(videoElement);
                                    }
                                });
                            })
                            .catch((err) => console.error("Error fetching videos by title:", err));

                            return;
                        }

                        relatedVideosData.items.forEach((item) => {
                            if (item.id && item.id.videoId) {
                                const video = item.snippet;
                                const videoElement = document.createElement("div");
                                videoElement.classList.add("related-video");
                                videoElement.innerHTML = `
                                    <a class="related-video-a1" href="video.html?videoId=${item.id.videoId}">
                                        <img src="${video.thumbnails.default.url}" alt="${video.title}">
                                        <p>${video.title}</p>
                                    </a>
                                    <a class="related-video-a2">
                                        <p>${video.channelTitle}</p>
                                        <p>${new Date(video.publishedAt).toLocaleDateString()}</p>
                                    </a>
                                `;
                                relatedVideosContainer.appendChild(videoElement);
                            }
                        });
                    }, 100);
                })
                .catch((err) => console.error("Error fetching related videos:", err));
            })
            .catch((err) => console.error("Error fetching channel data:", err));
        })
        .catch((err) => console.error("Error fetching video data:", err));
    } else if (videoPlayerContainer) {
        // Show error message if no videoId is provided
        videoPlayerContainer.innerHTML = `
            <div class="error-message">
                <h2>No video ID provided</h2>
                <p>Please access this page with a valid YouTube video ID in the URL.</p>
                <p>Example: video.html?videoId=dQw4w9WgXcQ</p>
            </div>
        `;
    }
});