const ResetPasswordMail = (name, link) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Reset Password</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        background-color: #007BFF;
        color: #ffffff;
        border-radius: 8px 8px 0 0;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        color: #333333;
        line-height: 1.5;
        text-align: center;
      }
      .content p {
        margin: 10px 0;
      }
      .button {
        display: inline-block;
        margin: 20px 0;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #007BFF;
        text-decoration: none;
        border-radius: 5px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #666666;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <table class="email-container" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td class="header">
          <h1>Reset Your Password</h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to set a new password:</p>
          <a href=${link} class="button">Reset Password</a>
          <p>If you didn’t request a password reset, please ignore this email or contact support if you have concerns.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>&copy; 2025 Your Company. All rights reserved.</p>
          <p>123 Street, City, Country</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

export default ResetPasswordMail;
