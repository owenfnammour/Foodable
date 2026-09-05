import React from 'react';

export default function FoodCard({ food, onLog, variant = 'list' }) {
  const { name, protein, carbs, fat, servingSize, amount} = food;
  const calories = food.calorie || food.calories;

  const mult = amount || 1;


  const calcCalorie = Math.round(Number(calories) * mult);
  const calcProtein = (Number(protein) * mult).toFixed(1);
  const calcCarbs = (Number(carbs) * mult).toFixed(1);
  const calcFat = (Number(fat) * mult).toFixed(1);


  // List view (for search dropdowns)
  if (variant === 'list') {
    return (
      <div className="search-result-item">
        <div>
          <strong>{name}</strong>
          <div className="result-subtext">
            {calcCalorie} kcal | P: {calcProtein}g C: {calcCarbs}g F: {calcFat}g
          </div>
        </div>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onLog(food)}
        >
          Log
        </button>
      </div>
    );
  }

  // Grid card view (for recent logs grid)
  return (
    <div className="card food-card">
      <h4>{name}</h4>

      {servingSize && (
        <span className="food-meta">
          {mult !== 1 ? `${mult} x ` : ''}{servingSize}
        </span>
      )}

      <div className="food-macros">
        <span>{calcCalorie} kcal</span>
        <span>P: {calcProtein}g</span>
        <span>C: {calcCarbs}g</span>
        <span>F: {calcFat}g</span>
      </div>
      <button
        className="btn btn-sm btn-primary"
        onClick={() => onLog(food)}
      >
        Log Again
      </button>
    </div>
  );
}