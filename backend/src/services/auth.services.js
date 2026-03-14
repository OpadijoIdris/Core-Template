import bcrypt from 'bcrypt';
import crypto from 'crypto';
import prisma from '../config/postgres.js';
import redis from '../config/redis.js';
import { sendEmail } from './mail.services.js';

export const registerUser = async ({ email, password }) => {

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = crypto.randomBytes(32).toString("hex");
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await prisma.user.create({
        data: {
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: token,
        },
    });

    await redis.set(`email_verify:${token}`, user.id, "EX", 60 * 30);
    await redis.set(`email_code:${verificationCode}`, user.id, "EX", 60 * 30);

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail({
    to: user.email,
    subject: "Welcome to Our App – Verify Your Email",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
                background: #4CAF50;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .content {
                padding: 30px;
                color: #333333;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 12px 20px;
                margin-top: 20px;
                background: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                padding: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h1>Verify Your Email</h1>
            </div>
            <div class="content">
                <p>Hi there,</p>
                <p>Thanks for signing up! Please confirm your email address to activate your account.</p>                <p><strong>Your verification code is: ${verificationCode}</strong></p>                <p>
                <a href="${verifyUrl}" class="button">Verify Email</a>
                </p>
                <p>If the button doesn’t work, copy and paste this link into your browser:</p>
                <p><a href="${verifyUrl}">${verifyUrl}</a></p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
            </div>
        </body>
        </html>
    `,
    });

    return { id: user.id, email: user.email };
};


export const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if(!user) {
        throw new Error ("Invalid Credentials");
    };
    if(!user.isVerified) {
        throw new Error("Please verify your email to login");
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        throw new Error ("Invalid password");
    };

    return { user: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl
    }};
};

export const verifyEmailService = async (tokenOrCode) => {
  // Try to verify by token first
  let userId = await redis.get(`email_verify:${tokenOrCode}`);
  
  // If not found, try to verify by code
  if (!userId) {
    userId = await redis.get(`email_code:${tokenOrCode}`);
  }

  if (!userId) {
    throw new Error("Invalid or expired verification link");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { 
        isVerified: true,
        verificationToken: null

    }
  });

  // Clean up both token and code from Redis
  await redis.del(`email_verify:${tokenOrCode}`);
  await redis.del(`email_code:${tokenOrCode}`);
};

export const resendVerificationEmailService = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isVerified) {
    throw new Error("Email already verified");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`email_verify:${token}`, user.id, "EX", 60 * 30);
  await redis.set(`email_code:${verificationCode}`, user.id, "EX", 60 * 30);

  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email – Resend",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
                background: #4CAF50;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .content {
                padding: 30px;
                color: #333333;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 12px 20px;
                margin-top: 20px;
                background: #4CAF50;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                padding: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h1>Verify Your Email</h1>
            </div>
            <div class="content">
                <p>Hi there,</p>
                <p>You requested a new verification link. Please confirm your email address to activate your account.</p>
                <p><strong>Your verification code is: ${verificationCode}</strong></p>
                <p>
                <a href="${verifyUrl}" class="button">Verify Email</a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${verifyUrl}">${verifyUrl}</a></p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
            </div>
        </body>
        </html>
    `,
  });

  return { message: "Verification email sent successfully" };
};

export const forgotPasswordService = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    throw new Error("User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`password_reset:${resetToken}`, user.id, "EX", 60 * 15); // 15 minutes
  await redis.set(`password_reset_code:${resetCode}`, user.id, "EX", 60 * 15);

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .header {
                background: #FF9800;
                color: #ffffff;
                text-align: center;
                padding: 20px;
            }
            .content {
                padding: 30px;
                color: #333333;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                padding: 12px 20px;
                margin-top: 20px;
                background: #FF9800;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #888888;
                padding: 20px;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                <h1>Reset Your Password</h1>
            </div>
            <div class="content">
                <p>Hi there,</p>
                <p>You requested to reset your password. Click the button below to set a new password.</p>
                <p><strong>Your password reset code is: ${resetCode}</strong></p>
                <p>
                <a href="${resetUrl}" class="button">Reset Password</a>
                </p>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>This link will expire in 15 minutes.</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            </div>
            </div>
        </body>
        </html>
    `,
  });

  return { message: "Password reset email sent successfully" };
};

export const resetPasswordService = async (tokenOrCode, newPassword) => {

    let userId = await redis.get(`password_reset:${tokenOrCode}`);
  
  // If not found, try code
  if (!userId) {
    userId = await redis.get(`password_reset_code:${tokenOrCode}`);
  }

  if (!userId) {
    throw new Error("Invalid or expired reset link");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  // Clean up both token and code from Redis
  await redis.del(`password_reset:${tokenOrCode}`);
  await redis.del(`password_reset_code:${tokenOrCode}`);

  return { message: "Password reset successfully" };
};

export const changePasswordService = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new Error("Current password is incorrect");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });

  return { message: "Password changed successfully" };
};
