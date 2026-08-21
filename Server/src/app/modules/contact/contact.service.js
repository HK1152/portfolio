const nodemailer = require('nodemailer');
const env = require('../../config/env.config');
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
      });
    }
    return this.transporter;
  }

  async sendContactEmail({ name, email, message }) {
    const transporter = this.getTransporter();

    const mailOptions = {
      from: email,
      to: env.EMAIL_USER,
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new message from your portfolio.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { messageId: info.messageId };
    } catch (error) {
      console.error('Nodemailer Send Error:', error);
      throw ApiError.internal('Failed to send email notification');
    }
  }
}

module.exports = new ContactService();
