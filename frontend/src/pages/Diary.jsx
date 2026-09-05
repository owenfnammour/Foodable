import { useState, useEffect } from "react";
import API from "../api/axios";
import Layout from "../components/Layout";
import { Calendar, Sunrise, Sun, Moon, Apple, Info } from 'lucide-react';
import FoodCard from "../components/FoodCard";


export default function Diary(){
    const getToday = () => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [logs, setLogs] = useState('');
    const [selectedDate, setSelectedDate] = useState(getToday());
    
    const isToday = selectedDate === getToday();

    useEffect(() => {
        const fetchDiary = async () => {
            try{
                const res = await API.get(`api/methods/diary/${selectedDate}`);

                console.log("DIARY DATA FROM BACKEND:", res.data);

                // shouldve deconstructed res, for ano time
                if (Array.isArray(res.data)){
                    setLogs(res.data); 
                }
                else if (res.data && Array.isArray(res.data.data)){
                    setLogs(res.data.data);
                }
                else{
                    console.warn('Backend did not send an array, it sent: ', res.data);
                    setLogs([]);
                }


            }
            catch(error){
                console.log('Failed to fetch diary: ',error);
                setLogs([]);
            }
        }

        fetchDiary();
        
    }, [selectedDate]);

    const safeLogs = Array.isArray(logs) ? logs : [];
    
    const breakfast = safeLogs.filter((log) => log.mealChoice === 'Breakfast' || log.mealChoice === 'breakfast');
    const lunch = safeLogs.filter((log) => log.mealChoice === 'Lunch' || log.mealChoice === 'lunch');
    const dinner = safeLogs.filter((log) => log.mealChoice === 'Dinner' || log.mealChoice === 'dinner');
    const snacks = safeLogs.filter((log) => log.mealChoice === 'Snacks' || log.mealChoice === 'snacks');    

    return (
        <Layout>
            <div className="diary-page">
            <div className="diary-header">
                <h2>My Diary</h2>
                
                <div className="date-picker-wrapper">
                <Calendar className="icon-muted" size={20} />
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    className="date-input"
                />
                </div>
            </div>

            {!isToday && (
                <div className="alert-box warning-box">
                <Info size={20} />
                <span>You are viewing a past date. Logs are read-only.</span>
                </div>
            )}

            <div className="meal-section">
                <h3 className="meal-header">
                <Sunrise className="icon-breakfast" size={22} /> Breakfast
                </h3>
                {breakfast.length === 0 ? <p className="text-muted">No food logged.</p> : breakfast.map(log => (
                <FoodCard key={log.logId} food={log} variant="diary" isEditable={isToday} />
                ))}
            </div>

            <div className="meal-section">
                <h3 className="meal-header">
                <Sun className="icon-lunch" size={22} /> Lunch
                </h3>
                {lunch.length === 0 ? <p className="text-muted">No food logged.</p> : lunch.map(log => (
                <FoodCard key={log.logId} food={log} variant="diary" isEditable={isToday} />
                ))}
            </div>

            <div className="meal-section">
                <h3 className="meal-header">
                <Moon className="icon-dinner" size={22} /> Dinner
                </h3>
                {dinner.length === 0 ? <p className="text-muted">No food logged.</p> : dinner.map(log => (
                <FoodCard key={log.logId} food={log} variant="diary" isEditable={isToday} />
                ))}
            </div>

            <div className="meal-section">
                <h3 className="meal-header">
                <Apple className="icon-snacks" size={22} /> Snacks
                </h3>
                {snacks.length === 0 ? <p className="text-muted">No food logged.</p> : snacks.map(log => (
                <FoodCard key={log.logId} food={log} variant="diary" isEditable={isToday} />
                ))}
            </div>
            </div>
        </Layout>
  );
}