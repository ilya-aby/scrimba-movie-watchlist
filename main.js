import { getMoviesBySearchTerm } from './api.js';
import { getMovieDetailsByID } from './api.js';
import { renderMovie } from './render.js';

const moviesContainer = document.getElementById('movies-container');
const searchInput = document.getElementById('search-input');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById('search-container').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Clear the movies container  
  moviesContainer.innerHTML = '';

  const searchResults = await getMoviesBySearchTerm(searchInput.value);

  for (const movie of searchResults) {
    const movieDetails = await getMovieDetailsByID(movie.imdbID);

    // Do not render movies with less than 50 IMDB votes if the movie year is prior to the current year
    // This eliminates obscure movies without eliminating upcoming movies that haven't been released yet
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    const currentYear = new Date().getFullYear();
    if ((isNaN(imdbVotes) || imdbVotes < 50) && parseInt(movieDetails.Year) < currentYear) {
      break;
    }

    const movieHtml = renderMovie(movieDetails);
    moviesContainer.insertAdjacentHTML('beforeend', movieHtml);
    await delay(75); // Wait between requests to avoid rate limits
  }
});