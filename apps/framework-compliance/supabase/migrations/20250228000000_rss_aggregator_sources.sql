-- Migration: RSS Feed Sources Table for Aggregator
-- This table stores RSS feed sources that are managed by the RSS Aggregator
-- The aggregator fetches from these sources instead of direct feed access

-- Create RSS feed sources table
CREATE TABLE IF NOT EXISTS rss_feed_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  framework VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  enabled BOOLEAN DEFAULT true,
  last_fetched TIMESTAMPTZ,
  update_frequency VARCHAR(20) DEFAULT 'daily' CHECK (update_frequency IN ('hourly', 'daily', 'weekly')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure unique feed URLs
  CONSTRAINT unique_feed_url UNIQUE(url)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rss_feed_sources_framework ON rss_feed_sources(framework);
CREATE INDEX IF NOT EXISTS idx_rss_feed_sources_enabled ON rss_feed_sources(enabled);
CREATE INDEX IF NOT EXISTS idx_rss_feed_sources_region ON rss_feed_sources(region);

-- Enable RLS
ALTER TABLE rss_feed_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Only authenticated users can view feed sources
CREATE POLICY "Authenticated users can view RSS feed sources"
  ON rss_feed_sources
  FOR SELECT
  TO authenticated
  USING (true);

-- Only service role can manage feed sources (for aggregator service)
CREATE POLICY "Service role can manage RSS feed sources"
  ON rss_feed_sources
  FOR ALL
  TO service_role
  USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_rss_feed_sources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rss_feed_sources_updated_at
  BEFORE UPDATE ON rss_feed_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_rss_feed_sources_updated_at();

-- Add comments
COMMENT ON TABLE rss_feed_sources IS 'RSS feed sources managed by the RSS Aggregator service. The aggregator fetches from these sources instead of direct feed access.';
COMMENT ON COLUMN rss_feed_sources.url IS 'RSS feed URL that the aggregator will fetch from';
COMMENT ON COLUMN rss_feed_sources.framework IS 'Regulatory framework this feed relates to (e.g., GDPR, CCPA, NIST)';
COMMENT ON COLUMN rss_feed_sources.update_frequency IS 'How often the aggregator should fetch from this feed';
COMMENT ON COLUMN rss_feed_sources.enabled IS 'Whether this feed source is currently active';

-- Insert some example feed sources (these would typically be configured via admin interface)
-- Note: These are placeholder URLs - replace with actual regulatory RSS feeds
INSERT INTO rss_feed_sources (name, url, framework, region, enabled, update_frequency)
VALUES
  ('GDPR Official Updates', 'https://example.com/gdpr/rss', 'GDPR', 'EU', true, 'daily'),
  ('CCPA Regulatory News', 'https://example.com/ccpa/rss', 'CCPA', 'US', true, 'daily'),
  ('NIST Privacy Framework', 'https://example.com/nist/rss', 'NIST', 'US', true, 'weekly')
ON CONFLICT (url) DO NOTHING;

