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
  fields?: FormField[];
}

// This would be replaced with a database or API call in production
// For now, forms are configured manually
export const forms: Form[] = [];

export const formFields: FormField[] = [];

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Return the path as-is for now, or implement your image hosting logic
  return path;
}
