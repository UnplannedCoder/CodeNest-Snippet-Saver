import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from backend root if available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

// Fallback credentials to guarantee email delivery on any deployment
const DEFAULT_EMAIL_USER = 'pawansa2006@gmail.com';
const DEFAULT_ADMIN_EMAIL = 'pawansa2006@gmail.com';
const DEFAULT_EMAIL_PASS = 'srzbdvccytojopfr';

let transporterInstance = null;

/**
 * Creates and returns a Nodemailer transporter instance.
 */
const createTransporter = () => {
  const user = (process.env.EMAIL_USER || DEFAULT_EMAIL_USER).trim();
  const rawPass = (process.env.EMAIL_PASS || DEFAULT_EMAIL_PASS).trim();
  const pass = rawPass.replace(/\s+/g, '');

  if (!user || !pass) {
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
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }

  return transporterInstance;
};

/**
 * Parse user-agent string into detailed device, OS, and browser information.
 */
export const parseDeviceInfo = (ua) => {
  if (!ua || ua === 'Unknown' || ua === 'NodeTest') {
    return {
      deviceType: '💻 Desktop / Test',
      os: 'Unknown OS',
      browser: 'API Client / Test',
      summary: 'Unknown Device',
    };
  }

  let deviceType = '💻 Desktop';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';

  // 1. Detect Operating System & Device Type
  if (/iPad|Tablet/i.test(ua)) {
    deviceType = '📱 Tablet';
    os = 'iPadOS / Tablet';
  } else if (/iPhone/i.test(ua)) {
    deviceType = '📱 Mobile (iPhone)';
    os = 'iOS';
  } else if (/Android/i.test(ua)) {
    if (/Mobile/i.test(ua)) {
      deviceType = '📱 Mobile (Android)';
      os = 'Android';
    } else {
      deviceType = '📱 Tablet (Android)';
      os = 'Android Tablet';
    }
  } else if (/Windows NT 10.0/i.test(ua)) {
    deviceType = '💻 Desktop (Windows)';
    os = 'Windows 10 / 11';
  } else if (/Windows NT 6.3/i.test(ua)) {
    deviceType = '💻 Desktop (Windows)';
    os = 'Windows 8.1';
  } else if (/Windows NT 6.1/i.test(ua)) {
    deviceType = '💻 Desktop (Windows)';
    os = 'Windows 7';
  } else if (/Windows/i.test(ua)) {
    deviceType = '💻 Desktop (Windows)';
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/i.test(ua)) {
    deviceType = '💻 Desktop (Mac)';
    os = 'macOS';
  } else if (/CrOS/i.test(ua)) {
    deviceType = '💻 Chromebook';
    os = 'ChromeOS';
  } else if (/Ubuntu/i.test(ua)) {
    deviceType = '💻 Desktop (Linux)';
    os = 'Ubuntu Linux';
  } else if (/Linux/i.test(ua)) {
    deviceType = '💻 Desktop (Linux)';
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
    deviceType,
    os,
    browser,
    summary: `${deviceType} • ${os} (${browser})`,
  };
};

/**
 * Generate a responsive and stylish HTML email template for notifications.
 */
const generateEmailTemplate = ({ title, badgeText, badgeColor, details, extraInfo }) => {
  const adminEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim();
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const detailRows = details
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 16px; color: #64748b; font-size: 14px; font-weight: 600; border-bottom: 1px solid #f1f5f9; width: 140px; vertical-align: middle;">
            ${item.label}
          </td>
          <td style="padding: 12px 16px; color: #0f172a; font-size: 14px; font-weight: 600; border-bottom: 1px solid #f1f5f9; vertical-align: middle;">
            ${item.value}
          </td>
        </tr>
      `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0b1120; padding: 36px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 580px; background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5); border: 1px solid #334155;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #312e81 100%); padding: 32px 24px; text-align: center;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🪺</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                      CodeNest
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #c7d2fe; font-size: 14px; font-weight: 500;">
                      Real-time Security & Activity Alert
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 28px 24px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <span style="display: inline-block; padding: 6px 18px; border-radius: 9999px; background-color: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">
                        ${badgeText}
                      </span>
                      <h2 style="margin: 16px 0 6px 0; color: #f8fafc; font-size: 20px; font-weight: 700;">
                        ${title}
                      </h2>
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                        📅 ${timestamp} (IST)
                      </p>
                    </div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 10px; border: 1px solid #334155; margin-bottom: 22px;">
                      ${detailRows}
                    </table>

                    ${
                      extraInfo
                        ? `<div style="background-color: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366f1; padding: 12px 16px; border-radius: 6px; margin-bottom: 16px;">
                            <p style="margin: 0; color: #cbd5e1; font-size: 13px; line-height: 1.5;">${extraInfo}</p>
                           </div>`
                        : ''
                    }
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f172a; padding: 18px 24px; text-align: center; border-top: 1px solid #334155;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">
                      This is an instant automated alert sent to <strong>${adminEmail}</strong> from your CodeNest Application.
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
 * Sends an email notification. Non-blocking and catches any errors.
 */
const sendNotificationEmail = async ({ subject, html, text }) => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim();
    const transporter = createTransporter();

    if (!transporter) {
      console.warn('⚠️ [EmailService] Email credentials missing. Notification skipped.');
      return;
    }

    const mailOptions = {
      from: `"CodeNest Alerts" <${process.env.EMAIL_USER || DEFAULT_EMAIL_USER}>`,
      to: adminEmail,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [EmailService] Notification sent successfully to ${adminEmail}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ [EmailService] Failed to send email notification:', error.message);
  }
};

/**
 * Send notification when a new user registers (signs up).
 */
export const sendSignupNotification = async ({ name, email, ip, userAgent }) => {
  const device = parseDeviceInfo(userAgent);
  const subject = `🎉 New User Signup on CodeNest: ${name} (${email})`;
  const text = `New User Signup on CodeNest\n\nName: ${name}\nEmail: ${email}\nDevice: ${device.summary}\nOS: ${device.os}\nBrowser: ${device.browser}\nIP: ${ip || 'N/A'}\nTime: ${new Date().toISOString()}`;

  const html = generateEmailTemplate({
    title: 'New User Registered',
    badgeText: 'New Signup',
    badgeColor: '#10b981', // Emerald green
    details: [
      { label: '👤 Name', value: `<span style="color: #f8fafc; font-size: 15px;">${name}</span>` },
      { label: '📧 Email', value: `<a href="mailto:${email}" style="color: #818cf8; text-decoration: none;">${email}</a>` },
      { label: '📱 Device Type', value: `<span style="color: #38bdf8;">${device.deviceType}</span>` },
      { label: '💻 Operating System', value: `<span style="color: #cbd5e1;">${device.os}</span>` },
      { label: '🌐 Browser', value: `<span style="color: #cbd5e1;">${device.browser}</span>` },
      { label: '📡 IP Address', value: `<span style="color: #94a3b8; font-family: monospace;">${ip || 'Unknown'}</span>` },
    ],
    extraInfo: '🚀 A new user has created an account on CodeNest and can now create, view, and save code snippets.',
  });

  return sendNotificationEmail({ subject, html, text });
};

/**
 * Send notification when a user logs in.
 */
export const sendLoginNotification = async ({ name, email, ip, userAgent }) => {
  const device = parseDeviceInfo(userAgent);
  const subject = `🔐 User Login Alert: ${name} (${email})`;
  const text = `User Login Alert on CodeNest\n\nName: ${name}\nEmail: ${email}\nDevice: ${device.summary}\nOS: ${device.os}\nBrowser: ${device.browser}\nIP: ${ip || 'N/A'}\nTime: ${new Date().toISOString()}`;

  const html = generateEmailTemplate({
    title: 'User Logged In',
    badgeText: 'User Login',
    badgeColor: '#3b82f6', // Blue
    details: [
      { label: '👤 Name', value: `<span style="color: #f8fafc; font-size: 15px;">${name}</span>` },
      { label: '📧 Email', value: `<a href="mailto:${email}" style="color: #818cf8; text-decoration: none;">${email}</a>` },
      { label: '📱 Device Type', value: `<span style="color: #38bdf8;">${device.deviceType}</span>` },
      { label: '💻 Operating System', value: `<span style="color: #cbd5e1;">${device.os}</span>` },
      { label: '🌐 Browser', value: `<span style="color: #cbd5e1;">${device.browser}</span>` },
      { label: '📡 IP Address', value: `<span style="color: #94a3b8; font-family: monospace;">${ip || 'Unknown'}</span>` },
    ],
    extraInfo: '🔑 A registered user has authenticated successfully and initiated a new session on CodeNest.',
  });

  return sendNotificationEmail({ subject, html, text });
};
