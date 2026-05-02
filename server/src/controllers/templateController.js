import { TemplateService } from '../services/templateService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getTemplates = async (req, res) => {
  try {
    const templates = await TemplateService.getAllTemplates(req.user.id);
    sendSuccess(res, templates, 200, 'Templates retrieved successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createTemplate = async (req, res) => {
  try {
    const template = await TemplateService.createTemplate(req.body, req.user.id);
    sendSuccess(res, template, 201, 'Template created successfully');
  } catch (err) {
    sendError(res, err.message, 400);
  }
};

export const updateTemplate = async (req, res) => {
  try {
    const template = await TemplateService.updateTemplate(req.params.id, req.body, req.user.id);
    sendSuccess(res, template, 200, 'Template updated successfully');
  } catch (err) {
    sendError(res, err.message, err.message === 'Template not found' ? 404 : 400);
  }
};

export const deleteTemplate = async (req, res) => {
  try {
    await TemplateService.deleteTemplate(req.params.id, req.user.id);
    sendSuccess(res, null, 200, 'Template deleted successfully');
  } catch (err) {
    sendError(res, err.message, err.message === 'Template not found' ? 404 : 500);
  }
};
