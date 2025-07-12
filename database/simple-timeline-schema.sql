-- Simple Timeline Events Schema
-- Copy and paste this into Supabase SQL Editor

-- 1. Timeline Events Table
CREATE TABLE timeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  event_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'upcoming',
  category VARCHAR(50),
  icon VARCHAR(50),
  color VARCHAR(20),
  is_milestone BOOLEAN DEFAULT false,
  created_by VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- 2. Timeline Event Requests Table
CREATE TABLE timeline_event_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  requested_by UUID REFERENCES applications(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  requested_date TIMESTAMP,
  category VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending',
  admin_response TEXT,
  priority VARCHAR(10) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Timeline Event Notes Table
CREATE TABLE timeline_event_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES timeline_events(id),
  application_id UUID REFERENCES applications(id),
  note_text TEXT NOT NULL,
  is_private BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Basic Indexes
CREATE INDEX idx_timeline_events_app_id ON timeline_events(application_id);
CREATE INDEX idx_timeline_requests_app_id ON timeline_event_requests(application_id);
CREATE INDEX idx_timeline_notes_event_id ON timeline_event_notes(event_id);
