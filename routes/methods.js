import db from '../db.js';
import express from 'express';
const router = express.Router();


// Get Weight & Intake O
router.get('/profile/:id', async (req,res,next) => {

    try{
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0){
            return res.status(400).json({message: "Invalid User ID"});
        }
        const [rows] = await db.query('SELECT weight,daily_total FROM users WHERE id = ?',[id]);

        if (rows.length === 0){
            return res.status(404).json({message: "User Not Found"});
        }
        res.status(200).json(rows[0]);
    }
    catch(error){
        next(error);
    }
});

// Update Daily Weight O
router.put('/profile/:id/weight', async (req, res, next) => {
    try{
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0){
            return res.status(400).json({message: "Invalid User ID"});
        }

        const weight = parseFloat(req.body.weight);

        if (isNaN(weight) || weight <= 0){
            return res.status(400).json({message: "Invalid Weight"});
        }
        
        const [result] = await db.query('UPDATE users SET weight = ? WHERE id = ?', [weight, id]);
        
        if (result.unaffectedRows === 0){
            return res.status(404).json({message: "User Not Found"});
        }

        res.status(200).json({message: "Weight Updated"});
    }
    catch(error){
        next(error);
    }
});

// Update Daily Intake O
router.put('/profile/:id/intake', async (req, res, next) => {
    try{
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0){
            return res.status(400).json({message: "Invalid User ID"});
        }

        const intake = parseInt(req.body.intake);

        
        if (!isNaN(intake) && intake > 0){
            const [result] = await db.query('UPDATE users SET daily_total = ? WHERE id = ?',[intake, id]);

            if (result.affectedRows === 0){
                return res.status(404).json({message: "User Not Found"});
            }

            res.status(200).json({message: "Daily Intake Updated"});
        }
        else{
            res.status(400).json({message : "Invalid input"})
        }
    }
    catch(error){
        next(error);
    }
});

// Get All Foods O
router.get('/foods', async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT * FROM foods');
        res.status(200).json(rows);
    }
    catch(error){
        next(error);
    }
});

// Create New Food O
router.post('/foods/add', async (req, res, next) => {
    try{    

        const facts = [req.body.name, req.body.calorie, req.body.protein, req.body.carbs, req.body.fat];

        if (facts[0] && facts[0].trim().length !== 0 && !isNaN(facts[1]) && !isNaN(facts[2]) && !isNaN(facts[3]) && !isNaN(facts[4])){
            await db.query("INSERT INTO foods (name, calorie, protein, carbs, fat) VALUES (?,?,?,?,?)", facts);
            res.status(201).json({message: "New Food Created"});
        }
        else{
            res.status(400).json({message: "Invalid Input"});
        }

    }
    catch(error){
        next(error);
    }
});

// Get a diary for a certain date O
router.get('/diary/date/:id/:date', async (req, res, next) => {
    try{
        const date = req.params.date;

        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid Date Format" });
        }

        // user id
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0){
            return res.status(400).json({message: "Invalid User ID"});
        }

        const [rows] = await db.query('SELECT * FROM daily_logs WHERE user_id = ? AND log_date = ?', [id, date]);

        if (rows.length === 0){
            return res.status(404).json({message: "Diary Not Found"});
        }
        res.status(200).json(rows);
    }
    catch(error){
        next(error);
    }
})

// Get Daily Logs O
router.get('/diary/:id', async (req,res,next) =>{

    try{
        
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0){
            return res.status(400).json({message: "Invalid User ID"});
        }

        const [rows] = await db.query('SELECT * FROM daily_logs WHERE user_id = ? AND log_date = CURDATE()', [id]);

        res.status(200).json(rows);
    }
    catch(error){
        next(error);
    }
});

// Add Food to the diary O
router.post('/diary/add/food', async (req,res,next) => {
    try{
        const {userId, foodId, logDate, mealChoice, amount} = req.body;

        if (isNaN(userId) || userId <= 0){
            return res.status(400).json({message: "Invalid User ID"});
        }

        if (isNaN(parseInt(foodId)) || parseInt(foodId) <= 0) {
            return res.status(400).json({ message: "Invalid Food ID" });
        }

        const [food] = await db.query('SELECT * FROM foods WHERE id = ? ', [foodId]);

        if (food.length === 0){
            return res.status(404).json({message: "Food Not Found"});
        }

        const validMeals = ['breakfast', 'lunch', 'dinner', 'snacks'];

        if (!validMeals.includes(mealChoice)) {
            return res.status(400).json({ message: "Invalid Meal Option" });
        }

        if (isNaN(amount) || amount < 0){
            return res.status(400).json({message: "Invalid Amount"});
        }

        if (isNaN(Date.parse(logDate))){
            return res.status(400).json({message: "Invalid Date"});
        }

        const baseCal = food[0].calorie;
        const totalCal = baseCal * amount;

        const [result] = await db.query('INSERT INTO daily_logs (user_id, food_id, log_date, meal_choice, amount, calories) VALUES (?, ?, ?, ?, ?, ?)',[userId, foodId, logDate, mealChoice, amount, totalCal ]);
        res.status(201).json({message: "Added successfully"});
    }
    catch(error){
        next(error);
    }
})

// Update Food Entry already logged in the diary O
router.put('/diary/update/:id', async (req, res, next) => {
    try {
        const logId = parseInt(req.params.id);
        const { userId, foodId, amount } = req.body;

        // 1. Validate Log ID
        if (isNaN(logId) || logId <= 0) {
            return res.status(400).json({ message: "Invalid Log ID" });
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId) || parsedUserId <= 0) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        const newAmount = parseFloat(amount);
        if (isNaN(newAmount) || newAmount < 0) {
            return res.status(400).json({ message: "Invalid Amount" });
        }

        const parsedFoodId = parseInt(foodId);
        if (isNaN(parsedFoodId) || parsedFoodId <= 0) {
            return res.status(400).json({ message: "Invalid Food ID" });
        }

        const [food] = await db.query('SELECT calorie FROM foods WHERE id = ?', [parsedFoodId]);
        if (food.length === 0) {
            return res.status(404).json({ message: "Food Not Found" });
        }

        const newTot = food[0].calorie * newAmount;

        const [result] = await db.query(
            'UPDATE daily_logs SET amount = ?, calories = ? WHERE id = ? AND user_id = ?',
            [newAmount, newTot, logId, parsedUserId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Log Not Found " });
        }

        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        next(error);
    }
});

// Delete Food Entry from the diary O   
router.delete('/diary/delete/:id', async (req, res, next) => {
    try{
        const logId = parseInt(req.params.id);

        if (isNaN(logId) || logId <= 0){
            return res.status(400).json({message: "Invalid Log"});
        }

        const [result] = await db.query('DELETE FROM daily_logs WHERE id = ?',[logId]);

        if (result.affectedRows === 0){
            return res.status(404).json({message: "Log Not Found"});
        }

        res.status(200).json({message: "Deleted Successfully"});

    }
    catch(error){
        next(error);
    }
});

export default router;