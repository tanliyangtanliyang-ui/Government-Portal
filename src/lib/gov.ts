// Government Portal data: GET /v1/government/insights (FarmXpress pilot network, v2 dataset + portal records). Read-only.
import { useEffect, useState } from 'react';

export const API = import.meta.env.VITE_FARMXPRESS_API_BASE_URL ?? 'http://127.0.0.1:4000/v1';

export type Month = { month: string; supply_kg: number; demand_kg: number; delivered_kg: number; active_farmers: number; orders: number; trips: number; avg_delay_min: number | null;
  on_time_pct: number | null; loss_kg: number; loss_pct_of_received: number | null; qc_pass_pct: number | null; temp_alerts: number; trips_avoided: number; km_avoided: number; co2e_avoided_kg: number };
export type StateRow = { state: string; farms: number; farmers: number; production_kg: number; buyers: number; demand_kg: number; delivered_kg: number; on_time_pct: number | null;
  rejected_at_delivery_kg: number; hubs: string[]; balance: 'surplus' | 'deficit' | 'supply_only' | 'demand_only' | 'none'; production_to_demand_pct: number | null };
export type HubRow = { hub_id: string; name: string; state: string; capacity_kg: number; shipments: number; avg_delay_min: number | null; avg_load_pct_of_capacity: number | null;
  planned_km: number; avg_trip_km: number | null; on_time_pct: number | null; temp_alerts: number; delay_alerts: number; alerts: number; multi_stop_share_pct: number | null; received_kg: number; delivered_kg: number };
export type Signal = { level: 'High' | 'Medium' | 'Low'; area: string; title: string; detail: string; rule: string };
export type Gov = {
  scope: string; window: { start: string; end: string };
  totals: { farmers: number; cooperative_members: number; cooperatives: number; farms: number; buyers: number; hubs: number; vehicles: number; refrigerated_vehicles: number;
    batches: number; supply_kg: number; received_kg: number; demand_kg: number; delivered_kg: number; shipments: number };
  kpis: { supply_kg: number; delivered_kg: number; fill_rate_pct: number | null; on_time_pct: number | null; loss_pct_of_received: number | null; co2e_avoided_kg: number; trips_avoided: number };
  monthly: Month[];
  produce_mix: { product_id: string; name: string; storage_class: string; kg: number; batches: number; share_pct: number | null }[];
  states: StateRow[];
  flows: { hub_to_buyer_state: { hub_id: string; state: string; kg: number; deliveries: number }[]; farm_state_to_hub: { state: string; hub_id: string; kg: number }[] };
  logistics: HubRow[];
  recent_trips: { shipment_id: string; hub_id: string; hub_name: string; planned_start_at: string; status: string; loaded_kg: number; capacity_kg: number; vehicle_type: string; km: number;
    weather_input: string | null; traffic_input: string | null; delay_minutes: number | null; stops: number; load_pct: number | null }[];
  weather: { days_by_hub: { hub_id: string; condition: string; days: number }[]; latest: { hub_id: string; hub_name: string; state: string; date: string; condition: string }[];
    delay_by_weather: { condition: string; trips: number; avg_delay_min: number; late_trips: number; late_share_pct: number | null }[];
    delay_by_traffic: { level: string; trips: number; avg_delay_min: number }[]; note: string };
  farmer: { total: number; cooperative_members: number; cooperative_share_pct: number | null; cooperatives: number; active_in_last_month: number; avg_sales_value_sen: number | null;
    sales_value_sen: number; by_state: { state: string; farmers: number; farms: number; production_kg: number }[]; using_portal: number; qc_pass_pct: number | null };
  loss: { qc_reject_kg: number; spoiled_in_hub_kg: number; rejected_at_delivery_kg: number; expired_batches: number; expired_batches_kg: number; total_kg: number };
  sustainability: { trips_avoided: number; km_avoided: number; co2e_avoided_kg: number; multi_stop_shipments: number; shipments: number; multi_stop_share_pct: number | null;
    co2e_factor: { co2e_kg_per_km: number; co2e_factor_source: string; road_factor: number; separate_trip_basis: string } | null; formulas: string[] };
  signals: Signal[];
  live: { produce_registrations: number; delivery_requests: number; orders: number; trips: number; proofs_of_delivery: number; cargo_alerts: number; farmers_using_portal: number };
  basis: string[];
};

let cache: Promise<Gov> | null = null; let cachedAt = 0;
function load(): Promise<Gov> {
  if (!cache || Date.now() - cachedAt > 60_000) {
    cachedAt = Date.now();
    cache = fetch(`${API}/government/insights`).then(async (r) => { const b = await r.json().catch(() => null); if (!r.ok) throw new Error(b?.error?.message ?? `API ${r.status}`); return b as Gov; });
    cache.catch(() => { cache = null; });
  }
  return cache;
}
/** Network insights, shared by every view (one request per minute at most). */
export function useGov() {
  const [data, setData] = useState<Gov | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let live = true; load().then((d) => live && setData(d)).catch((e) => live && setError((e as Error).message)); return () => { live = false; }; }, []);
  return { data, error };
}

export const t = (kg: number | null | undefined) => (kg == null ? '—' : kg >= 1000 ? `${(kg / 1000).toLocaleString('en-MY', { maximumFractionDigits: 1 })} t` : `${Math.round(kg)} kg`);
export const kgf = (kg: number | null | undefined) => (kg == null ? '—' : `${Math.round(kg).toLocaleString('en-MY')} kg`);
export const pc = (v: number | null | undefined) => (v == null ? '—' : `${v}%`);
export const rm = (sen: number | null | undefined) => (sen == null ? '—' : `RM ${Math.round(sen / 100).toLocaleString('en-MY')}`);
export const mon = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
export const day = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kuala_Lumpur' }) : '—');
export const period = (g: Gov) => `${day(g.window.start)} – ${day(g.window.end)}`;

/** Download rows as a CSV file (client side, from the API figures). */
export function downloadCsv(name: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  const esc = (v: unknown) => (v == null ? '' : Array.isArray(v) ? `"${v.join('; ')}"` : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => esc(r[c])).join(','))].join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
