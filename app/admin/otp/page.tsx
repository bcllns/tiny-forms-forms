"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyOTP } from "@/lib/supabase-auth";
import { OTPForm } from "@/components/OTPForm";

export default function OTPPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeSentAt, setCodeSentAt] = useState<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(60);
  const router = useRouter();

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem("otp_email");
    if (!storedEmail) {
      router.push("/admin/login");
    } else {
      setEmail(storedEmail);
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - codeSentAt) / 1000);
      const remaining = Math.max(0, 60 - elapsed);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [codeSentAt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 8) {
      setError("Please enter a valid 8-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    console.log('Verifying OTP:', { email: email.substring(0, 3) + '***', otpLength: otp.length, timeElapsed: Math.floor((Date.now() - codeSentAt) / 1000) });
    
    const { data, error } = await verifyOTP(email, otp);

    if (error) {
      console.error('OTP verification error:', error);
      // Check if it's an expiration error
      if (error.message.toLowerCase().includes('expired') || 
          error.message.toLowerCase().includes('invalid')) {
        const elapsed = Math.floor((Date.now() - codeSentAt) / 1000);
        if (elapsed > 60) {
          setError("Code has expired. OTP codes are valid for 60 seconds. Please request a new code.");
        } else {
          setError(`Invalid code (${elapsed}s elapsed). Please check and try again. Error: ${error.message}`);
        }
      } else {
        setError(`Error: ${error.message}`);
      }
      setLoading(false);
    } else if (data.session) {
      console.log('OTP verified successfully');
      // Clear stored email
      sessionStorage.removeItem("otp_email");
      // Redirect to dashboard
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      console.warn('No session returned from OTP verification');
      setError("Verification failed. Please request a new code.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    // Import signInWithOTP here to avoid circular dependency
    const { signInWithOTP } = await import("@/lib/supabase-auth");
    const { error } = await signInWithOTP(email);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setOtp(""); // Clear the current OTP input
      setCodeSentAt(Date.now()); // Reset the timestamp
      setTimeRemaining(60); // Reset the timer
      setError(null);
      setLoading(false);
      alert("A new code has been sent to your email");
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xs">
        <OTPForm />
      </div>
    </div>
  );
}
