export interface IEmailData {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
}


export interface IMailService {
    sendMail(options: IEmailData):Promise<any>;
}

export const MailTypes = {
    IMailService:Symbol("IMailService")
}