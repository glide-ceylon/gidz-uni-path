-- Timeline Events Enhancement - Database Migration
-- Execute this in Supabase SQL Editor

-- 1. Create timeline_events table
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('system', 'admin_custom', 'user_request')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('completed', 'in_progress', 'upcoming', 'cancelled')),
  category VARCHAR(50) CHECK (category IN ('academic', 'visa', 'personal', 'university', 'documentation')),
  icon VARCHAR(50),
  color VARCHAR(20),
  is_milestone BOOLEAN DEFAULT false,
  created_by VARCHAR(20) CHECK (created_by IN ('system', 'admin', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2. Create timeline_event_requests table
CREATE TABLE timeline_event_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  requested_by UUID REFERENCES applications(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requested_date TIMESTAMP,
  category VARCHAR(50) CHECK (category IN ('academic', 'visa', 'personal', 'university', 'documentation')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_response TEXT,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Create timeline_event_notes table
CREATE TABLE timeline_event_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES timeline_events(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX idx_timeline_events_application_id ON timeline_events(application_id);
CREATE INDEX idx_timeline_events_status ON timeline_events(status);
CREATE INDEX idx_timeline_events_event_date ON timeline_events(event_date);
CREATE INDEX idx_timeline_events_category ON timeline_events(category);

CREATE INDEX idx_timeline_event_requests_application_id ON timeline_event_requests(application_id);
CREATE INDEX idx_timeline_event_requests_status ON timeline_event_requests(status);
CREATE INDEX idx_timeline_event_requests_requested_by ON timeline_event_requests(requested_by);

CREATE INDEX idx_timeline_event_notes_event_id ON timeline_event_notes(event_id);
CREATE INDEX idx_timeline_event_notes_application_id ON timeline_event_notes(application_id);

-- 5. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_timeline_events_updated_at 
  BEFORE UPDATE ON timeline_events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_timeline_event_requests_updated_at 
  BEFORE UPDATE ON timeline_event_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_event_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_event_notes ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies

-- Timeline Events Policies
CREATE POLICY "Users can view their own timeline events" ON timeline_events
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Service role can manage all timeline events" ON timeline_events
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- Timeline Event Requests Policies  
CREATE POLICY "Users can view their own event requests" ON timeline_event_requests
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Users can insert their own event requests" ON timeline_event_requests
  FOR INSERT WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Users can update their own pending requests" ON timeline_event_requests
  FOR UPDATE USING (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    ) AND status = 'pending'
  );

CREATE POLICY "Service role can manage all event requests" ON timeline_event_requests
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- Timeline Event Notes Policies
CREATE POLICY "Users can view their own event notes" ON timeline_event_notes
  FOR SELECT USING (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Users can insert notes on their own events" ON timeline_event_notes
  FOR INSERT WITH CHECK (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Users can update their own notes" ON timeline_event_notes
  FOR UPDATE USING (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Users can delete their own notes" ON timeline_event_notes
  FOR DELETE USING (
    application_id IN (
      SELECT id FROM applications WHERE email = auth.email()
    )
  );

CREATE POLICY "Service role can manage all event notes" ON timeline_event_notes
  FOR ALL USING (
    auth.role() = 'service_role'
  );

-- 8. Create sample system events for existing applications
INSERT INTO timeline_events (application_id, event_type, title, description, event_date, status, category, icon, color, is_milestone, created_by, metadata)
SELECT 
  id as application_id,
  'system' as event_type,
  'Account Registration' as title,
  'Successfully registered with GIDZ Uni Path' as description,
  created_at as event_date,
  'completed' as status,
  'personal' as category,
  'FaUserPlus' as icon,
  'green' as color,
  true as is_milestone,
  'system' as created_by,
  '{"auto_generated": true, "milestone_order": 1}'::jsonb as metadata
FROM applications
WHERE created_at IS NOT NULL;

-- Add document collection events for applications that have documents
INSERT INTO timeline_events (application_id, event_type, title, description, event_date, status, category, icon, color, is_milestone, created_by, metadata)
SELECT DISTINCT
  d.application_id,
  'system' as event_type,
  'Document Collection Started' as title,
  'Began uploading required documents' as description,
  MIN(d.created_at) as event_date,
  'completed' as status,
  'documentation' as category,
  'FaFileAlt' as icon,
  'blue' as color,
  true as is_milestone,
  'system' as created_by,
  '{"auto_generated": true, "milestone_order": 2}'::jsonb as metadata
FROM documents d
WHERE d.created_at IS NOT NULL
GROUP BY d.application_id;

COMMENT ON TABLE timeline_events IS 'Stores all timeline events for applications including system, admin, and user-requested events';
COMMENT ON TABLE timeline_event_requests IS 'Stores user requests for custom timeline events pending admin approval';
COMMENT ON TABLE timeline_event_notes IS 'Stores user notes associated with timeline events';
