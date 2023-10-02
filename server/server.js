const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const { error } = require('./lib-handler');
const { connectToMongoDb, environmentVariables } = require('./config');

const apiRouter = require('./routes');


dotenv.config({
  path: './.env',
});

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(
  cors({
    // origin: [
    //   'http://localhost:5173',
    //   'http://localhost:5500',
    //   'http://localhost:3000',
    //   'http://127.0.0.1:5500',
    // ],origin:
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour',
});

app.get('/', (req, res) => {
  res.json({ message: 'api is working' });
});

app.use('/api', limiter);


app.use(apiRouter);

app.use(error.handler);

const main = async () => {
  console.info('Starting server');
  await connectToMongoDb();
  console.info('Connected to MongoDB');
  app.listen(environmentVariables.APP_PORT || 8000, (err) => {
    try {
      console.info(
        `Server running on ${environmentVariables.APP_HOST}:${environmentVariables.APP_PORT}`
      );
    } catch (error) {
      console.log(error);
    }
  });
};

main();
