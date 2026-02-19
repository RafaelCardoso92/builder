import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Builder <noreply@builder.co.uk>';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

export async function sendQuoteResponseNotification({
  customerEmail,
  customerName,
  tradespersonName,
  businessName,
  quoteTitle,
  responseMessage,
}: {
  customerEmail: string;
  customerName: string;
  tradespersonName: string;
  businessName: string;
  quoteTitle: string;
  responseMessage: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">You've Got a Response!</h1>
      </div>

      <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
        <p style="margin-top: 0;">Hi ${customerName},</p>

        <p><strong>${businessName}</strong> has responded to your quote request:</p>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Quote Request:</p>
          <p style="margin: 0; font-weight: 600;">${quoteTitle}</p>
        </div>

        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">Response from ${tradespersonName}:</p>
          <p style="margin: 0; white-space: pre-wrap;">${responseMessage}</p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/quotes" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Full Response</a>
        </div>

        <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 14px;">
          This email was sent by Builder. If you have any questions, please contact us at support@builder.co.uk.
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `${businessName} responded to your quote request`,
    html,
  });
}
