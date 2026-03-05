-- Add fund column to transactions table if it doesn't exist
-- This migration adds support for transaction funds
PRAGMA foreign_keys = ON;

-- Check if fund column exists and add it if not
-- SQLite doesn't have IF NOT EXISTS for ALTER TABLE, so we try to add and ignore if it exists
ALTER TABLE transactions ADD COLUMN fund TEXT DEFAULT 'General Fund';
