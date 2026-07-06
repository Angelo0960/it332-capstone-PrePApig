import * as vaccinationController from '../controllers/vaccineController.js';
import express from 'express';

const vaccinationRouter = express.Router();

vaccinationRouter.post('/create', vaccinationController.createVaccination);

vaccinationRouter.get('/all', vaccinationController.getAllVaccinations);

export default vaccinationRouter; 