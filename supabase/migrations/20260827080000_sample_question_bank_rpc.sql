-- 20260827080000_sample_question_bank_rpc.sql
--
-- question_banks now holds the full official 2021 PSC word table for C1/C2
-- (thousands of rows), but consumers were reading capped subsets via
-- PostgREST `.limit(n)` with no ORDER BY. PostgREST then serves physical row
-- order, so rows inserted after the original seed sat past the cap and were
-- systematically under-served. This RPC draws the sample server-side.
--
-- ORDER BY random() rather than TABLESAMPLE: TABLESAMPLE samples pages
-- before the `component` filter and cannot guarantee n rows; a filtered sort
-- over a few thousand rows is cheap and uniform.
--
-- SECURITY INVOKER: RLS still applies (question_banks is publicly readable,
-- see 001_initial_schema.sql), so the default PUBLIC execute grant adds no
-- exposure beyond the existing table policy.

CREATE OR REPLACE FUNCTION public.sample_question_bank(p_component integer, p_n integer)
RETURNS SETOF public.question_banks
LANGUAGE sql
VOLATILE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
  SELECT *
  FROM public.question_banks
  WHERE component = p_component
  ORDER BY random()
  LIMIT GREATEST(p_n, 0);
$function$;

COMMENT ON FUNCTION public.sample_question_bank(integer, integer) IS
  'Uniform random sample of up to p_n question_banks rows for one component. Used by C1/C2 practice and mock-exam reads so late-inserted rows are served evenly.';
