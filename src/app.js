import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import passport from 'passport';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import stripeRoutes from './routes/stripeRoutes.js';
import dotenv from 'dotenv';
import { FRONTEND_URL_LOCAL, FRONTEND_URL_PRODUCCION } from './config.js';

dotenv.config();
const app = express();

app.use(morgan('dev'));

// app.use(cors());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      sameSite: 'none',
      // httpOnly: true,
      // maxAge: 3600000,
    },
  })
);

app.use(
  cors({
    origin: [FRONTEND_URL_LOCAL, FRONTEND_URL_PRODUCCION],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(cookieParser());
app.use('/api/v1', stripeRoutes);

app.use(express.json());

// app.use(passport.initialize());
// app.use(passport.session());

app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1', orderRoutes);

export default app;
