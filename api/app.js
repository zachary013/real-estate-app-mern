import express from 'express';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';

const app = express();

//lets us use json data
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(8800, () => {
    console.log('Server is running on port 8800');
})