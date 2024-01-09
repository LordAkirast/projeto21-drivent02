import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getEnrollmentByUser, postCreateOrUpdateEnrollment, getAddressFromCEP } from '@/controllers';
import { createOrUpdateEnrollmentSchema } from '@/schemas';
import { getTicketTypes } from '@/controllers/tickets-controller';
const ticketsRouter = Router();

ticketsRouter
  //.all('/*', authenticateToken)
  .get('/types', getTicketTypes) //get tickets types
  .get('/', getEnrollmentByUser) //get tickets
  .post('/', validateBody(createOrUpdateEnrollmentSchema), postCreateOrUpdateEnrollment); //post tickets

export { ticketsRouter };
