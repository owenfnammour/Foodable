import jwt from 'jsonwebtoken';


// Token authentication
export const authenticateToken = (req, res, next) =>{
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] ;

    const token = authHeader && authHeader.split(' ')[1];

    if (!token){
        res.status(401).json({message: 'Access token required'});
    }

    jwt.verify(token, 'YOUR_SECRET_KEY', (err, decodedUser) =>{
        if (err){
            res.status(403).json({message: "Invalid or expired token"});
        }
        req.user = decodedUser;
        next();
    })
}