import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import fileUpload from "express-fileupload";
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
      sameSite: 'none',
      // httpOnly: true,
      // maxAge: 3600000,
    },
  })
);
app.use(cors({
  origin: [process.env.FRONTEND_URL_LOCAL, process.env.FRONTEND_URL_PRODUCCION],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(cookieParser());

// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: "./uploads",
// })
// )
// app.use(cors());
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', cartRoutes);

export default app;