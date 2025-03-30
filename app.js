// Connects the website to movie database
const apiKey = '1e294b7212ca318a2fc2acabc0303a23';
const movieList = document.getElementById('movie-list');

const movieFallback = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800';

async function findMovies(pageNumber = 1) {
    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        const sortedMovies = data.results.sort((a, b) => b.popularity - a.popularity);

        return sortedMovies;
    } catch (error) {
        console.error("Error fetching movies:", error);
        return [];
    }
}

async function loadAllMovies() {
    const allMovies = [];
    for (let page = 1; page <= 3; page++) {  // Fetching the first 3 pages (60 movies)
        const movies = await findMovies(page);
        allMovies.push(...movies);
    }
    
    const sortedMovies = allMovies.sort((a, b) => b.popularity - a.popularity);

    displayMovies(sortedMovies);
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = "";

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
const seenBooks = new Set();

const bookFallback = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800';

async function fetchBooks(page) {
    const response = await fetch(`https://openlibrary.org/search.json?q=bestseller&limit=20&page=${page}`);
    const data = await response.json();
    return data.docs || [];
}

async function loadBooks() {
    bookList.innerHTML = ""; // Clear list to prevent duplication
    seenBooks.clear(); // Reset tracking of books

    let totalBooks = 0;
    let page = 1;

    while (totalBooks < 60) {
        const books = await fetchBooks(page);
        if (books.length === 0) break; // Stop if no more books are returned

        books.forEach(book => {
            if (!seenBooks.has(book.key) && totalBooks < 60) { // Ensure uniqueness and max 60 books
                seenBooks.add(book.key);
                displayBook(book);
                totalBooks++;
            }
        });

        page++; // Move to the next page for new books
    }
}

function displayBook(book) {
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
}

loadBooks(); // Load the first 60 books when page loads

// Allows for the user to search
const searchInput = document.querySelector('.search-container input');
const searchButton = document.querySelector('.search-container button');
const searchResults = document.createElement('div');
searchResults.classList.add('search-results');
document.body.appendChild(searchResults);

const movieResultsContainer = document.getElementById("movie-results");
const bookResultsContainer = document.getElementById("book-results");

const resultFallback = 'https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800';

searchButton.addEventListener('click', searchMovies);
searchButton.addEventListener('click', searchBooks);

document.getElementById("search-movie-button").addEventListener("click", function() {
    const query = document.getElementById("search-movie-input").value.trim();
    if (!query) {
        movieResultsContainer.innerHTML = ""; // Clear results if input is empty
        return;
    }
    searchMovies(query);
});

document.getElementById("search-book-button").addEventListener("click", function() {
    const query = document.getElementById("search-book-input").value.trim();
    if (!query) {
        bookResultsContainer.innerHTML = ""; // Clear results if input is empty
        return;
    }
    searchBooks(query);
});

async function searchMovies(query) {
    movieResultsContainer.innerHTML = ""; // Clear previous results

    try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const movieData = await movieResponse.json();
        const movies = movieData.results || [];

        movies.forEach(movie => { // Display movies
            const movieDiv = document.createElement("div");
            movieDiv.classList.add("movie");

            const poster = document.createElement("img");
            poster.src = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                : resultFallback; // If no image available
            poster.alt = movie.title;

            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = movie.title;

            movieDiv.appendChild(poster);
            movieDiv.appendChild(title);
            movieResultsContainer.appendChild(movieDiv);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        movieResultsContainer.innerHTML = "<div class='error'>Error loading movies. Try again.</div>";
    }
}

async function searchBooks(query) {
    bookResultsContainer.innerHTML = ""; // Clear previous results

    try {
        const bookResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=15`);
        const bookData = await bookResponse.json();
        const books = bookData.docs || [];

        books.forEach(book => { // Display books
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book");

            const coverImg = document.createElement("img");
            coverImg.src = book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
                : resultFallback; // If no image available
            coverImg.alt = book.title;

            const title = document.createElement("div");
            title.classList.add("title");
            title.textContent = book.title;

            bookDiv.appendChild(coverImg);
            bookDiv.appendChild(title);
            bookResultsContainer.appendChild(bookDiv);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        bookResultsContainer.innerHTML = "<div class='error'>Error loading books. Try again.</div>";
    }
}

async function fetchMovies(query) { // Fetch movies from TMDb
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
}

async function fetchBooks(query) { // Fetch books from Open Library
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.docs || [];
    } catch (error) {
        console.error("Error fetching book data:", error);
        return []; // Return an empty array if there's an error
    }
}

function displayMovieResults(movies) { // Display search results
    searchResults.innerHTML = ""; // Clear previous results

    if (movies.length === 0) {
        searchResults.innerHTML = "<p>No results found.</p>";
        return;
    }

    const container = document.createElement('div');
    container.classList.add('search-container-results');

    movies.forEach(movie => { // Add movies
        container.appendChild(createMediaItem(
            movie.title,
            movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movieFallback
        ));
    });

    searchResults.appendChild(container);
}

function displayBookResults(books) { // Display search results
    searchResults.innerHTML = ""; // Clear previous results

    if (books.length === 0) {
        searchResults.innerHTML = "<p>No results found.</p>";
        return;
    }

    const container = document.createElement('div');
    container.classList.add('search-container-results');

    books.forEach(book => { // Add books
        container.appendChild(createMediaItem(
            book.title,
            book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : bookFallback
        ));
    });

    searchResults.appendChild(container);
}

function createMediaItem(title, imgSrc) { // Helper function to create a media item
    const mediaDiv = document.createElement('div');
    mediaDiv.classList.add('media-item');

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = title;

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('media-title');
    titleDiv.textContent = title;

    mediaDiv.appendChild(img);
    mediaDiv.appendChild(titleDiv);
    return mediaDiv;
}