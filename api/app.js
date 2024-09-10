import express from 'express';

const app = express();

app.use('/api/test', (req, res) => {
    res.send('Hello World');
})

app.listen(8800, () => {
    console.log('Server is running on port 8800');
})