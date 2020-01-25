import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionCotroller';
import authMiddleware from './app/middlewares/auth';
import authMiddlewareArduino from './app/middlewares/authArduino';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import TotenController from './app/controllers/TotenController';
import TotenParamController from './app/controllers/TotenParamController';

import logger from './app/middlewares/logger';

import ArduinoController from './app/controllers/ArduinoController';

const routes = new Router();
const upload = multer(multerConfig);

routes.use(logger);

routes.get('/arduino', async (req, res) => {
  import CheckIn from './app/models/Checkin';
  const checkin = await CheckIn.create({
    host: res.connection.remoteAddress,
  });

  res.json(checkin);
});

routes.get('/app', async (req, res, next) => {
  res.send(`<h1>Hello App</h1>`);
});

routes.get(
  '/api/arduino/avulso',
  authMiddlewareArduino,
  ArduinoController.getAvulso
);

routes.post(
  '/api/arduino/alert',
  authMiddlewareArduino,
  ArduinoController.postAlert
);

routes.post(
  '/api/arduino/avulso/checkin/:id',
  authMiddlewareArduino,
  ArduinoController.postAvulsoCheckIn
);

routes.put(
  '/api/arduino/avulso/checkin/:id',
  authMiddlewareArduino,
  ArduinoController.putAvulsoCheckIn
);

routes.delete(
  '/api/arduino/avulso/:id',
  authMiddlewareArduino,
  ArduinoController.deleteAvulso
);

routes.get(
  '/api/arduino/datetime',
  authMiddlewareArduino,
  ArduinoController.getDatetime
);

routes.post(
  '/api/arduino/register',
  authMiddlewareArduino,
  ArduinoController.postRegister
);

routes.get('/api/toten', TotenController.index);
routes.post('/api/toten', TotenController.store);
routes.put('/api/toten', TotenController.update);

routes.get('/api/toten/param', TotenParamController.index);
routes.post('/api/toten/param', TotenParamController.store);
routes.put('/api/toten/param', TotenParamController.update);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/users', UserController.get);

routes.use(authMiddleware);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);
routes.get('/providers', ProviderController.index);

routes.post('/appointmens', AppointmentController.store);
routes.get('/appointmens', AppointmentController.index);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);

// routes.use((req, res, next) => {
//   console.log('Rota nao localizada');
//   next();
// });

export default routes;
