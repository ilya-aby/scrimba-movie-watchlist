import { getMoviesBySearchTerm } from './api.js';
import { getMovieDetailsByID } from './api.js';
import { renderMovie } from './render.js';

const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search-input');
let watchlist

document.getElementById('search-container').addEventListener('submit', async function(e) {
  e.preventDefault();
  await handleSearch(searchInput.value);
});

document.getElementById('movies-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('watchlist-button')) {
    const imdbID = e.target.dataset.imdbid;
    handleWatchlistUpdate(imdbID);
    e.target.classList.toggle('in-watchlist');
  }
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchWatchlist() {
  watchlist = new Set(JSON.parse(localStorage.getItem('watchlist')) || []);
}

function handleWatchlistUpdate(imdbID) {
  if (watchlist.has(imdbID)) {
    watchlist.delete(imdbID);
  } else {
    watchlist.add(imdbID);
  }

  // Save the updated watchlist
  localStorage.setItem('watchlist', JSON.stringify(Array.from(watchlist)));
}

async function handleSearch(searchTerm) {
  // Clear the movies container  
  moviesContainer.innerHTML = '';

  const searchResults = await getMoviesBySearchTerm(searchInput.value);

  for (const movie of searchResults) {
    const movieDetails = await getMovieDetailsByID(movie.imdbID);

    // Don't render movies with <50 IMDB votes if the movie year is in the past
    // This eliminates obscure movies w/o eliminating upcoming movies with no ratings
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    const currentYear = new Date().getFullYear();
    if ((isNaN(imdbVotes) || imdbVotes < 50) && parseInt(movieDetails.Year) < currentYear) {
      break;
    }

    const isInWatchlist = watchlist.has(movie.imdbID);
    const movieHtml = renderMovie(movieDetails, isInWatchlist);
    moviesContainer.insertAdjacentHTML('beforeend', movieHtml);
    await delay(100); // Wait between requests to avoid rate limits
  }
}

fetchWatchlist();