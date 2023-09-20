import nodemailer from "nodemailer";

const sendEmail = async (html: string, userEmail: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: userEmail,
    subject: "Staywise Email Confirmation OTP",
    html,
    // attachments: [
    //   {
    //     filename: "logo.png",
    //     path: "./logo.png",
    //     cid: "logo",
    //   },
    // ],
  };

  try {
    const res = await transporter.sendMail(mailOptions);

    console.log(res.response);
  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
