import { Queue, QueueOptions, RedisConnection, Worker, Job } from "bullmq";
import { MailTypes, IMailService, IEmailData, IEmailQueue } from "./mail.interface";
import logger from "../../utils/logging/winston";
import { inject, injectable } from "inversify";

const queueOptions = { 
    limiter:{
        max:100, // maximum number of tasks the queue can take
        duration:10000  // miliseconds to wait after reaching max limit
    },
    prefix: 'EMAIL-TASK',
    defaultJobOptions: {
        attempts: 5, // default number of retries for a mail
        removeonComplete: true
    }
} as QueueOptions;

const REDIS_URL = process.env.REDIS_URL as unknown as typeof RedisConnection;

@injectable()
export default class EmailQueue implements IEmailQueue{
    private queue: Queue;
    private worker: Worker;
    private emailService: IMailService;
    constructor(@inject(MailTypes.IMailService)mailSerivce:IMailService){
        this.emailService =  mailSerivce;
        this.queue =  new Queue('Email Queue', queueOptions, REDIS_URL);
        this.worker = new Worker("Email Queue", async(emailJob:Job)=>{
            logger.info("Processing Email Notification Task")
            await this.emailService.sendMail(emailJob.data);
        });
    }

    public async addEmailToQueue(emailData:IEmailData):Promise<void>{
        await this.queue.add("email_notification", emailData);
        logger.info(`Email to ${emailData.to} has been added to the Queue`)
    }
}



