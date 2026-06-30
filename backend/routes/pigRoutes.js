import * as pigBatchController from '../controllers/pigController.js';
import express from 'express';

const pigBatchRouter = express.Router();

// Create Batch
pigBatchRouter.post('/create', pigBatchController.createBatch);

// Get All Batches
pigBatchRouter.get('/all', pigBatchController.getAllBatches);



export default pigBatchRouter;