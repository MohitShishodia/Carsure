-- Supabase SQL setup for Carsure360
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Create evaluations table
CREATE TABLE IF NOT EXISTS evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evaluation_id TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  images JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_evaluations_created_at ON evaluations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_evaluations_evaluation_id ON evaluations(evaluation_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;

-- Policy to allow all operations (for anon key access)
CREATE POLICY "Allow all operations" ON evaluations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Storage bucket: Run this manually or via Dashboard > Storage
-- 1. Create bucket named 'evaluation-images'
-- 2. Make it PUBLIC
-- 3. Allow upload for anon users
