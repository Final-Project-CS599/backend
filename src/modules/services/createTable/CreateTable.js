import { Router } from 'express';
import { createdTables } from './CreateTables.service.js';

export const route = Router();
route.post('/create-tables', createdTables);

// export default route;
