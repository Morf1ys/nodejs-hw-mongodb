import cloudinary from '../config/cloudinary.js';
import Contact from '../db/contactModel.js';
import stream from 'stream';

export const createContact = async (contactData, file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(new Error('Failed to upload to Cloudinary'));
          }
          contactData.photo = result.secure_url;
          saveContact(contactData).then(resolve).catch(reject);
        },
      );

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    } else {
      saveContact(contactData).then(resolve).catch(reject);
    }
  });
};

const saveContact = async (contactData) => {
  const contact = new Contact(contactData);
  await contact.save();
  return contact;
};

export const getAllContacts = async (filter) => {
  return await Contact.find(filter);
};

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const updateContact = async (contactId, contactData, userId, file) => {
  return new Promise((resolve, reject) => {
    if (file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(new Error('Failed to upload to Cloudinary'));
          }
          contactData.photo = result.secure_url;
          updateContactData(contactId, contactData, userId)
            .then(resolve)
            .catch(reject);
        },
      );

      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer);
      bufferStream.pipe(uploadStream);
    } else {
      updateContactData(contactId, contactData, userId)
        .then(resolve)
        .catch(reject);
    }
  });
};

const updateContactData = async (contactId, contactData, userId) => {
  return await Contact.findOneAndUpdate(
    { _id: contactId, userId },
    contactData,
    { new: true },
  );
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
