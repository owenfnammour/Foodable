import db from '../db.js';
import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();


// Get Weight & Intake O
router.get('/profile', authenticateToken, async (req,res,next) => {

    try{
        const id = req.user.userId;

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
router.put('/profile/weight', authenticateToken, async (req, res, next) => {
    try{
        const id = req.user.userId;

        const weight = parseFloat(req.body.weight);

        if (isNaN(weight) || weight <= 0){
            return res.status(400).json({message: "Invalid Weight"});
        }
        
        const [result] = await db.query('UPDATE users SET weight = ? WHERE id = ?', [weight, id]);
        
        if (result.affectedRows === 0){
            return res.status(404).json({message: "User Not Found"});
        }

        res.status(200).json({message: "Weight Updated"});
    }
    catch(error){
        next(error);
    }
});

// Update Daily Intake O
router.put('/profile/intake', authenticateToken, async (req, res, next) => {
    try{
        const id = req.user.userId;

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

// Get macros O
router.get('macros/:date', authenticateToken, async (req, res, next) => {
    try{
        const userId = req.user.userId;
        const date = req.params.date;

        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid Date" })
        };

        const [rows] = await db.query(
            `SELECT 
                COALESCE(SUM(f.calorie * l.amount), 0) AS curr_cal,
                COALESCE(SUM(f.protein * l.amount), 0) AS curr_pro,
                COALESCE(SUM(f.carbs * l.amount), 0) AS curr_carbs,
                COALESCE(SUM(f.fat * l.amount), 0) AS curr_fat
             FROM daily_logs l
             JOIN foods f ON l.food_id = f.id
             WHERE l.user_id = ? AND l.log_date = ?`,
            [userId, date]
        );

        res.status(200).json(rows[0]);
    }
    catch(error){
        next(error);
    }
})

// Get All Foods O
router.get('/foods', authenticateToken,  async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT id, name, serving_size AS servingSize, calorie AS calories, protein, carbs, fat FROM foods');
        res.status(200).json(rows);
    }
    catch(error){
        next(error);
    }
});

//Get top 15 most recently logged foods
router.get('/logs/recent', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const [recentFoods] = await db.query(
      `SELECT 
         f.id, 
         f.name, 
         f.serving_size AS servingSize, 
         f.calorie AS calories, 
         f.protein, 
         f.carbs, 
         f.fat, 
         (SELECT amount FROM daily_logs WHERE food_id = f.id AND user_id = ? ORDER BY id DESC LIMIT 1) AS amount
       FROM daily_logs dl
       JOIN foods f ON dl.food_id = f.id
       WHERE dl.user_id = ?
       GROUP BY f.id, f.name, f.serving_size, f.calorie, f.protein, f.carbs, f.fat
       ORDER BY MAX(dl.id) DESC
       LIMIT 15`,
      [userId, userId]
    );

    res.json(recentFoods);
  } catch (error) {
    next(error);
  }
});

// Get certain food 0
router.get('/foods/search' , async (req, res, next) => {
    try {
        const q = req.query.item;

        if (!q || q.trim() === ''){
            return res.json([]);
        }

        const searchItem = `%${q}%`;
        const [foods] = await db.query('SELECT * FROM foods WHERE `name` LIKE ? LIMIT 15',[searchItem]);

        res.status(200).json(foods);
    }
    catch(error){
        next(error);
    }
});

// Create New Food O
router.post('/foods/add', authenticateToken,  async (req, res, next) => {
    try{    

        const facts = [req.body.name, req.body.servingSize, req.body.calorie, req.body.protein, req.body.carbs, req.body.fat];

        if (facts[0] && typeof facts[0] === 'string' && facts[0].trim().length !== 0 && 
            facts[1] && typeof facts[1] === 'string' && facts[1].trim().length !== 0 &&
            !isNaN(facts[2]) && !isNaN(facts[3]) && !isNaN(facts[4]) && !isNaN(facts[5])) {
                const [result] = await db.query("INSERT INTO foods (name, serving_size, calorie, protein, carbs, fat) VALUES (?,?,?,?,?,?)", facts);
                res.status(201).json({message: "New Food Created", id: result.insertId});
        }
        else{
            res.status(400).json({message: "Invalid Input"});
        }

    }
    catch(error){
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
});

// Get Daily Logs O
router.get('/diary', authenticateToken, async (req,res,next) =>{

    try{
        
        const id = req.user.userId;

        const [rows] = await db.query('SELECT * FROM daily_logs WHERE user_id = ? AND log_date = CURDATE()', [id]);

        res.status(200).json(rows);
    }
    catch(error){
        next(error);
    }
});

// Get a diary for a certain date O
router.get('/diary/:date', authenticateToken, async (req, res, next) => {
    try{
        const date = req.params.date;

        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ message: "Invalid Date Format" });
        }

        const id = req.user.userId;

        const [rows] = await db.query('SELECT dl.id AS logId, dl.meal_choice AS mealChoice, dl.amount, f.id AS foodId, f.name, f.serving_size AS servingSize, f.calorie AS calories, f.protein, f.carbs, f.fat FROM daily_logs dl JOIN foods f on dl.food_id = f.id WHERE dl.user_id = ? AND dl.log_date = ?',[id, date]);

        res.status(200).json(rows);
    }
    catch(error){
        next(error);
    }
}); 

// Add Food to the diary 
router.post('/diary/add/food', authenticateToken, async (req,res,next) => {
    try{
        const userId = req.user.userId;

        const {foodId, logDate, mealChoice, amount} = req.body;

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

        const totalCal = food[0].calorie * amount;

        await db.query(
            'INSERT INTO daily_logs (user_id, food_id, log_date, meal_choice, amount, calories) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, foodId, logDate, mealChoice, amount, totalCal]
        );

        res.status(201).json({message: "Added successfully"});
    }
    catch(error){
        next(error);
    }
})

// Update Food Entry already logged in the diary 
router.put('/diary/update/:id', authenticateToken,  async (req, res, next) => {
    try {
        const logId = parseInt(req.params.id);
        const {foodId, amount } = req.body;

        // 1. Validate Log ID
        if (isNaN(logId) || logId <= 0) {
            return res.status(400).json({ message: "Invalid Log ID" });
        }

        const userId = req.user.userId;

        const newAmount = parseFloat(amount);
        if (isNaN(newAmount) || newAmount < 0) {
            return res.status(400).json({ message: "Invalid Amount" });
        }

        const parsedFoodId = parseInt(foodId);
        if (isNaN(parsedFoodId) || parsedFoodId <= 0) {
            return res.status(400).json({ message: "Invalid Food ID" });
        }

        const [food] = await db.query('SELECT * FROM foods WHERE id = ?', [parsedFoodId]);
        if (food.length === 0) {
            return res.status(404).json({ message: "Food Not Found" });
        }

        const totalCal = food[0].calorie * newAmount;

        const [result] = await db.query(
            'UPDATE daily_logs SET amount = ?, calories = ?, food_id = ? WHERE id = ? AND user_id = ?',
            [newAmount, totalCal, parsedFoodId, logId, userId]
        );


        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Log Not Found " });
        }

        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        next(error);
    }
});

// Delete Food Entry from the diary
router.delete('/diary/delete/:id', authenticateToken, async (req, res, next) => {
    try{
        const logId = parseInt(req.params.id);

        const userId = req.user.userId;

        if (isNaN(logId) || logId <= 0){
            return res.status(400).json({message: "Invalid Log"});
        }
        
        const [result] = await db.query('DELETE FROM daily_logs WHERE id = ? AND user_id = ?',[logId, userId]);

        if (result.affectedRows === 0){
            return res.status(404).json({message: "Log Not Found"});
        }

        res.status(200).json({message: "Deleted Successfully"});

    }
    catch(error){
        next(error);
    }
});

// Get current macros
router.get('/dashboard/macros/:date', authenticateToken, async ( req, res, next) => {
    try{
        const userId = req.user.userId;
        const date = req.params.date;

        
        const [results] = await db.query('COALESCE(SUM(f.calorie * dl.amount), 0) AS totalCalories, COALESCE(SUM(f.protein * dl.amount)) AS totalProtein, COALESCE(SUM(f.carbs * dl.amount)) AS totalCarbs, COALESCE(SUM(f.fat * dl.amount)) AS totalFat FROM daily_logs dl JOIN foods f on f.id = dl.food_id WHERE dl.user_id = ? AND dl.log_date = ?', [userId, date]);

        res.status(200).json(results[0]);
    }
    catch(error){
        next(error);
    }
})

export default router;