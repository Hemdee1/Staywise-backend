import nodemailer from "nodemailer";

interface mailOptions {
  from: string | undefined;
  to: string;
  subject: string;
  html: string;
}

const { AUTH_EMAIL, AUTH_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "hotmail",
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false,
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
  tls: {
    ciphers: "TLS_AES_128_GCM_SHA256",
  },
  dnsTimeout: 120000,
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Error verifying transporter:", error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

export const sendEmail = async (mailOptions: mailOptions) => {
  // eslint-disable-next-line no-useless-catch
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};
