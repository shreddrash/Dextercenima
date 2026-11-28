import express from 'express';
import { createApiRouter } from './apiRouter';

const app = express();
app.use(express.json());
app.use('/api', createApiRouter());
app.use('/', createApiRouter());

export default app;
