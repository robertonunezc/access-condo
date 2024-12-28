import aws from 'aws-sdk';

import dotenv from 'dotenv';
dotenv.config(); 
export interface TaskMessage {
    service: string;
    payload: object;
}
export class WorkerService {
    private readonly QUEUE_URL = process.env.QUEUE_URL;
    private readonly sqs: aws.SQS;
    
    constructor() {
        aws.config.update({
            region: process.env.AWS_REGION, 
            accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          });
        // TODO: Do not create an instance each time the WorkerService is created
        // Create a single instance and reuse it
        this.sqs = new aws.SQS();

        // Test the credentials
        this.sqs.getQueueUrl({ QueueName: 'main' }, (err, data) => {
            console.log("WorkerService", process.env.AWS_REGION);

            if (err) {
                console.error("Error validating AWS credentials:", err);
            } else {
                console.log("AWS credentials are valid:", data);
            }
        });
    }

 async sendTaskToWorker(task: TaskMessage): Promise<void> {
    if (!this.QUEUE_URL) {
        throw new Error('QUEUE_URL is not defined');
    }
    const params = {
        QueueUrl: this.QUEUE_URL,
        MessageBody: JSON.stringify(task), 
    }
    try {
        const result = await this.sqs.sendMessage(params).promise();
        console.log(`Message sent with ID: ${result.MessageId}`);
    }
    catch (error) {
        console.error('Error sending message to SQS', error);
        throw error;
    }
 }
}
