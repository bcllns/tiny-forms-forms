import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ConfirmationPageProps {
  message: string;
}

export default function ConfirmationPage({ message }: ConfirmationPageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">{message}</p>
      <Link href="/">
        <Button>Submit Another Form</Button>
      </Link>
    </div>
  );
}
