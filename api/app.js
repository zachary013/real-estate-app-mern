import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import testRoute from './routes/test.route.js';

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
//lets us use json data
app.use(express.json());
//use cookies
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/test', testRoute);

const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });