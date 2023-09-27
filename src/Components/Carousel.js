import React, { useState } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

const Carousel = ({ movies }) => {
  const filteredMovies = movies.filter((movie) => movie.popularity > 0);
  const sortedPopularity =
    filteredMovies.length < 10
      ? filteredMovies
      : filteredMovies
          .sort((movie1, movie2) => movie2.popularity - movie1.popularity)
          .slice(0, 10);

  const [currentIdx, setCurrentIdx] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIdx === 0;
    const newIndex = isFirstSlide
      ? sortedPopularity.length - 1
      : currentIdx - 1;
    setCurrentIdx(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIdx === sortedPopularity.length - 1;
    const newIndex = isLastSlide ? 0 : currentIdx + 1;
    setCurrentIdx(newIndex);
  };

  return (
    <div className=" w-full m-auto py-5 px-4 relative group">
      <div
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original/${sortedPopularity[currentIdx].poster_path})`,
        }}
        className="w-full h-80vh md:h-full rounded-xl bg-center bg-no-repeat bg-contain duration-500"
      ></div>
      {/* Left Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
    </div>
  );
};

export default Carousel;
