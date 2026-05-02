import { Client } from '../models/index.js';

export const ClientService = {
  getAllClients: async (userId) => {
    return await Client.findAll({ where: { userId } });
  },

  createClient: async (data, userId) => {
    const { email, phone } = data;
    // email should be unique for each user
    if (email) {
      const existingEmail = await Client.findOne({ where: { email, userId } });
      if (existingEmail) throw new Error('A client with this email already exists');
    }
    
    // phone should be unique for each user
    if (phone) {
      const existingPhone = await Client.findOne({ where: { phone, userId } });
      if (existingPhone) throw new Error('A client with this phone number already exists');
    }

    return await Client.create({ ...data, userId });
  },

  updateClient: async (id, data, userId) => {
    const client = await Client.findOne({ where: { id, userId } });
    if (!client) throw new Error('Client not found');

    const { email, phone } = data;

    if (email && email !== client.email) {
      const existingEmail = await Client.findOne({ where: { email, userId } });
      if (existingEmail) throw new Error('A client with this email already exists');
    }

    if (phone && phone !== client.phone) {
      const existingPhone = await Client.findOne({ where: { phone, userId } });
      if (existingPhone) throw new Error('A client with this phone number already exists');
    }

    return await client.update(data);
  },

  deleteClient: async (id, userId) => {
    const client = await Client.findOne({ where: { id, userId } });
    if (!client) throw new Error('Client not found');
    await client.destroy();
    return true;
  }
};
