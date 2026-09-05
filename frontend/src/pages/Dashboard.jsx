import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import MacroCard from '../components/MacroCard';  
import Layout from '../components/Layout';

export default function Dashboard() {
  return (
     <Layout>
        <main className = "dashboard-grid">
          <MacroCard />

          <div className="card">
            <h3>Weekly Calorie Intake</h3>
          </div>

          <div className="card">
            <h3>Weekly Calorie Intake vs Goal</h3>
          </div>

          <div className="card">
            <h3>Upcoming Reminders</h3>
          </div>
        </main>
      </Layout>  

  );
}