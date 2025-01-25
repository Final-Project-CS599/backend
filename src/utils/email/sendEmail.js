import nodemailer from 'nodemailer';


// send email

export const generateEmailTemplate = ( emailLink , email ,password ) =>{
    return ` <!DOCTYPE html>
    <html lang="ar">
        <head>
            <meta charset="UTF-8">
            <style type="text/css">
                body {
                    background-color: #9b4caf7f; 
                    margin: 0px;
                    font-family: Arial, sans-serif;
                }
                .input-field {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #9b4caf;
                    border-radius: 4px;
                }
                .submit-button {
                    background-color: #fff;
                    color: #9b4caf;
                    padding: 10px 20px;
                    border: 2px solid #ddd;
                    border-color: #9b4caf;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .submit-button:hover {
                    color: #fff;
                    background-color: #9b4caf;
                }
            </style>
        </head>
        <body style="margin: 0px;">
            <div class="container">
            <table border="0" width="50%" 
                style="margin: auto; margin-top: 100px; padding: 30px; border: 1px solid #9b4caf; border-radius: 10px; background-color: rgba(255, 255, 255, 0.789); box-shadow: -5px 2px 54px -9px rgba(0, 0, 0, 1);"
            >
                <tr>
                    <td>
                        <table border="0" width="100%" >
                            <tr>
                                <td>
                                    <h1>
                                        <img width="100%" src="path_to_your_logo.png" alt="Academy Logo" class="logo">
                                    </h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table border="0" width="100%">
                            <tr>
                                <td style="padding: 20px 0;">
                                    <h2 style="text-align: center;">Welcome to our academy</h2>
                                    <p style="text-align: center;"> Please login to your account with your details</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="text-align: center;">
                                        <p>Email: <span class="credentials">${email}</span></p>
                                        <p>Password: <span class="credentials">${password}</span></p>
                                    </div>
                                        
                                    <!-- start button -->
                                    <tr>
                                        <td align="left" bgcolor="#ffffff">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                                        <table border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td>
                                                                    <a href="${emailLink}" style="margin:10px; padding:15px 25px; background-color: #9b4caf; color: #fff; text-decoration: none; border-radius: 5px;"> Login </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- end button -->
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            </div>
        </body>
    </html>
    `
}

export const sendEmail = async ({to=[] , cc="" , bcc="" , subject="Confirm Email", text="" , html="" , attachments=[]}={}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"Send Email" < ${process.env.SEND_EMAIL} > `,
        to,
        cc,
        bcc,
        subject,
        text,
        html, 
        attachments
    });
};

//send code
export const generateCodeTemplate = ( emailLink , code ) =>{
    return ` <!DOCTYPE html>
    <html lang="ar">
        <head>
            <meta charset="UTF-8">
            <style type="text/css">
                body {
                    background-color: #9b4caf7f; 
                    margin: 0px;
                    font-family: Arial, sans-serif;
                }
                .input-field {
                    width: 100%;
                    padding: 10px;
                    margin: 10px 0;
                    border: 1px solid #9b4caf;
                    border-radius: 4px;
                }
                .submit-button {
                    background-color: #fff;
                    color: #9b4caf;
                    padding: 10px 20px;
                    border: 2px solid #ddd;
                    border-color: #9b4caf;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                .submit-button:hover {
                    color: #fff;
                    background-color: #9b4caf;
                }
            </style>
        </head>
        <body style="margin: 0px;">
            <div class="container">
            <table border="0" width="50%" 
                style="margin: auto; margin-top: 100px; padding: 30px; border: 1px solid #9b4caf; border-radius: 10px; background-color: rgba(255, 255, 255, 0.789); box-shadow: -5px 2px 54px -9px rgba(0, 0, 0, 1);"
            >
                <tr>
                    <td>
                        <table border="0" width="100%" >
                            <tr>
                                <td>
                                    <h1>
                                        <img width="100%" src="path_to_your_logo.png" alt="Academy Logo" class="logo">
                                    </h1>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table border="0" width="100%">
                            <tr>
                                <td style="padding: 20px 0;">
                                    <h2 style="text-align: center;">Welcome to our academy</h2>
                                    <p style="text-align: center;"> Please login to your account with your details</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="text-align: center;">
                                        <p>Code: <span class="credentials">${code}</span></p>
                                    </div>

                                    <!-- start button -->
                                    <tr>
                                        <td align="left" bgcolor="#ffffff">
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                                                        <table border="0" cellpadding="0" cellspacing="0">
                                                            <tr>
                                                                <td>
                                                                    <a href="${emailLink}" style="margin:10px; padding:15px 25px; background-color: #9b4caf; color: #fff; text-decoration: none; border-radius: 5px;"> Forget Password </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- end button -->
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            </div>
        </body>
    </html>
    `
};

export const sendCodeForgatPassword = async ({to=[] , cc="" , bcc="" , subject="Send Code", text="" , html="" , attachments=[]}={}) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SEND_EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const info = await transporter.sendMail({
        from: `"Send Code" < ${process.env.SEND_EMAIL} > `,
        to,
        cc,
        bcc,
        subject,
        text,
        html, 
        attachments
    });
};

