import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";

export async function POST(request: NextRequest) {
  try {
    const { formConfig, formData } = await request.json();

    // Initialize Postmark client
    const client = new postmark.ServerClient(
      process.env.POSTMARK_API_KEY || ""
    );

    // Build email body
    let emailBody = `New form submission from ${formConfig.name}\n\n`;
    emailBody += `Form: ${formConfig.name}\n`;
    emailBody += `Domain: ${formConfig.domain}\n\n`;
    emailBody += `Submission Details:\n`;
    emailBody += `${"=".repeat(50)}\n\n`;

    Object.entries(formData).forEach(([key, value]) => {
      emailBody += `${key}:\n${value}\n\n`;
    });

    // Send email using Postmark
    await client.sendEmail({
      From: process.env.POSTMARK_FROM_EMAIL || "noreply@formmonkey.com",
      To: formConfig.email_to,
      Subject: formConfig.email_subject,
      TextBody: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}
