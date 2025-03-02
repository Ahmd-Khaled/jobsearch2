import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  // Sender
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GMAILPASSWORD,
    },
  });

  //   Reciever
  const info = await transporter.sendMail({
    from: `"Social Media App" <${process.env.EMAIL}>`, // sender address
    to,
    subject,
    html, // html body
    // text: "Hello world?", // plain text body
  });

  return info.rejected.length === 0 ? true : false;
};

export default sendEmail;

export const subject = {
  register: "Register New Account",
  verifyEmail: "Activate Account",
  forgotPassword: "Reset Password",
  changePassword: "Password Changed Successfully",
  regnerateOTP: "New OTP",
  updateEmail: "Update Email",
};
