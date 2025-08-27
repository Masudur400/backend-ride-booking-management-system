import { envVars } from "../../config/env";
import { ContactData } from "./contact.interface";
import nodemailer from "nodemailer";

const sendContactMailService = async (data: ContactData) => {
  const transporter = nodemailer.createTransport({
    host:  envVars.EMAIL_SENDER.SMTP_HOST,
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: envVars.EMAIL_SENDER.SMTP_SECURE === "true",
    auth: {
      user: envVars.EMAIL_SENDER.SMTP_USER,
      pass: envVars.EMAIL_SENDER.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${data.name}" <${data.email}>`,
    to: envVars.EMAIL_SENDER.SMTP_TO,
    subject: data.subject,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
    html: `<p><strong>Name:</strong> ${data.name}</p>
           <p><strong>Email:</strong> ${data.email}</p>
           
           <p>${data.message}</p>`,
  };
// <p><strong>Message:</strong></p>
  return transporter.sendMail(mailOptions);
};


export const contactServices = {
    sendContactMailService
}