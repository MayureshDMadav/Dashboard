import { NextRequest, NextResponse } from 'next/server';
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64data = Buffer.from(arrayBuffer).toString('base64');

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["idol17.mayureshmadav@gmail.com"],
      subject: "Daily PDF Report",
      html: "<p>Please find your PDF report attached.</p>",
      attachments: [
        {
          filename: "report.pdf",
          content: base64data,
        },
      ],
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (e) {
    console.error("Exception occurred:", e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}