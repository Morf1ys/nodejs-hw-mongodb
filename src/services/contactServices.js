import Contact from '../db/contactModel.js';
import createError from 'http-errors';

export const createContact = async (contactData, userId) => {
  const contact = new Contact({ ...contactData, userId });
  await contact.save();
  return contact;
};

export const getAllContacts = async (userId, query) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = query;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const skip = (page - 1) * perPage;
  const totalItems = await Contact.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / perPage);

  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
    .skip(skip)
    .limit(perPage);

  return { contacts, page, perPage, totalItems, totalPages };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({ _id: contactId, userId });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

export const updateContact = async (contactId, userId, contactData) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    contactData,
    { new: true },
  );
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  return contact;
};
