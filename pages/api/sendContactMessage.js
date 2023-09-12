import nodemailer from 'nodemailer';
import {get, ref} from "firebase/database";
import {firebaseDb} from "../../firebase-config";


export default async function handler(req, res) {
    // Get the name, email, and message from the request body
    const {name, email, message} = JSON.parse(req.body);

    //verify email
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error:"invalid_mail"})
    }

    // Get needed values from DB
    let dbData = await getLogoAndContactEmailFromDB();

    // Set up the SMTP transport for Nodemailer
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // Insert the message details into the HTML email template
    const html = insertContentIntoTemplate(
        'Nowa wiadomość z formularza kontaktowego',
        name,
        email,
        message,
        dbData.logoUrl,
        "#151515");

    // Set up the message details
    const messageDetails = {
        from: `"Formularz kontaktowy" <${process.env.SMTP_USERNAME}>`,
        to: dbData.contactEmail,
        subject: 'Nowa wiadomość z formularza kontaktowego',
        html: html, // Send the email as HTML
    };

    // Send the email
    const info = await transport.sendMail(messageDetails);


    // If the email was sent successfully, send a success response.
    // Otherwise, send an error response.
    if (!info?.messageId) { return res.status(500).json({ success: false });}
    return res.status(200).json({ success: true });
}

async function getLogoAndContactEmailFromDB(){
    let snapShot = await get(ref(firebaseDb, `info/logo`));
    let logoUrl = await snapShot.val();

    snapShot = await get(ref(firebaseDb, `info/contactEmail`));
    let contactEmail = await snapShot.val();

    return {logoUrl,contactEmail};
}

// creates a html message from contents
function insertContentIntoTemplate(title, name, email, content, logoLink,mainColor) {
    return (
        `<html lang="pl-PL">
        <head>
            <meta charSet="utf-8"/>
        </head>
        <body>
        <div style="background-color:#f8f8f8; height: 30px"></div>
        <div style="margin:0;padding:0!important;background-color:#f8f8f8" width="100%">
            <center style="width:100%">
                <div style="max-width:600px;margin:0 auto">
                    <font face="Verdana">
                        <table width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff"
                               style="max-width:600px;width:100%;margin:auto;border-spacing:0!important;border-collapse:collapse!important;">

                            <tbody>
                            <tr>
                                <td align="right" valign="center"
                                    style="padding:10px 20px;background-color:${mainColor}; height:100px">
                                    <img
                                        src="${logoLink}"
                                        style="width: 20%;">
                                </td>
                            </tr>
                            <td height="10">&nbsp;</td>
                            <tr>
                                <td valign="top" style="padding: 10px 20px 0px 20px;">
                                    <h1 style="color:${mainColor}; font-size: 22pt;margin-bottom: 0px;">${title}</h1>
                                </td>
                            </tr>
                            <td height="5">&nbsp;</td>
                            <tr>
                                <td align="left" valign="top"
                                    style="padding:0px 20px;  text-align: justify; text-justify: inter-word;">
                                    <span style="color:${mainColor};"><b>Imię i nazwisko:</b> </span>${name}
                                </td>
                            </tr>
                            <tr>
                                <td align="left" valign="top"
                                    style="padding:0px 20px;  text-align: justify; text-justify: inter-word;">
                                    <span style="color:${mainColor};"><b>Adres email:</b> </span>${email}
                                </td>
                            </tr> 
                            <td height="10">&nbsp;</td>
                            <tr>
                                <td align="left" valign="top"
                                    style="padding:20px 10%;  text-align: justify; text-justify: inter-word;background-color: #f5f5f5;">
                                    ${content}
                                </td>
                            </tr>
                            <td height="30px">&nbsp;</td>


                            <td height="250">&nbsp;</td>
                            <tr>
                                <td align="center" valign="top" style="padding:20px 0;background-color:${mainColor};color:white">
                                    <font size="1.5" color="1f1f1f"> <i> Ta wiadomość została wysłana
                                        przez <br> drugiezycie.eu
                                    </i></font>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </font>
                </div>
        </div>
        </center>
        </div>
    <div style="background-color:#f8f8f8; height: 30px"></div>
</body>
</html>`);


}