-- Storage bucket policies for header_images

-- First, ensure the bucket exists and is public
-- This should be done via the Supabase Dashboard UI:
-- Storage > Create bucket > Name: "header_images" > Public bucket: YES

-- Allow public access to read files in the header_images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'header_images' );

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'header_images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'header_images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'header_images'
  AND auth.role() = 'authenticated'
);
