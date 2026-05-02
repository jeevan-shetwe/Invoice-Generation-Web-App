import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController.js';
import { validate } from '../middleware/validate.js';
import { clientSchema } from '../validations/client.validation.js';

const router = express.Router();

router.get('/', getClients);
router.post('/', validate(clientSchema), createClient);
router.put('/:id', validate(clientSchema), updateClient);
router.delete('/:id', deleteClient);

export default router;
