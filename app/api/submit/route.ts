import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { formConfig, formData } = await request.json();

    // Get client information
    const userIp = request.headers.get("x-forwarded-for") || 
                   request.headers.get("x-real-ip") || 
                   "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "unknown";

    // Save submission to Supabase
    const { error: dbError } = await supabase
      .from("form_submissions")
      .insert({
        form_id: formConfig.id,
        submission_data: formData,
        user_ip: userIp,
        user_agent: userAgent,
        referrer: referrer,
      });

    if (dbError) {
      console.error("Error saving to database:", dbError);
      // Continue with email even if database save fails
    }

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
      From: process.env.POSTMARK_FROM_EMAIL || "noreply@dlmmediallc.com",
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
