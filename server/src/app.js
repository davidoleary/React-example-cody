import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import wrap from 'express-async-wrap';
import cors from 'cors';
import path from 'path';
import auth from 'mf-auth';

import config from '../config/default';
import routes from './routes';
import { ErrorResponse } from './helpers/response';

auth.configure({
  ignoreRoutes: ['/', '/studio-cody', '/studio-cody/'], // initial token check is done on client
  authUrl: config.authUrl,
});

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// TODO: sort out routing in different builts (docker verus direct) remove duplication
app.use('/studio-cody/static', express.static(path.resolve('build/static')));
app.use(cors({
  origin: config.corsOrigin,
}));

app.use(auth.express, (err, req, res, next) => {
  if (err) {
    console.log('app use auth express error', err);
    return res.status(401).json(
      new ErrorResponse()
        .setError('Unauthorized', 'Unauthorized')
        .getResponse(),
    );
  }

  return next();
});

app.use('/studio-cody/api', routes);

app.get('/studio-cody/', (req, res) => {
  res.sendFile(path.resolve('build/index.html'));
});

app.get('/', (req, res) => {
  res.redirect('/studio-cody');
});

// catch 404 and forward to error handler
app.use(wrap(async (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}));

// error handler
app.use(wrap(async (err, req, res) => {
  // render the error page
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
}));

export default app;
