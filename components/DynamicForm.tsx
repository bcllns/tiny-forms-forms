"use client";

import React, { useState } from "react";
import { FormConfig, FormField } from "@/forms.json";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface DynamicFormProps {
  config: FormConfig;
  onSuccess: () => void;
}

export default function DynamicForm({ config, onSuccess }: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (fieldLabel: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldLabel]: value }));
    if (errors[fieldLabel]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldLabel];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    config.fields.forEach((field) => {
      if (field.required && !formData[field.label]?.trim()) {
        newErrors[field.label] = `${field.label} is required`;
      }

      if (field.type === "email" && formData[field.label]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.label])) {
          newErrors[field.label] = "Please enter a valid email address";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formConfig: config,
          formData,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = field.label.toLowerCase().replace(/\s+/g, "-");

    switch (field.type) {
      case "text":
      case "email":
        return (
          <div key={field.label} className="mb-4">
            <Label htmlFor={fieldId} className="block mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id={fieldId}
              type={field.type}
              value={formData[field.label] || ""}
              onChange={(e) => handleChange(field.label, e.target.value)}
              placeholder={field.hint}
              className={errors[field.label] ? "border-red-500" : ""}
            />
            {errors[field.label] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div key={field.label} className="mb-4">
            <Label htmlFor={fieldId} className="block mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id={fieldId}
              value={formData[field.label] || ""}
              onChange={(e) => handleChange(field.label, e.target.value)}
              placeholder={field.hint}
              rows={4}
              className={errors[field.label] ? "border-red-500" : ""}
            />
            {errors[field.label] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div key={field.label} className="mb-4">
            <Label htmlFor={fieldId} className="block mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <Select
              id={fieldId}
              value={formData[field.label] || ""}
              onChange={(e) => handleChange(field.label, e.target.value)}
              className={errors[field.label] ? "border-red-500" : ""}
            >
              <option value="">{field.hint || "Select an option"}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {errors[field.label] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div key={field.label} className="mb-4">
            <Label className="block mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${fieldId}-${option}`}
                    value={option}
                    checked={(formData[field.label] || "")
                      .split(",")
                      .includes(option)}
                    onChange={(e) => {
                      const currentValues = formData[field.label]
                        ? formData[field.label].split(",").filter((v) => v)
                        : [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      handleChange(field.label, newValues.join(","));
                    }}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label
                    htmlFor={`${fieldId}-${option}`}
                    className="ml-2 text-sm"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errors[field.label] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div key={field.label} className="mb-4">
            <Label className="block mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={`${fieldId}-${option}`}
                    name={fieldId}
                    value={option}
                    checked={formData[field.label] === option}
                    onChange={(e) => handleChange(field.label, e.target.value)}
                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <label
                    htmlFor={`${fieldId}-${option}`}
                    className="ml-2 text-sm"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {errors[field.label] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.label]}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {config.fields.map(renderField)}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6"
        size="lg"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
