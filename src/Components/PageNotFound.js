import React from "react";
import { NavLink } from "react-router-dom";

export const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <h1 className="flex flex-col items-center justify-start">
        <div className="text-white text-2xl font-bold my-2 text-center">
          <div className="flex justify-center border-white rounded-full object-contain">
            <img
              src="https://cdn.dribbble.com/users/8805637/screenshots/16312153/media/d1dbc1c5e61313fc5c81b65f8540c8e3.gif"
              alt="Animated GIF"
              className="w-3/5 rounded-full"
            />
          </div>
        </div>
        <div className="text-white text-2xl font-bold my-2 text-center">
          You're Lost Buddy - 404 Page Not Found
        </div>
      </h1>
      <div className="flex items-center justify-center">
        <NavLink
          className="w-96 flex items-center justify-center text-md px-4 py-2 border rounded text-white border-white hover:border-teal-500 hover:text-teal-500 mt-4"
          to={"/"}
        >
          Return Back Home
        </NavLink>
      </div>
    </div>
  );
};
