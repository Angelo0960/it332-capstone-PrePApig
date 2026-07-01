import * as pigBatchController from '../controllers/pigController.js';
import express from 'express';

const pigBatchRouter = express.Router();

// Create Batch
pigBatchRouter.post('/create', pigBatchController.createBatch);

// Get All Batches
pigBatchRouter.get('/all', pigBatchController.getAllBatches);

pigBatchRouter.get('/:id', pigBatchController.getBatchById);

// Update Batch
pigBatchRouter.put('/:id', pigBatchController.updateBatch);

pigBatchRouter.delete('/:id', pigBatchController.deleteBatch);

feedRouter.get('/batch/:batchId', feedController.getFeedByBatch);

// Feed Records
feedRouter.get('/:id', feedController.getFeedRecordById);

feedRouter.put('/:id', feedController.updateFeedRecord);

export default pigBatchRouter;


