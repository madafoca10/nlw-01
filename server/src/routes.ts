import express from 'express';
import multer from 'multer';
import { celebrate } from 'celebrate';

import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';
import multerConfig from './config/multer'; 

// index, show, create, update, delete

const routes = express.Router();
const upload = multer(multerConfig);
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get("/items", itemsController.index);
routes.get("/items/:id", itemsController.show);

routes.get('/points', pointsController.index);
routes.get("/points/:id", pointsController.show);
routes.post('/points', upload.single('image'),  pointsController.create);

export default routes;
