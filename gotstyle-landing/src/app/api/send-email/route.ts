import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, message } = await req.json();

  const EMAIL_PASSWORD = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;
  const transporter = nodemailer.createTransport({
    host: "smtp.privateemail.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@gotstyle.app",
      pass: EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "info@gotstyle.app",
      subject: "New message to gotstyle.app",
      text: `
      Email: ${email}\n
      Message: ${message}
      `,
    });

    return NextResponse.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Email not sent" });
  }
}
