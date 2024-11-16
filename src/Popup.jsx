import React from "react";
import "./Popup.css"

const Popup = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="popup-content">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Popup;
