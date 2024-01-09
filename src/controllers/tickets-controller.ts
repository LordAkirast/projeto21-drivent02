import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { enrollmentsService } from '@/services';
import { CEP } from '@/protocols';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTicketTypes(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const ticketTypes = await prisma.ticketType.findMany();

    const formattedTicketTypes = ticketTypes.map((type) => ({
      id: type.id,
      name: type.name,
      price: type.price,
      isRemote: type.isRemote,
      includesHotel: type.includesHotel,
      createdAt: type.createdAt,
      updatedAt: type.updatedAt,
    }));

    res.status(200).json(formattedTicketTypes);
  } catch (error) {
    console.error('Erro ao pegar tickets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
