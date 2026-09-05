// Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  PlusCircle, 
  BookOpen, 
  Utensils, 
  Bell, 
  User 
} from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>NutriPulse</h2>
      </div>

      <nav className="nav-menu">
        <NavLink to="/dashboard" className="nav-link">
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/log" className="nav-link">
          <PlusCircle size={20} />
          <span>Log</span>
        </NavLink>

        <NavLink to="/diary" className="nav-link">
          <BookOpen size={20} />
          <span>Diary</span>
        </NavLink>

        <NavLink to="/recipes" className="nav-link">
          <Utensils size={20} />
          <span>Recipes & Meals</span>
        </NavLink>

        <NavLink to="/reminders" className="nav-link">
          <Bell size={20} />
          <span>Reminders</span>
        </NavLink>

        <NavLink to="/profile" className="nav-link">
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}