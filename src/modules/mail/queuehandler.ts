import { Queue, QueueOptions, Worker, Job, RedisConnection } from "bullmq";
import { MailTypes, IMailService, IEmailData, IEmailQueue } from "./mail.interface";
import logger from "../../utils/logging/winston";
import { inject, injectable } from "inversify";
import { configureRedisUrl } from "../../utils/redis/configureUrl";

const connectionString = process.env.REDIS_URL as string;
const redisConnection = configureRedisUrl(connectionString);

const queueOptions = { 
    limiter:{
        max:100, // maximum number of tasks the queue can take
        duration:10000  // miliseconds to wait after reaching max limit
    },
    connection:redisConnection,
    prefix: 'EMAIL-TASK',
    backoff: {
        type: 'exponential', // Exponential backoff strategy
        delay: 1000, // Initial delay in milliseconds
    },
    defaultJobOptions: {
        attempts: 5, // default number of retries for a mail
        removeonComplete: true
    }
} as QueueOptions;

const emailQueueName = 'email-queue';

@injectable()
export default class EmailQueue implements IEmailQueue{
    private queue: Queue;
    private worker: Worker;
    private emailService: IMailService;
    constructor(@inject(MailTypes.IMailService)mailSerivce:IMailService){
        this.emailService =  mailSerivce;
        this.queue =  new Queue(emailQueueName, queueOptions);
        this.worker = new Worker(emailQueueName, async(emailJob:Job)=>{
            this.processEmailJobTask(emailJob) }, queueOptions);
    }

    private async processEmailJobTask(emailJob:Job){
        logger.info("Processing Email Notification Task")
        const response = await this.emailService.sendMail(emailJob.data)
        if(response){
            logger.info("Proccesing Email Notification Task Completed")
        }else{
            logger.error("Proccesing Email Notification Task Failed")
        }

    }
    public async addEmailToQueue(emailData:IEmailData):Promise<void>{
        try {
            await this.queue.add("email_notification", emailData);
            logger.info(`Email to ${emailData.to} has been added to the Queue`)
          } catch (error) {
            logger.error(`Email to ${emailData.to} failed to be added to the Queue`)
          }
       
        
    }
}



