import {createTransport} from "nodemailer"
import { config } from "../config/index.js"
import twilio from 'twilio'


const twilioCredentials = {
    accountSid: config.CREDENTIALS.TWILIO.accountSid,
    authToken: config.CREDENTIALS.TWILIO.authToken,
    twilioPhone: config.CREDENTIALS.TWILIO.twilioPhone
}

const twilioClient = twilio(twilioCredentials.accountSid, twilioCredentials.authToken);


const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: config.CREDENTIALS.ETHEREAL.etherealUser,
        pass: config.CREDENTIALS.ETHEREAL.etherealPass
    }
})
const gmailTransporter = createTransport({

    service: 'gmail',
    port: 587,
    auth:{
        user: config.CREDENTIALS.GMAIL.gmailUser,
        pass: config.CREDENTIALS.GMAIL.gmailPass
    }
})

const mailOptions= {
    from: 'Servidor Node.js',
    to: 'rafael.msl81@gmail.com',
    subject: 'Mail de prueba',
    text: 'Mail de prueba'
}

async function sendSMS(message,destination){
    const smsOptions = { body: message, from: twilioCredentials.twilioPhone, to: destination }
    try {
        const response = await twilioClient.messages.create(smsOptions)
        return response
    } catch (error) {
        console.log(error)
    }
    
}
async function sendMail(subject,message,destination){
    const mailOptions= {
        from: 'Servidor Node.js',
        to: destination,
        subject: subject,
        text: message
    }
    try {
        const info = await gmailTransporter.sendMail(mailOptions)
        return info.accepted
    } catch (error) {
        console.log(error)
    }
}

export const MESSAGE_UTILS = {sendMail, sendSMS}