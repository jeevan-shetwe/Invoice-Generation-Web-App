import { Template } from '../models/index.js';

export const TemplateService = {
  getAllTemplates: async (userId) => {
    return await Template.findAll({ where: { userId } });
  },

  createTemplate: async (data, userId) => {
    return await Template.create({ ...data, userId });
  },

  updateTemplate: async (id, data, userId) => {
    const template = await Template.findOne({ where: { id, userId } });
    if (!template) throw new Error('Template not found');
    return await template.update(data);
  },

  deleteTemplate: async (id, userId) => {
    const template = await Template.findOne({ where: { id, userId } });
    if (!template) throw new Error('Template not found');
    await template.destroy();
    return true;
  }
};
