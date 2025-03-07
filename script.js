// Get elements
let leftMenuBtn = document.querySelector('#slid_btn');
let leftMenu = document.querySelector('#left_menu');
let bottomPart = document.querySelector('#bottom_part');

// Toggle sidebar
leftMenuBtn.addEventListener('click', () => {
    leftMenu.classList.toggle('shrink');

    if (leftMenu.classList.contains('shrink')) {
        bottomPart.style.gridTemplateColumns = "90px 1fr"; // Sidebar shrinks
    } else {
        bottomPart.style.gridTemplateColumns = "250px 1fr"; // Sidebar expands
    }
});



const API_KEY = "AIzaSyBk1GX9jKO4rF0jOPFkGkuvJNTuUolI6Eg"; 
const VIDEO_CONTAINER = document.getElementById("video-container");



async function fetchVideos() {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=50&regionCode=IN`
        );
        const data = await response.json();
        displayVideos(data.items);
    } catch (error) {
        console.error("Error fetching videos:", error);
        VIDEO_CONTAINER.innerHTML = "<h2>Failed to load videos</h2>";
    }
}

// Fetch channel image by channelId
async function getChannelImage(channelId) {
    const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&part=snippet&id=${channelId}`
    );
    const data = await response.json();
    return data.items[0].snippet.thumbnails.default.url; // Returning channel image URL
}

// Convert ISO 8601 duration to a readable format (e.g., PT14M23S -> 14:23)
function convertDuration(isoDuration) {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matches = isoDuration.match(regex);

    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;

    return `${hours ? `${hours}:` : ''}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

async function displayVideos(videos) {
    VIDEO_CONTAINER.innerHTML = ""; // Clear the existing content

    for (const video of videos) {
        const channelImage = await getChannelImage(video.snippet.channelId); // Fetch channel image
        const duration = convertDuration(video.contentDetails.duration); // Convert ISO 8601 duration to readable format

        const videoElement = document.createElement("div");
        videoElement.classList.add("first-video");

        videoElement.innerHTML = `
            <div class="row">
                <img class="thum1" src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <div class="videotime">${duration}</div> <!-- Display video duration -->
            </div>
            <div class="video-info-grid">
                <div class="chanel-pic">
                    <img class="pic" src="${channelImage}" alt="Channel Picture">
                </div>
                <div class="info">
                    <p class="title">${video.snippet.title}</p>
                    <p class="name">${video.snippet.channelTitle}</p>
                    <p class="stats">${video.statistics.viewCount} views &#183; 6 months ago</p>
                </div>
            </div>
        `;

        videoElement.addEventListener('click', () => {
            window.location.href = `video-details.html?videoId=${video.id}`;
        });

        VIDEO_CONTAINER.appendChild(videoElement);
    }
}

// Fetch videos on page load
fetchVideos();
