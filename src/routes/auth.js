import express from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from '../mailer';

const router = express.Router();
//用户登录
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

//用户邮箱秘钥确认验证
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

router.post('/reset_password_request', (req, res) => {
	const { email } = req.body.email; //空了研究下结构
	User.findOne({ email: email }).then((user) => {
		if (user) {
			sendResetPasswordEmail(user);
			res.json({});
		} else {
			res.status(400).json({ errors: { global: 'Someting went wrong' } });
		}
	});
});

router.post('/validate_token', (req, res) => {
	const { token } = req.body;
	jwt.verify(token, process.env.JWT_SECRET, (err) => {
		if (err) {
			res.status(401).json();
		} else {
			res.json({});
		}
	});
});

//666
router.post('/reset_password', (req, res) => {
	const { password, token } = req.body.data;
	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			res.status(401).json({ errors: { global: 'Invalid Token' } });
		} else {
			User.findOne({ _id: decoded._id }).then((user) => {
				if (user) {
					user.setPassword(password);
					user.save().then(() => res.json({}));
				} else {
					res.status(404).json({ errors: { global: 'Invalid Token' } });
				}
			});
		}
	});
});

export default router;
