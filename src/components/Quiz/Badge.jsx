import React, { useState, useEffect } from 'react';

const Badge = ({ name, score, totalQuestions }) => {
  const [badgeType, setBadgeType] = useState(1);
  
  useEffect(() => {
    setBadgeType(Math.random() < 0.5 ? 1 : 2);
  }, []);
  
  const percentage = Math.round((score / totalQuestions) * 100);
  let badgeText;
  
  if (percentage >= 90) {
    badgeText = 'Excellent!';
  } else if (percentage >= 75) {
    badgeText = 'Good Job!';
  } else if (percentage >= 60) {
    badgeText = 'Nice Try!';
  } else {
    badgeText = 'Keep Practicing!';
  }
  
  const badgeImage = badgeType === 1 ? 
    "./badge.jpg" : 
    "./badge.jpg";
  
  return (
    <div className="flex justify-center items-center flex-col">
      <div className="relative w-64 h-64">
        <div 
          className="w-full h-full bg-center bg-no-repeat bg-contain"
          style={{ 
            backgroundImage: `url(${badgeImage})`,
            position: 'relative'
          }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center px-4">
              {/* <p className="text-lg font-bold text-gray-800 mb-1">{name}'s Quiz Result</p> */}
              <p className="text-3xl font-bold text-gray-900 mb-1">{score} / {totalQuestions}</p>
              <p className="text-xl font-bold text-gray-900 mb-1">{percentage}%</p>
              <p className="text-2xl font-bold text-gray-800">{badgeText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badge;
