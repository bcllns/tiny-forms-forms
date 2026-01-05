# Supabase Migration Guide

This app now uses Supabase to store form configurations, fields, and submissions.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Run the Migration

1. In your Supabase dashboard, go to the SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run the SQL to create the tables and policies

### 3. Create Storage Bucket for Header Images

1. In your Supabase dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `header_images`
4. **IMPORTANT**: Toggle **Public bucket** to ON (this allows public read access)
5. Click **Create bucket**

### 4. Configure Storage Policies (Optional but Recommended)

1. In the SQL Editor, run `supabase/migrations/002_storage_policies.sql`
2. This adds RLS policies for the storage bucket
3. Allows public read access and authenticated uploads

**Note**: If you made the bucket public in step 3, the read policy is already handled. The additional policies are for upload/update/delete operations.

### 5. Upload Your Header Image

1. In the `header_images` bucket, click **Upload file**
2. Create a folder structure: click **New folder** and name it your form's UUID
3. Navigate into that folder and upload your logo/header image
4. The path structure should be: `{form_id}/{image_name}.{ext}`
5. Example: `e1a41c6e-c829-4606-bf7e-599c1fc8a4fe/combined-logo.png`

**Troubleshooting**: If you get "Upstream response failed":

- Verify the bucket is set to **Public**
- Check the file path matches `{form_id}/{filename}`
- Ensure the file was uploaded successfully
- Try accessing the URL directly in your browser

### 5. Seed Initial Data

1. In the SQL Editor, run the `supabase/seed.sql` script
2. **Important:** After the first INSERT, note the returned UUID (this is your form_id)
3. Replace `YOUR_FORM_ID_HERE` in the second part with that UUID
4. Run the form_fields INSERT statements
5. Update the `header_image` field to just the filename (e.g., `combined-logo.png`), not the full path

### 6. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. In your Supabase dashboard, go to Project Settings > API
3. Copy your Project URL and anon/public key
4. Add them to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
POSTMARK_API_KEY=your_postmark_api_key
POSTMARK_FROM_EMAIL=noreply@yourdomain.com
```

### 7. Test the Application

1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000
3. The form should load from Supabase
4. The header image should load from Supabase Storage
5. Submit the form to test the full flow

## Database Schema

### forms

- Stores form configurations
- Each form has a unique domain
- Contains header settings and email configuration
- **header_image**: Stores just the filename (e.g., `combined-logo.png`), not the full path

### form_fields

- Stores fields for each form
- Linked to forms via `form_id`
- Ordered by the `order` column

### form_submissions

- Stores all form submissions
- Includes submission data as JSON
- Captures user metadata (IP, user agent, referrer)

## Storage Structure

### header_images bucket

Images are organized by form ID:

- Path structure: `{form_id}/{image_name}.{ext}`
- Example: `550e8400-e29b-41d4-a716-446655440000/combined-logo.png`
- The bucket should be set to **public** for images to be accessible
- The `header_image` field in the forms table stores only the filename
- The app automatically constructs the full Supabase Storage URL

## Row Level Security (RLS)

The migration includes RLS policies:

- Public forms are viewable by everyone
- Private forms are only viewable by their owners
- Anyone can submit forms
- Only form owners can view submissions

## Adding New Forms

You can add new forms directly in Supabase:

1. Insert a new row in the `forms` table
2. Upload the header image to Storage at `header_images/{form_id}/{filename}`
3. Set the `header_image` field to just the filename
4. Insert corresponding rows in `form_fields`
5. Set the correct `domain` to match your hostname

## Migration from forms.json.ts

The old `forms.json.ts` file is no longer used. All form configuration is now in Supabase, allowing for:

- Dynamic form management
- Form submissions tracking
- Multi-tenant support via domains
- Private/public form settings
