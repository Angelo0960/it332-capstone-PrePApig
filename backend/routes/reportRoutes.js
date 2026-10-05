import * as reportController from '../controllers/reportController.js';
import express from 'express';

const reportRouter = express.Router();

reportRouter.get('/dashboard', reportController.getDashboardReport);

reportRouter.get('/feeds', reportController.getFeedReport);

reportRouter.get('/expenses', reportController.getExpenseReport);
reportRouter.get('/analytics', reportController.getAnalyticsData);

export default reportRouter;