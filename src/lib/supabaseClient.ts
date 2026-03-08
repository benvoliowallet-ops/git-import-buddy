// ─── Supabase Client Stub ─────────────────────────────────────────────────────
// App runs without @supabase/supabase-js installed.
// All hooks fall back to local data automatically.
//
// TO ENABLE REAL SUPABASE:
//   1. Run:  npm install   (installs @supabase/supabase-js)
//   2. Fill: .env.local   (VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY)
//   3. Replace this file with the real client (see comment below)
// ─────────────────────────────────────────────────────────────────────────────
//
// Real implementation (uncomment after npm install):
//
//   import { createClient } from '@supabase/supabase-js';
//   const url = import.meta.env.VITE_SUPABASE_URL ?? '';
//   const key = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
//   export const isSupabaseConfigured = !!url && !!key;
//   export const supabase = createClient(url, key);
//
// ─────────────────────────────────────────────────────────────────────────────

export const isSupabaseConfigured = false;

type Row = Record<string, unknown>;
type SBResult = Promise<{ data: Row[] | null; error: { message: string } | null }>;

const noop = (): SBResult => Promise.resolve({ data: null, error: null });

export const supabase = {
  from: (_table: string) => ({
    select: (_cols: string) => ({
      eq: (_col: string, _val: string): SBResult => noop(),
    }),
  }),
} as const;
