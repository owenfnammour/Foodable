import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
const CircularProgress = ({ percentage, color = 'var(--primary)' }) => {
  const radius = 35;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="progress-ring">
      <circle
        className="progress-ring-bg"
        strokeWidth={stroke}
        fill="transparent"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        className="progress-ring-fill"
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset }}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
    </svg>
  );
};

export default function MacroCard() {

    const [macros, setMacros] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 70
  });

  useEffect(() => {
    const fetchMacros = async () => {
        try {
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            const today = `${year}-${month}-${day}`;

            const res = await API.get(`api/dashboard/macros/${today}`);
            setMacros((prev) => ({...prev, 
                calories: res.data.totalCalories || 0,
                protein: res.data.protein || 0,
                carbs: res.data.carbs || 0,
                fat: res.data.fat || 0 
            }));

        }
        catch(err){
            console.log("Failed to load today's macros from DB: ", err);
        }
    }
    fetchMacros();
  }, [])

  const caloriePercent = Math.min(100, Math.round((macros.calories / macros.calorieGoal) * 100)) || 0;
  const proteinPercent = Math.min(100, Math.round((macros.protein / macros.proteinGoal) * 100)) || 0;
  const carbsPercent = Math.min(100, Math.round((macros.carbs / macros.carbsGoal) * 100)) || 0;
  const fatPercent = Math.min(100, Math.round((macros.fat / macros.fatGoal) * 100)) || 0;

    return (
        <Link to="/diary" className="card glance-card click-card">
        <h3>Today's Macronutrients</h3>
        <div className="glance-grid">
            <div className="macro-item">
            <span className="macro-label">Calories</span>
            <span className="macro-value">{macros.calories} kcal</span>
            <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${caloriePercent}%` }}></div>
            </div>
            </div>

            <div className="macro-item">
                <div className="macro-header">
                    <div>
                        <span className="macro-label">Protein</span>
                        <div className="macro-value">{macros.protein} g</div>
                    </div>
                    <CircularProgress percentage={proteinPercent} color="var(--primary)" />
                </div>
            </div>

            <div className="macro-item">
            <div className="macro-header">
                <div>
                <span className="macro-label">Carbs</span>
                <div className="macro-value">{`${macros.carbs}`} g</div>
                </div>
                <CircularProgress percentage={carbsPercent} color="var(--primary)" />
            </div>
            </div>

            <div className="macro-item">
            <div className="macro-header">
                <div>
                <span className="macro-label">Fat</span>
                <div className="macro-value">{`${macros.fat}`} g</div>
                </div>
                <CircularProgress percentage={fatPercent} color="var(--accent-orange)" />
            </div>
            </div>
        </div>
        </Link>
    );
}