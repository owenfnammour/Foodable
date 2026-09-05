import React, { useState } from "react";
import API from '../api/axios.js';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';

export default function CreateFoodForm({ onFoodCreated }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const [newFood, setNewFood] = useState({
    name: '',
    servingSize: '', 
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    mealChoice: 'breakfast',
    amount: '0' 
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();

    try {
      const createRes = await API.post('/api/methods/foods/add', {
        name: newFood.name,
        servingSize: newFood.servingSize,
        calorie: newFood.calories,
        protein: newFood.protein,
        carbs: newFood.carbs,
        fat: newFood.fat
      });

      const newFoodId = createRes.data.id; 

      const today = new Date().toISOString().split('T')[0]; 

      await API.post('/api/methods/diary/add/food', {
        foodId: newFoodId,
        logDate: today,
        mealChoice: newFood.mealChoice,
        amount: parseFloat(newFood.amount)
      });


      onFoodCreated({
        id: newFoodId,
        name: newFood.name,
        calorie: newFood.calories,
        protein: newFood.protein,
        carbs: newFood.carbs,
        fat: newFood.fat,
        amount: parseFloat(newFood.amount),
        servingSize: newFood.servingSize,
      });                                                                                                                                                                                                                                                              

      setShowCreateForm(false);
      setNewFood({
        name: '',
        servingSize: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        mealChoice: 'breakfast',
        amount: '1'
      });
    } catch (error) {
      console.log('Okay Failed to create and log food:', error);
    }
  };

  return (
    <div className="card log-control-card create-card">
      <button
        type="button"
        className="create-toggle-btn"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        <div className="toggle-title">
          <Plus size={20} />
          <span>Create & Log New Food</span>
        </div>
        {showCreateForm ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateFood} className="create-food-form">
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Food Name (e.g., Protein Shake)"
              value={newFood.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="servingSize"
              placeholder="Serving Size (e.g., 1 scoop / 100g)"
              value={newFood.servingSize}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="calories"
              placeholder="Calories (kcal)"
              value={newFood.calories}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="protein"
              placeholder="Protein (g)"
              value={newFood.protein}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="carbs"
              placeholder="Carbs (g)"
              value={newFood.carbs}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="fat"
              placeholder="Fat (g)"
              value={newFood.fat}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <select 
              name="mealChoice" 
              value={newFood.mealChoice} 
              onChange={handleInputChange} 
              className="input-field"
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
            
            <input
              type="number"
              name="amount"
              placeholder="Amount (e.g. 100 g)"
              value={newFood.amount}
              onChange={handleInputChange}
              min="0.1"
              step="0.1"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Create & Log Food
          </button>
        </form>
      )}
    </div>
  );
}