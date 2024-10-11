// Serverless functions to fetch movie data from OMDB
// This allows us to avoid exposing our API key in the client-side code
// Our API key is stored in Netlify environment variables

exports.handler = async (event, context) => {
  const API_KEY = process.env.OMDB_API_KEY;
  const { searchTerm, imdbId } = event.queryStringParameters;
  
  let omdbUrl;
  if (searchTerm) {
    omdbUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`;
  } else if (imdbId) {
    omdbUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbId}`;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing searchTerm or imdbId parameter' }),
    };
  }
  
  try {
    const response = await fetch(omdbUrl);
    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data' }),
    };
  }
};