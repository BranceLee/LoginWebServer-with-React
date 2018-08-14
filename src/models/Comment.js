import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	email: { type: String, required: true },
	date: { type: String, required: true },
	image: { type: String, default: '' },
	meta: { type: Number, default: 0 },
	summary: { type: String, required: true }
});

schema.methods.setComment = function setComment(comment) {
	this.date = comment.date;
	this.image = comment.image;
	this.meta = comment.meta;
	this.summary = comment.summary;
};

export default mongoose.model('Comment', schema);
