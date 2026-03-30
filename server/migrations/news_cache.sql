-- ============================================================
-- Migration: Create news_cache table
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gckwfrtluhqjzbclkkdm/sql
-- ============================================================

-- Drop table if re-running
DROP TABLE IF EXISTS news_cache;

-- Single-row cache table for agricultural news articles
CREATE TABLE news_cache (
    id          INT PRIMARY KEY DEFAULT 1,           -- Always 1; enforces single-row
    articles    JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of article objects
    fetched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),  -- When articles were last fetched

    -- Constraint: only one row ever exists
    CONSTRAINT single_row CHECK (id = 1)
);

-- Index on fetched_at for fast cache-age lookups
CREATE INDEX idx_news_cache_fetched_at ON news_cache (fetched_at);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

-- Allow backend (service role) to read/write freely (no policy needed for service role)
-- Allow public/anon to READ the cache (the news is public anyway)
CREATE POLICY "Allow public read of news cache"
    ON news_cache
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Only service role can INSERT/UPDATE/DELETE (enforced by RLS + key)
CREATE POLICY "Only service role can write news cache"
    ON news_cache
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================================
-- Seed with an empty row so UPSERT always has a target
-- ============================================================
INSERT INTO news_cache (id, articles, fetched_at)
VALUES (1, '[]'::jsonb, '2000-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Verify
-- ============================================================
SELECT * FROM news_cache;
