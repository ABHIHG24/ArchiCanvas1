const sgMail = require("@sendgrid/mail");

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendEmail(options)
 * SAME API as Nodemailer version
 *
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} options.html
 */
const sendEmail = async (options) => {
  try {
    await sgMail.send({
      to: options.to,
      from: `"Pathfinder" <${process.env.EMAIL_FROM}>`, // verified sender
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    console.log("✅ Email sent successfully via SendGrid");
  } catch (error) {
    console.error(
      "❌ SendGrid Email Error:",
      error.response?.body || error.message,
    );
  }
};

module.exports = sendEmail;
