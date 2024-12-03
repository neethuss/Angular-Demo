import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import pool from './model/db.js';
import session from "express-session";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));



app.use(express.json()); 
(async () => {
  try {
    await pool.query('SELECT NOW()'); 
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    process.exit(1); 
  }
})();



app.use(
  session({
    secret: process.env.SESSION_SECRET || 'neutrinostasksecret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  
  })
);



app.use('/api', authRoutes)


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
