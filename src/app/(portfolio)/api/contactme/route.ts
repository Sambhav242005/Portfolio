import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.email || 'sambhav242005@gmail.com',
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 400 });
    }

    return NextResponse.json(
      { ok: true, message: "Form processed successfully", data },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error processing form:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}