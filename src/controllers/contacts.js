import {
  createContact as createContactService,
  getAllContacts as getAllContactsService,
  getContactById as getContactByIdService,
  updateContact as updateContactService,
  deleteContact as deleteContactService,
} from '../services/contacts.js';
import createError from 'http-errors';
import { ctrlWrapper } from './ctrlWrapper.js';

export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;

  const filter = { userId: req.user._id };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const skip = (page - 1) * perPage;
  const totalItems = await getAllContactsService(filter);
  const totalPages = Math.ceil(totalItems.length / perPage);

  const contacts = totalItems
    .sort((a, b) =>
      sortOrder === 'asc' ? a[sortBy] > b[sortBy] : a[sortBy] < b[sortBy],
    )
    .slice(skip, skip + perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems: totalItems.length,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
});

export const getContactById = ctrlWrapper(async (req, res, next) => {
  const contact = await getContactByIdService(
    req.params.contactId,
    req.user._id,
  );
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
});

export const createContact = ctrlWrapper(async (req, res, next) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (!name || !phoneNumber) {
    return next(createError(400, 'Name and phone number are required'));
  }
  const contactData = {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId: req.user._id,
  };
  const contact = await createContactService(contactData, req.file);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const contact = await updateContactService(
    req.params.contactId,
    req.body,
    req.user._id,
    req.file,
  );
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
});

export const deleteContact = ctrlWrapper(async (req, res, next) => {
  const contact = await deleteContactService(
    req.params.contactId,
    req.user._id,
  );
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.status(204).send();
});
