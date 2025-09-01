-- Gidz Buddy Checklist Schema (Simplified)
-- This table stores the checklist items that appear in the SmartRecommendations component

CREATE TABLE gidz_buddy_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  youtube_link VARCHAR(500), -- YouTube video link for guidance
  is_active BOOLEAN DEFAULT true, -- Whether this item should be shown
  display_order INTEGER DEFAULT 0, -- Order in which items should be displayed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default checklist items
INSERT INTO gidz_buddy_checklist (
  title, description, youtube_link, display_order
) VALUES 
(
  'Blocked Account - Expatrio',
  'Open a blocked account to show financial proof for your visa application',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  1
),
(
  'Motivation Letter',
  'Write a compelling motivation letter for your university applications',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  2
),
(
  'Find Accommodation',
  'Secure housing for your stay in Germany before arrival',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  3
),
(
  'Tips for Learning German',
  'Start learning German to help with daily life and studies',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  4
),
(
  'Book Flight',
  'Book your flight to Germany after visa approval',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  5
),
(
  'Health Insurance',
  'Get mandatory health insurance coverage for Germany',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  6
);

-- Create indexes for better performance
CREATE INDEX idx_gidz_buddy_checklist_active ON gidz_buddy_checklist(is_active);
CREATE INDEX idx_gidz_buddy_checklist_order ON gidz_buddy_checklist(display_order);

-- Add RLS (Row Level Security) if needed
-- ALTER TABLE gidz_buddy_checklist ENABLE ROW LEVEL SECURITY;

-- Add trigger to update updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gidz_buddy_checklist_updated_at
    BEFORE UPDATE ON gidz_buddy_checklist
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
