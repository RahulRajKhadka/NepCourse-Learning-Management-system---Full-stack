import nodemailer from "nodemailer";
import { createTransport } from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendMail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: to,
    subject: "Password Reset OTP",
  html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="color: #4CAF50; text-align: center;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #333;">
            Use the following One-Time Password (OTP) to reset your account password:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; background: #f3f3f3; padding: 12px 24px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #000;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #555;">
            ⚠️ This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            If you didn’t request a password reset, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });
};

export default sendMail;
