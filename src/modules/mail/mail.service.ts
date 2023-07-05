import nodemailer from 'nodemailer';
import { IMailService, IEmailData }from './mail.interface';
import logger from '../../utils/logging/winston';
import * as dotenv from "dotenv";
import { injectable } from 'inversify';


dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

@injectable()
export default class MailService implements IMailService{
    private transporter: nodemailer.Transporter;
    constructor(){
            this.createConnection();
    };
    
    private async createConnection(){
        this.transporter = nodemailer.createTransport({
            service:"gmail",
            host:"smtp.gmail.com",
            port: 587,
            tls: {
                rejectUnauthorized: false,
            },
            auth:{
                user:process.env.GOOGLE_MAIL_SENDER,
                pass:process.env.GOOGLE_APP_KEY
            }
        }) };

    public sendMail = async(options: IEmailData):Promise<boolean>=>{
        try {
            const info = await this.transporter
            .sendMail({ 
                from: process.env.GOOGLE_MAIL_SENDER,
                to: options.to,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            logger.info(`Mail sent successfully!!`);
            logger.info(`[MailResponse]=${info.response} [MessageID]=${info.messageId}`);
            return true;
        }catch(error:any){
            logger.error("Error Sending Mail", error)
            return false;
        }
    }
}