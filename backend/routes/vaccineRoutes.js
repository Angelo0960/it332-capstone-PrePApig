import * as vaccinationController from '../controllers/vaccineController.js';
import express from 'express';

const vaccinationRouter = express.Router();

vaccinationRouter.post('/create', vaccinationController.createVaccination);

vaccinationRouter.get('/all', vaccinationController.getAllVaccinations);

vaccinationRouter.get('/batch/:batchId', vaccinationController.getVaccinationsByBatch);

vaccinationRouter.get('/:id', vaccinationController.getVaccinationById);

vaccinationRouter.get('/upcoming', vaccinationController.getUpcomingVaccinations);

export default vaccinationRouter; 