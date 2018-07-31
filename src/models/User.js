import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; //哈希加密
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema(
	{
		email: { type: String, required: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

//send the public data
schema.methods.generateJWT = function generateJWT() {
	//sign 用于编码与释码的作用，第一个参数是公钥，第二个参数是私钥用于解码的
	return jwt.sign(
		{
			email: this.email
		},
		process.env.JWT_SECRET
	);
};

schema.methods.isValidPassword = function isValidPassword(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		token: this.generateJWT()
	};
};

export default mongoose.model('User', schema);
