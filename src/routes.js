import { Router } from 'express';
const routes = new Router();

import ArduinoController from './app/controllers/ArduinoController';
import authMiddlewareArduino from './app/middlewares/authArduino';
import logger from './app/middlewares/logger';

routes.use(logger);

routes.get('/', async (req, res, next) => {
  res.send('<h1>Running...</h1>');
});

routes.get('/api/arduino/', ArduinoController.index);

routes.use(authMiddlewareArduino); // <-- apartir desse ponto exige que esteja autenticado

routes.post(
  '/api/arduino/avulso/checkin/:id',
  ArduinoController.postAvulsoCheckIn
);

routes.put(
  '/api/arduino/avulso/checkin/:id',
  ArduinoController.putAvulsoCheckIn
);

routes.get('/api/arduino/avulso', ArduinoController.getAvulso);

routes.post('/api/arduino/alert', ArduinoController.postAlert);

routes.delete('/api/arduino/avulso/:id', ArduinoController.deleteAvulso);

routes.get('/api/arduino/datetime', ArduinoController.getDatetime);

routes.post('/api/arduino/register', ArduinoController.postRegister);

export default routes;
