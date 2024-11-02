document.getElementById('searchButton').addEventListener('click', searchMedia);

function searchMedia() {
    const query = document.getElementById('searchInput').value.trim();
    const mediaType = document.getElementById('mediaType').value;
    if (query) {
        fetchMedia(mediaType, query);
    } else {
        alert("Please enter a title.");
    }
}

async function fetchMedia(mediaType, query) {
    const apiKey = '22e40eda03c997570e3dbc0c3a30edbc';
    const apiURL = `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.total_results > 0) {
            displayMedia(mediaType, data.results);
        } else {
            alert("No results found, try searching something different.");
        }
    } catch (error) {
        console.error("Error fetching media:", error);
    }
}

function displayMedia(mediaType, media) {
    const moviesList = document.getElementById('moviesList');
    moviesList.innerHTML = '';

    media.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('media-item');

        const posterPath = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'placeholder_image_url.jpg';

        itemDiv.innerHTML = `
            <img src="${posterPath}" alt="${item.title || item.name}">
            <h2>${item.title || item.name}</h2>
            <p>Year: ${new Date(item.release_date || item.first_air_date).getFullYear()}</p>
            <p>Rating: ${item.vote_average}</p>
            <label for="sourceSelect-${item.id}">Watch from:</label>
            <select id="sourceSelect-${item.id}" class="source-select">
                ${getSourceOptions(mediaType)}
            </select>
            <button class="watch-button" onclick="openSource('${mediaType}', '${item.id}')">Watch</button>
        `;

        moviesList.appendChild(itemDiv);
    });
}

function getSourceOptions(mediaType) {
    const movieSources = [
        { value: 'https://vidsrc.pro/embed/movie/', label: 'vidsrc.pro' },
        { value: 'https://embed.su/embed/movie/', label: 'embed.su' },
        { value: 'https://multiembed.mov/?tmdb=1&video_id=', label: 'multiembed' },
        { value: 'https://vidlink.pro/movie/', label: 'vidlink' },
        { value: 'https://vidbinge.dev/embed/movie/', label: 'vidbinge' },
        { value: 'https://vidsrc.vip/embed/movie/', label: 'vidsrc.vip' },
        { value: 'https://moviesapi.club/movie/', label: 'moviesapi.club' },
        { value: 'https://vidsrc.icu/embed/movie/', label: 'vidsrc.icu' },
        { value: 'https://player.vidsrc.nl/embed/movie/', label: 'vidsrc.nl' },
        { value: 'https://vidsrc.cc/v2/embed/movie/', label: 'vidsrc.cc' },
        { value: 'https://www.2embed.cc/embed/', label: '2embed' },
        { value: 'https://player.autoembed.cc/embed/movie/', label: 'autoembed' }
    ];

    const tvSources = [
        { value: 'tvsrc.net', label: 'tvsrc.net' },
        // hey so like this doesnt work yet, im working on it tho. sorry :3
    ];

    const sources = mediaType === 'tv' ? tvSources : movieSources;

    return sources.map(source => `<option value="${source.value}">${source.label}</option>`).join('');
}

function openSource(mediaType, id) {
    const selectedSource = document.getElementById(`sourceSelect-${id}`).value;
    let watchUrl;

    if (mediaType === 'tv') {
        const tvSources = selectedSource;
        watchUrl = `${tvSources}${id}`;
    } else {
        watchUrl = `${selectedSource}${id}`;
    }

    window.open(watchUrl, '_blank');
}
