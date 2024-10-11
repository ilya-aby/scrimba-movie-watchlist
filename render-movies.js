export function renderMovies(movies) {

  const movieHtml = movies.map(movie => {
    if (!movie) {
      return '';
    }

    return `
      <div class="movie" data-imdbid="${movie.imdbID}">
        <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-info">
          <div class="movie-header">
            <h2 class="movie-title">${movie.Title}</h2>
            <p class="movie-year">${movie.Year}</p>
            <p class="movie-rating">⭐️ ${movie.imdbRating}</p>
          </div>
          <div class="movie-subhead">
            <p class="movie-runtime">${movie.Runtime}</p>
            <p class="movie-genre">${movie.Genre}</p>
            <button class="movie-button">Watchlist</button>
          </div>
          <p class="movie-description">${movie.Plot}</p>
        </div>
      </div>
    `;
  }).join('');
  
  return movieHtml;

}
