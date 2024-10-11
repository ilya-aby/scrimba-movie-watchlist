import { getMoviesBySearchTerm } from './api.js';
import { getMovieDetailsByID } from './api.js';
import { renderMovie } from './render.js';

const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search-input');
let watchlist
let likes

document.getElementById('search-container').addEventListener('submit', async function(e) {
  e.preventDefault();
  await handleSearch(searchInput.value);
});

document.getElementById('movies-container').addEventListener('click', function(e) {
  const button = e.target.closest('.watchlist-button');
  if (button) {
    const imdbID = button.dataset.imdbid;
    handleWatchlistUpdate(imdbID);
    button.classList.toggle('in-watchlist');
  }
});

document.getElementById('movies-container').addEventListener('click', function(e) {
  const button = e.target.closest('.like-button');
  if (button) {
    const imdbID = button.dataset.imdbid;
    handleLikeUpdate(imdbID);
    button.classList.toggle('in-likes');
  }
});

document.getElementById('open-watchlist').addEventListener('click', function() {
  handleShowWatchlist();
});

document.getElementById('open-likes').addEventListener('click', function() {
  handleShowLikes();
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchLists() {
  watchlist = new Set(JSON.parse(localStorage.getItem('watchlist')) || []);
  likes = new Set(JSON.parse(localStorage.getItem('likes')) || []);
}

function handleWatchlistUpdate(imdbID) {
  if (watchlist.has(imdbID)) {
    watchlist.delete(imdbID);
  } else {
    watchlist.add(imdbID);
  }

  localStorage.setItem('watchlist', JSON.stringify(Array.from(watchlist)));
}

function handleLikeUpdate(imdbID) {
  if (likes.has(imdbID)) {
    likes.delete(imdbID);
  } else {
    likes.add(imdbID);
  }

  localStorage.setItem('likes', JSON.stringify(Array.from(likes)));
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

async function handleSearch(searchTerm) {
  moviesContainer.innerHTML = '';
  const searchResults = await getMoviesBySearchTerm(searchInput.value);
  const imdbIDs = searchResults.map(movie => movie.imdbID);

  if (imdbIDs.length === 0) {
    moviesContainer.classList.add('empty');
    moviesContainer.innerHTML = '<p class="placeholder-text">We couldn\'t find any results for that search. Please try again.</p>';
    return;
  }

  await renderMoviesFromIDs(imdbIDs);
}

async function renderMoviesFromIDs(imdbIDs) {
  moviesContainer.classList.remove('empty');
  for (const imdbID of imdbIDs) {
    const movieDetails = await getMovieDetailsByID(imdbID);

    // Don't render movies with <50 IMDB votes if the movie year is in the past
    // This eliminates obscure movies w/o eliminating upcoming movies with no ratings
    // We early-terminate the loop to avoid unnecessary requests because the results are sorted by votes
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    const currentYear = new Date().getFullYear();
    if ((isNaN(imdbVotes) || imdbVotes < 50) && parseInt(movieDetails.Year) < currentYear) {
      break;
    }

    const isInWatchlist = watchlist.has(imdbID);
    const isLiked = likes.has(imdbID);
    const movieHtml = renderMovie(movieDetails, isInWatchlist, isLiked);
    moviesContainer.insertAdjacentHTML('beforeend', movieHtml);
    await delay(100); // Wait between requests to avoid rate limits
  }
}

fetchLists();