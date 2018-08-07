import express from 'express';

const router = express.Router();

router.get('/search', (req, res) => {
	res.json({
		books: [
			{
				goodreadsId: 0,
				title: 'Block Chain',
				authors: 'Lee',
				covers: [ 'http1', 'http2' ],
				pages: 189
			},

			{
				goodreadsId: 1,
				title: 'ThINK OF JAVA',
				authors: 'Tomsong',
				covers: [ 'http1', 'http2' ],
				pages: 389
			},
			{
				goodreadsId: 2,
				title: 'Business Man',
				authors: 'Jack',
				covers: [ 'http1', 'http2' ],
				pages: 218
			}
		]
	});
});

export default router;
