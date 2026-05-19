// Email transport setup and template helpers for notification messages.
import nodemailer from 'nodemailer';

const parseBoolean = (value) => String(value).toLowerCase() === 'true';

const isEmailEnabled = () =>
  parseBoolean(process.env.EMAIL_ENABLED) &&
  !!process.env.SMTP_USER &&
  !!process.env.SMTP_PASS;

const getTransporter = () => {
  if (!isEmailEnabled()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE
      ? parseBoolean(process.env.SMTP_SECURE)
      : true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const buildOrderEmail = ({ customerName, order }) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const itemLines = items
    .map(
      (item) =>
        `- ${item.title || `Book #${item.bookId}`} x ${Number(item.quantity) || 0}: ${formatCurrency(item.lineTotal)}`,
    )
    .join('\n');

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">${item.title || `Book #${item.bookId}`}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">${Number(item.quantity) || 0}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.lineTotal)}</td>
        </tr>`,
    )
    .join('');

  return {
    subject: `ReadVibe Order Confirmation #${order.id}`,
    text: `Hello ${customerName || 'Reader'},

Thank you for your order with ReadVibe.

Order ID: ${order.id}
Status: ${order.status}
Subtotal: ${formatCurrency(order.subtotal)}
Shipping: ${formatCurrency(order.shippingCost)}
Tax: ${formatCurrency(order.tax)}
Total: ${formatCurrency(order.total)}

Items:
${itemLines || 'No items available.'}

We will notify you again when your order status changes.

ReadVibe`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 16px;">ReadVibe Order Confirmation</h2>
        <p>Hello ${customerName || 'Reader'},</p>
        <p>Thank you for your order. We have received it successfully and are preparing it now.</p>

        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 4px 0;"><strong>Order ID:</strong> ${order.id}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> ${order.status}</p>
          <p style="margin: 4px 0;"><strong>Subtotal:</strong> ${formatCurrency(order.subtotal)}</p>
          <p style="margin: 4px 0;"><strong>Shipping:</strong> ${formatCurrency(order.shippingCost)}</p>
          <p style="margin: 4px 0;"><strong>Tax:</strong> ${formatCurrency(order.tax)}</p>
          <p style="margin: 4px 0;"><strong>Total:</strong> ${formatCurrency(order.total)}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr>
              <th style="text-align: left; padding-bottom: 8px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="text-align: center; padding-bottom: 8px; border-bottom: 2px solid #ddd;">Qty</th>
              <th style="text-align: right; padding-bottom: 8px; border-bottom: 2px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows || '<tr><td colspan="3" style="padding: 12px 0;">No items available.</td></tr>'}
          </tbody>
        </table>

        <p>We will notify you again when your order status changes.</p>
        <p style="margin-top: 24px;">ReadVibe</p>
      </div>
    `,
  };
};

export const sendOrderConfirmationEmail = async ({ to, customerName, order }) => {
  if (!to || !order) {
    console.log('Email skipped: missing recipient or order payload.');
    return { sent: false, skipped: true, messageId: null };
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log('Email disabled. Order confirmation not sent.', {
      to,
      orderId: order.id,
    });
    return { sent: false, skipped: true, messageId: null };
  }

  const emailContent = buildOrderEmail({ customerName, order });
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const info = await transporter.sendMail({
    from,
    to,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  return { sent: true, messageId: info.messageId };
};

export { buildOrderEmail, formatCurrency, getTransporter, isEmailEnabled };