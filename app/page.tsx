"use client";

import { useState, useEffect } from "react";
import { getFormByDomain, Form, getImageUrl } from "@/lib/forms";
import DynamicForm from "@/components/DynamicForm";
import ConfirmationPage from "@/components/ConfirmationPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formConfig, setFormConfig] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    async function fetchForm() {
      try {
        // Get the current domain
        const currentDomain = window.location.host;

        // Fetch form by domain from Supabase
        const formData = await getFormByDomain(currentDomain);

        console.log("Fetched form for domain:", currentDomain);
        console.log("Form data:", formData);

        // If domain not found, redirect to tinyforms.co
        if (!formData) {
          //window.location.href = "https://tinyforms.co";
          return;
        }

        // Get the image URL
        if (formData.header_image) {
          const url = getImageUrl(formData.id, formData.header_image);
          if (url) setImageUrl(url);
        }

        setFormConfig(formData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError("Failed to load form");
        setLoading(false);
      }
    }

    fetchForm();
  }, []);

  const handleFormSuccess = () => {
    setShowConfirmation(true);
  };

  const handleReset = () => {
    setShowConfirmation(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-gray-600">Loading form...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !formConfig) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="text-center py-12">
              <p className="text-red-600">{error || "Form not found"}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <Header text={formConfig.header_text} image={imageUrl} description={showConfirmation ? undefined : formConfig.header_description} />

          {showConfirmation ? <ConfirmationPage message={formConfig.confirmation_message || "Thank you for your submission!"} onReset={handleReset} /> : <DynamicForm config={formConfig} onSuccess={handleFormSuccess} />}
        </div>
      </main>

      <Footer branding={formConfig.branding ? formConfig.branding : false} />
    </div>
  );
}
