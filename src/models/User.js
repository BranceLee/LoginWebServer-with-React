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

//用户账号标识符
schema.methods.generateJWT = function generateJWT() {
	//sign 用于编码与释码的作用，第一个参数是加密内容
	return jwt.sign(
		{
			email: this.email,
			confirmed: this.confirmed
		},
		process.env.JWT_SECRET
	);
};

//重置密码信息加密,by DB 的id
schema.methods.generateResetPasswordJWT = function generateRestPasswordJWT() {
	return jwt.sign(
		{
			_id: this.id
		},
		process.env.JWT_SECRET,
		{ expiresIn: '1h' } //有效时间
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

schema.methods.generateResetPasswordUrl = function generateResetPasswordUrl() {
	return `${process.env.HOST}/resetpassword_confirm/${this.email}/${this.generateResetPasswordJWT()}`;
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
