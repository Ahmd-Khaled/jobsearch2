export const jobApplicationMail = (email, username, status, jobTitle) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Job Application Response</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f4f6;
      padding: 20px;
      text-align: center;
    }
    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
      text-align: left;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }
    .header {
      background: linear-gradient(90deg, #4CAF50, #2196F3);
      padding: 20px;
      text-align: center;
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 1px;
    }
    h1 {
      color: #333;
      text-align: center;
      font-size: 28px;
      margin-bottom: 20px;
    }
    p {
      color: #555;
      line-height: 1.8;
      font-size: 16px;
      margin: 15px 0;
    }
    .status-accepted {
      color: #4CAF50;
      font-weight: bold;
      font-size: 18px;
    }
    .status-rejected {
      color: #D32F2F;
      font-weight: bold;
      font-size: 18px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #777;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      margin-top: 20px;
      background: #2196F3;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      text-align: center;
    }
    .button:hover {
      background: #1976D2;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">Job Application Response</div>
    <h1>Hello, ${username}!</h1>
    <p>We appreciate your interest in the <strong>${jobTitle}</strong> position at our company.</p>
    <p>Your application has been 
      <span class="${
        status == "accepted" ? "status-accepted" : "status-rejected"
      }}">${status}</span>.</p>
    <p>
      Thank you for your time and effort during the selection process.
      If you have any questions, feel free to contact us at <strong>${email}</strong>.
    </p>
    <p>We wish you the best of luck in your career!</p>
    <div class="footer">Best Regards,<br> HR Team</div>
    <div style="text-align: center;">
      <a href="mailto:${email}" class="button">Contact Us</a>
    </div>
  </div>
</body>
</html>

`;
};
