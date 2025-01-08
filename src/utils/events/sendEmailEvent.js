import {EventEmitter} from 'node:events';
import { generateEmailTemplate, sendEmail } from './../email/sendEmail.js';
import { generateToken } from './../token/token.js';


export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail" , async (data) => {
    const {email , password} = data;
    
    const emailToken = generateToken({
        payload: {email} ,
        signature: process.env.TOKENSENDEMAIL_SIGNATURE
    })

    const emailLink = `${process.env.FE_URL}/login/${emailToken}`;

    const html = generateEmailTemplate(emailLink , email , password);

    await sendEmail({to:email , subject:"Confirm Email" , html});
});

