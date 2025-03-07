const apiKey = '1e294b7212ca318a2fc2acabc0303a23';
const movieList = document.getElementById('movie-list');

async function fetchMovies(pageNumber) {
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;  // This is the array of movies for the page
}

async function loadAllMovies() {
    for (let page = 1; page <= 3; page++) {   // Fetch the first 3 pages (60 movies)
        const movies = await fetchMovies(page);
        displayMovies(movies);
    }
}

function displayMovies(movies) {
    movies.forEach(movie => {
        const movieDiv = document.createElement('div');
        movieDiv.classList.add('movie');

        const poster = document.createElement('img');
        poster.src = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;
        poster.alt = movie.title;

        const title = document.createElement('div');
        title.classList.add('movie-title');
        title.textContent = movie.title;

        movieDiv.appendChild(poster);
        movieDiv.appendChild(title);
        movieList.appendChild(movieDiv);
    });
}

// Load 3 pages when the site loads
loadAllMovies();