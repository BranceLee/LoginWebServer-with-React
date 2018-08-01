import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt'; //哈希加密
import jwt from 'jsonwebtoken';

// 规定User的数据类型
const schema = new mongoose.Schema(
	{
		email: { type: String, required: true, lowercase: true, index: true, unique: true },
		passwordHash: { type: String, required: true },
		confirmed: { type: Boolean, default: false }
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

schema.methods.setPassword = function setPassword(password) {
	this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.toAuthJSON = function toAuthJSON() {
	return {
		email: this.email,
		token: this.generateJWT(),
		confirmed: this.confirmed
	};
};

//查重提示
schema.plugin(uniqueValidator, { message: 'This email is already token' });

export default mongoose.model('User', schema);
