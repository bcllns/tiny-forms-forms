import type { Metadata } from "next";
import "./globals.css";
import { ReCaptchaProvider } from "@/lib/recaptcha";

export const metadata: Metadata = {
  title: "Tiny Forms",
  description: "Simple, customizable forms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReCaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}>{children}</ReCaptchaProvider>
      </body>
    </html>
  );
}
