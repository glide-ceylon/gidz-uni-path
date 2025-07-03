-- Admin Management System Migration
-- This creates tables for managing admin users and their permissions

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'manager', 'staff')),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  permissions JSONB DEFAULT '{}'::jsonb,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_sessions table for tracking admin logins
CREATE TABLE admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address INET,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_permissions table for granular permissions
CREATE TABLE admin_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  permission_name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_role_permissions junction table
CREATE TABLE admin_role_permissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  permission_id UUID REFERENCES admin_permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(role, permission_id)
);

-- Add RLS policies for admin tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_role_permissions ENABLE ROW LEVEL SECURITY;

-- Service role can manage all admin data
CREATE POLICY "Service role can manage admin users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage admin sessions" ON admin_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage admin permissions" ON admin_permissions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage admin role permissions" ON admin_role_permissions
  FOR ALL USING (auth.role() = 'service_role');

-- Admins can view their own data (if they have a Supabase auth account)
CREATE POLICY "Admins can view their own data" ON admin_users
  FOR SELECT USING (
    email = auth.email() AND is_active = true
  );

-- Create indexes for performance
CREATE INDEX idx_admin_users_email ON admin_users(email);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);
CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires_at ON admin_sessions(expires_at);
CREATE INDEX idx_admin_role_permissions_role ON admin_role_permissions(role);

-- Insert default permissions
INSERT INTO admin_permissions (permission_name, description, category) VALUES
-- Timeline Events Permissions
('timeline_events.read', 'View timeline events', 'timeline'),
('timeline_events.create', 'Create timeline events', 'timeline'),
('timeline_events.update', 'Update timeline events', 'timeline'),
('timeline_events.delete', 'Delete timeline events', 'timeline'),
('timeline_events.manage_all', 'Manage all timeline events', 'timeline'),

-- Timeline Requests Permissions
('timeline_requests.read', 'View timeline requests', 'timeline'),
('timeline_requests.approve', 'Approve timeline requests', 'timeline'),
('timeline_requests.reject', 'Reject timeline requests', 'timeline'),
('timeline_requests.manage_all', 'Manage all timeline requests', 'timeline'),

-- User Management Permissions
('users.read', 'View user profiles', 'users'),
('users.update', 'Update user profiles', 'users'),
('users.delete', 'Delete user accounts', 'users'),
('users.manage_all', 'Full user management', 'users'),

-- Application Management Permissions
('applications.read', 'View applications', 'applications'),
('applications.update', 'Update applications', 'applications'),
('applications.delete', 'Delete applications', 'applications'),
('applications.manage_all', 'Full application management', 'applications'),

-- Admin Management Permissions
('admins.read', 'View admin users', 'admin'),
('admins.create', 'Create admin users', 'admin'),
('admins.update', 'Update admin users', 'admin'),
('admins.delete', 'Delete admin users', 'admin'),
('admins.manage_permissions', 'Manage admin permissions', 'admin'),

-- System Permissions
('system.analytics', 'View system analytics', 'system'),
('system.logs', 'View system logs', 'system'),
('system.settings', 'Manage system settings', 'system'),
('system.backup', 'Perform system backups', 'system');

-- Assign permissions to roles
INSERT INTO admin_role_permissions (role, permission_id) 
SELECT 'super_admin', id FROM admin_permissions;

-- Admin role gets most permissions except super admin functions
INSERT INTO admin_role_permissions (role, permission_id) 
SELECT 'admin', id FROM admin_permissions 
WHERE permission_name NOT IN ('admins.delete', 'admins.manage_permissions', 'system.backup');

-- Manager role gets read and update permissions
INSERT INTO admin_role_permissions (role, permission_id) 
SELECT 'manager', id FROM admin_permissions 
WHERE permission_name LIKE '%.read' OR permission_name LIKE '%.update' 
   OR permission_name IN ('timeline_requests.approve', 'timeline_requests.reject');

-- Staff role gets basic read permissions
INSERT INTO admin_role_permissions (role, permission_id) 
SELECT 'staff', id FROM admin_permissions 
WHERE permission_name LIKE '%.read';

-- Insert sample admin users (update these with real admin emails)
INSERT INTO admin_users (email, first_name, last_name, role, department, permissions) VALUES
('admin@gidz-uni-path.com', 'System', 'Administrator', 'super_admin', 'IT', 
 '{"can_manage_admins": true, "can_access_all_data": true}'),
('manager@gidz-uni-path.com', 'Application', 'Manager', 'admin', 'Operations',
 '{"can_approve_requests": true, "can_manage_timelines": true}'),
('staff@gidz-uni-path.com', 'Support', 'Staff', 'staff', 'Support',
 '{"can_view_applications": true, "can_respond_to_requests": true}');

-- Create function to check admin permissions
CREATE OR REPLACE FUNCTION check_admin_permission(admin_email TEXT, permission_name TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  has_permission BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 
    FROM admin_users au
    JOIN admin_role_permissions arp ON arp.role = au.role
    JOIN admin_permissions ap ON ap.id = arp.permission_id
    WHERE au.email = admin_email 
      AND au.is_active = true
      AND ap.permission_name = permission_name
  ) INTO has_permission;
  
  RETURN has_permission;
END;
$$ LANGUAGE plpgsql;

-- Create function to get admin permissions
CREATE OR REPLACE FUNCTION get_admin_permissions(admin_email TEXT)
RETURNS TABLE(permission_name TEXT, description TEXT, category TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ap.permission_name, ap.description, ap.category
  FROM admin_users au
  JOIN admin_role_permissions arp ON arp.role = au.role
  JOIN admin_permissions ap ON ap.id = arp.permission_id
  WHERE au.email = admin_email 
    AND au.is_active = true
  ORDER BY ap.category, ap.permission_name;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at 
  BEFORE UPDATE ON admin_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE admin_users IS 'Stores admin user accounts and their roles';
COMMENT ON TABLE admin_sessions IS 'Tracks admin login sessions for security';
COMMENT ON TABLE admin_permissions IS 'Defines available permissions in the system';
COMMENT ON TABLE admin_role_permissions IS 'Maps permissions to admin roles';
COMMENT ON FUNCTION check_admin_permission IS 'Checks if an admin has a specific permission';
COMMENT ON FUNCTION get_admin_permissions IS 'Returns all permissions for an admin user';
