import { ClientService } from '../services/clientService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getClients = async (req, res) => {
  try {
    const clients = await ClientService.getAllClients(req.user.id);
    sendSuccess(res, clients, 200, 'Clients retrieved successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createClient = async (req, res) => {
  try {
    const client = await ClientService.createClient(req.body, req.user.id);
    sendSuccess(res, client, 201, 'Client created successfully');
  } catch (err) {
    sendError(res, err.message, 400);
  }
};

export const updateClient = async (req, res) => {
  try {
    const client = await ClientService.updateClient(req.params.id, req.body, req.user.id);
    sendSuccess(res, client, 200, 'Client updated successfully');
  } catch (err) {
    sendError(res, err.message, err.message === 'Client not found' ? 404 : 400);
  }
};

export const deleteClient = async (req, res) => {
  try {
    await ClientService.deleteClient(req.params.id, req.user.id);
    sendSuccess(res, null, 200, 'Client deleted successfully');
  } catch (err) {
    sendError(res, err.message, err.message === 'Client not found' ? 404 : 500);
  }
};
