import { useState } from 'react';
import { malaysiaStates, type MapState } from '@/lib/data';
import { Badge } from './ui';

const riskColor: Record<string, string> = {
  Low: '#10b981',
  Medium: '#f59e0b',
  High: '#fb923c',
  Critical: '#ef4444',
};

export function MalaysiaMap() {
  const [selected, setSelected] = useState<MapState>(malaysiaStates[0]);
  const [hover, setHover] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      <div className="relative flex-1 min-h-[360px] rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800/60 overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="status-dot text-emerald-400" style={{ background: '#34d399' }}>
            <span className="pulse-ring absolute inset-0 text-emerald-400" />
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300/80">Live Network</span>
        </div>
        <div className="absolute top-3 right-3 z-10 flex gap-3 text-[9px] font-mono">
          {Object.entries(riskColor).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: v }} />
              <span className="text-slate-400">{k}</span>
            </div>
          ))}
        </div>

        <svg viewBox="0 0 440 340" className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <radialGradient id="hubGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Route lines */}
          {[
            ['kdh', 'prk'], ['prk', 'slr'], ['slr', 'kul'], ['kul', 'nsn'], ['nsn', 'mlk'], ['mlk', 'jhr'],
            ['ktn', 'trg'], ['trg', 'phg'], ['phg', 'slr'], ['ktn', 'trg'],
            ['sbh', 'srk'], ['sbh', 'lbn'],
          ].map(([a, b], i) => {
            const sa = malaysiaStates.find((s) => s.id === a)!;
            const sb = malaysiaStates.find((s) => s.id === b)!;
            return (
              <line key={i} x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y} stroke="#1c4a6e" strokeWidth="1.2" className="flow-line" opacity="0.7" />
            );
          })}

          {/* Demand zone pulse around KL */}
          <circle cx={175} cy={235} r="26" fill="url(#hubGlow)" opacity="0.5" />

          {/* State nodes */}
          {malaysiaStates.map((s) => {
            const isSel = selected.id === s.id;
            const isHover = hover === s.id;
            const r = s.region === 'Borneo' ? 5 : 6;
            return (
              <g key={s.id} onMouseEnter={() => setHover(s.id)} onMouseLeave={() => setHover(null)} onClick={() => setSelected(s)} className="cursor-pointer">
                {isSel && <circle cx={s.x} cy={s.y} r="14" fill="none" stroke={riskColor[s.risk]} strokeWidth="1" opacity="0.5" className="spin-slow" />}
                <circle cx={s.x} cy={s.y} r={r + 4} fill={riskColor[s.risk]} opacity={isHover ? 0.25 : 0.12} />
                <circle cx={s.x} cy={s.y} r={r} fill={riskColor[s.risk]} filter="url(#glow)" stroke="#0a1220" strokeWidth="1" />
                <text x={s.x} y={s.y - r - 4} fontSize="8.5" fill={isHover || isSel ? '#e6eef9' : '#8da4c4'} textAnchor="middle" fontFamily="Inter" fontWeight={isSel ? 700 : 500} style={{ pointerEvents: 'none' }}>
                  {s.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-500">
          15 states · 126 hubs · 28 routes
        </div>
      </div>

      {/* Detail panel */}
      <div className="w-full lg:w-72 panel p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-emerald-400/70 font-mono">Region Detail</div>
            <h4 className="text-lg font-bold text-white">{selected.name}</h4>
          </div>
          <Badge level={selected.risk} />
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Production</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold tabular text-white">{selected.production}</span>
              <span className="text-xs text-slate-400">k tonnes</span>
              <span className={`text-xs font-mono ${selected.productionTrend >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {selected.productionTrend >= 0 ? '↑' : '↓'} {Math.abs(selected.productionTrend)}%
              </span>
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Main Produce</div>
            <div className="text-sm text-slate-200">{selected.mainProduce}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Hub Capacity</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${selected.hubCapacity}%`, background: `linear-gradient(90deg, #10b981, #34d399)` }} />
              </div>
              <span className="text-xs font-mono text-emerald-300">{selected.hubCapacity}%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-2">
              <div className="text-[9px] uppercase text-slate-500">Hubs</div>
              <div className="text-base font-bold tabular text-white">{selected.hubCount}</div>
            </div>
            <div className="rounded-lg bg-slate-800/40 border border-slate-700/40 p-2">
              <div className="text-[9px] uppercase text-slate-500">Region</div>
              <div className="text-base font-bold text-white">{selected.region}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-mono">All Regions</div>
          <div className="space-y-0.5 max-h-40 overflow-y-auto pr-1">
            {malaysiaStates.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition ${selected.id === s.id ? 'bg-emerald-500/10 text-emerald-200' : 'text-slate-400 hover:bg-slate-800/40'}`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: riskColor[s.risk] }} />
                  {s.name}
                </span>
                <span className="font-mono text-[10px]">{s.production}k</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
