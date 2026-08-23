import nodemailer from 'nodemailer';

let transporterInstance = null;

/**
 * Creates and returns a Nodemailer transporter instance.
 */
const createTransporter = () => {
  const user = (process.env.EMAIL_USER || 'pawansa2006@gmail.com').trim();
  const rawPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : null;
  const pass = rawPass ? rawPass.replace(/\s+/g, '') : null;

  if (!user || !pass || pass === 'your_gmail_app_password_here') {
    return null;
  }

  if (!transporterInstance) {
    transporterInstance = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });
  }

  return transporterInstance;
};


/**
 * Parse user-agent string into a clean readable browser & OS format.
 */
const formatUserAgent = (ua) => {
  if (!ua || ua === 'Unknown' || ua === 'NodeTest') return ua || 'Unknown';
  
  let browser = 'Unknown Browser';
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';

  let os = 'Unknown OS';
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
  else if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
};
const generateEmailTemplate = ({ title, badgeText, badgeColor, details, extraInfo }) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'pawansa2006@gmail.com';
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const detailRows = details
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 14px; color: #64748b; font-size: 14px; font-weight: 500; border-bottom: 1px solid #f1f5f9; width: 120px;">
            ${item.label}
          </td>
          <td style="padding: 10px 14px; color: #1e293b; font-size: 14px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">
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
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 24px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">
                      CodeNest 🪺
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px;">
                      Activity Notification
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 28px 24px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                      <span style="display: inline-block; padding: 6px 16px; border-radius: 9999px; background-color: ${badgeColor}; color: #ffffff; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${badgeText}
                      </span>
                      <h2 style="margin: 14px 0 6px 0; color: #0f172a; font-size: 18px; font-weight: 700;">
                        ${title}
                      </h2>
                      <p style="margin: 0; color: #64748b; font-size: 13px;">
                        ${timestamp} (IST)
                      </p>
                    </div>

                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                      ${detailRows}
                    </table>

                    ${
                      extraInfo
                        ? `<p style="margin: 0 0 16px 0; color: #64748b; font-size: 12px; text-align: center; line-height: 1.5;">${extraInfo}</p>`
                        : ''
                    }
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                      This is an automated alert sent to <strong>${adminEmail}</strong> by your CodeNest application.
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
    const adminEmail = process.env.ADMIN_EMAIL || 'pawansa2006@gmail.com';
    const transporter = createTransporter();

    if (!transporter) {
      console.warn(
        '⚠️ [EmailService] EMAIL_USER or EMAIL_PASS is not configured. Email notification skipped.\n' +
        '👉 Please set valid Gmail SMTP credentials in backend/.env to receive email alerts.'
      );
      return;
    }

    const mailOptions = {
      from: `"CodeNest Alerts" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ [EmailService] Notification sent successfully to ${adminEmail}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ [EmailService] Failed to send email notification:', error.message);
  }
};

/**
 * Send notification when a new user registers (signs up).
 */
export const sendSignupNotification = async ({ name, email, ip, userAgent }) => {
  const formattedDevice = formatUserAgent(userAgent);
  const subject = `🎉 New User Signup on CodeNest: ${name} (${email})`;
  const text = `New User Signup on CodeNest\n\nName: ${name}\nEmail: ${email}\nIP: ${ip || 'N/A'}\nDevice: ${formattedDevice}\nTime: ${new Date().toISOString()}`;

  const html = generateEmailTemplate({
    title: 'New User Registered',
    badgeText: 'New Signup',
    badgeColor: '#10b981', // Emerald green
    details: [
      { label: 'Name', value: name },
      { label: 'Email', value: `<a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>` },
      { label: 'IP Address', value: ip || 'Unknown' },
      { label: 'Device / Browser', value: formattedDevice },
    ],
    extraInfo: 'A new user has created an account and can now create & share code snippets.',
  });

  return sendNotificationEmail({ subject, html, text });
};

/**
 * Send notification when a user logs in.
 */
export const sendLoginNotification = async ({ name, email, ip, userAgent }) => {
  const formattedDevice = formatUserAgent(userAgent);
  const subject = `🔐 User Login Alert: ${name} (${email})`;
  const text = `User Login Alert on CodeNest\n\nName: ${name}\nEmail: ${email}\nIP: ${ip || 'N/A'}\nDevice: ${formattedDevice}\nTime: ${new Date().toISOString()}`;

  const html = generateEmailTemplate({
    title: 'User Logged In',
    badgeText: 'User Login',
    badgeColor: '#3b82f6', // Blue
    details: [
      { label: 'Name', value: name },
      { label: 'Email', value: `<a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>` },
      { label: 'IP Address', value: ip || 'Unknown' },
      { label: 'Device / Browser', value: formattedDevice },
    ],
    extraInfo: 'A user has successfully authenticated and started a new session.',
  });

  return sendNotificationEmail({ subject, html, text });
};
