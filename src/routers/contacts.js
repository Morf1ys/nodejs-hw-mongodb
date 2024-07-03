import express from 'express';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import authenticate from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticate);

router.post('/', upload.single('photo'), createContact);
router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
router.patch('/:contactId', upload.single('photo'), updateContact);
router.delete('/:contactId', deleteContact);

export default router;
