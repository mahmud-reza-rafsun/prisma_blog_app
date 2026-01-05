import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                required: false
            },
            phone: {
                type: "string"
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationURL = `${process.env.APP_URL}/verify-email?token=${token}`
                const info = await transporter.sendMail({
                    from: '"Prisma Blog app" <prisma@dev.com>',
                    to: "rafsun16.it@gmail.com",
                    subject: "Hello ✔",
                    text: "Hello human?",
                    html: `<!DOCTYPE html>
                            <html lang="en">
                            <head>
                            <meta charset="UTF-8" />
                            <title>Verify Email</title>
                            </head>
                            <body style="margin:0; padding:0; background:#f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Inter, Arial, sans-serif;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                <td align="center" style="padding:40px 16px;">
                                    <table width="520" cellpadding="0" cellspacing="0"
                                    style="background:#ffffff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.06);">

                                    <!-- Header -->
                                    <tr>
                                        <td style="padding:24px 28px; text-align:center;">
                                        <h1 style="margin:0; font-size:20px; color:#111827;">
                                            Prisma Blog App
                                        </h1>
                                        </td>
                                    </tr>

                                    <!-- Content -->
                                    <tr>
                                        <td style="padding:0 28px 28px; color:#374151;">
                                        <h2 style="font-size:18px; margin:0 0 12px; color:#111827;">
                                            Verify your email
                                        </h2>

                                        <p style="margin:0 0 20px; font-size:14.5px; line-height:1.6;">
                                            Thanks for joining <b>Prisma Blog</b>.
                                            Please confirm your email address to activate your account.
                                        </p>

                                        <div style="text-align:center; margin:26px 0;">
                                            <a href="${verificationURL}"
                                            style="display:inline-block;
                                                    background:linear-gradient(135deg, #6366f1, #2563eb);
                                                    color:#ffffff;
                                                    padding:12px 26px;
                                                    font-size:14px;
                                                    font-weight:600;
                                                    border-radius:8px;
                                                    text-decoration:none;">
                                            Verify Email
                                            </a>
                                        </div>

                                        <p style="margin:0; font-size:13px; color:#6b7280;">
                                            If you didn’t request this, you can safely ignore this email.
                                        </p>
                                        </td>
                                    </tr>

                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding:16px; text-align:center; font-size:12px; color:#9ca3af;">
                                        © 2026 Prisma Blog
                                        </td>
                                    </tr>

                                    </table>
                                </td>
                                </tr>
                            </table>
                            </body>
                            </html>
                `,
                });

                console.log("Message sent:", info.messageId);
            } catch (err) {
                console.log(err);
                throw err
            }
        },
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});