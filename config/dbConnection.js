const mongoose = require('mongoose');

const dbConnection = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL);
		console.log('Db connected...');
	} catch (error) {
		console.error('Db connection error : ' + error);
	}
};

module.exports = dbConnection;
