import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Form Monkey",
  description: "Easy to use web forms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
