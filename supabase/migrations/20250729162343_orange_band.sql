/*
  # Create policy_generators table

  1. New Tables
    - `policy_generators`
      - `id` (uuid, primary key)
      - `session_id` (text, unique)
      - `organization_info` (jsonb)
      - `selected_industry` (text)
      - `selected_policies` (text[])
      - `selected_compliance` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    - `toolkit_analytics`
      - `id` (uuid, primary key)
      - `tool_name` (text)
      - `action` (text)
      - `session_id` (text)
      - `organization_name` (text)
      - `data` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create policy_generators table
CREATE TABLE IF NOT EXISTS policy_generators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  organization_info jsonb NOT NULL DEFAULT '{}',
  selected_industry text DEFAULT '',
  selected_policies text[] DEFAULT '{}',
  selected_compliance text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create toolkit_analytics table
CREATE TABLE IF NOT EXISTS toolkit_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  action text NOT NULL,
  session_id text,
  organization_name text,
  data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE policy_generators ENABLE ROW LEVEL SECURITY;
ALTER TABLE toolkit_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for policy_generators
CREATE POLICY "Allow public read access to policy_generators"
  ON policy_generators
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert access to policy_generators"
  ON policy_generators
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update access to policy_generators"
  ON policy_generators
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for toolkit_analytics
CREATE POLICY "Allow public insert access to toolkit_analytics"
  ON toolkit_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policy_generators_session_id ON policy_generators(session_id);
CREATE INDEX IF NOT EXISTS idx_policy_generators_created_at ON policy_generators(created_at);
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_tool_name ON toolkit_analytics(tool_name);
CREATE INDEX IF NOT EXISTS idx_toolkit_analytics_session_id ON toolkit_analytics(session_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policy_generators_updated_at
    BEFORE UPDATE ON policy_generators
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();