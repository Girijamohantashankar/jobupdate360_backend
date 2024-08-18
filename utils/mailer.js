const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendWelcomeEmail = async (email, name) => {
    const emailTemplatePath = path.join(__dirname, '../views/welcome_email.html');
    fs.readFile(emailTemplatePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading email template:', err);
            return;
        }
        const htmlContent = data.replace('{{name}}', name);

        const mailOptions = {
            from: `"jobupdate360" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Jobupdate360!',
            html: htmlContent,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Welcome email sent:', info.response);
            }
        });
    });
};

module.exports = sendWelcomeEmail;
