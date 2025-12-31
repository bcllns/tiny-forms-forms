"use client";

import { useState } from "react";
import { forms } from "@/forms.json";
import DynamicForm from "@/components/DynamicForm";
import ConfirmationPage from "@/components/ConfirmationPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Get the current domain from window.location
  // For development, we'll use localhost:3000
  const currentDomain =
    typeof window !== "undefined" ? window.location.host : "localhost:3000";

  // Find the form config based on domain
  const formConfig = forms.find((form) => form.domain === currentDomain) || forms[0];

  const handleFormSuccess = () => {
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <Header
            text={formConfig.header.text}
            image={formConfig.header.image}
            description={showConfirmation ? undefined : formConfig.header.description}
          />
          
          {showConfirmation ? (
            <ConfirmationPage
              message={
                formConfig.confirmation_message ||
                "Thank you for your submission!"
              }
            />
          ) : (
            <DynamicForm config={formConfig} onSuccess={handleFormSuccess} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
