// File: components/BadgeSystem.js
import React from 'react';

const BadgeSystem = () => {
  const badges = [
    {
      name: 'Beginner',
      description: 'Complete your first quiz',
      icon: '🔰',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Explorer',
      description: 'Try quizzes in 3 different topics',
      icon: '🧭',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Scholar',
      description: 'Score above 80% in 5 quizzes',
      icon: '🎓',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'Expert',
      description: 'Score 100% in any quiz',
      icon: '⭐',
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      name: 'Persistent',
      description: 'Complete 10 quizzes',
      icon: '🏆',
      color: 'bg-red-100 text-red-800'
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Achievement Badges</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge, index) => (
          <div key={index} className={`p-4 rounded-lg ${badge.color} border flex items-center space-x-3`}>
            <div className="text-2xl">{badge.icon}</div>
            <div>
              <h4 className="font-semibold">{badge.name}</h4>
              <p className="text-sm">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeSystem;