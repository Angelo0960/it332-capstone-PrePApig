import express from 'express';
import 'dotenv/config.js';
import authRouter from './routes/authRoutes.js';
import pigBatchRouter from './routes/pigRoutes.js';
import feedRouter from './routes/feedRoutes.js';
import vaccinationRouter from './routes/vaccineRoutes.js';
import expensesRouter from './routes/expensesRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import notificationRouter from './routes/notificationRoutes.js';



//initialize express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

try
{
app.listen(process.env.PORT || 5000, () => {
  console.log(`Listening to port ${process.env.PORT || 5000}...`);
});
}catch(e){
    console.error('Error starting the server:', e);
}

app.use  ('/auth', authRouter)
app.use  ('/pigs', pigBatchRouter)
app.use  ('/feeds', feedRouter)
app.use  ('/vaccinations', vaccinationRouter)
app.use  ('/expenses', expensesRouter)
app.use  ('/reports', reportRouter);
app.use  ('/notifications', notificationRouter);

//req cons
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});