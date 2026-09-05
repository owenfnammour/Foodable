import React, { useState, useEffect } from 'react';
import API from '../api/axios.js';
import { Search } from 'lucide-react';
import FoodCard from './FoodCard';

export default function LogFoodSearch({ onLogItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await API.get(
          `api/methods/foods/search?item=${encodeURIComponent(searchQuery)}`
        );
        setSearchResults(res.data);
      } catch (err) {
        console.error('Search request failed:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelect = (item) => {
    onLogItem(item);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="card log-control-card search-card">
      <span className="control-label">Search Database</span>
      <div className="search-input-wrapper">
        <Search className="search-icon" size={18} />
        <input
          type="text"
          placeholder="Type food name (e.g., Lasagna)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isSearching && <p className="search-status">Searching...</p>}

      {searchResults.length > 0 && (
        <div className="search-results-list">
          {searchResults.map((item) => (
            <FoodCard
              key={item.id}
              food={item}
              onLog={handleSelect}
              variant="list"
            />
          ))}
        </div>
      )}

      {!isSearching && searchQuery.trim() !== '' && searchResults.length === 0 && (
        <p className="search-status">No matching foods found.</p>
      )}
    </div>
  );
}