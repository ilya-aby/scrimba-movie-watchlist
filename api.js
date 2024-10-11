import { updateCache } from './storage.js';

// URL for our serverless function that proxies OMDB requests
const API_URL = '/.netlify/functions/movieFetch';

// Get movies by search term. Since the search endpoint returns only basic movie information,
// we need to make a second request for each movie to get the full details.
export async function getMoviesBySearchTerm(searchTerm) {
  const url = `${API_URL}?searchTerm=${encodeURIComponent(searchTerm)}`;
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

// Get movie details by IMDB ID & store in cache
export async function getMovieDetailsById(imdbId) {
  try {
    const url = `${API_URL}?imdbId=${imdbId}`;
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

