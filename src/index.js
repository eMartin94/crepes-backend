import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

connectDB();
