import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
}

class StripeService {
  async createAIAgentPayment(userId: string, amount: number = 20): Promise<PaymentIntent> {
    try {
      // Convert BRL to cents (Stripe expects cents)
      const amountInCents = Math.round(amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'brl',
        metadata: {
          userId: userId,
          service: 'ai_agent_analysis',
          amount: amount.toString()
        },
        description: 'Análise de Campanha por IA - Cortex BIaaS',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        id: paymentIntent.id,
        client_secret: paymentIntent.client_secret!,
        amount: amount,
        currency: 'brl'
      };
    } catch (error) {
      console.error('Error creating AI agent payment:', error);
      throw new Error('Falha ao processar pagamento');
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<boolean> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Update the AI agent session with payment confirmation
        const session = await prisma.aIAgentSession.findFirst({
          where: { paymentId: paymentIntentId }
        });

        if (session) {
          await prisma.aIAgentSession.update({
            where: { id: session.id },
            data: {
              paidAt: new Date()
            }
          });
        }

        return true;
      }

      return false;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return false;
    }
  }

  async createCustomer(email: string, name?: string): Promise<string> {
    try {
      const customer = await stripe.customers.create({
        email: email,
        name: name,
      });

      return customer.id;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Falha ao criar cliente no sistema de pagamento');
    }
  }

  async getPaymentStatus(paymentIntentId: string): Promise<string> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent.status;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return 'unknown';
    }
  }
}

// Create a singleton instance
const stripeService = new StripeService();

export default stripeService;
