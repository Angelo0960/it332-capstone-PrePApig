import * as notificationController from '../controllers/notificationController.js';
import express from 'express';

const notificationRouter = express.Router();

notificationRouter.post('/send', notificationController.createNotification);

notificationRouter.get('/all', notificationController.getAllNotifications);

notificationRouter.patch('/:id/read', notificationController.markAsRead);

notificationRouter.delete('/:id', notificationController.deleteNotification);

export default notificationRouter;