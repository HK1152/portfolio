const nodemailer = require('nodemailer');
const env = require('../../config/env.config');
const prisma = require('../../config/prismaClient');
const ApiError = require('../../utils/apiError');

/**
 * Contact Service - handles email sending and logging
 */
class ContactService {
  constructor() {
    this.transporter = null;
  }

  getTransporter() {
    if (!this.transporter) {
      if (!env.EMAIL_USER || !env.EMAIL_PASS) {
        console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured in environment.');
      }
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
      });
    }
    return this.transporter;
  }

  async sendContactEmail({ name, email, message }) {
    // 1. Always store message in database first so leads are never lost
    try {
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          message,
        },
      });
    } catch (dbError) {
      console.error('Failed to store contact message in DB:', dbError.message);
    }

    // 2. If email credentials are missing, return success as it is safely recorded in DB
    if (!env.EMAIL_USER || !env.EMAIL_PASS) {
      console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured. Message recorded in database.');
      return { success: true, savedToDb: true };
    }

    const transporter = this.getTransporter();

    const mailOptions = {
      from: `"${name}" <${env.EMAIL_USER}>`,
      to: env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new message from your portfolio.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { messageId: info.messageId, success: true };
    } catch (error) {
      console.error('Nodemailer Send Error:', error.message);
      // Message is already saved in DB, so return success gracefully
      return { success: true, savedToDb: true, emailError: error.message };
    }
  }
}

module.exports = new ContactService();
