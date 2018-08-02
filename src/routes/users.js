import express from 'express';
import User from '../models/User';
import parseErrors from '../untils/parseErrors';
import { sendConfirmationEmail } from '../mailer';

const router = express.Router();

//响应前端
router.post('/', (req, res) => {
	const { email, password } = req.body.user;
	const user = new User({ email });
	user.setPassword(password);
	user.setConfirmationToken();
	user
		.save()
		.then((user) => {
			sendConfirmationEmail(user);
			res.json({ user: user.toAuthJSON() });
		}) //新用户已储存，给钥匙,传信息
		.catch((err) => res.status(400).json({ errors: parseErrors(err.errors) }));
});

export default router;
