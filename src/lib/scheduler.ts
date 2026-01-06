import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import aiService from './ai-service';
import whatsAppService from './whatsapp-service';

const prisma = new PrismaClient();

class ReportScheduler {
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  async scheduleAllReports() {
    console.log('Scheduling all WhatsApp reports...');

    // Clear existing jobs
    this.clearAllJobs();

    // Get all active report configurations
    const reports = await prisma.whatsAppReportConfig.findMany({
      where: { isActive: true },
      include: {
        dashboard: {
          include: {
            widgets: {
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    for (const report of reports) {
      this.scheduleReport(report);
    }

    console.log(`Scheduled ${reports.length} WhatsApp reports`);
  }

  private scheduleReport(report: any) {
    const cronExpression = this.buildCronExpression(report.frequency, report.time);

    if (!cronExpression) {
      console.error(`Invalid schedule for report ${report.id}`);
      return;
    }

    const job = cron.schedule(cronExpression, async () => {
      await this.sendScheduledReport(report);
    });

    this.scheduledJobs.set(report.id, job);
    console.log(`Scheduled report ${report.id} with cron: ${cronExpression}`);
  }

  private buildCronExpression(frequency: string, time: string): string | null {
    const [hours, minutes] = time.split(':').map(Number);

    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }

    switch (frequency) {
      case 'daily':
        return `${minutes} ${hours} * * *`; // Every day at specified time

      case 'weekly':
        return `${minutes} ${hours} * * 1`; // Every Monday at specified time

      case 'monthly':
        return `${minutes} ${hours} 1 * *`; // First day of every month at specified time

      default:
        return null;
    }
  }

  private async sendScheduledReport(report: any) {
    try {
      console.log(`Sending scheduled report for config ${report.id}`);

      // Prepare dashboard data for AI report generation
      const dashboardData = {
        dashboardName: report.dashboard.name,
        widgets: report.dashboard.widgets.map((widget: any) => ({
          type: widget.type,
          title: widget.title,
          data: widget.config
        })),
        userInfo: {
          name: report.user.name,
          email: report.user.email
        }
      };

      // Generate AI report
      const reportContent = await aiService.generateDashboardReport(dashboardData);

      // Send report via WhatsApp
      const success = await whatsAppService.sendReport(report.id, reportContent);

      if (success) {
        console.log(`Successfully sent scheduled report for config ${report.id}`);
      } else {
        console.error(`Failed to send scheduled report for config ${report.id}`);
      }
    } catch (error) {
      console.error(`Error sending scheduled report for config ${report.id}:`, error);
    }
  }

  private clearAllJobs() {
    for (const [id, job] of this.scheduledJobs) {
      job.stop();
      job.destroy();
    }
    this.scheduledJobs.clear();
  }

  async rescheduleReport(reportId: string) {
    // Stop existing job
    const existingJob = this.scheduledJobs.get(reportId);
    if (existingJob) {
      existingJob.stop();
      existingJob.destroy();
      this.scheduledJobs.delete(reportId);
    }

    // Get updated report config
    const report = await prisma.whatsAppReportConfig.findFirst({
      where: { id: reportId, isActive: true },
      include: {
        dashboard: {
          include: {
            widgets: {
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    if (report) {
      this.scheduleReport(report);
    }
  }

  async stopReport(reportId: string) {
    const job = this.scheduledJobs.get(reportId);
    if (job) {
      job.stop();
      job.destroy();
      this.scheduledJobs.delete(reportId);
      console.log(`Stopped scheduled report ${reportId}`);
    }
  }

  getScheduledJobsCount(): number {
    return this.scheduledJobs.size;
  }

  async checkAndSendDailyReports() {
    // This can be called manually to send daily reports
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const reports = await prisma.whatsAppReportConfig.findMany({
      where: {
        isActive: true,
        frequency: 'daily',
        time: {
          startsWith: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
        }
      },
      include: {
        dashboard: {
          include: {
            widgets: {
              orderBy: { createdAt: 'asc' }
            }
          }
        },
        user: {
          select: { name: true, email: true }
        }
      }
    });

    for (const report of reports) {
      await this.sendScheduledReport(report);
    }
  }
}

// Create singleton instance
const reportScheduler = new ReportScheduler();

export default reportScheduler;
