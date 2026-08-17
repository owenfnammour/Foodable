import express from 'express';
import db from './db.js';
import 'dotenv/config';
import router from './routes/methods.js'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/routes',router);

async function testConnection(){
    try{
        await db.query('SELECT 1');
        console.log("Successful connection");
    }
    catch(error){
        console.log("Failed connection: " , error.message)
    }
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    testConnection();
});
