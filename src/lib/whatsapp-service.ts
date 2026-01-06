import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class WhatsAppService {
  private client: Client;
  private isReady = false;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: 'cortex-dashboard'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.initializeClient();
  }

  private initializeClient() {
    this.client.on('qr', (qr) => {
      console.log('QR Code received, scan with WhatsApp:');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('ready', () => {
      console.log('WhatsApp client is ready!');
      this.isReady = true;
    });

    this.client.on('authenticated', () => {
      console.log('WhatsApp authenticated!');
    });

    this.client.on('auth_failure', (msg) => {
      console.error('WhatsApp authentication failed:', msg);
    });

    this.client.on('disconnected', (reason) => {
      console.log('WhatsApp disconnected:', reason);
      this.isReady = false;
    });

    // Initialize the client
    this.client.initialize().catch(console.error);
  }

  async isClientReady(): Promise<boolean> {
    return this.isReady;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    try {
      if (!this.isReady) {
        throw new Error('WhatsApp client is not ready');
      }

      // Format phone number to WhatsApp format
      const formattedNumber = phoneNumber.replace(/\D/g, '');
      const whatsappNumber = `${formattedNumber}@c.us`;

      await this.client.sendMessage(whatsappNumber, message);

      // Log the sent message
      await prisma.whatsAppReportHistory.create({
        data: {
          configId: '', // Will be set by the caller
          status: 'sent',
          message: message,
          sentAt: new Date()
        }
      });

      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);

      // Log the failed message
      await prisma.whatsAppReportHistory.create({
        data: {
          configId: '', // Will be set by the caller
          status: 'failed',
          message: message,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });

      return false;
    }
  }

  async sendReport(configId: string, reportContent: string): Promise<boolean> {
    try {
      // Get the configuration
      const config = await prisma.whatsAppReportConfig.findUnique({
        where: { id: configId }
      });

      if (!config) {
        throw new Error('WhatsApp report configuration not found');
      }

      const success = await this.sendMessage(config.phoneNumber, reportContent);

      // Update the history record with the configId
      await prisma.whatsAppReportHistory.updateMany({
        where: {
          configId: '',
          createdAt: {
            gte: new Date(Date.now() - 10000) // Last 10 seconds
          }
        },
        data: {
          configId: configId
        }
      });

      return success;
    } catch (error) {
      console.error('Error sending WhatsApp report:', error);
      return false;
    }
  }

  async destroy() {
    if (this.client) {
      await this.client.destroy();
    }
  }
}

// Create a singleton instance
const whatsAppService = new WhatsAppService();

export default whatsAppService;
