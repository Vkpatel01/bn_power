'use server'

import * as nodemailer from 'nodemailer';

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  console.log('Environment check:', {
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASS,
    user: process.env.EMAIL_USER
  });

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });

    console.log('Transporter created, attempting to send email...');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bnpowerenterprises@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, message: 'Email sent successfully' };
  } catch (error: any) {
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    return { success: false, message: `Failed to send email: ${error.message}` };
  }
}