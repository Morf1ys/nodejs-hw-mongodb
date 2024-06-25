import Contact from '../db/contactModel.js';
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
  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: Number(page),
      perPage: Number(perPage),
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
});

export const getContactById = ctrlWrapper(async (req, res, next) => {
  const contact = await Contact.findOne({
    _id: req.params.contactId,
    userId: req.user._id,
  });
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
  const contact = new Contact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId: req.user._id,
  });
  await contact.save();
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: req.params.contactId, userId: req.user._id },
    req.body,
    { new: true },
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
  const contact = await Contact.findOneAndDelete({
    _id: req.params.contactId,
    userId: req.user._id,
  });
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.status(204).send();
});
