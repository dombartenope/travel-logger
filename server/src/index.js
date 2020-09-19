const dotenv = require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const middlewares = require('./middlewares');
const logs = require('./api/logs');

const app = express();

//DB Connection
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

//Middleware
app.use(morgan('common'));
app.use(helmet());
app.use(
	cors({
		//TODO: change on deployment
		origin: process.env.CORS_ORIGIN,
	})
);
app.use(express.json());

//Routes
app.use('/api/logs', logs);

//Not Found Middleware (404)
app.use(middlewares.notFound);

//General Error Handler
app.use(middlewares.errorHandler);

//Listener
const port = process.env.PORT || 1337;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
