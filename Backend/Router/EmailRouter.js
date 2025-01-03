const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


const sendEmail = (to, subject, text, html) => {
  
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: to, 
    subject: subject,
    text: text, 
    html: html 
  };

 
  return transporter.sendMail(mailOptions);
};


router.post('/send', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    const info = await sendEmail(to, subject, text, html);
    res.status(200).json({ message: 'Email sent', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;
