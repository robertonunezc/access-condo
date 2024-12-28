import { Worker, Job } from 'bullmq';
import { EmailService } from '../../infra/email';
import { redis, REDIS_QUEUE_NAME } from '../../infra/redis.config';
// TODO: implement a retry strategy for failed jobs

// Connect to Redis

export interface EmailTaskData{
    to: string;
    subject: string;
    message: string;
}
const sendEmail = async (job: Job) => {
    const { to, subject, message }:EmailTaskData = job.data;
    console.log(`Sending email to ${to} with message: "${message}"`);
    // Simulate email sending logic
    const emailServices = new EmailService();
    await emailServices.sendEmail(to, subject, message);
  }
// Define task processors
const taskProcessors: Record<string, (job: Job) => Promise<void> | void> = {
    
    generateReport: async (job) => {
      const { reportId } = job.data;
      console.log(`Generating report with ID: ${reportId}`);
      // Simulate report generation logic
    },
    processPayment: async (job) => {
      const { paymentId, amount } = job.data;
      console.log(`Processing payment with ID: ${paymentId}, Amount: $${amount}`);
      // Simulate payment processing logic
    },
  };
  
  taskProcessors.sendEmail = sendEmail;
  // Define the generic job processor
  const processJob = async (job: Job) => {
    console.log(`Processing job: ${job.name} (ID: ${job.id})`);
    const processor = taskProcessors[job.name];
  
    if (processor) {
      await processor(job);
    } else {
      console.error(`No processor found for task: ${job.name}`);
    }
  };
  
// Define task processors
const worker = new Worker(REDIS_QUEUE_NAME, processJob, { connection: redis.connection });

worker.on('ready', () => {
    console.log('Worker is ready');
});
// Listen for job events
worker.on('completed', (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on('failed', (job, err) => {
    if(!job){
        console.log("Job is null");
        return;
    }
  console.error(`Job failed: ${job.id}, error: ${err.message}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down worker...');
    await worker.close();
    await redis.connection.quit();
    process.exit(0);
  });