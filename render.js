export function renderMovie(movie, isInWatchlist, isLiked) {

  if (!movie) {
    return '';
  }

  // Dynamically set the class of the watchlist button based on whether the movie is in watchlist
  const watchlistButtonClass = isInWatchlist ? 'watchlist-button in-watchlist' : 'watchlist-button';
  const likeButtonClass = isLiked ? 'like-button in-likes' : 'like-button';
  return `
      <div class="movie">
        <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} poster" onerror="this.onerror=null; this.src='images/poster-placeholder.png'; this.alt='No poster available';">
        <div class="movie-info">
          <div class="movie-header">
            <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" rel="noopener noreferrer">
              <h2 class="movie-title">${movie.Title}</h2>
            </a>
            <p class="movie-year">${movie.Year}</p>
            ${movie.imdbRating !== "N/A" 
              ? `<p class="movie-rating" title="${movie.imdbVotes} Votes">⭐️ ${movie.imdbRating}</p>` 
              : ''}
            ${movie.Metascore == "N/A" 
              ? ''
              : parseInt(movie.Metascore) < 40 
                ? `<p class="movie-metascore low">${movie.Metascore}</p>`
                : parseInt(movie.Metascore) < 60 
                  ? `<p class="movie-metascore medium">${movie.Metascore}</p>`
                  : `<p class="movie-metascore high">${movie.Metascore}</p>`}
          </div>
          <div class="movie-subhead">
            <p class="movie-runtime">${movie.Runtime}</p>
            <p class="movie-genre">${movie.Genre}</p>
            <div class="movie-action-buttons">
              <button class="${watchlistButtonClass}" data-imdb-id="${movie.imdbID}" title="Watchlist" aria-label="Toggle Watchlist">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clip-rule="evenodd" />
                </svg>        
              </button>
              <button class="${likeButtonClass}" data-imdb-id="${movie.imdbID}" title="Likes" aria-label="Toggle Likes">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
              </button>
            </div>
          </div>
          <p class="movie-description">${movie.Plot}</p>
        </div>
      </div>
    `;
}