import React from "react";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <img
        className="max-w-sm rounded-full"
        src="https://cdn.dribbble.com/users/2882885/screenshots/7861928/media/a4c4da396c3da907e7ed9dd0b55e5031.gif"
        alt="Loading..."
      />
    </div>
  );
};

export default Spinner;
