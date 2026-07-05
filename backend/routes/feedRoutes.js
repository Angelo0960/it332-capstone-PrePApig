import * as feedController from '../controllers/feedController.js';
import express from 'express';

const feedRouter = express.Router();

feedRouter.post('/create', feedController.createFeedRecord);

feedRouter.get('/all', feedController.getAllFeedRecords);

feedRouter.get('/batch/:batchId', feedController.getFeedByBatch);

feedRouter.get('/:id', feedController.getFeedRecordById);

feedRouter.put('/:id', feedController.updateFeedRecord);

feedRouter.delete('/:id', feedController.deleteFeedRecord);

feedRouter.get('/summary', feedController.getFeedSummary);

export default feedRouter;