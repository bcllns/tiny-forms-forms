"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-auth";

export default function VerifyPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("success");
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Verifying your email...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <p className="text-lg">Successfully verified! Redirecting...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-red-600 text-4xl mb-4">✗</div>
            <p className="text-lg">Verification failed. Please try again.</p>
          </>
        )}
      </div>
    </div>
  );
}
