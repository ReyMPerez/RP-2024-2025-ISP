// Connects the website to movie database
const apiKey = '1e294b7212ca318a2fc2acabc0303a23';
const movieList = document.getElementById('movie-list');

async function fetchMovies(pageNumber) {
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.results;
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

loadAllMovies(); // Load 3 pages when the site loads

// Connects the website to book database
const bookList = document.getElementById('book-list');

async function fetchBooks(page) {
    const startIndex = (page - 1) * 20;
    const response = await fetch(`https://openlibrary.org/search.json?q=bestseller&limit=20&offset=${startIndex}`);
    const data = await response.json();
    return data.docs;
}

async function loadBooks() {
    for (let page = 1; page <= 3; page++) {  // Fetch the first 3 pages (60 books)
        const books = await fetchBooks(page);
        displayBooks(books);
    }
}

function displayBooks(books) {
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book');

        const coverImg = document.createElement('img');
        if (book.cover_i) {
            coverImg.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        } else {
            coverImg.src = 'https://via.placeholder.com/150x200?text=No+Cover';
        }

        const title = document.createElement('div');
        title.classList.add('book-title');
        title.textContent = book.title;

        bookDiv.appendChild(coverImg);
        bookDiv.appendChild(title);
        bookList.appendChild(bookDiv);
    });
}

loadBooks(); // Load the first 60 books when page loads