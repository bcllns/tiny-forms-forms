-- Add privacy policy and sharing token columns to forms table
ALTER TABLE forms ADD COLUMN IF NOT EXISTS privacy_policy TEXT DEFAULT 'public' CHECK (privacy_policy IN ('public', 'private_link', 'private_password'));
ALTER TABLE forms ADD COLUMN IF NOT EXISTS sharing_token TEXT;
ALTER TABLE forms ADD COLUMN IF NOT EXISTS form_password TEXT;

-- Create index for sharing token lookups
CREATE INDEX IF NOT EXISTS idx_forms_sharing_token ON forms(sharing_token);

-- Drop the old RLS policy for forms
DROP POLICY IF EXISTS "Public forms are viewable by everyone" ON forms;

-- Create new RLS policy that handles privacy_policy
-- Allow viewing if: public, private_link (we validate token in app), or owner
CREATE POLICY "Forms are viewable based on privacy policy"
  ON forms FOR SELECT
  USING (
    privacy_policy = 'public' 
    OR privacy_policy = 'private_link' 
    OR privacy_policy = 'private_password'
    OR auth.uid() = owner
  );

-- Update form_fields policy to match new privacy logic
DROP POLICY IF EXISTS "Public form fields are viewable by everyone" ON form_fields;

CREATE POLICY "Form fields are viewable based on form privacy"
  ON form_fields FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms 
      WHERE forms.id = form_fields.form_id 
      AND (
        forms.privacy_policy = 'public' 
        OR forms.privacy_policy = 'private_link' 
        OR forms.privacy_policy = 'private_password'
        OR forms.owner = auth.uid()
      )
    )
  );
