const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		fullname: {
			type: String,
			trim: true,
			required: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			trim: true,
			required: true,
			minlength: 6,
		},
	},
	{ timestamps: true, v: 0 }
);

const user = mongoose.model('user', userSchema);

module.exports = user;
