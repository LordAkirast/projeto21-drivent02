type Payment = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: string;
    name: string;
    expirationDate: string; // formato: 'MM/AAAA' ou 'M/AAAA'
    cvv: string;
  };
};


export class PaymentService {
  static async processPayment(ticketId: number): Promise<Payment> {

    const payment: Payment = {
      id: 1,
      ticketId,
      value: 100, 
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return payment;
  }
}
