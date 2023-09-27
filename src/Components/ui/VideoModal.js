import React from "react";

const VideoModal = ({ isOpen, onClose, videoKey }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoKey}`}
          frameborder="0"
          allowfullscreen
        ></iframe>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default VideoModal;
