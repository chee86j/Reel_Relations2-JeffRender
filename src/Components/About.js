import React from "react";

const About = () => {
  return (
    <div className="text-white mx-auto lg:w-1/3 sm:w-2/3 lg:text-xs sm:text-sm">
      <h1 className="text-center mb-5">ABOUT US</h1>

      <div className="mb-5">
        Six Degrees of Separation is the idea that all people are six or fewer
        social connections away from each other. As a result, a chain of "friend
        of a friend" statements can be made to connect any two people in a
        maximum of six steps. We applied this to actors costarring in films. The
        user can type in any two actors, if they've starred in a movie together,
        the degree of separation is 1 and that movie will be displayed. But if
        not, the app will display a chain of intermediary costars and the movies
        they've starred in together. This is a modern rendition of
        https://oracleofbacon.org. We recreated the algorithm, and used React,
        Redux and Tailwind CSS to give the site a more modern look and feel.
      </div>

      <div className="mb-5">
        The basis of the app is a breadth first search (BFS) algorithm. Once an
        actor is entered, we use the TMDB database to pull up a list of every
        single costar they've had. These become nodes on a graph, 1 degree of
        separation away. The algorithm goes through each node and pulls up
        costars for each one as well, these get added to a queue, all 2 degrees
        of separation away. The algorithm will first search for actor two in all
        of the 1st degree nodes, if it is not found, it will continue on to the
        queue, and keep queueing the subsidiary costars.{" "}
      </div>

      <div className="mb-5">
        Due to TMDB consisting of over 750,000 entries, we had to limit the size
        of the actors and movies included in our database for speed and
        efficiency. Actors that show up in the search bar's autocomplete are the
        only ones present in our database at the moment. We are working on
        expanding the database to include more entries entirely dependent on the
        hosting service we use.
      </div>
    </div>
  );
};

export default About;
