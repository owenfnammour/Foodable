import React, { useState, useEffect } from 'react';
import API from '../api/axios.js'; // Adjust path if Log.jsx is in a different folder
import Layout from '../components/Layout'; // Assuming you still use Layout
import LogFoodSearch from '../components/LogFoodSearch';
import CreateFoodForm from '../components/CreateFoodForm';
import RecentLogsGrid from '../components/RecentLogsGrid';
import PopupInput from '../components/PopupInput.jsx';

export default function Log(){
  const [recentLogs, setRecentLogs] = useState([]);

  const [foodToLog, setFoodToLog] = useState(null);

  // Grab 15 items recently logged
  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        const results = await API.get('api/methods/logs/recent');
        setRecentLogs(results.data);
      }
      catch(error){
        console.log('Failed to load recent logs: ', error);
      }
    }
    fetchRecentLogs();
  },[]);

  const handleLogItemClick = (food) => {
    setFoodToLog(food); 
  }

  const confirmLog = async (amount, mealChoice) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await API.post('api/methods/diary/add/food',
        {foodId: foodToLog.id, logDate: today, mealChoice: mealChoice, amount: amount}
      );
      setRecentLogs((prev) => {
        const filtered = prev.filter((item) => item.id !== foodToLog.id);
        const loggedFood = {...foodToLog, calories : foodToLog.calories || foodToLog.calorie, servingSize: foodToLog.servingSize || foodToLog.serving_size, amount: amount};
        return [loggedFood, ...filtered].slice(0,15);
      });

      setFoodToLog(null);
    }
    catch(error){
      console.log('Failed to log food: ', error);
    }
  }

  const handleFoodCreated = (newFood) =>{
    setRecentLogs((prev) =>{
      const filtered = prev.filter((item) => item.id !== newFood.id);
      const formatted = {...newFood, calories: newFood.calorie || newFood.calorie, servingSize: newFood.servingSize || newFood.serving_size, amount : newFood.amount};
      return [newFood, ...filtered].slice(0,15);
    });
  } 

  return (
    <Layout>
      <div className = 'log-page'>
        <div className="log-controls-grid">
          <LogFoodSearch onLogItem={handleLogItemClick} />
          <CreateFoodForm onFoodCreated={handleFoodCreated} />
        </div>

        <RecentLogsGrid 
          recentLogs={recentLogs} 
          onLogAgain={handleLogItemClick} 
        />
      </div>

      {foodToLog &&
        <PopupInput food = {foodToLog} onConfirm = {confirmLog} onClose = {() => setFoodToLog(null)}/>}
    </Layout>
  );
}