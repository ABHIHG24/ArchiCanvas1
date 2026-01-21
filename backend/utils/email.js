const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true, // required for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // 🔍 Verify connection (VERY IMPORTANT)
  await transporter.verify();
  console.log("SMTP connection verified");

  const info = await transporter.sendMail({
    from: `"Pathfinder" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  console.log("Email sent:", info.messageId);
  return info;
};

module.exports = sendEmail;
