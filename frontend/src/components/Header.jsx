import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, BarChart2, Settings, LogOut } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="top-header">
      <div className="profile-container">
        <button className="profile-btn" onClick={() => setIsOpen(!isOpen)}>
          <User size={18} color="var(--primary)" />
          <span>User Profile</span>
          <ChevronDown size={16} />
        </button>

        {isOpen && (
          <div className="profile-dropdown">
            <Link to = '/stats' className="dropdown-item" onClick={() => setIsOpen(false)}>
              <BarChart2 size={16} />
              <span>Stats</span>
            </Link>

            <Link to = '/settings' className="dropdown-item" onClick={() => setIsOpen(false)}>
              <Settings size={16} />
              <span>Settings</span>
            </Link>

            <Link to = '/login' className="dropdown-item" onClick={() => setIsOpen(false)}>
              <LogOut size={16} />
              <span>Log Out</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
