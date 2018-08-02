import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt'; //哈希加密
import jwt from 'jsonwebtoken';

// 规定User的数据类型
const schema = new mongoose.Schema(
	{
		email: { type: String, required: true, lowercase: true, index: true, unique: true },
		passwordHash: { type: String, required: true },
		confirmed: { type: Boolean, default: false },
		confirmationToken: { type: String, default: '' }
	},
	{
		timestamps: true
	}
);

//send the public data
schema.methods.generateJWT = function generateJWT() {
	//sign 用于编码与释码的作用，第一个参数是加密内容
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

//generation email token to verify the regist
schema.methods.setConfirmationToken = function setConfirmationToken() {
	this.confirmationToken = this.generateJWT();
};

schema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
	return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
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
