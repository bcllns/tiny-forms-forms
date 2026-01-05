import { supabase } from "./supabase";

export interface FormField {
  id: string;
  form_id: string;
  type: "text" | "email" | "textarea" | "select" | "checkbox" | "radio";
  label: string;
  hint?: string;
  required: boolean;
  options?: string[];
  order: number;
}

export interface Form {
  id: string;
  name: string;
  domain: string;
  email_to: string;
  email_subject: string;
  header_text: string;
  header_image?: string;
  header_description?: string;
  confirmation_message?: string;
  owner?: string;
  private: boolean;
  privacy_policy?: "public" | "private_link" | "private_password";
  sharing_token?: string;
  form_password?: string;
  fields?: FormField[];
  branding?: boolean;
}

/**
 * Fetch a form by its ID from Supabase
 */
export async function getFormById(formId: string): Promise<Form | null> {
  const { data: form, error } = await supabase.from("forms").select("*").eq("id", formId).single();

  if (error || !form) {
    console.error("Error fetching form:", error);
    return null;
  }

  // Fetch the form fields
  const { data: fields, error: fieldsError } = await supabase.from("form_fields").select("*").eq("form_id", formId).order("order", { ascending: true });

  if (fieldsError) {
    console.error("Error fetching form fields:", fieldsError);
  }

  return {
    ...form,
    fields: fields || [],
  };
}

/**
 * Fetch a form by its domain from Supabase
 */
export async function getFormByDomain(domain: string): Promise<Form | null> {
  const { data: form, error } = await supabase.from("forms").select("*").eq("domain", domain).single();

  if (error || !form) {
    console.error("Error fetching form by domain:", error);
    return null;
  }

  // Fetch the form fields
  const { data: fields, error: fieldsError } = await supabase.from("form_fields").select("*").eq("form_id", form.id).order("order", { ascending: true });

  if (fieldsError) {
    console.error("Error fetching form fields:", fieldsError);
  }

  return {
    ...form,
    fields: fields || [],
  };
}

/**
 * Get the full public URL for an image stored in Supabase Storage
 * Images are stored in the header_images bucket with path: {form_id}/{filename}
 */
export function getImageUrl(formId: string, imagePath: string | null | undefined): string | null {
  if (!imagePath) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Construct the public URL for Supabase Storage
  // Format: {supabase_url}/storage/v1/object/public/header_images/{form_id}/{image_filename}
  return `${supabaseUrl}/storage/v1/object/public/header_images/${formId}/${imagePath}`;
}
