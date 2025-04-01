## Reel Relations: The Actor Connection

Welcome to Reel Relations!, an exciting application designed to unravel the intriguing connections between two actors and the movies they starred in. For both seasoned film enthusiasts or a coders who want to explore algorithms, this PERN Stack App offers a user-friendly gateway to explore the degrees of separation between your favorite actors.

Providing an immersive experience where you can dive into the captivating world of cinema. Through Reel Relations, you'll discover the fascinating web of relationships that intertwine actors through their shared appearances in movies.

![Chrome Reel Demo](./src/Components/assets/chrome-reel.gif)

## Behind the Scenes

Our app employs a cutting-edge graph-based algorithm to power its exploration capabilities. The ingenious buildGraph function carefully constructs a graph representation by analyzing movies and identifying the actors who have collaborated on-screen through our PostgreSQL database. Each actor is represented as a node within the graph, while their movie collaborations form the intricate connections or edges.

To unveil the degrees of separation between two actors, Reel Relations harnesses the power of the breadth-first search (BFS) algorithm. This intelligent algorithm traverses the graph methodically, tracing paths from one actor to another through their mutual movie appearances. The result is a thrilling revelation of the shortest path that connects the two actors, illuminating the degrees of separation they share.

For optimal performance, we've implemented an LRU (Least Recently Used) caching system that stores search results. This means repeated searches between the same actors (in any order) will be significantly faster, as the results are cached and readily available. The cache automatically manages its size and removes least recently used entries when needed.

![Example of BFS](./src/Components/assets/example-search.png)

All will find Reel Relations incredibly intuitive. Simply enter the names of the two actors you're curious about, and watch as the app unveils the hidden ties that are binding them through their cinematic collaborations. Prepare to be amazed as you unravel unexpected relationships and gain a deeper understanding of how everyone knows someone in the film industry.

Reel Relations is inviting you to embark on an enchanting journey, where actors, movies, and degrees of separation converge. Get ready to Unveil the Secrets that Lie within the Reels and Discover a Whole New Perspective on the World of Cinema!

Check Out Our Live Render at https://reelrelations.up.railway.app/
Lights! Camera! Action!

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm
- PostgreSQL

## Installation & Local Deployment

1. **Clone the repository** and navigate to the project directory.
2. **Install Dependencies**: Run `npm install`.

3. **Environment Setup**: Create a `.env` file in the root directory and add the following environment variables:
   ```
   API_KEY=YOUR_TMDB_API_KEY
   JWT_SECRET=YOUR_JWT_SECRET
   DATABASE_URL=YOUR_DATABASE_URL
   CLIENT_ID=YOUR_CLIENT_ID
   CLIENT_SECRET=YOUR_CLIENT_SECRET
   REDIRECT_URL=YOUR_REDIRECT_URL_FOR_OAUTH
   ```

4. **Database Setup**: Create and connect your PostgreSQL database `reel_relations_db`.
   - The DATABASE_URL should be in the format: `postgres://username:password@localhost:5432/reel_relations_db`

5. **Development Build**: Run `npm run build:dev` to build the application.

- You will need to run Postico (Mac) to load src/Components/assets/csv files into your database.
- Remember to select 'Match Column by Name' to import the csv files to each table.

6. **Start the Application**:

- Run `npm run start:dev` to start the server.
- Open `http://localhost:3000/` in your browser.

## Features

- Responsive Design: Crafted using Tailwind CSS, our app offers a mobile-friendly and visually appealing interface.
- Technology Stack: Built with the PERN stack (PostgreSQL, Express.js, React, Node.js), ensuring scalability and robustness.
- Graph-based algorithm to analyze movie collaborations.
- Breadth-first search (BFS) algorithm to determine degrees of separation.
- LRU caching system for optimized search performance.
- User-friendly interface for exploring actor connections.
- OAuth 2.0 authentication for secure login.
- Interactive movie & actor cards with detailed information.
- Movie trailer previews.
- Keep track of all your Favorite Actors and Movies under your Favorites in your Account.

## Performance Optimizations

- **LRU Caching**: The application implements an LRU (Least Recently Used) cache for search results:
  - Cached results are available instantly for repeated searches
  - Cache works bidirectionally (A→B gives same result as B→A)
  - Automatically manages memory usage by removing least recently used entries
  - Configurable cache size (default: 1000 entries)
