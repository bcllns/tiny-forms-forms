-- Seed script to insert the example form from forms.json.ts into Supabase

-- Insert the Contact Form
INSERT INTO forms (
  name,
  domain,
  email_to,
  email_subject,
  header_text,
  header_image,
  header_description,
  confirmation_message,
  private
) VALUES (
  'Contact Form',
  'localhost:3000',
  'contact@example.com',
  'New Contact Form Submission',
  'Contact Us',
  'combined-logo.png',
  'Please fill out the form below to be contacted by one of our advisors.',
  'Thank you for contacting us! We''ll get back to you soon.',
  false
)
RETURNING id;

-- Note: Save the returned ID and use it for the form_id in the next inserts
-- Replace 'YOUR_FORM_ID_HERE' with the actual UUID returned above

-- Insert form fields
INSERT INTO form_fields (form_id, label, type, required, hint, "order") VALUES
-- Replace 'YOUR_FORM_ID_HERE' with actual form ID from above
('YOUR_FORM_ID_HERE', 'Full Name', 'text', true, 'Enter your full name', 1),
('YOUR_FORM_ID_HERE', 'Email Address', 'email', true, 'We''ll never share your email', 2),
('YOUR_FORM_ID_HERE', 'Phone Number', 'text', false, 'Optional', 3),
('YOUR_FORM_ID_HERE', 'Subject', 'select', true, 'Select a subject', 4),
('YOUR_FORM_ID_HERE', 'Message', 'textarea', true, 'Tell us how we can help', 5);

-- Update the Subject field with options
UPDATE form_fields 
SET options = ARRAY['General Inquiry', 'Support', 'Sales', 'Other']
WHERE label = 'Subject';
