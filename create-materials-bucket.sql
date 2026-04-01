-- Create materials bucket in Supabase Storage
-- Execute this in Supabase SQL Editor

-- Note: Buckets must be created via Supabase UI, not SQL
-- Go to Storage > Create a new bucket
-- Name: materials
-- Public: Yes (so students can access the files)

-- After creating the bucket via UI, run these policies:

-- Policy: Allow authenticated users to upload materials
CREATE POLICY "Teachers can upload materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = 'materials'
);

-- Policy: Allow public read access to materials
CREATE POLICY "Anyone can view materials"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Policy: Allow teachers to delete their own materials
CREATE POLICY "Teachers can delete materials"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'materials');
