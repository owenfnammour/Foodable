import React from 'react';
import FoodCard from './FoodCard';

export default function RecentLogsGrid({ recentLogs, onLogAgain }) {
  return (
    <section className="recent-logs-section">
      <h3>Recently Logged Items</h3>

      {recentLogs.length === 0 ? (
        <div className="card empty-state-card">
          <p>No recently logged items yet. Search or create a food above to get started!</p>
        </div>
      ) : (
        <div className="food-cards-grid">
          {recentLogs.map((item) => (
            <FoodCard
              key={item.id}
              food={item}
              onLog={onLogAgain}
              variant="card"    
            />
          ))}
        </div>
      )}
    </section>
  );
}