import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export interface FormSubmission {
  id?: string;
  form_id: string;
  submission_data: Record<string, any>;
  submitted_at?: string;
  user_ip?: string;
  user_agent?: string;
  referrer?: string;
}

export function getImageUrl(formId: string, imagePath: string): string {
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a local path (starts with /), return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, construct Supabase storage URL
  const { data } = supabase.storage
    .from('header_images')
    .getPublicUrl(`${formId}/${imagePath}`);
  
  return data.publicUrl;
}
