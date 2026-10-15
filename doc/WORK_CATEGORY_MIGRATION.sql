-- Widen the work_projects category check to match the services actually offered.
-- Old: check (category in ('Web', 'Mobile', 'AI'))
--      (statically verified: inserting any other value fails with 23514
--       work_projects_category_check)
-- New adds: 'E-commerce' and 'SaaS' (service lines from data/services.ts).
-- 'Mobile' is kept — Mobile is still a real service line even though our first
-- three projects were filed as Web/AI.

-- Drop by auto-generated name (work_projects_category_check) if it exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'work_projects'::regclass AND conname = 'work_projects_category_check'
  ) THEN
    ALTER TABLE work_projects DROP CONSTRAINT work_projects_category_check;
  END IF;
END $$;

ALTER TABLE work_projects
  ADD CONSTRAINT work_projects_category_check
  CHECK (category IN ('Web', 'Mobile', 'E-commerce', 'SaaS', 'AI'));

-- Existing rows (Web/Mobile/AI) stay valid; no data migration needed.
