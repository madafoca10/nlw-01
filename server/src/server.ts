import express from 'express';
import path from 'path';
import routes from './routes';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.use('/image_items', express.static(path.resolve(__dirname, '..', 'uploads', 'items')));
app.use('/image_points', express.static(path.resolve(__dirname, '..', 'uploads', 'points')));

app.listen(3333);