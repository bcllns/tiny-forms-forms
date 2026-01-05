import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { formConfig, formData, recaptchaToken } = await request.json();

    // Verify reCAPTCHA token
    if (!recaptchaToken) {
      return NextResponse.json({ error: "reCAPTCHA token missing" }, { status: 400 });
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (recaptchaSecret && recaptchaSecret !== "your_recaptcha_secret_key_here") {
      try {
        const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
        });

        const recaptchaData = await recaptchaResponse.json();

        console.log("reCAPTCHA verification result:", recaptchaData);

        if (!recaptchaData.success) {
          console.error("reCAPTCHA verification failed:", recaptchaData);
          return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
        }

        // For v3, check score (0.0 to 1.0, higher is better)
        if (recaptchaData.score !== undefined && recaptchaData.score < 0.5) {
          console.warn("reCAPTCHA score too low:", recaptchaData.score);
          return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
        }
      } catch (error) {
        console.error("reCAPTCHA verification error:", error);
        // Continue with submission if reCAPTCHA service is down
      }
    } else {
      console.warn("reCAPTCHA secret key not configured - skipping verification");
    }

    // Get client information
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "unknown";

    // Store submission in Supabase
    const { error: dbError } = await supabase.from("form_submissions").insert({
      form_id: formConfig.id,
      submission_data: formData,
      user_ip: userIp,
      user_agent: userAgent,
      referrer: referrer,
    });

    if (dbError) {
      console.error("Error storing form submission:", dbError);
      // Continue with email even if database storage fails
    }

    // Build email body
    let emailBody = `New form submission from ${formConfig.name}\n\n`;
    emailBody += `Form: ${formConfig.name}\n`;
    emailBody += `Domain: ${formConfig.domain}\n\n`;
    emailBody += `Submission Details:\n`;
    emailBody += `${"=".repeat(50)}\n\n`;

    Object.entries(formData).forEach(([key, value]) => {
      emailBody += `${key}:\n${value}\n\n`;
    });

    // Use the Postmark or Resend clien to send email depending on the configuration
    if (!formConfig.email_service && formConfig.email_service === "postmark") {
      //use resend by default
    } else {
      // Send email using Resend
      await resend.emails.send({
        from: "Tiny Forms <noreply@tinydev.co>",
        to: formConfig.email_to,
        subject: formConfig.email_subject,
        text: emailBody,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 });
  }
}
