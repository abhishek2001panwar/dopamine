export function getReceiptEmailHtml({
  userName,
  orderId,
  items,
  totalAmount,
  deliveryAddress,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dopamine-ochre.vercel.app/',
}: {
  userName: string;
  orderId: string;
  items: Array<{ title: string; price: number; image?: string }>;
  totalAmount: number;
  deliveryAddress?: string;
  appUrl?: string;
}) {
  const shortOrderId = orderId.substring(0, 8).toUpperCase();
  const trackingUrl = `${appUrl}/orders/${orderId}`;

  const itemRowsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #EAE2D5;">
          <strong style="color: #1C1712; font-size: 14px;">${item.title}</strong>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #EAE2D5; text-align: right; font-family: monospace; font-weight: bold; color: #9B7A2B;">
          $${(item.price || 0).toLocaleString()}
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
        <title>DopaCart Acquisition Receipt</title>
      </head>
      <body style="background-color: #FAF7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px; color: #1C1712;">
        <div style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 28px; border: 1px solid #EAE2D5; padding: 40px; box-shadow: 0 15px 35px rgba(28,23,18,0.04);">
          
          <!-- Header Logo -->
          <div style="text-align: center; border-bottom: 1px solid #EAE2D5; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 28px; margin: 0; font-weight: 900; letter-spacing: -0.5px; color: #1C1712;">
              Dopa<span style="color: #C8A24F; font-style: italic;">Cart</span><span style="font-size: 10px; vertical-align: top; margin-left: 2px;">®</span>
            </h1>
            <p style="font-family: monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #9B7A2B; margin-top: 6px; font-weight: bold;">
              OFFICIAL ACQUISITION DOSSIER
            </p>
          </div>

          <!-- Order Summary Badge -->
          <div style="background-color: #FAF7F2; border: 1px solid #EAE2D5; border-radius: 18px; padding: 20px; margin-bottom: 24px; text-align: center;">
            <span style="font-family: monospace; font-size: 10px; text-transform: uppercase; color: #9B7A2B; font-weight: bold; tracking-widest: 2px;">
              REF ID: #${shortOrderId}
            </span>
            <h2 style="font-size: 22px; margin: 8px 0; color: #1C1712; font-weight: 400;">
              Acquisition Confirmed
            </h2>
            <p style="font-family: monospace; font-size: 11px; color: #75695C; margin: 0; text-transform: uppercase;">
              Registered to: <strong>${userName}</strong>
            </p>
          </div>

          <!-- TRACK ORDER BUTTON -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${trackingUrl}" style="display: inline-block; background-color: #C8A24F; color: #ffffff; font-family: monospace; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; padding: 16px 36px; border-radius: 50px; text-decoration: none; box-shadow: 0 10px 20px rgba(200,162,79,0.25);">
              🚀 Track Package Live →
            </a>
          </div>

          <!-- Item Details Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="font-family: monospace; font-size: 10px; text-transform: uppercase; color: #75695C; text-align: left;">
                <th style="padding-bottom: 8px; border-bottom: 2px solid #1C1712;">Acquired Vault Item</th>
                <th style="padding-bottom: 8px; border-bottom: 2px solid #1C1712; text-align: right;">Grant Debited</th>
              </tr>
            </thead>
            <tbody>
              ${itemRowsHtml}
            </tbody>
          </table>

          <!-- Total Calculation -->
          <div style="background-color: #1C1712; color: #FAF7F2; border-radius: 20px; padding: 20px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #C8A24F; font-weight: bold;">
                Total Virtual Debited
              </span>
              <span style="font-family: monospace; font-size: 22px; font-weight: bold; color: #FAF7F2;">
                $${totalAmount.toLocaleString()}
              </span>
            </div>
            ${
              deliveryAddress
                ? `<p style="font-family: monospace; font-size: 10px; color: #75695C; margin: 8px 0 0 0; text-transform: uppercase;">
                    Destination HQ: ${deliveryAddress}
                  </p>`
                : ''
            }
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 1px solid #EAE2D5; padding-top: 20px; font-family: monospace; font-size: 9px; color: #75695C; text-transform: uppercase;">
            <p style="margin: 0;">
              100% Risk-Free Virtual Simulator • Zero Credit Cards Charged
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
}