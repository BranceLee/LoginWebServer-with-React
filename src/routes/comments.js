import express from 'express';
import Comment from '../models/Comment';

const router = express.Router();

router.get('/', (req, res) => {
	Comment.find().then((data) => res.json({ data }));
});

router.post('/addcomment', (req, res) => {
	const { comment: { email }, comment } = req.body.data;
	const comments = new Comment({ email });
	comments.setComment(comment);
	comments.save().then((data) => res.json({ data })).catch((err) => res.status(400).json({ errors: '评论失败' }));
});

export default router;
