import {
  GOOGLE_API_USER,
  GOOGLE_API_CLIENT_ID,
  GOOGLE_API_CLIENT_SECRET,
  GOOGLE_API_REFRESH_TOKEN,
  GOOGLE_API_REDIRECT_URIS,
} from '../config.js';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_API_CLIENT_ID,
  GOOGLE_API_CLIENT_SECRET,
  GOOGLE_API_REDIRECT_URIS
);

oauth2Client.setCredentials({
  refresh_token: GOOGLE_API_REFRESH_TOKEN,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: GOOGLE_API_USER,
    clientId: GOOGLE_API_CLIENT_ID,
    clientSecret: GOOGLE_API_CLIENT_SECRET,
    refreshToken: GOOGLE_API_REFRESH_TOKEN,
    accessToken: oauth2Client.getAccessToken(),
  },
});

export const sendEmail = (to, subject, htmlContent) => {
  const mailOptions = {
    from: GOOGLE_API_USER,
    to: to,
    subject: subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });
};
