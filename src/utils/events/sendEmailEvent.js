import {EventEmitter} from 'node:events';
import { generateCodeTemplate, generateEmailTemplate, sendCodeForgatPassword, sendEmail } from './../email/sendEmail.js';
import { generateToken } from './../token/token.js';
import { nanoid } from 'nanoid';
import * as generateEmail from './../email/sendEmail.js';


export const emailEvent = new EventEmitter();


const sendEmailGlobal = async ( {email , subject , templateGenerate , endpoint , addData  ,sendEmailFunction} = {}) => {
    try{
        const emailToken = generateToken({
            payload: {email} ,
            signature: process.env.TOKENSENDEMAIL_SIGNATURE
        })

        // email Link Token 
        let emailLink;
        if(endpoint === "confirmEmail"){
            emailLink = `${process.env.FE_URL}/${endpoint}?token=${emailToken}`;
        }else{
            emailLink = `${process.env.FE_URL}/${endpoint}`;
        }

        // html Data
        let  html;
        if (templateGenerate === generateEmail.generateEmailTemplate){
            html = templateGenerate(emailLink , email , addData);
        }else {
            html = templateGenerate(emailLink , addData);
        }
        await sendEmailFunction ({to:email , subject, html });
        console.log(`${subject} email sent successfully.`);
    }catch(err){
        console.error(`Error sending ${subject} email:`, err);
    }
};

// send Email
emailEvent.on("sendEmail" , async(data) => {
    const {email , password} = data;
    await sendEmailGlobal({
        email,
        subject: "Confirm Email",
        templateGenerate: generateEmail.generateEmailTemplate,
        endpoint: "confirmEmail",
        addData: password,
        sendEmailFunction: generateEmail.sendEmail
    });
});

// send code
emailEvent.on("sendCode" , async(data) => {
    const {email ,code} = data;

    await sendEmailGlobal({
        email,
        subject: "Send Code",
        templateGenerate: generateEmail.generateCodeTemplate,
        endpoint: "ForgetPasswordVerifyCode",
        addData: code, 
        sendEmailFunction: generateEmail.sendCodeForgatPassword
    });
})
