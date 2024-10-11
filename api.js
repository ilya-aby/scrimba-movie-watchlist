const API_URL = 'https://www.omdbapi.com/';

// Get movies by search term. Since the search endpoint returns only basic movie information,
// we need to make a second request for each movie to get the full details.
export async function getMoviesBySearchTerm(searchTerm) {
  const url = `${API_URL}?s=${searchTerm}&apikey=${API_KEY}&type=movie`;
  const response = await fetch(url);
  const data = await response.json();

  console.log("Search results:", data);

  if (data.Response === "False" || !data.Search || data.Search.length === 0) {
    return [];
  }

  // Filter out movies with "N/A" posters
  const filteredMovies = data.Search.filter(movie => movie.Poster !== "N/A");

  return filteredMovies;
}

// Get movie details by IMDB ID
export async function getMovieDetailsByID(imdbID) {
  try {
    const url = `${API_URL}?i=${imdbID}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Movie details:", data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details: ", error);
    return null;
  }
}

