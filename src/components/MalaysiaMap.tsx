import { useState } from 'react';
import type { Gov, StateRow } from '@/lib/gov';
import { t, pc } from '@/lib/gov';

// Schematic map of Malaysian states (fixed positions, not to scale). Colour = supply/demand balance of the FarmXpress pilot
// network in that state, from records. States without FarmXpress farms, buyers or hubs are shown grey.
const POS: Record<string, { x: number; y: number; region: 'Peninsular' | 'Borneo' }> = {
  Johor: { x: 250, y: 300, region: 'Peninsular' }, Pahang: { x: 205, y: 215, region: 'Peninsular' }, Terengganu: { x: 240, y: 185, region: 'Peninsular' },
  Kelantan: { x: 225, y: 150, region: 'Peninsular' }, Perak: { x: 150, y: 200, region: 'Peninsular' }, Penang: { x: 120, y: 170, region: 'Peninsular' },
  Kedah: { x: 130, y: 130, region: 'Peninsular' }, Perlis: { x: 110, y: 110, region: 'Peninsular' }, 'Negeri Sembilan': { x: 200, y: 270, region: 'Peninsular' },
  Melaka: { x: 215, y: 285, region: 'Peninsular' }, Selangor: { x: 170, y: 220, region: 'Peninsular' }, 'Kuala Lumpur': { x: 178, y: 238, region: 'Peninsular' },
  Sabah: { x: 360, y: 230, region: 'Borneo' }, Sarawak: { x: 320, y: 250, region: 'Borneo' }, Labuan: { x: 350, y: 255, region: 'Borneo' },
};
export const BALANCE: Record<StateRow['balance'], { label: string; color: string }> = {
  surplus: { label: 'Supply ≥ demand', color: '#10b981' },
  deficit: { label: 'Supply < demand', color: '#fb923c' },
  supply_only: { label: 'Supply only', color: '#22d3ee' },
  demand_only: { label: 'Demand only', color: '#f59e0b' },
  none: { label: 'No records', color: '#334155' },
};

export function MalaysiaMap({ data }: { data: Gov }) {
  const rows = new Map(data.states.map((s) => [s.state, s]));
  const withData = data.states.filter((s) => POS[s.state]);
  const [selected, setSelected] = useState<string>(withData[0]?.state ?? 'Pahang');
  const [hover, setHover] = useState<string | null>(null);
  const sel = rows.get(selected);
  const hubState = new Map(data.logistics.map((h) => [h.hub_id, h.state]));
  const maxFlow = Math.max(1, ...data.flows.hub_to_buyer_state.map((f) => f.kg), ...data.flows.farm_state_to_hub.map((f) => f.kg));
  const line = (a: string | undefined, b: string | undefined, kg: number, color: string, key: string, dash?: string) => {
    const pa = a ? POS[a] : undefined; const pb = b ? POS[b] : undefined;
    if (!pa || !pb || a === b) return null;
    return <line key={key} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={color} strokeWidth={1 + (kg / maxFlow) * 4} opacity="0.55" strokeDasharray={dash}><title>{`${a} → ${b}: ${t(kg)}`}</title></line>;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="relative flex-1 min-h-[360px] rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800/60 overflow-hidden bg-grid" data-testid="gov-map">
        <div className="absolute top-3 left-3 z-10 text-[10px] font-mono uppercase tracking-widest text-emerald-300/80">FarmXpress pilot network · schematic</div>
        <div className="absolute top-8 left-3 right-3 z-10 flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-mono">
          {Object.values(BALANCE).map((b) => (
            <span key={b.label} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: b.color }} /><span className="text-slate-400">{b.label}</span></span>
          ))}
        </div>
        <svg viewBox="0 0 440 340" className="w-full h-full">
          {data.flows.farm_state_to_hub.map((f, i) => line(f.state, hubState.get(f.hub_id), f.kg, '#22d3ee', `s${i}`, '3 3'))}
          {data.flows.hub_to_buyer_state.map((f, i) => line(hubState.get(f.hub_id), f.state, f.kg, '#34d399', `d${i}`))}
          {Object.entries(POS).map(([name, p]) => {
            const s = rows.get(name); const b = BALANCE[s?.balance ?? 'none']; const isSel = selected === name; const hubs = s?.hubs.length ?? 0;
            const r = s && s.balance !== 'none' ? 6 : 4;
            return (
              <g key={name} onMouseEnter={() => setHover(name)} onMouseLeave={() => setHover(null)} onClick={() => s && setSelected(name)} className={s ? 'cursor-pointer' : ''}>
                {isSel && <circle cx={p.x} cy={p.y} r="14" fill="none" stroke={b.color} strokeWidth="1" opacity="0.6" />}
                {hubs > 0 && <rect x={p.x - 9} y={p.y - 9} width="18" height="18" rx="4" fill="none" stroke="#e2e8f0" strokeWidth="1.2" />}
                <circle cx={p.x} cy={p.y} r={r} fill={b.color} stroke="#0a1220" strokeWidth="1" />
                <text x={p.x} y={p.y - r - 5} fontSize="8.5" fill={hover === name || isSel ? '#e6eef9' : s ? '#8da4c4' : '#475569'} textAnchor="middle" fontWeight={isSel ? 700 : 500} style={{ pointerEvents: 'none' }}>{name}</text>
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-3 left-3 right-3 text-[9px] font-mono text-slate-500 flex flex-wrap gap-x-4">
          <span>□ hub</span><span className="text-cyan-400">- - farms → hub</span><span className="text-emerald-400">— hub → buyers</span>
          <span>{data.states.filter((s) => s.balance !== 'none').length} states with records · {data.totals.hubs} hubs · line width = kg</span>
        </div>
      </div>

      <div className="w-full lg:w-72 panel p-4 flex flex-col" data-testid="gov-map-detail">
        <div className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-mono">State detail</div>
        <h4 className="text-lg font-bold text-white">{selected}</h4>
        {sel ? (
          <div className="space-y-2 text-sm mt-2">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-600 text-slate-200" style={{ borderColor: BALANCE[sel.balance].color }}>{BALANCE[sel.balance].label}</span>
            {[
              ['Farms / farmers', `${sel.farms} / ${sel.farmers}`], ['Produce supplied', t(sel.production_kg)], ['Buyers', String(sel.buyers)],
              ['Ordered by buyers', t(sel.demand_kg)], ['Delivered to buyers', t(sel.delivered_kg)], ['Supply / demand', pc(sel.production_to_demand_pct)],
              ['On time (failed or rejected = missed)', pc(sel.on_time_pct)], ['Hubs', sel.hubs.join(', ') || '—'],
            ].map(([a, b]) => <div key={a} className="flex justify-between gap-2"><span className="text-slate-500 text-xs">{a}</span><span className="text-slate-100 font-mono text-xs">{b}</span></div>)}
          </div>
        ) : <p className="text-xs text-slate-500 mt-2">No FarmXpress records in this state.</p>}
        <div className="mt-4 pt-3 border-t border-slate-800 space-y-0.5 max-h-40 overflow-y-auto">
          {withData.map((s) => (
            <button key={s.state} onClick={() => setSelected(s.state)} className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs ${selected === s.state ? 'bg-emerald-500/10 text-emerald-200' : 'text-slate-400 hover:bg-slate-800/40'}`}>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ background: BALANCE[s.balance].color }} />{s.state}</span>
              <span className="font-mono text-[10px]">{t(s.production_kg)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
