const { Router } = require('express');

const LogEntry = require('../models/LogEntry');

const router = Router();

//Get all entries from DB
router.get('/', async (req, res) => {
	try {
		//Define all data
		const entries = await LogEntry.find();
		//Return all data as JSON
		res.json(entries);
	} catch (error) {
		//Pass to error handler if failure
		next(error);
	}
});

//Post new entry to DB
router.post('/', async (req, res, next) => {
	//Create a new DB collection instance
	const logEntry = new LogEntry(req.body);
	try {
		//Take entry and save to collection
		const createdEntry = await logEntry.save();
		//Return the promise as JSON
		res.json(createdEntry);
	} catch (error) {
		//For Validation Error
		if (error.constructor.name) {
			res.status(422);
		}
		//Pass to error handle if failure
		next(error);
	}
});

module.exports = router;
