require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(cors());

// =============================
// Brevo SMTP Configuration
// =============================
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SENDER_EMAIL,
    pass: process.env.BREVO_API_KEY,
  },
});

const API_KEY = process.env.EMAIL_SERVICE_API_KEY || "";

function checkApiKey(req, res, next) {
  if (!API_KEY) {
    return next();
  }

  if (req.header("x-api-key") !== API_KEY) {
    console.warn("[auth] Invalid API Key");
    return res.status(401).json({
      error: "Invalid API Key",
    });
  }

  next();
}

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
  });
});

app.post("/send-otp", checkApiKey, async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      error: "Email and OTP are required",
    });
  }

  try {
    console.log(`Sending OTP to ${email}`);

    const info = await transporter.sendMail({
      from: `"AI Chat App" <${process.env.BREVO_SENDER_EMAIL}>`,
      to: email,
      subject: "AI Chat App - Login Verification",
      text: `Hello,

Your One-Time Password (OTP) is:

${otp}

This OTP is valid for 5 minutes.

If you didn't request this OTP, please ignore this email.

Regards,
AI Chat App Team`,
    });

    console.log("Email sent:", info.messageId);

    return res.json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log("BREVO_API_KEY:", !!process.env.BREVO_API_KEY);
  console.log("BREVO_SENDER_EMAIL:", !!process.env.BREVO_SENDER_EMAIL);
  console.log("EMAIL_SERVICE_API_KEY:", !!API_KEY);
});