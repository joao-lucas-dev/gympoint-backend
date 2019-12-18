import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import PlanController from './app/controllers/PlanController';
import RegistrationsController from './app/controllers/RegistrationsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/registrations', RegistrationsController.store);
routes.put('/registrations/:id', RegistrationsController.update);

export default routes;
