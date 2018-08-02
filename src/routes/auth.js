import express from 'express';
import User from '../models/User';
const router = express.Router();

router.post('/', (req, res) => {
	const { credentials } = req.body;
	User.findOne({ email: credentials.email }).then((user) => {
		if (user && user.isValidPassword(credentials.password)) {
			// res.json({ user: { email: user.email } });
			res.json({ user: user.toAuthJSON() });
		} else {
			res.status(400).json({ errors: { global: 'Invalidate credentials!' } });
		}
	});
});

router.post('/confirmation', (req, res) => {
	const { token } = req.body;
	User.findOneAndUpdate(
		{ confirmationToken: token },
		{ confirmationToken: '', confirmed: true },
		{ new: true } //用户权限,有一条更新记录
	).then(
		(user) =>
			user
				? res.json({ user: user.toAuthJSON() })
				: res.status(400).json({ errors: { global: 'Wrong Information!' } })
	);
});

export default router;
