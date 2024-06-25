import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.post('/', createContact);
router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
router.patch('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

export default router;
