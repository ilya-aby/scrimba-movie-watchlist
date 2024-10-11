exports.handler = async (event, context) => {
  const API_KEY = process.env.OMDB_API_KEY; // Store your key in environment variables for security
  const { searchTerm } = event.queryStringParameters;
  
  const omdbUrl = `http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}`;
  
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