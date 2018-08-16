import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	email: { type: String, required: true },
	date: { type: String, required: true },
	image: { type: String, default: 'https://react.semantic-ui.com/images/avatar/large/matthew.png' },
	meta: { type: String, default: '0 likes' },
	summary: { type: String, required: true }
});

schema.methods.setComment = function setComment(comment) {
	this.date = comment.date;
	this.image = comment.image;
	this.meta = comment.meta;
	this.summary = comment.summary;
};

export default mongoose.model('Comment', schema);
