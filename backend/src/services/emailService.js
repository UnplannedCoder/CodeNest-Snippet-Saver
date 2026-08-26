import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure .env is loaded reliably
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

let transporterInstance = null;

/**
 * Creates and returns a Nodemailer transporter instance using environment variables.
 * Never uses hardcoded credentials.
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : null;
  const rawPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : null;
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : null;

  if (!user || !pass || pass === 'your_gmail_app_password_here') {
    return null;
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
    });
  }

  return transporterInstance;
};

/**
 * Parse user-agent string into clean, structured device, OS, and browser information.
 */
export const parseDeviceInfo = (ua) => {
  if (!ua || ua === 'Unknown' || ua === 'NodeTest') {
    return {
      device: 'Desktop',
      os: 'Unknown OS',
      browser: 'API Client / Unknown',
      summary: 'Desktop • Unknown OS',
    };
  }

  let device = 'Desktop';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  // 1. Detect Operating System and Device Category
  if (/iPad/i.test(ua)) {
    device = 'Tablet';
    os = 'iPadOS';
  } else if (/iPhone/i.test(ua)) {
    device = 'Mobile (iPhone)';
    os = 'iOS';
  } else if (/Android/i.test(ua)) {
    if (/Mobile/i.test(ua)) {
      device = 'Mobile';
      os = 'Android';
    } else {
      device = 'Tablet';
      os = 'Android Tablet';
    }
  } else if (/Windows NT 10.0/i.test(ua)) {
    device = 'Desktop';
    os = 'Windows 10/11';
  } else if (/Windows NT 6.3/i.test(ua)) {
    device = 'Desktop';
    os = 'Windows 8.1';
  } else if (/Windows NT 6.1/i.test(ua)) {
    device = 'Desktop';
    os = 'Windows 7';
  } else if (/Windows/i.test(ua)) {
    device = 'Desktop';
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    device = 'Desktop';
    os = 'macOS';
  } else if (/CrOS/i.test(ua)) {
    device = 'Desktop';
    os = 'ChromeOS';
  } else if (/Ubuntu/i.test(ua)) {
    device = 'Desktop';
    os = 'Ubuntu Linux';
  } else if (/Linux/i.test(ua)) {
    device = 'Desktop';
    os = 'Linux';
  }

  // 2. Detect Browser
  if (/Edg\//i.test(ua)) {
    browser = 'Microsoft Edge';
  } else if (/OPR\/|Opera/i.test(ua)) {
    browser = 'Opera';
  } else if (/Brave/i.test(ua)) {
    browser = 'Brave';
  } else if (/Chrome\/|CriOS/i.test(ua)) {
    browser = 'Google Chrome';
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    browser = 'Apple Safari';
  } else if (/Firefox\/|FxiOS/i.test(ua)) {
    browser = 'Mozilla Firefox';
  }

  return {
    device,
    os,
    browser,
    summary: `${device} • ${os} (${browser})`,
  };
};

/**
 * Format timestamp in IST (Indian Standard Time).
 */
const formatISTTimestamp = () => {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';
};

/**
 * Generate responsive and modern HTML email template for CodeNest activity alerts.
 */
const generateEmailTemplate = ({ eventTitle, badgeText, badgeColor, username, email, device, ip, formattedTime, extraMessage }) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'pawansa2006@gmail.com';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${eventTitle}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0b1120; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 560px; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4); border: 1px solid #334155;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%); padding: 28px 24px; text-align: center;">
                    <div style="font-size: 28px; margin-bottom: 6px;">🪺</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                      CodeNest
                    </h1>
                    <p style="margin: 4px 0 0 0; color: #c7d2fe; font-size: 13px; font-weight: 500;">
                      Security & Activity Alert
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 24px 24px 20px 24px;">
                    
                    <!-- Event Badge & Title -->
                    <div style="text-align: center; margin-bottom: 20px;">
                      <span style="display: inline-block; padding: 5px 16px; border-radius: 9999px; background-color: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px;">
                        ${badgeText}
                      </span>
                      <h2 style="margin: 12px 0 4px 0; color: #f8fafc; font-size: 19px; font-weight: 700;">
                        ${eventTitle}
                      </h2>
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                        ${extraMessage}
                      </p>
                    </div>

                    <!-- Section: User Information -->
                    <div style="margin-bottom: 16px;">
                      <div style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        👤 User Information
                      </div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155;">
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500; width: 110px; border-bottom: 1px solid #1e293b;">Username / Name</td>
                          <td style="padding: 10px 14px; color: #f8fafc; font-size: 13px; font-weight: 600; border-bottom: 1px solid #1e293b;">${username}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500;">Email Address</td>
                          <td style="padding: 10px 14px; color: #38bdf8; font-size: 13px; font-weight: 600;">
                            <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <!-- Section: Device Information -->
                    <div style="margin-bottom: 16px;">
                      <div style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        📱 Device Information
                      </div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155;">
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500; width: 110px; border-bottom: 1px solid #1e293b;">Device Type</td>
                          <td style="padding: 10px 14px; color: #f8fafc; font-size: 13px; font-weight: 600; border-bottom: 1px solid #1e293b;">${device.device}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500; border-bottom: 1px solid #1e293b;">Operating System</td>
                          <td style="padding: 10px 14px; color: #f8fafc; font-size: 13px; font-weight: 600; border-bottom: 1px solid #1e293b;">${device.os}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500;">Browser</td>
                          <td style="padding: 10px 14px; color: #f8fafc; font-size: 13px; font-weight: 600;">${device.browser}</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Section: Network & Time -->
                    <div style="margin-bottom: 8px;">
                      <div style="font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                        🌐 Network & Timestamp
                      </div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155;">
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500; width: 110px; border-bottom: 1px solid #1e293b;">IP Address</td>
                          <td style="padding: 10px 14px; color: #f8fafc; font-size: 13px; font-weight: 600; font-family: monospace; border-bottom: 1px solid #1e293b;">${ip}</td>
                        </tr>
                        <tr>
                          <td style="padding: 10px 14px; color: #94a3b8; font-size: 13px; font-weight: 500;">Date & Time</td>
                          <td style="padding: 10px 14px; color: #f8fafc; font-size: 13px; font-weight: 600;">${formattedTime}</td>
                        </tr>
                      </table>
                    </div>

                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f172a; padding: 16px 24px; text-align: center; border-top: 1px solid #334155;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">
                      This is an automated CodeNest security notification sent to <strong>${adminEmail}</strong>.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

/**
 * Generate clean plain-text fallback content.
 */
const generatePlainText = ({ eventTitle, username, email, device, ip, formattedTime }) => {
  return `========================================
           CodeNest Alert
========================================

Event: ${eventTitle}

USER INFORMATION
----------------------------------------
Username:       ${username}
Email:          ${email}

DEVICE INFORMATION
----------------------------------------
Device:         ${device.device}
OS:             ${device.os}
Browser:        ${device.browser}

NETWORK & TIME
----------------------------------------
IP Address:     ${ip}
Date & Time:    ${formattedTime}

========================================
This is an automated alert from CodeNest.
========================================`;
};

/**
 * Sends email via HTTPS Webhook (e.g. Google Apps Script / Custom Webhook).
 * Bypasses all cloud/Render outbound SMTP port restrictions (uses HTTPS Port 443).
 */
const sendViaWebhook = async ({ webhookUrl, to, subject, html, text }) => {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to,
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  console.log(`✉️ [EmailService] Notification delivered via HTTPS Webhook to ${to}`);
  return true;
};

/**
 * Sends email via Resend HTTP REST API (uses HTTPS Port 443).
 */
const sendViaResend = async ({ apiKey, to, subject, html, text }) => {
  const fromAddress = process.env.RESEND_FROM || 'CodeNest Alerts <onboarding@resend.dev>';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [to],
      subject,
      html,
      text,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `HTTP ${response.status}`);
  }

  console.log(`✉️ [EmailService] Notification delivered via Resend API to ${to}: ${data.id}`);
  return data;
};

/**
 * Sends an email notification using available transports (Webhook -> Resend -> Nodemailer SMTP).
 * Safe error handling: never throws unhandled errors or exposes sensitive credentials.
 */
const sendNotificationEmail = async ({ eventType, subject, html, text }) => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'pawansa2006@gmail.com').trim();

  // 1. Try HTTPS Webhook (Google Apps Script / Custom Webhook) -> Ideal for Render Free Tier
  const webhookUrl = process.env.EMAIL_WEBHOOK_URL ? process.env.EMAIL_WEBHOOK_URL.trim() : null;
  if (webhookUrl) {
    try {
      await sendViaWebhook({ webhookUrl, to: adminEmail, subject, html, text });
      return;
    } catch (err) {
      console.error(`[EmailService] ${eventType} Webhook dispatch failed:`, err.message);
    }
  }

  // 2. Try Resend HTTP REST API -> Ideal for cloud deployment
  const resendApiKey = process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.trim() : null;
  if (resendApiKey) {
    try {
      await sendViaResend({ apiKey: resendApiKey, to: adminEmail, subject, html, text });
      return;
    } catch (err) {
      console.error(`[EmailService] ${eventType} Resend API dispatch failed:`, err.message);
    }
  }

  // 3. Try Nodemailer SMTP (Gmail / Custom SMTP) -> Works on local machine or open SMTP servers
  const transporter = createTransporter();
  if (transporter) {
    try {
      const sender = (process.env.EMAIL_USER || adminEmail).trim();
      const mailOptions = {
        from: `"CodeNest Alerts" <${sender}>`,
        to: adminEmail,
        subject,
        text,
        html,
        priority: 'high',
        headers: {
          'X-Priority': '1 (Highest)',
          'X-MSMail-Priority': 'High',
          'Importance': 'High',
          'X-Message-Flag': 'Security Alert',
        },
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`✉️ [EmailService] ${eventType} notification delivered via SMTP to ${adminEmail}: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error(`[EmailService] ${eventType} SMTP dispatch failed (Note: Cloud free tiers like Render block SMTP ports 465/587. Configure EMAIL_WEBHOOK_URL or RESEND_API_KEY):`, error.message);
      return;
    }
  }

  // If no transport is configured
  console.warn(
    `⚠️ [EmailService] ${eventType} notification skipped: No active email transport configured.\n` +
    `👉 Please set EMAIL_WEBHOOK_URL, RESEND_API_KEY, or EMAIL_USER/EMAIL_PASS in your environment variables.`
  );
};

/**
 * Send notification when a new user registers (signs up).
 */
export const sendSignupNotification = async ({ name, email, ip, userAgent }) => {
  const device = parseDeviceInfo(userAgent);
  const formattedTime = formatISTTimestamp();
  const safeIp = ip || 'Unknown';
  const subject = `🎉 New User Signup on CodeNest: ${name} (${email})`;

  const html = generateEmailTemplate({
    eventTitle: 'New User Registered',
    badgeText: 'New Signup',
    badgeColor: '#10b981', // Emerald
    username: name,
    email,
    device,
    ip: safeIp,
    formattedTime,
    extraMessage: 'A new user has successfully registered an account on CodeNest.',
  });

  const text = generatePlainText({
    eventTitle: 'New User Signup',
    username: name,
    email,
    device,
    ip: safeIp,
    formattedTime,
  });

  return sendNotificationEmail({
    eventType: 'Signup',
    subject,
    html,
    text,
  });
};

/**
 * Send notification when a user logs in.
 */
export const sendLoginNotification = async ({ name, email, ip, userAgent }) => {
  const device = parseDeviceInfo(userAgent);
  const formattedTime = formatISTTimestamp();
  const safeIp = ip || 'Unknown';
  const subject = `🔐 User Login Alert: ${name} (${email})`;

  const html = generateEmailTemplate({
    eventTitle: 'User Logged In',
    badgeText: 'User Login',
    badgeColor: '#3b82f6', // Blue
    username: name,
    email,
    device,
    ip: safeIp,
    formattedTime,
    extraMessage: 'A user has successfully authenticated and started a new session on CodeNest.',
  });

  const text = generatePlainText({
    eventTitle: 'User Login',
    username: name,
    email,
    device,
    ip: safeIp,
    formattedTime,
  });

  return sendNotificationEmail({
    eventType: 'Login',
    subject,
    html,
    text,
  });
};
