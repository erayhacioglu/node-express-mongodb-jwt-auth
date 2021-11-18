require('dotenv').config();
require('./config/dbConnection')();
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

//middlewares
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routes
app.use('/api', require('./routes/authRouter'));
app.use('/user', require('./routes/userRouter'));

//port setting and app listening
const Port = process.env.PORT || 5000;
app.listen(Port, () => console.log(`Server running on port ${Port}`));
