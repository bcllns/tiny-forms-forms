"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithOTP } from "@/lib/supabase-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await signInWithOTP(email);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Store email in sessionStorage and redirect to OTP page
      sessionStorage.setItem("otp_email", email);
      router.push("/admin/otp");
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <a
                  href="#"
                  className="flex flex-col items-center gap-2 font-medium"
                >
                  <div className="flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-6" />
                  </div>
                  <span className="sr-only">Acme Inc.</span>
                </a>
                <h1 className="text-xl font-bold">Welcome to Tiny Forms</h1>
                <p className="text-sm text-muted-foreground">
                  Don&apos;t have an account? <a href="/">Sign up</a>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Login"}
                </Button>
              </div>
              
            </div>
          </form>
          <p className="px-6 text-center text-xs text-muted-foreground">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </p>
        </div>

    </div>
    </div>
  );
}
