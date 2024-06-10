import express from 'express';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import createError from 'http-errors';
import errorHandler from './middleware/errorHandler.js';
import notFoundHandler from './middleware/notFoundHandler.js';

function setupServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
}

export default setupServer;
