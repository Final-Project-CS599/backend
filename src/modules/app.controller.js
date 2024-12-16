import { dbConfig } from '../DB/connection.js';
import { route as dbRoute } from './services/createTable/CreateTable.js';

const bootstrap = (app, express) => {
  app.use(express.json());

  app.get('/', (req, res, next) => {
    return res
      .status(200)
      .json({ message: 'Welcome in node.js project powered by express and ES6' });
  });

  app.use('/DB', dbRoute);

  app.all('*', (req, res, next) => {
    return res.status(404).json({ message: 'In-valid routing' });
  });

  dbConfig.connect((err) => {
    if (err) {
      console.log('error on db connection ', err);
    } else {
      console.log('db connected');
    }
  });
};

export default bootstrap;
