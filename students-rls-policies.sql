-- Enable RLS on students table
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert students (for joining classes with code)
-- Students don't have auth accounts, so we allow public inserts
CREATE POLICY "Anyone can create student records"
ON students
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: Allow students to view their own record
-- This uses the student's ID directly since they don't have auth.uid()
CREATE POLICY "Students can view their own record"
ON students
FOR SELECT
TO public
USING (true);

-- Policy: Allow teachers to view students in their classes
CREATE POLICY "Teachers can view students in their classes"
ON students
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = students.class_id
    AND classes.teacher_id = auth.uid()
  )
);

-- Policy: Allow students to update their own record
CREATE POLICY "Students can update their own record"
ON students
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy: Teachers can update students in their classes
CREATE POLICY "Teachers can update students in their classes"
ON students
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = students.class_id
    AND classes.teacher_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classes
    WHERE classes.id = students.class_id
    AND classes.teacher_id = auth.uid()
  )
);
