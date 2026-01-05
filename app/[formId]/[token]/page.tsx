"use client";

import { useState, useEffect, use } from "react";
import { getFormById, Form, getImageUrl } from "@/lib/forms";
import DynamicForm from "@/components/DynamicForm";
import ConfirmationPage from "@/components/ConfirmationPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivateFormPage({ params }: { params: Promise<{ formId: string; token: string }> }) {
  const { formId, token } = use(params);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formConfig, setFormConfig] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    async function fetchForm() {
      try {
        // Validate allowed hosts
        const allowedHosts = ["localhost", "share.tinyforms.co"];
        if (!allowedHosts.includes(window.location.hostname)) {
          window.location.href = "https://tinyforms.co";
          return;
        }

        // UUID regex pattern
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        // Validate UUID format
        if (!uuidRegex.test(formId)) {
          window.location.href = "https://tinyforms.co";
          return;
        }

        // Fetch the form from Supabase
        const formData = await getFormById(formId);
        console.log("Fetched private form:", formId);

        if (!formData) {
          setError("Form not found 1");
          setLoading(false);
          return;
        }

        // Validate privacy settings and token
        if (formData.privacy_policy === "private_link") {
          if (!formData.sharing_token || formData.sharing_token !== token) {
            setError("Invalid access token");
            setLoading(false);
            return;
          }
        } else {
          // If the form is not a private_link form, redirect to regular form page
          window.location.href = `/${formId}`;
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
  }, [formId, token]);

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

      <Footer />
    </div>
  );
}
