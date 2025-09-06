# Troubleshooting Admin Session Issues

## Problem Analysis

Based on your test results, the admin login creates a session successfully, but subsequent API calls fail with 401 Unauthorized. This indicates an issue with session validation.

## Common Causes

### 1. **Admin User Not in Database**

The user `thushanjana@gmail.com` might not exist in the `admin_users` table.

### 2. **Missing Permissions Function**

The `get_admin_permissions` PostgreSQL function might not exist.

### 3. **Session Token Extraction Issues**

The session validation might not be extracting the token correctly from cookies/headers.

## Diagnostic Steps

### Step 1: Check if Admin User Exists

```bash
npm run debug:admin-session
```

This will check:

- ✅ Admin user exists in `admin_users` table
- ✅ User permissions are set up
- ✅ Recent sessions are valid
- ✅ Session validation query works

### Step 2: Add Admin User (if needed)

```bash
npm run add:admin-user
```

This will:

- ✅ Create admin user in `admin_users` table
- ✅ Set up default permissions for super_admin role
- ✅ Ensure proper role permissions exist

### Step 3: Test with Debug Logging

```bash
npm run test:admin-login
```

Check the console output for detailed session validation logs.

## Manual Fixes

### Fix 1: Create Admin User Manually

If the scripts don't work, you can manually insert the admin user:

```sql
-- Insert admin user
INSERT INTO admin_users (
  email,
  first_name,
  last_name,
  role,
  department,
  is_active,
  created_at
) VALUES (
  'thushanjana@gmail.com',
  'Thushan',
  'Jana',
  'super_admin',
  'IT',
  true,
  NOW()
);

-- Create permissions if they don't exist
INSERT INTO admin_permissions (permission_name, description) VALUES
  ('timeline.read', 'Read timeline events'),
  ('timeline.create', 'Create timeline events'),
  ('timeline.update', 'Update timeline events'),
  ('timeline.delete', 'Delete timeline events'),
  ('admin.read', 'Read admin data'),
  ('admin.create', 'Create admin users'),
  ('admin.update', 'Update admin users'),
  ('admin.delete', 'Delete admin users')
ON CONFLICT (permission_name) DO NOTHING;

-- Assign permissions to super_admin role
INSERT INTO admin_role_permissions (role_name, permission_name) VALUES
  ('super_admin', 'timeline.read'),
  ('super_admin', 'timeline.create'),
  ('super_admin', 'timeline.update'),
  ('super_admin', 'timeline.delete'),
  ('super_admin', 'admin.read'),
  ('super_admin', 'admin.create'),
  ('super_admin', 'admin.update'),
  ('super_admin', 'admin.delete')
ON CONFLICT (role_name, permission_name) DO NOTHING;
```

### Fix 2: Create get_admin_permissions Function

If the function doesn't exist, create it in Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION get_admin_permissions(admin_email TEXT)
RETURNS TABLE(permission_name TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT arp.permission_name
  FROM admin_users au
  JOIN admin_role_permissions arp ON au.role = arp.role_name
  WHERE au.email = admin_email
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Fix 3: Alternative Permission Check

If the function approach doesn't work, you can modify the session validation to use a direct query:

```javascript
// In lib/adminAuth.js, replace the RPC call with:
const { data: permissions, error: permError } = await supabaseAdmin
  .from("admin_role_permissions")
  .select("permission_name")
  .eq("role_name", session.admin_users.role);

const permissionsList = permissions
  ? permissions.map((p) => p.permission_name)
  : [];
```

## Expected Flow

### Successful Authentication Flow:

1. **Login** → Creates session in `admin_sessions` table
2. **Session Validation** → Finds session by token + admin user data
3. **Permission Check** → Gets permissions via function or query
4. **API Access** → Validates required permissions
5. **Session Activity** → Updates last activity timestamp

### Debug Output (Expected):

```
🔍 Session validation - Token received: Yes
🔍 Looking up session in database...
✅ Session found for admin: thushanjana@gmail.com
🔍 Getting admin permissions...
✅ Session validation successful, permissions: 8
```

## Quick Test Commands

Run these in order to diagnose and fix:

```bash
# 1. Debug current state
npm run debug:admin-session

# 2. Add admin user if missing
npm run add:admin-user

# 3. Test authentication again
npm run test:admin-login

# 4. Check enhanced auth (alternative method)
npm run test:admin-auth
```

## Common Solutions

### Solution 1: User Missing from admin_users

- Run `npm run add:admin-user` to create the user
- Verify the user exists with correct role and active status

### Solution 2: Permission Function Missing

- Create the `get_admin_permissions` function in Supabase
- Or modify the code to use direct table queries

### Solution 3: Session Token Issues

- Check if cookies are being set correctly
- Verify session token extraction in validation function
- Ensure tokens match between creation and validation

### Solution 4: Permission Validation Failing

- Ensure admin has the required permissions (timeline.read, etc.)
- Check that role_permissions are set up correctly

## Next Steps

1. **Run the diagnostic script first**: `npm run debug:admin-session`
2. **Based on the output, apply the appropriate fix**
3. **Test again with debug logging enabled**
4. **If still failing, check the database directly for session and user data**

The issue is most likely that the admin user doesn't exist in the `admin_users` table, even though Supabase Auth allows the login. The session validation requires both a valid session AND a corresponding admin user record.
