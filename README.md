## Setup

1. Clone the repository and navigate to the project directory.
2. Install the dependencies by running `npm install`.
3. Create a new file named `.env` in the root directory of the project.
4. Add the following line to the `.env` file, replacing `your_api_key_here` with your actual API key:

Make sure to keep the `.env` file secure and avoid committing it to version control. 5. Start the server by running `npm start`.

## Reel Relations: The Actor Connection

Welcome to Reel Relations!, an exciting application designed to unravel the intriguing connections between two actors and the movies they starred in. For both seasoned film enthusiasts or a coders who want to explore algorithms, this PERN Stack App offers a user-friendly gateway to explore the degrees of separation between your favorite actors.

Providing an immersive experience where you can dive into the captivating world of cinema. Through Reel Relations, you'll discover the fascinating web of relationships that intertwine actors through their shared appearances in movies.

![Chrome Reel Demo](./src/Components/assets/chrome-reel.gif)


Behind the scenes, our app employs a cutting-edge graph-based algorithm to power its exploration capabilities. The ingenious buildGraph function carefully constructs a graph representation by analyzing movies and identifying the actors who have collaborated on-screen through our PostgreSQL database. Each actor is represented as a node within the graph, while their movie collaborations form the intricate connections or edges.

To unveil the degrees of separation between two actors, Reel Relations harnesses the power of the breadth-first search (BFS) algorithm. This intelligent algorithm traverses the graph methodically, tracing paths from one actor to another through their mutual movie appearances. The result is a thrilling revelation of the shortest path that connects the two actors, illuminating the degrees of separation they share.

All will find Reel Relations incredibly intuitive. Simply enter the names of the two actors you're curious about, and watch as the app unveils the hidden ties that are binding them through their cinematic collaborations. Prepare to be amazed as you unravel unexpected relationships and gain a deeper understanding of how everyone knows someone in the film industry.

Reel Relations is inviting you to embark on an enchanting journey, where actors, movies, and degrees of separation converge. Get ready to Unveil the Secrets that Lie within the Reels and Discover a Whole New Perspective on the World of Cinema!

Lights! Camera! Action!
