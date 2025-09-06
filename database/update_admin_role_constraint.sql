-- ================================================
-- Update Admin Users Role Constraint
-- ================================================
-- This SQL script updates the admin_users table constraint
-- to include the new 'finance_manager' role.

-- Step 1: Drop existing role constraint
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;

-- Step 2: Add new constraint with finance_manager included
ALTER TABLE admin_users 
ADD CONSTRAINT admin_users_role_check 
CHECK (role IN ('super_admin', 'admin', 'manager', 'staff', 'finance_manager'));

-- Step 3: Verify the constraint was added
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    consrc as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'admin_users'::regclass 
AND conname = 'admin_users_role_check';

-- Step 4: Test with a sample query (this should work without errors)
SELECT DISTINCT role FROM admin_users ORDER BY role;
