import { updateCache } from './storage.js';

const API_URL = 'https://www.omdbapi.com/';

// Get movies by search term. Since the search endpoint returns only basic movie information,
// we need to make a second request for each movie to get the full details.
export async function getMoviesBySearchTerm(searchTerm) {
  const url = `${API_URL}?s=${searchTerm}&apikey=${API_KEY}&type=movie`;
  const response = await fetch(url);
  const data = await response.json();

  console.table("Search results:", data);

  if (data.Response === "False" || !data.Search || data.Search.length === 0) {
    return [];
  }

  // Filter out movies with "N/A" posters
  const filteredMovies = data.Search.filter(movie => movie.Poster !== "N/A");

  return filteredMovies;
}

// Get movie details by IMDB ID
// If the movie is in the cache, return it from the cache
// Otherwise, fetch the movie details from the API and add them to the cache
export async function getMovieDetailsById(imdbId) {
  try {
    const url = `${API_URL}?i=${imdbId}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Movie details:", data);
    updateCache(imdbId, data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details: ", error);
    return null;
  }
}

