// Get elements
let leftMenuBtn = document.querySelector('#slid_btn');
let leftMenu = document.querySelector('#left_menu');
let bottomPart = document.querySelector('#bottom_part');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('s_icon');
const sidebar=document.getElementById('left_menu')

// Toggle sidebar
leftMenuBtn.addEventListener('click', () => {
    leftMenu.classList.toggle('shrink');

    if (leftMenu.classList.contains('shrink')) {
        bottomPart.style.gridTemplateColumns = "90px 1fr"; // Sidebar shrinks
    } else {
        bottomPart.style.gridTemplateColumns = "250px 1fr"; // Sidebar expands
    }
});

const API_KEY = "AIzaSyA5lScQ5BFaFVIMA8QLkGhI2Xs_OpLzXLw";
const VIDEO_CONTAINER = document.getElementById("video-container");
const FILTER_BUTTONS = document.querySelectorAll(".filter-btn");

// Function to fech videos based on category or search query
async function fetchVideos(category = "mostPopular", searchQuery = "") {
    try {
        let url;
        
        if (searchQuery) {
            url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&q=${searchQuery}&maxResults=50&regionCode=IN`;
        } else if (category !== "mostPopular") {
            url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&q=${category}&maxResults=50&regionCode=IN`;
        } else {
            url = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=50&regionCode=IN`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        // Clear active filter buttons when searching
        if (searchQuery) {
            FILTER_BUTTONS.forEach(btn => btn.classList.remove("active"));
        }
        
        displayVideos(data.items);
    } catch (error) {
        console.error("Error fetching videos:", error);
        VIDEO_CONTAINER.innerHTML = "<h2>Failed to load videos</h2>";
    }
}

// Fetch channel image by channelId
async function getChannelImage(channelId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?key=${API_KEY}&part=snippet&id=${channelId}`);
        const data = await response.json();
        return data.items[0]?.snippet?.thumbnails?.default?.url || "";
    } catch (error) {
        console.error("Error fetching channel image:", error);
        return "";
    }
}

// Convert ISO 8601 duration to readable format
function convertDuration(isoDuration) {
    const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
    const matches = isoDuration.match(regex);

    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;

    return `${hours ? `${hours}:` : ""}${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}


async function displayVideos(videos) {
    VIDEO_CONTAINER.innerHTML = "";

    if (videos.length === 0) {
        VIDEO_CONTAINER.innerHTML = "<h2>No videos found</h2>";
        return;
    }

    for (const video of videos) {
        const videoId = video.id?.videoId || video.id; 
        const channelImage = await getChannelImage(video.snippet.channelId);
        const duration = video.contentDetails ? convertDuration(video.contentDetails.duration) : "N/A"; 

        const videoElement = document.createElement("div");
        videoElement.classList.add("first-video");

        videoElement.innerHTML = `
            <div class="row">
                <img class="thum1" src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <div class="videotime">${duration}</div>
            </div>
            <div class="video-info-grid">
                <div class="chanel-pic">
                    <img class="pic" src="${channelImage}" alt="Channel Picture">
                </div>
                <div class="info">
                    <p class="title">${video.snippet.title}</p>
                    <p class="name">${video.snippet.channelTitle}</p>
                    <p class="stats">${video.statistics?.viewCount || "N/A"} views</p>
                </div>
            </div>
        `;

        videoElement.addEventListener("click", () => {
            window.location.href = `video-details.html?videoId=${videoId}`;
        });

        VIDEO_CONTAINER.appendChild(videoElement);
    }
}

FILTER_BUTTONS.forEach((button) => {
    button.addEventListener("click", () => {
        searchInput.value = "";
        
        FILTER_BUTTONS.forEach(btn => btn.classList.remove("active"));


        button.classList.add("active");


        const category = button.innerText.toLowerCase();
        fetchVideos(category);
    });
});

function handleSearch() {
    const query = searchInput.value.trim();
    if (query) {
        fetchVideos("", query);
    }
}


searchButton.addEventListener('click', handleSearch);


searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});


fetchVideos();