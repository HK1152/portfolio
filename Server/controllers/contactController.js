const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Create a transporter
    // For production, use environment variables for user and pass
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email (e.g., hk1152studio@gmail.com)
        pass: process.env.EMAIL_PASS  // Your Gmail App Password
      }
    });

    // 2. Define email options
    const mailOptions = {
      from: email, // Sender address (user's email from Firebase)
      to: process.env.EMAIL_USER, // Your receiver email
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new message from your portfolio.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
      replyTo: email
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};

module.exports = { sendEmail };
