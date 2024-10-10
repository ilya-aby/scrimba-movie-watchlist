import { getMoviesBySearchTerm } from './api.js';
import { renderMovies } from './render-movies.js';

const searchButton = document.getElementById('search-button');
const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search-input');

document.getElementById('search-container').addEventListener('submit', async function(e) {
  e.preventDefault();
  const results = await getMoviesBySearchTerm(searchInput.value);
  console.log(results);
  const movieHtml = renderMovies(results);
  moviesContainer.innerHTML = movieHtml;
});