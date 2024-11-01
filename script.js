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
            displayMedia(data.results);
        } else {
            alert("No results found, try searching something different.");
        }
    } catch (error) {
        console.error("Error fetching media:", error);
    }
}

function displayMedia(media) {
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
                <option value="vidsrc.pro">vidsrc.pro</option>
                <option value="vidsrc.rip">vidsrc.rip (no ads)</option>
                <option value="superembed">superembed</option>
                <option value="vidlink">vidlink (no ads)</option>
                <option value="vidbinge">vidbinge</option>
                <option value="vidsrc.vip">vidsrc.vip</option>
                <option value="moviesclub">moviesclub</option>
                <option value="vidsrc.icu">vidsrc.icu</option>
                <option value="vidsrc.nl">vidsrc.nl (no ads)</option>
                <option value="vidsrc.cc">vidsrc.cc</option>
                <option value="2embed">2embed</option>
                <option value="autoembed">autoembed</option>
                <option value="vidsrc.xyz">vidsrc.xyz</option>
            </select>
            <button class="watch-button" onclick="openSource('${item.id}')">Watch</button>
        `;

        moviesList.appendChild(itemDiv);
    });
}

function openSource(id) {
    const selectedSource = document.getElementById(`sourceSelect-${id}`).value;
    const watchUrl = `https://${selectedSource}/embed/${id}`;
    window.open(watchUrl, '_blank');
}
