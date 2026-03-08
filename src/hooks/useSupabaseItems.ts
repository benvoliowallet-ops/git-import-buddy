import { useState, useEffect } from 'react';
import type { StockItem } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { STOCK_ITEMS } from '../data/stockItems';

// ─── useItemsByGroup ──────────────────────────────────────────────────────────
// Returns items filtered by group. Falls back to local STOCK_ITEMS if Supabase
// is not configured.

export function useItemsByGroup(group: string): StockItem[] {
  const [items, setItems] = useState<StockItem[]>(() =>
    STOCK_ITEMS.filter((i) => i.group === group)
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from('skladove_karty')
      .select('*')
      .eq('group', group)
      .then(({ data, error }) => {
        if (error) {
          console.warn('[Supabase] useItemsByGroup error:', error.message);
          return;
        }
        if (data && data.length > 0) {
          setItems(
            data.map((row: any) => ({
              code: row.code,
              name: row.name,
              additionalText: row.additional_text ?? '',
              price: Number(row.price ?? 0),
              group: row.group ?? group,
              supplier: row.dodavatel ?? undefined,
            }))
          );
        }
      });
  }, [group]);

  return items;
}

// ─── useNormistChecker ────────────────────────────────────────────────────────
// Returns a function that checks whether a given code belongs to NORMIST.
// Falls back to a prefix-based heuristic if Supabase is not configured.

export function useNormistChecker() {
  const [normistCodes, setNormistCodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase
      .from('skladove_karty')
      .select('code')
      .eq('dodavatel', 'NORMIST')
      .then(({ data, error }) => {
        if (error) {
          console.warn('[Supabase] useNormistChecker error:', error.message);
          return;
        }
        if (data) {
          setNormistCodes(new Set(data.map((r: any) => r.code as string)));
        }
      });
  }, []);

  /** isNormist returns true for codes from the NORMIST supplier */
  const isNormist = (code: string): boolean => {
    if (isSupabaseConfigured && normistCodes.size > 0) {
      return normistCodes.has(code);
    }
    // Primary fallback: check supplier field in local STOCK_ITEMS
    const localItem = STOCK_ITEMS.find((i) => i.code === code);
    if (localItem) return localItem.supplier === 'NORMIST';
    // Secondary heuristic: codes that start with NOR/NORMIST/NMC or match known prefixes
    return (
      code.startsWith('NOR') ||
      code.startsWith('NORMIST') ||
      code.startsWith('NMC') ||
      code.startsWith('NORMIST_PUMP') ||
      code.startsWith('NORMIST_UV') ||
      code.startsWith('NORMIST_30SS')
    );
  };

  return { isNormist };
}
