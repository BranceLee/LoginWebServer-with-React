import express from 'express';

const router = express.Router();

router.get('/search', (req, res) => {
	res.json({
		books: [
			{
				goodreadsId: 1,
				title: 'Block Chain',
				authors: 'Lee',
				convers: [ 'http1' ]
			}
		]
	});
});

export default router;
