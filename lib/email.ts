import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export function createEmailTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '1025'),
    secure: false,
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    } : undefined,
  });
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = createEmailTransporter();
  
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@todoapp.local',
    to,
    subject,
    html,
  });

  return info;
}

export function generateMagicLinkEmail(email: string, token: string, type: 'signup' | 'login') {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const verifyUrl = `${appUrl}/auth/verify?token=${token}&email=${encodeURIComponent(email)}&type=${type}`;
  
  const action = type === 'signup' ? 'サインアップ' : 'ログイン';
  
  return {
    subject: `${action}用のリンクです`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${action}用のリンク</h2>
        <p>以下のリンクをクリックして${action}を完了してください。</p>
        <p>
          <a href="${verifyUrl}" style="background-color: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            ${action}を完了する
          </a>
        </p>
        <p>このリンクは30分間有効です。</p>
        <p>もしこのメールに心当たりがない場合は、無視してください。</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          このリンクを使用できない場合は、以下のURLをコピーしてブラウザに貼り付けてください:<br>
          ${verifyUrl}
        </p>
      </div>
    `,
  };
}