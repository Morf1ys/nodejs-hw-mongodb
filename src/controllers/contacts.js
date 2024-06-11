import Contact from '../db/contactModel.js';
import createError from 'http-errors';
import { ctrlWrapper } from './ctrlWrapper.js';

export const getAllContacts = ctrlWrapper(async (req, res, next) => {
  const contacts = await Contact.find();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
});

export const getContactById = ctrlWrapper(async (req, res, next) => {
  const contact = await Contact.findById(req.params.contactId);
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
  });
  await contact.save();
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
});

export const updateContact = ctrlWrapper(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.contactId,
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
  const contact = await Contact.findByIdAndDelete(req.params.contactId);
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.status(204).send();
});
