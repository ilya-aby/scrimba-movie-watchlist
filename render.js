export function renderMovie(movie) {

  if (!movie) {
    return '';
  }   

  return `
      <div class="movie">
        <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-info">
          <div class="movie-header">
            <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" rel="noopener noreferrer">
              <h2 class="movie-title">${movie.Title}</h2>
            </a>
            <p class="movie-year">${movie.Year}</p>
            ${movie.imdbRating !== "N/A" 
              ? `<p class="movie-rating" title="${movie.imdbVotes} Votes">⭐️ ${movie.imdbRating}</p>` 
              : ''}
          </div>
          <div class="movie-subhead">
            <p class="movie-runtime">${movie.Runtime}</p>
            <p class="movie-genre">${movie.Genre}</p>
            <button class="watchlist-button" data-imdbid="${movie.imdbID}">Watchlist</button>
          </div>
          <p class="movie-description">${movie.Plot}</p>
        </div>
      </div>
    `;

}
