const templateEmail = (otp, name, subject) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    <title>Email Verification</title>
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
        .otp-container {
              margin: 20px 0;
          }
  
          .otp {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
              background: #f9f9f9;
              padding: 10px 20px;
              border-radius: 4px;
              letter-spacing: 4px;
          }
  
          .copy-btn {
              margin-left: 10px;
              padding: 10px 20px;
              font-size: 14px;
              color: white;
              background-color: #4CAF50;
              border: none;
              border-radius: 4px;
              cursor: pointer;
          }
  
          .copy-btn:hover {
              background-color: #45a049;
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
          <h1>${subject}</h1>
        </td>
      </tr>
      <tr>
        <td class="content">
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
          <h2 class="button">${otp}</h2>            
          <div class="otp-container">
            <span class="otp" id="otp-code">${otp}</span>
            <button class="copy-btn" onclick="copyOTP()">Copy</button>
          </div>
          <p>If you didn’t create this account, you can safely ignore this email.</p>
        </td>
      </tr>
      <tr>
        <td class="footer">
          <p>&copy; 2025 Your Company. All rights reserved.</p>
          <p>123 Street, City, Country</p>
        </td>
      </tr>
    </table>
    <script>
      function copyOTP() {
        const otpCode = document.getElementById('otp-code').innerText;
        navigator.clipboard.writeText(otpCode).then(() => {
            alert('OTP copied to clipboard!');
        }).catch(err => {
            alert('Failed to copy OTP. Please try again.');
            console.error('Error copying OTP:', err);
        });
      }
    </script>
  </body>
  </html>
  `;
};

export default templateEmail;
