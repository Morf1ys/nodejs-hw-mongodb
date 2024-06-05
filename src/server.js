import express from 'express';
import cors from 'cors';
import Contact from './db/contactModel.js';

function setupServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.find();
      res.status(200).json({
        status: '200',
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error fetching contacts',
        data: error,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const contact = await Contact.findById(req.params.contactId);
      if (!contact) {
        return res.status(404).json({
          status: '404',
          message: `Contact not found with id ${req.params.contactId}`,
        });
      }
      res.status(200).json({
        status: '200',
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
    } catch (error) {
      res.status(500).json({
        status: '500',
        message: 'Error fetching contact',
        data: error,
      });
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default setupServer;
