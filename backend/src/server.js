import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { swaggerSpec } from './swagger.js';

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', router);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Backend running on ${port}`));
