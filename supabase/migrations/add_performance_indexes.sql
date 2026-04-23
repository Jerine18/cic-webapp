-- =============================================================================
-- add_performance_indexes.sql
--
-- Adds indexes to the `submissions` table for the most common query patterns
-- in the CIC Hub app. Run once in Supabase → SQL Editor (or via
-- `supabase db push` if using the CLI). Safe to re-run — every statement uses
-- IF NOT EXISTS, so it becomes a no-op after the first run.
--
-- Index-by-index rationale:
--
--   idx_submissions_status
--     The admin submissions page filters by status (Pending / In Progress /
--     Completed) from a dropdown, and the dashboard stat cards read counts
--     grouped by status. Both previously scanned the full table.
--
--   idx_submissions_priority
--     Priority is no longer a user-facing filter in the UI, but the column
--     still exists. Keeping the index is cheap and preserves query speed for
--     any admin SQL / exports that still filter by it.
--
--   idx_submissions_type
--     The "Requests by type" panel on the dashboard and the service-type
--     filter pills on the submissions table query by `type`.
--
--   idx_submissions_user_id
--     The user portal (/userpage, /usermyrequests, detail page) filters
--     submissions to the logged-in user via WHERE user_id = auth.uid().
--     Without this, every portal load does a full-table scan.
--
--   idx_submissions_created_at (DESC)
--     Every listing orders by created_at DESC. A descending index lets
--     Postgres walk the index directly to return recent rows without a sort.
--
--   idx_submissions_user_created
--     Composite index covering the most frequent portal query:
--         WHERE user_id = ? ORDER BY created_at DESC.
--     Matches the leading column (user_id) exactly, then uses the trailing
--     created_at for the ordering — lets the planner skip both the scan and
--     the sort in one go.
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_priority ON submissions(priority);
CREATE INDEX IF NOT EXISTS idx_submissions_type ON submissions(type);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Composite index for the user portal's `WHERE user_id = ? ORDER BY created_at DESC` pattern.
CREATE INDEX IF NOT EXISTS idx_submissions_user_created
  ON submissions(user_id, created_at DESC);
