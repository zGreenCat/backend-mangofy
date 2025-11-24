const nodemailer = require("nodemailer");
const { env } = require("./env");

let transporter;
if (env.SMTP_HOST && env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 587,
    secure: false,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
} else {
  // Fallback transporter that logs the message to console (for development)
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

async function sendMail({ to, subject, text, html, from }) {
  const mailOptions = {
    from: from || env.EMAIL_FROM,
    to,
    subject,
    text,
    html,
  };
  const info = await transporter.sendMail(mailOptions);
  // If using jsonTransport, 'info.message' contains the json payload
  if (info && info.message) console.log("Mail sent (json):", info.message);
  return info;
}

module.exports = { sendMail };
