import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaymentService } from '@/services/payment.service';
import { TicketService } from '@/services/ticket.service';
import { Payment } from '@/models/payment.model';

export async function processPayment(req: Request, res: Response) {
  const { ticketId, cardData } = req.body;

  if (!ticketId || !cardData) {
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'ticketId and cardData are required' });
  }

  try {
    const ticket = await TicketService.getTicketById(ticketId);
    if (!ticket) {
      return res.status(httpStatus.NOT_FOUND).json({ error: 'Ticket not found' });
    }

    const hasTicket = await TicketService.checkUserTicketOwnership(req.user.id, ticketId);
    if (!hasTicket) {
      return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized: User does not own the ticket' });
    }

    const paymentResult: Payment = await PaymentService.processPayment(ticket, cardData);

    await TicketService.updateTicketStatus(ticketId, 'PAID');

    return res.status(httpStatus.OK).json(paymentResult);
  } catch (error) {
    console.error('Error processing payment:', error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
  }
}
////