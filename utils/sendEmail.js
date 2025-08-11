import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const sendEmail = async (options) => {
    // create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // define email options
    const mailOptions = {
        from: process.env.EMAIL_FROM, // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.html, // html body
        // attachments: options.attachments, // optional attachments
    };
    // send the email
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Email could not be sent');
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
}

export { sendEmail };