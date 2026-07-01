import express from 'express';
import 'dotenv/config.js';
import authRouter from './routes/authRoutes.js';
import pigBatchRouter from './routes/pigRoutes.js';
import feedRouter from './routes/feedRoutes.js';

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

//req cons
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});