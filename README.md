# Betterboxd

A movie search web app. Built with HTML, CSS, and JavaScript for the Scrimba front-end developer path. Used as a learning exercise to practice API interactions & learn serverless functions.

![Betterboxd Screenshot](images/betterboxd-animation.gif)

## Features

- Search any film and get back metadata including IMDB & Metacritic ratings & synopsis
- Responsive layout & typography for mobile and desktop via media queries
- Supports liking & adding films to watchlist
- Supports browsing top-rated IMDB films 
- Films loaded via [OMDB](https://www.omdbapi.com/)'s API
- Dynamic rendering of film HTML with JS
- Persists likes & watchlist across sessions with localstorage
- Client-side cache persisted across sessions to reduce duplicative API calls & improve performance
- Uses [Netlify Functions](https://www.netlify.com/platform/core/functions/) as Lambdas that proxy calls to the OMDB API to keep the API key out of client-side code

## Technologies Used

- HTML
- CSS
- JavaScript
- Netlify Functions

## Installation

- Requires requesting an API key from OMDB
- movieFetch.js assumes deploying on Netlify, which during the build process creates a serverless function and a .netlify API route that can respond to fetch() requests
- Netlify needs an environment variable set with `OMDB_API_KEY` so that it can use it during build for the serverless proxy

## Files

- `index.html`: The main HTML structure
- `style.css`: Styles for the film application
- `main.js`: Primary logic for managing application state 
- `api.js`: Encapsulates API calls to the serverless function
- `top-films.js`: IMDB IDs of the top 50 films on IMDB as of 10/10/2024 to support "top film" feature
- `render.js`: Rendering and layout for a single film card
- `storage.js`: Encapsulates code for reading & writing to localstorage
- `/netlify/functions/movieFetch.js`: API proxy for calls to the OMDB API

## Lessons Learned

- Mobile-first development coupled with media queries to bump up typography and spacing at `@media (min-width: 768px)` worked very well, as well as doing `width: 100%` on the parent container coupled with a `max-width` to keep desktop in check
- Netlify functions are very straightforward and smooth, though make local dev impossible without installing the Netlify CLI
- Localstorage is very easy and it took less than 5 minutes to build a good clientside API cache with a map
- Reaching the limits of raw DOM manipulation in functions in vanilla JS. Makes it very hard to reason about app state & maintaining consistent state 
- Some special things needed to create a nice search box experience on iOS, including things like enterkeyhint="search" to turn "done" into "search" on the keyboard, as well as `document.activeElement.blur()` to dismiss the keyboard after search is initiated
- Odd behavior with :hover pseudoelement on mobile. Ended up putting all :hover logic in media query that checks if hover is possible. Otherwise mobile keep :hover on elements after they've been clicked, which is bad if you are reducing opacity on hover

## Future Work

- Swap to TMDB for better API responsiveness, since OMDB is not well-maintained
- Via TMDB, support added features like streaming services, trailers, etc.
- Properly handle aria live region & other a11y issues
- Consider revisiting as a React project to properly manage app state & components
- Consider using TMDB API to build an AI-focused 6 degrees of Kevin Bacon game
