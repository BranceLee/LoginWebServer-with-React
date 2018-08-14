import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import auth from './routes/auth';
import user from './routes/users';
import books from './routes/books';
import comments from './routes/comments';

dotenv.config();
const app = express();

app.use(bodyParser.json());

//链接数据库，并保证mongo 正常运行
mongoose.connect(process.env.MONGODB_URL);

//'/xx/xx' 与 Routes
app.use('/api/auth', auth);
app.use('/api/users', user);
app.use('/api/books', books);
app.use('/api/comments', comments);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(8080, () => console.log('Running on localhoast :8080'));
