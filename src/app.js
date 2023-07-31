import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      // httpOnly: true,
      // maxAge: 3600000,
    },
  })
);
// app.use(cors({
//   origin: process.env.FRONTEND_URL_LOCAL,
//   methods: ['GET', 'POST', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   optionsSuccessStatus: 200
// }));
app.use(cookieParser());
app.use(cors());
app.use('/api', productRoutes);
app.use('/api', authRoutes)
app.use('/api', cartRoutes)

export default app;