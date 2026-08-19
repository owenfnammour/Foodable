import db from '../db.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const routerA = express.Router();

// Sign up Logic
routerA.post('/signup', async (req, res, next) => {

    try{
        const {email, password} = req.body;

        if (!email || !password || password.trim().length < 6){
            return res.status(400).json({message: "Invalid email or password (Min. 6 characters)"});
        }

        const [result] = await db.query("SELECT id FROM users WHERE email = ?",[email]);
        if (result.length > 0){
            return res.status(400).json({message: "Email already registered"});
        }

        const hashedPass = await bcrypt.hash(password, 10);

        await db.query("INSERT INTO users (email, `password` ,weight, daily_total) VALUES (?, ?, ?, ?)", [email, hashedPass, 75, 2500]);
        res.status(201).json({message: "User registered successfully"});
    }
    catch(error){
        next(error);
    }
});

// Log In Logic
routerA.post('/login', async (req, res, next) => {
    try{
        const {email, password} = req.body;
        
        const [users] = await db.query("SELECT * FROM users WHERE email = ?",[email]);

        if (users.length === 0){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const user = users[0];

        const match = await bcrypt.compare(password, user.password);
        
        if (!match){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        const token = jwt.sign(
            {userId: user.id, email: user.email},
            'YOUR_SECRET_KEY',
            {expiresIn: '24h'}
        );

        res.status(200).json({message: "Logged In", token});

    }
    catch(error){
        next(error);
    }
});

export default routerA;