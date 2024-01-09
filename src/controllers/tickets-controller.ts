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

export async function getTickets(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId: number = req.userId;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
      return;
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!enrollment) {
      res.status(httpStatus.NOT_FOUND).json({ error: 'User has no enrollment' });
      return;
    }

    const ticket = await prisma.ticket.findFirst({
      where: {
        enrollmentId: enrollment.id,
      },
      include: {
        TicketType: true,
      },
    });

    if (!ticket) {
      res.status(httpStatus.NOT_FOUND).json({ error: 'User has no ticket' });
      return;
    }

    const formattedTicket = {
      id: ticket.id,
      status: ticket.status,
      ticketTypeId: ticket.ticketTypeId,
      enrollmentId: ticket.enrollmentId,
      TicketType: {
        id: ticket.TicketType.id,
        name: ticket.TicketType.name,
        price: ticket.TicketType.price,
        isRemote: ticket.TicketType.isRemote,
        includesHotel: ticket.TicketType.includesHotel,
        createdAt: ticket.TicketType.createdAt,
        updatedAt: ticket.TicketType.updatedAt,
      },
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    res.status(httpStatus.OK).json(formattedTicket);
  } catch (error) {
    console.error('Erro:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
}

