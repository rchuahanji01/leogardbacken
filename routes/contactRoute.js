// routes/contactRoute.js
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Basic validation helper
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // simple validation
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "Name, email and message are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    // create transporter using env vars
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 465,
      secure: process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === "true" : true, // true for 465, false for other ports
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASS, // use App Password if Gmail with 2FA
      },
    });
    console.log('process.env.ADMIN_EMAIL' , process.env.ADMIN_EMAIL)
    console.log('process.env.EMAIL_HOST ' , process.env.EMAIL_HOST )
    console.log('process.env.ADMIN_PASS ' , process.env.ADMIN_PASS )
    const mailOptions = {
      from: `"Website Contact" <${process.env.ADMIN_EMAIL}>`,
      to: "rakesh112233rc@gmail.com", // destination admin email
      subject: subject ? `Website Inquiry: ${subject}` : "Website Inquiry",
      html: `
        <h3>New inquiry from website</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Subject:</b> ${subject || "N/A"}</p>
        <hr/>
        <p><b>Message:</b></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
        <hr/>
        <p>Received: ${new Date().toLocaleString()}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending contact email:", err);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;
