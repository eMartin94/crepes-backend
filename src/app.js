import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js'

const app = express();

app.use(morgan('dev'));

app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL_LOCAL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.use('/api', productRoutes);

export default app;