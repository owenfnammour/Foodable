import React, {useState} from 'react';


export default function PopupInput({food, onClose, onConfirm}){
    const [formData, setFormData] = useState({
        amount: '1',
        mealChoice: 'breakfast'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        onConfirm(parseFloat(formData.amount), formData.mealChoice);
    }

    const handleChange = (e) =>{
        const {name, value} = e.target;

        setFormData((prev) => ({...prev, [name] : value}));

    };

    return (
    <div className="modal-overlay">
      <div className="card modal-content">
        <h3>Log {food.name}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row modal-form-row">
            <select 
              name="mealChoice"
              className="input-field"
              value={formData.mealChoice} 
              onChange={handleChange}
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>

            <input
              type="number"
              name="amount" // Added name attribute for handleChange to work
              className="input-field"
              value={formData.amount}
              onChange={handleChange}
              min="0.1"
              step="0.1"
              placeholder="Amount"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" >Confirm</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}