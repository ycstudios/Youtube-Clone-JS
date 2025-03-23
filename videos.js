// YouTube Video Playback Script
// Store API key in a constant - replace YOUR_API_KEY with your actual YouTube API key
const API_KEY = "AIzaSyCiiI8KaUKPCPv7XRn8LLc605P9sywljIU";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('videoId'); // Retrieve videoId from the query parameter
    console.log("Current Video ID:", videoId);

    const videoPlayerContainer = document.querySelector("#video-player");
    const videoContainer = document.getElementById('video-container');

    // YouTube API Endpoints
    const videoApiUrl = "https://www.googleapis.com/youtube/v3/videos?";
    const channelApiUrl = "https://www.googleapis.com/youtube/v3/channels?";
    const relatedVideosApiUrl = "https://www.googleapis.com/youtube/v3/search?";

    // Embed the video iframe if the videoId is present and video-container exists
    if (videoId && videoContainer) {
        videoContainer.innerHTML = `
<iframe width="1000" height="550" src="https://www.youtube.com/embed/${videoId}" 
    title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

        `;
    }

    // Fetch video and related details if videoPlayerContainer is found and videoId is present
    if (videoId && videoPlayerContainer) {
        fetch(videoApiUrl + new URLSearchParams({
            key: API_KEY,
            part: "snippet,statistics",
            id: videoId,
        }))
            .then((response) => response.json())
            .then((data) => {
                console.log("Video Data:", data);
                if (!data.items || data.items.length === 0) {
                    console.error("Video data not found.");
                    return;
                }

                const videoData = data.items[0];
                const videoTitle = videoData.snippet.title;
                const channelId = videoData.snippet.channelId;
                const likeCount = videoData.statistics.likeCount;

                // Fetch channel data for channel thumbnail and display video details
                fetch(channelApiUrl + new URLSearchParams({
                    key: API_KEY,
                    part: "snippet",
                    id: channelId,
                }))
                    .then((response) => response.json())
                    .then((channelData) => {
                        if (!channelData.items || channelData.items.length === 0) {
                            console.error("Channel data not found.");
                            return;
                        }

                        const channelThumbnail = channelData.items[0].snippet.thumbnails.default.url;

                        videoPlayerContainer.innerHTML = `
                            <div class="video-div">
                                <div class="videoPage-video-container">
                                    <iframe class="videoPage-video" src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
                                    <h1 class="videoPage-title">${videoTitle}</h1>
                                </div>                    

                                <div class="videoPage-channel">
                                    <div class="videoPage-channel-container">
                                        <div class="videoPage-channel-icon-container">
                                            <img src="${channelThumbnail}" class="videoPage-channel-icon" alt="">
                                            <p class="videoPage-channel-text">${videoData.snippet.channelTitle}</p>
                                        </div>

                                        <div class="videoPage-likes-dislikes">
                                            <button id="like-button"><i class="fa-solid fa-thumbs-up"></i> ${likeCount}</button>
                                            <button id="dislike-button"><i class="fa-solid fa-thumbs-down"></i></button>
                                        </div>
                                    </div>

                                    <div class="videoPage-description-text">
                                        <p>Description</p>
                                        <p id="description">${videoData.snippet.description}</p>
                                        <button id="see-more-button">See More</button>
                                    </div>
                                </div>
                            </div>

                            <div class="related-videos-container">
                                <h2>Related Videos</h2>
                                <div id="related-videos">Loading...</div>
                            </div>
                        `;

                        // Like and Dislike buttons functionality
                        document.getElementById("like-button").addEventListener("click", () => console.log("Liked!"));
                        document.getElementById("dislike-button").addEventListener("click", () => console.log("Disliked!"));

                        // See More and See Less toggle for video description
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

                        // Fetch and display related videos
                        fetchRelatedVideos(videoId, videoTitle);
                    })
                    .catch((err) => console.error("Error fetching channel data:", err));
            })
            .catch((err) => console.error("Error fetching video data:", err));
    } else if (videoPlayerContainer) {
        // Show error message if no videoId is provided in the URL
        videoPlayerContainer.innerHTML = `
            <div class="error-message">
                <h2>No video ID provided</h2>
                <p>Please access this page with a valid YouTube video ID in the URL.</p>
                <p>Example: video-details.html?videoId=dQw4w9WgXcQ</p>
            </div>
        `;
    }

    // Function to fetch related videos
    function fetchRelatedVideos(videoId, videoTitle) {
        fetch(relatedVideosApiUrl + new URLSearchParams({
            key: API_KEY,
            part: "snippet",
            relatedToVideoId: videoId,
            type: "video",
            maxResults: 10,
        }))
            .then((response) => response.json())
            .then((data) => {
                const relatedVideosContainer = document.getElementById("related-videos");
                relatedVideosContainer.innerHTML = "";

                if (!data.items || data.items.length === 0) {
                    console.warn("No related videos found. Searching by title...");
                    searchVideosByTitle(videoTitle);
                    return;
                }

                displayRelatedVideos(data.items);
            })
            .catch((err) => console.error("Error fetching related videos:", err));
    }

    // Function to search videos by title (fallback if no related videos are found)
    function searchVideosByTitle(title) {
        fetch(relatedVideosApiUrl + new URLSearchParams({
            key: API_KEY,
            part: "snippet",
            q: title,
            type: "video",
            maxResults: 10,
        }))
            .then((response) => response.json())
            .then((data) => displayRelatedVideos(data.items))
            .catch((err) => console.error("Error searching videos by title:", err));
    }

    // Function to display related videos
    function displayRelatedVideos(videos) {
        const relatedVideosContainer = document.getElementById("related-videos");

        videos.forEach((item) => {
            if (item.id && item.id.videoId) {
                const video = item.snippet;
                const videoElement = document.createElement("div");
                videoElement.classList.add("related-video");
                videoElement.innerHTML = `
                    <a class="related-video-a1" href="video-details.html?videoId=${item.id.videoId}">
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
    }
});
