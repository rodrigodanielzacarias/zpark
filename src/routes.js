import { Router } from 'express';
const routes = new Router();

import ControllerV1 from './app/controllers/ControllerV1';
import AuthMiddlewareV1 from './app/middlewares/authArduino';
import logger from './app/middlewares/logger';

routes.use(logger);

routes.get('/', async (req, res, next) => {
  res.send('<h1>Running...</h1>');
});

routes.get('/api/v1/', ControllerV1.index);

routes.get('/api/v1/datetime', ControllerV1.getDatetime);

routes.use(AuthMiddlewareV1); // Utiliza AuthV1

routes.get('/api/v1/avulso', ControllerV1.getAvulso);

routes.post('/api/v1/alert', ControllerV1.postAlert);

routes.delete('/api/v1/avulso/:id', ControllerV1.deleteAvulso);

routes.post('/api/v1/register', ControllerV1.postRegister);

routes.post('/api/v1/avulso/checkin/:id', ControllerV1.postAvulsoCheckIn);

routes.put('/api/v1/avulso/checkin/:id', ControllerV1.putAvulsoCheckIn);

export default routes;
