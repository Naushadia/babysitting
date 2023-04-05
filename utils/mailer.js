const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "napoleon77@ethereal.email",
      pass: "fXU951Yv9jHU7HJSJR",
    },
  });

//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     service : 'Gmail',
    
//     auth: {
//       user: 'Your email',
//       pass: 'your password',
//     }


// const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.PASSWORD,
//     },
//   });
  
//   // A map to store email-otp pairs
//   const emailOtpMap = new Map();
  
//   // A route to generate and send OTP
//   app.post("/generate-otp", async (req, res) => {
//     try {
//       // Getting the email from request body
//       const email = req.body.email;
  
//       // Generating a 4-digit random OTP
//       const otp = Math.floor(1000 + Math.random() * 9000);
  
//       // Storing the OTP with the email
//       emailOtpMap.set(email, otp);
  
//       // Sending the OTP to the email
//       await transporter.sendMail({
//         from: process.env.EMAIL,
//         to: email,
//         subject: "Your OTP for verification",
//         text: `Your OTP for verification is ${otp}`,
//       });
  
//       // Sending success response
//       res.json({ success: true });
//     } catch (error) {
//       // Sending error response
//       res.status(500).json({ success: false, error });
//     }
//   });
  
//   // A route to verify OTP
//   app.post("/verify-otp", (req, res) => {
//     try {
//       // Getting the email and otp from request body
//       const { email, otp } = req.body;
  
//       // Getting the stored OTP for the email
//       const storedOtp = emailOtpMap.get(email);
  
//       // Verifying the OTP
//       if (storedOtp === otp) 

module.exports = transporter;