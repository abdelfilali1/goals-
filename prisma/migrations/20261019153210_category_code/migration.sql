-- Add a short line code to each category, filled in for existing rows.
ALTER TABLE "Category" ADD COLUMN "code" TEXT;

UPDATE "Category" SET "code" = CASE "name"
  WHEN 'Family' THEN 'FAM'
  WHEN 'Health' THEN 'HLT'
  WHEN 'Work' THEN 'WRK'
  WHEN 'Personal' THEN 'PER'
  WHEN 'Finance' THEN 'FIN'
  ELSE UPPER(LEFT(REGEXP_REPLACE("name", '[^[:alnum:]]', '', 'g'), 3))
END;

-- Darker plate colours for the default categories so white codes stay readable.
UPDATE "Category" SET "color" = CASE "name"
  WHEN 'Family' THEN '#9A4B40'
  WHEN 'Health' THEN '#2F6E4E'
  WHEN 'Work' THEN '#34558A'
  WHEN 'Personal' THEN '#7D6222'
  WHEN 'Finance' THEN '#3F646B'
  ELSE "color"
END;

ALTER TABLE "Category" ALTER COLUMN "code" SET NOT NULL;
