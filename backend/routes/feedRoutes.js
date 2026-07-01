import * as feedController from '../controllers/feedController.js';
import express from 'express';

const feedRouter = express.Router();

feedRouter.post('/create', feedController.createFeedRecord);

feedRouter.get('/all', feedController.getAllFeedRecords);

export default feedRouter;