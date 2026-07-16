require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// A shared secret so random people on the internet can't use your
// Gmail account to spam through this endpoint. The Python backend
// sends this same value in the "x-api-key" header on every request.
const API_KEY = process.env.EMAIL_SERVICE_API_KEY || "";

function checkApiKey(req, res, next) {
  if (!API_KEY) {
    // No key configured — allow through (useful for quick local testing),
    // but you should set EMAIL_SERVICE_API_KEY before deploying.
    return next();
  }

  if (req.header("x-api-key") !== API_KEY) {
    console.warn("[auth] rejected request: invalid or missing x-api-key");
    return res.status(401).json({ error: "Invalid or missing API key" });
  }

  return next();
}

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.post("/send-otp", checkApiKey, async (req, res) => {
  const { email, otp } = req.body || {};

  if (!email || !otp) {
    console.warn("[send-otp] rejected: missing email or otp in request body");
    return res.status(400).json({ error: "email and otp are required" });
  }

  if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD) {
    console.error(
      "[send-otp] EMAIL_ADDRESS or EMAIL_PASSWORD is not set on this service"
    );
    return res.status(500).json({
      error: "EMAIL_ADDRESS or EMAIL_PASSWORD is not set on the email service",
    });
  }

  console.log(`[send-otp] attempting to send OTP email to ${email}`);

  const text = `Hello,

Welcome to AI Chat App.

Your One-Time Password (OTP) is:

${otp}

This OTP will expire in 5 minutes.

If you did not request this OTP, please ignore this email.

Regards,
AI Chat App Team`;

  try {
    const info = await transporter.sendMail({
      from: `"AI Chat App" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: "AI Chat App - Login Verification",
      text,
    });

    console.log(
      `[send-otp] sent to ${email} — messageId: ${info.messageId}`
    );

    return res.json({ message: "OTP sent" });
  } catch (err) {
    console.error(`[send-otp] FAILED for ${email}:`, err.message || err);

    return res.status(500).json({
      error: err.message || "Failed to send email",
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Email service running on port ${PORT}`);
  console.log(
    `EMAIL_ADDRESS configured: ${Boolean(process.env.EMAIL_ADDRESS)}`
  );
  console.log(
    `EMAIL_PASSWORD configured: ${Boolean(process.env.EMAIL_PASSWORD)}`
  );
  console.log(
    `EMAIL_SERVICE_API_KEY configured: ${Boolean(API_KEY)}`
  );
});
