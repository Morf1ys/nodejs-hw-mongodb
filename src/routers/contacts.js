import express from 'express';
import * as contactsController from '../controllers/contacts.js';
import { validateBody } from '../middleware/validateBody.js';
import Joi from 'joi';

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: Joi.string().valid('work', 'home', 'personal').optional(),
});

router.get('/contacts', contactsController.getAllContacts);
router.get('/contacts/:contactId', contactsController.getContactById);
router.post(
  '/contacts',
  validateBody(contactSchema),
  contactsController.createContact,
);
router.patch(
  '/contacts/:contactId',
  validateBody(contactSchema),
  contactsController.updateContact,
);
router.delete('/contacts/:contactId', contactsController.deleteContact);

export default router;
