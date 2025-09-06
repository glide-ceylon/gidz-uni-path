-- Create feedbacks table
CREATE TABLE feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  program_type TEXT,
  university TEXT,
  allow_display_name BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_feedbacks_application_id ON feedbacks(application_id);
CREATE INDEX idx_feedbacks_status ON feedbacks(status);
CREATE INDEX idx_feedbacks_created_at ON feedbacks(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own feedbacks" ON feedbacks
  FOR SELECT USING (application_id IN (
    SELECT id FROM applications WHERE id = auth.uid()::text::uuid
  ));

CREATE POLICY "Users can insert their own feedbacks" ON feedbacks
  FOR INSERT WITH CHECK (application_id IN (
    SELECT id FROM applications WHERE id = auth.uid()::text::uuid
  ));

-- Admin policy (you'll need to adjust this based on your admin role system)
CREATE POLICY "Admins can manage all feedbacks" ON feedbacks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.uid() = auth.users.id 
      AND auth.users.email IN ('admin@gidz-uni-path.com') -- Replace with your admin emails
    )
  );