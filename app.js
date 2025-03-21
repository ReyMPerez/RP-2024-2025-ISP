// Connects the website to movie database
const apiKey = '1e294b7212ca318a2fc2acabc0303a23';
const movieList = document.getElementById('movie-list');

const movieFallback = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800';

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
        poster.src = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : movieFallback; // If no image available
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

const bookFallback = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800';

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
        coverImg.src = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
            : bookFallback; // If no image available
        coverImg.alt = book.title;

        const title = document.createElement('div');
        title.classList.add('book-title');
        title.textContent = book.title;

        bookDiv.appendChild(coverImg);
        bookDiv.appendChild(title);
        bookList.appendChild(bookDiv);
    });
}

loadBooks(); // Load the first 60 books when page loads