-- Migration to add a JSONB column to the calls table for flexible metadata

-- It's best practice to use JSONB over JSON for performance and indexing capabilities.
ALTER TABLE calls
ADD COLUMN analysis_metadata JSONB;

-- Add a comment to explain the purpose of the new column for future reference.
COMMENT ON COLUMN calls.analysis_metadata IS 'Flexible JSONB field to store unstructured analysis data, such as raw output from AI models, detailed sentiment scores, keyword spotting results, or other third-party integration metadata.';

-- For efficient querying of data within the JSONB column, a GIN index is recommended.
-- This allows you to quickly find rows based on keys or values within the JSON structure.
CREATE INDEX idx_calls_analysis_metadata ON calls USING GIN (analysis_metadata);
