export let watchlist;
export let likes;
export let cache;

// Util function to fetch watchlist, likes, and cache from localStorage or initiate them
export function fetchLists() {
  watchlist = new Set(JSON.parse(localStorage.getItem('watchlist')) || []);
  likes = new Set(JSON.parse(localStorage.getItem('likes')) || []);
  cache = JSON.parse(localStorage.getItem('cache')) || {};
}

export function toggleWatchlistStatus(imdbID) {
  if (watchlist.has(imdbID)) {
    watchlist.delete(imdbID);
  } else {
    watchlist.add(imdbID);
  }

  localStorage.setItem('watchlist', JSON.stringify(Array.from(watchlist)));
}

export function toggleLikeStatus(imdbID) {
  console.log("Toggling like status for", imdbID);
  if (likes.has(imdbID)) {
    likes.delete(imdbID);
  } else {
    likes.add(imdbID);
  }

  localStorage.setItem('likes', JSON.stringify(Array.from(likes)));
}

// Update the cache with movie details
// We only cache the fields that are used in the render function to save space
export function updateCache(imdbId, movieDetails) {
  const { Title, Year, Poster, imdbRating, imdbVotes, Metascore, Runtime, Genre, Plot, imdbID } = movieDetails;
  cache[imdbId] = { Title, Year, Poster, imdbRating, imdbVotes, Metascore, Runtime, Genre, Plot, imdbID };
  localStorage.setItem('cache', JSON.stringify(cache));
}