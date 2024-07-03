import express from 'express';
import {
<<<<<<< Updated upstream
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import authenticate from '../middleware/authenticate.js';
import { upload } from '../middleware/upload.js';
=======
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import authenticate from '../middleware/authenticate.js'; // Перевірте цей рядок
import { validateBody } from '../middleware/validateBody.js';
import Joi from 'joi';
>>>>>>> Stashed changes

const router = express.Router();

router.use(authenticate);

<<<<<<< Updated upstream
router.post('/', upload.single('photo'), createContact);
router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
router.patch('/:contactId', upload.single('photo'), updateContact);
router.delete('/:contactId', deleteContact);
=======
router.use(authenticate); // Додаємо middleware для аутентифікації

router.get('/', getAllContactsController);
router.get('/:contactId', getContactByIdController);
router.post('/', validateBody(contactSchema), createContactController);
router.patch(
  '/:contactId',
  validateBody(contactSchema),
  updateContactController,
);
router.delete('/:contactId', deleteContactController);
>>>>>>> Stashed changes

export default router;
