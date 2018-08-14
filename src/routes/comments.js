import express from 'express';
import Comment from '../models/Comment';

const router = express.Router();

router.get('/', (req, res) => {
	Comment.find().then((data) => res.json({ data }));
});

router.post('/addcomment', (req, res) => {
	const { comment: { email }, comment } = req.body;
	const comments = new Comment({ email });
	comments.setComment(comment);
	comments.save().then((comment) => res.json({ comment })).catch((err) => res.status(400).json({ errors: err }));
});

export default router;
