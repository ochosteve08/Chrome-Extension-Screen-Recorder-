const videoRoute = require('./uploadRoutes');
const userRoute = require('./userRoutes');
const { error } = require('../lib-handler');
const { Router } = require('express');

const apiRouter = Router();

apiRouter.use('/video', videoRoute);
apiRouter.use('/users', userRoute);

apiRouter.use('*', () => error.throwNotFound({ item: 'Route' }));

module.exports = apiRouter;
