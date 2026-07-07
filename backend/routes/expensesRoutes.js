import * as expenseController from '../controllers/expensesController.js';
import express from 'express';

const expensesRouter = express.Router();

expensesRouter.post('/create', expenseController.createExpense);

expensesRouter.get('/all', expenseController.getAllExpenses);

expensesRouter.get('/:id', expenseController.getExpenseById);

export default expensesRouter;
