import express from 'express';
import * as contactsController from '../controllers/contacts.js';

const router = express.Router();

router.get('/contacts', contactsController.getAllContacts);
router.get('/contacts/:contactId', contactsController.getContactById);
router.post('/contacts', contactsController.createContact);
router.patch('/contacts/:contactId', contactsController.updateContact);
router.delete('/contacts/:contactId', contactsController.deleteContact);

export default router;
