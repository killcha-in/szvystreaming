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

        // Create season and episode dropdowns for TV shows
        const seasonDropdown = mediaType === 'tv' ? `
            <label for="seasonSelect-${item.id}">Season:</label>
            <select id="seasonSelect-${item.id}" class="season-select">
                <!-- Seasons will be dynamically loaded here -->
            </select>
            <label for="episodeSelect-${item.id}">Episode:</label>
            <select id="episodeSelect-${item.id}" class="episode-select">
                <!-- Episodes will be dynamically loaded here -->
            </select>
        ` : '';

        itemDiv.innerHTML = `
            <img src="${posterPath}" alt="${item.title || item.name}">
            <h2>${item.title || item.name}</h2>
            <p>Year: ${new Date(item.release_date || item.first_air_date).getFullYear()}</p>
            <p>Rating: ${item.vote_average}</p>
            <label for="sourceSelect-${item.id}">Watch from:</label>
            <select id="sourceSelect-${item.id}" class="source-select">
                ${getSourceOptions(mediaType)}
            </select>
            ${seasonDropdown}  <!-- Only for TV shows -->
            <button class="watch-button" onclick="openSource('${mediaType}', '${item.id}')">Watch</button>
        `;

        moviesList.appendChild(itemDiv);

        // If the media type is 'tv', load season data
        if (mediaType === 'tv') {
            fetchSeasons(item.id); // Fetch seasons for TV shows
        }
    });
}

async function fetchSeasons(tvShowId) {
    const apiKey = '22e40eda03c997570e3dbc0c3a30edbc';
    const seasonURL = `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`;

    try {
        const response = await fetch(seasonURL);
        const data = await response.json();

        const seasonSelect = document.getElementById(`seasonSelect-${tvShowId}`);
        const episodeSelect = document.getElementById(`episodeSelect-${tvShowId}`);

        // Populate season dropdown
        data.seasons.forEach(season => {
            const option = document.createElement('option');
            option.value = season.season_number;
            option.textContent = `Season ${season.season_number}`;
            seasonSelect.appendChild(option);
        });

        // Load episodes for the first season by default
        if (data.seasons.length > 0) {
            fetchEpisodes(tvShowId, data.seasons[0].season_number);
        }

        // Update episodes when a season is selected
        seasonSelect.addEventListener('change', function () {
            const selectedSeason = seasonSelect.value;
            fetchEpisodes(tvShowId, selectedSeason);
        });

    } catch (error) {
        console.error("Error fetching seasons:", error);
    }
}

async function fetchEpisodes(tvShowId, seasonNumber) {
    const apiKey = '22e40eda03c997570e3dbc0c3a30edbc';
    const episodeURL = `https://api.themoviedb.org/3/tv/${tvShowId}/season/${seasonNumber}?api_key=${apiKey}`;

    try {
        const response = await fetch(episodeURL);
        const data = await response.json();

        const episodeSelect = document.getElementById(`episodeSelect-${tvShowId}`);
        episodeSelect.innerHTML = '';

        // Populate episode dropdown
        data.episodes.forEach(episode => {
            const option = document.createElement('option');
            option.value = episode.episode_number;
            option.textContent = `Episode ${episode.episode_number}`;
            episodeSelect.appendChild(option);
        });

    } catch (error) {
        console.error("Error fetching episodes:", error);
    }
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
        { value: 'https://vidsrc.pro/embed/tv/', label: 'vidsrc.pro' },
        { value: 'https://embed.su/embed/tv/', label: 'embed.su' },
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

    const sources = mediaType === 'tv' ? tvSources : movieSources;

    return sources.map(source => `<option value="${source.value}">${source.label}</option>`).join('');
}

function openSource(mediaType, id) {
    const selectedSource = document.getElementById(`sourceSelect-${id}`).value;
    const season = document.getElementById(`seasonSelect-${id}`).value;
    const episode = document.getElementById(`episodeSelect-${id}`).value;
    let watchUrl;

    if (selectedSource === 'multiembed' && mediaType === 'tv') {
        watchUrl = `https://multiembed.mov/?tmdb=1&video_id=${id}&s=${season}&e=${episode}`;
    } else {
        if (mediaType === 'tv') {
            watchUrl = `${selectedSource}${id}/${season}/${episode}`;
        } else {
            watchUrl = `${selectedSource}${id}`;
        }
    }

    window.open(watchUrl, '_blank');
}
