import { useEffect, useState } from 'react';

// Read-only network-wide record counts from the shared FarmXpress API (GET /v1/network/summary).
// Raw counts only, exactly as returned: no KPI formulas or derived rates are applied here.
const API = import.meta.env.VITE_FARMXPRESS_API_BASE_URL ?? 'http://127.0.0.1:4000/v1';

type Counts = Record<string, number>;
type Summary = {
  readOnly: boolean;
  window: { start: string | null; end: string | null };
  entities: Counts;
  batchesByStatus: Counts; ordersByStatus: Counts; shipmentsByStatus: Counts; deliveriesByStatus: Counts;
  deliveriesOnTime: Counts; sensorObservationsByQuality: Counts; alertsByKind: Counts;
  byHub: { hub_id: string; name: string; state: string; batches: number; orders: number; shipments: number }[];
  provenance: { dataset_version: string; label: string } | null;
};

const utc = (s: string | null) => (s ? `${s.replace('T', ' ').slice(0, 16)} UTC` : 'not recorded');
const label = (k: string) => k.split('_').join(' ');
const total = (o: Counts) => Object.values(o).reduce((a, b) => a + b, 0);

function CountBox({ title, counts }: { title: string; counts: Counts }) {
  const entries = Object.entries(counts);
  return (
    <div className="rounded-lg border border-slate-700/70 bg-slate-950/20 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{title} · {total(counts)}</div>
      {entries.length === 0 ? <div className="mt-1 text-xs text-slate-500">No records returned.</div>
        : entries.map(([k, v]) => <div key={k} className="mt-1 flex justify-between gap-3 text-xs"><span className="text-slate-400">{label(k)}</span><span className="font-mono text-slate-200">{v}</span></div>)}
    </div>
  );
}

export function NetworkSummaryPanel() {
  const [state, setState] = useState<{ loading: boolean; data?: Summary; error?: string }>({ loading: true });
  useEffect(() => {
    let active = true;
    fetch(`${API}/network/summary`)
      .then(async (r) => (r.ok ? r.json() : Promise.reject(new Error(`API ${r.status}`))))
      .then((data: Summary) => { if (active) setState({ loading: false, data }); })
      .catch((e: Error) => { if (active) setState({ loading: false, error: e.message }); });
    return () => { active = false; };
  }, []);

  if (state.error) return <div className="mb-6 rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-200">Network summary unavailable from the shared API ({state.error}). No national figures are shown in place of the API.</div>;
  if (state.loading || !state.data) return <div className="mb-6 rounded-lg border border-slate-700/70 bg-slate-950/20 p-4 text-sm text-slate-400">Loading network summary from the shared API…</div>;

  const d = state.data;
  return (
    <section className="mb-6 rounded-lg border border-emerald-500/30 bg-slate-950/20 p-4" data-source="farmxpress-api">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="text-sm font-semibold text-slate-100">Network records (shared API)</div>
        <div className="text-xs text-slate-400">Read-only · {d.provenance?.label ?? 'provenance not returned'} v{d.provenance?.dataset_version ?? '?'} · {utc(d.window.start)} → {utc(d.window.end)}</div>
      </div>
      <div className="mt-1 text-xs text-slate-400">{Object.entries(d.entities).map(([k, v]) => `${label(k)} ${v}`).join(' · ')}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <CountBox title="Batches by status" counts={d.batchesByStatus} />
        <CountBox title="Orders by status" counts={d.ordersByStatus} />
        <CountBox title="Shipments by status" counts={d.shipmentsByStatus} />
        <CountBox title="Deliveries by status" counts={d.deliveriesByStatus} />
        <CountBox title="Deliveries on time" counts={d.deliveriesOnTime} />
        <CountBox title="Sensor observations by quality" counts={d.sensorObservationsByQuality} />
        <CountBox title="Alerts by kind" counts={d.alertsByKind} />
        <div className="rounded-lg border border-slate-700/70 bg-slate-950/20 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400">By hub</div>
          {d.byHub.length === 0 ? <div className="mt-1 text-xs text-slate-500">No hubs returned.</div>
            : d.byHub.map((h) => <div key={h.hub_id} className="mt-1 text-xs text-slate-400">{h.name} <span className="font-mono text-slate-200">({h.hub_id}, {h.state})</span> · batches {h.batches} · orders {h.orders} · shipments {h.shipments}</div>)}
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-500">Raw record counts from the dataset. The pages below are calculated from the same records (GET /v1/government/insights).</div>
    </section>
  );
}
