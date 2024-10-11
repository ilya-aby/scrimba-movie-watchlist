import { getMoviesBySearchTerm } from './api.js';
import { getMovieDetailsById } from './api.js';
import { renderMovie } from './render.js';
import { fetchLists, watchlist, likes, cache, toggleWatchlistStatus, toggleLikeStatus } from './storage.js';
import { TOP_FILMS } from './top-films.js';

const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search-input');
let currentSearchTerm = '';

document.getElementById('search-container').addEventListener('submit', async function(e) {
  e.preventDefault();
  await handleSearch(searchInput.value);
});

document.getElementById('movies-container').addEventListener('click', function(e) {
  const watchlistButton = e.target.closest('.watchlist-button');
  const likeButton = e.target.closest('.like-button');
  if (watchlistButton) {
    toggleWatchlistStatus(watchlistButton.dataset.imdbId);
    watchlistButton.classList.toggle('in-watchlist');
  } else if (likeButton) {
    toggleLikeStatus(likeButton.dataset.imdbId);
    likeButton.classList.toggle('in-likes');
  }
});

document.getElementById('open-watchlist').addEventListener('click', function() {
  handleShowWatchlist();
});

document.getElementById('open-likes').addEventListener('click', function() {
  handleShowLikes();
});

document.getElementById('open-top-films').addEventListener('click', function() {
  handleShowTopFilms();
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleShowLikes() {
  moviesContainer.innerHTML = '';
  
  if (likes.size === 0) {
    moviesContainer.classList.add('empty');
    moviesContainer.innerHTML = '<p class="placeholder-text">You haven\'t liked any movies yet.</p>';
    return;
  }

  await renderMoviesFromIDs(Array.from(likes).reverse());
}

async function handleShowWatchlist() {
  moviesContainer.innerHTML = '';

  if (watchlist.size === 0) {
    moviesContainer.classList.add('empty');
    moviesContainer.innerHTML = '<p class="placeholder-text">Your watchlist is empty.</p>';
    return;
  }

  await renderMoviesFromIDs(Array.from(watchlist).reverse());
}

async function handleShowTopFilms() {
  moviesContainer.innerHTML = '';
  await renderMoviesFromIDs(TOP_FILMS);
}

async function handleSearch(searchTerm) {
  currentSearchTerm = searchTerm;
  moviesContainer.innerHTML = '';
  const searchResults = await getMoviesBySearchTerm(searchInput.value);
  const imdbIds = searchResults.map(movie => movie.imdbID);

  if (imdbIds.length === 0) {
    moviesContainer.classList.add('empty');
    moviesContainer.innerHTML = '<p class="placeholder-text">We couldn\'t find any results for that search. Please try again.</p>';
    return;
  }

  await renderMoviesFromIDs(imdbIds, searchTerm);
}

async function renderMoviesFromIDs(imdbIDs, searchTerm=null) {
  moviesContainer.classList.remove('empty');
  for (const imdbId of imdbIDs) {
    let movieDetails;
    let shouldRateLimit = false;

    if (searchTerm && currentSearchTerm !== searchTerm) {
      console.log('Search term changed, stopping render');
      console.log('Current search term:', currentSearchTerm);
      console.log('New search term:', searchTerm);
      console.log(`${imdbId} not rendered and now aborting`);
      return;
    }

    if (cache[imdbId]) {
      movieDetails = cache[imdbId];
    } else {
      movieDetails = await getMovieDetailsById(imdbId);
      shouldRateLimit = true;
    }

    // Don't render movies with <50 IMDB votes if the movie year is in the past
    // This eliminates obscure movies w/o eliminating upcoming movies with no ratings
    // We early-terminate the loop to avoid unnecessary requests because the results are sorted by votes
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    const currentYear = new Date().getFullYear();
    if ((isNaN(imdbVotes) || imdbVotes < 50) && parseInt(movieDetails.Year) < currentYear) {
      break;
    }

    const movieHtml = renderMovie(movieDetails, watchlist.has(imdbId), likes.has(imdbId));
    moviesContainer.insertAdjacentHTML('beforeend', movieHtml);
    await delay(shouldRateLimit ? 100 : 0); // Wait between requests to avoid rate limits
  }
}

fetchLists();