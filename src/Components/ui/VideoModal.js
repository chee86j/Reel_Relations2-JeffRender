import React from "react";

const VideoModal = ({ isOpen, onClose, videoKey }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-4/5 bg-white p-5 rounded shadow-lg">
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Close Window
        </button>
        <h1 className="text-2xl text-black font-bold text-center ">Trailer</h1>
        <h2 className="text-xs text-black font-normal text-center ">
          * If Video Doesn't Load, Please Refresh. Youtube's Algorithm Will
          Readjust Its Recommendation
        </h2>
        <iframe
          width="100%"
          height="55%"
          src={`https://www.youtube.com/embed/${videoKey}`}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoModal;
