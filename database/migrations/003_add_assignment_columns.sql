-- Add assignment functionality to student_visa table
-- This migration adds columns to support staff assignment for student visa applications

-- Add assigned_to column (foreign key to admin_users table)
ALTER TABLE student_visa 
ADD COLUMN IF NOT EXISTS assigned_to UUID;

-- Add assigned_at timestamp column
ALTER TABLE student_visa 
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ;

-- Add assigned_by column (tracks who made the assignment)
ALTER TABLE student_visa 
ADD COLUMN IF NOT EXISTS assigned_by UUID;

-- Add foreign key constraints
ALTER TABLE student_visa 
ADD CONSTRAINT IF NOT EXISTS fk_student_visa_assigned_to 
FOREIGN KEY (assigned_to) REFERENCES admin_users(id) ON DELETE SET NULL;

ALTER TABLE student_visa 
ADD CONSTRAINT IF NOT EXISTS fk_student_visa_assigned_by 
FOREIGN KEY (assigned_by) REFERENCES admin_users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_student_visa_assigned_to 
ON student_visa(assigned_to);

-- Add comments for documentation
COMMENT ON COLUMN student_visa.assigned_to IS 'Staff member assigned to review this application';
COMMENT ON COLUMN student_visa.assigned_at IS 'Timestamp when the assignment was made';
COMMENT ON COLUMN student_visa.assigned_by IS 'Admin user who made the assignment';

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'student_visa' 
AND column_name IN ('assigned_to', 'assigned_at', 'assigned_by')
ORDER BY column_name;
