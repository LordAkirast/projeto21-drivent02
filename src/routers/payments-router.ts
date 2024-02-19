import { Router } from 'express';

// import { createUserSchema } from '@/schemas';
// import { validateBody } from '@/middlewares';
// import { usersPost } from '@/controllers';

const paymentsRouter = Router();

paymentsRouter.post('/', usersPost);

export { paymentsRouter };
