import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { formConfig, formData } = await request.json();

    // Get client information
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "unknown";

    // Note: Database storage removed - forms are configured manually
    // To re-enable, add your database logic here

    // Build email body
    let emailBody = `New form submission from ${formConfig.name}\n\n`;
    emailBody += `Form: ${formConfig.name}\n`;
    emailBody += `Domain: ${formConfig.domain}\n\n`;
    emailBody += `Submission Details:\n`;
    emailBody += `${"=".repeat(50)}\n\n`;

    Object.entries(formData).forEach(([key, value]) => {
      emailBody += `${key}:\n${value}\n\n`;
    });

    // Send email using Resend
    await resend.emails.send({
      from: "TinyForms <noreply@tinydev.co>",
      to: formConfig.email_to,
      subject: formConfig.email_subject,
      text: emailBody,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}
