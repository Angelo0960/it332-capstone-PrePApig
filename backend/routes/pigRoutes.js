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
// Get Active Batches
pigBatchRouter.get('/active', pigBatchController.getActiveBatches);
// Update Weight Only
pigBatchRouter.patch('/:id/weight', pigBatchController.updateWeight);
// Get Summary
pigBatchRouter.get('/summary', pigBatchController.getBatchSummary);


export default pigBatchRouter;


