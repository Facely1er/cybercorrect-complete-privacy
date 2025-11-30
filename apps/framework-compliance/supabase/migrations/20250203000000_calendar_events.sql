/*
  # Calendar Events Database Schema
  
  This migration creates the calendar_events table for compliance activity scheduling:
  - Supports multiple event types (assessment, audit, review, etc.)
  - Tracks attendees, notifications, and related items
  - Includes recurrence patterns for recurring events
  - Full RLS policies for user-based access control
*/

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  type text NOT NULL CHECK (type IN (
    'assessment',
    'control-review',
    'evidence-collection',
    'policy-review',
    'training',
    'audit',
    'risk-assessment',
    'incident-review',
    'milestone',
    'deadline'
  )),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  all_day boolean NOT NULL DEFAULT false,
  recurrence jsonb,
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN (
    'scheduled',
    'in-progress',
    'completed',
    'cancelled',
    'overdue'
  )),
  attendees jsonb DEFAULT '[]',
  location text,
  related_items jsonb DEFAULT '[]',
  notifications jsonb DEFAULT '[]',
  category text DEFAULT 'compliance',
  tags jsonb DEFAULT '[]',
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);

-- Create index on start_date for date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);

-- Create index on type for filtering
CREATE INDEX IF NOT EXISTS idx_calendar_events_type ON calendar_events(type);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_calendar_events_status ON calendar_events(status);

-- Create index on priority for filtering
CREATE INDEX IF NOT EXISTS idx_calendar_events_priority ON calendar_events(priority);

-- Create composite index for common queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON calendar_events(user_id, start_date);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own events
CREATE POLICY "Users can view their own calendar events"
  ON calendar_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own events
CREATE POLICY "Users can insert their own calendar events"
  ON calendar_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own events
CREATE POLICY "Users can update their own calendar events"
  ON calendar_events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own events
CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_calendar_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_calendar_events_updated_at();


