// StarsPopup.js
import React from 'react';
import './StarsPopup.css';

const StarsPopup = ({ totalQuestions, correctAnswers, onClose }) => {
  const stars = Math.min(correctAnswers, totalQuestions);

  return (
    <div className="stars-popup">
      <div className="stars-container">
        {Array.from({ length: stars }).map((_, index) => (
          <span key={index} className="star">
            ⭐
          </span>
        ))}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default StarsPopup;

