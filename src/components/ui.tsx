import React from 'react';

export function Sparkline({ data, color = '#34d399', width = 120, height = 36 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${height - ((d - min) / range) * (height - 6) - 3}`);
  const path = `M ${pts.join(' L ')}`;
  const area = `${path} L ${width},${height} L 0,${height} Z`;
  const id = React.useId();
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / range) * (height - 6) - 3} r="2.4" fill={color} />
    </svg>
  );
}

export function Donut({ segments, size = 140, thickness = 18, centerLabel, centerSub }: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerSub?: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#16233c" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold tabular text-white">{centerLabel}</span>
          {centerSub && <span className="text-[10px] uppercase tracking-wider text-slate-400">{centerSub}</span>}
        </div>
      )}
    </div>
  );
}

export function Gauge({ value, size = 120, color = '#10b981', label }: { value: number; size?: number; color?: string; label?: string }) {
  const r = (size - 16) / 2;
  const c = Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <path d={`M 8 ${size / 2} A ${r} ${r} 0 0 1 ${size - 8} ${size / 2}`} fill="none" stroke="#16233c" strokeWidth="10" strokeLinecap="round" />
        <path
          d={`M 8 ${size / 2} A ${r} ${r} 0 0 1 ${size - 8} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * c} ${c}`}
        />
      </svg>
      <div className="-mt-6 text-center">
        <div className="text-2xl font-bold tabular text-white">{value}%</div>
        {label && <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>}
      </div>
    </div>
  );
}

export function Bars({ data, color = '#10b981', height = 80 }: { data: { label: string; value: number }[]; color?: string; height?: number }) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
          <div className="w-full rounded-t-md relative transition-all" style={{ height: `${(d.value / max) * (height - 18)}px`, background: `linear-gradient(180deg, ${color}, ${color}40)` }}>
            <div className="opacity-0 group-hover:opacity-100 transition absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap">{d.value}</div>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AreaChart({ data, height = 120, color = '#10b981', color2 = '#f59e0b' }: { data: { month: string; supply: number; demand: number; risk: number }[]; height?: number; color?: string; color2?: string }) {
  const width = 320;
  const max = Math.max(...data.flatMap((d) => [d.supply, d.demand])) + 20;
  const step = width / (data.length - 1);
  const y = (v: number) => height - (v / max) * (height - 20) - 10;
  const supplyPath = `M ${data.map((d, i) => `${i * step},${y(d.supply)}`).join(' L ')}`;
  const demandPath = `M ${data.map((d, i) => `${i * step},${y(d.demand)}`).join(' L ')}`;
  const supplyArea = `${supplyPath} L ${width},${height} L 0,${height} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" y1={height * g} x2={width} y2={height * g} stroke="#16233c" strokeWidth="1" strokeDasharray="2 4" />
      ))}
      <path d={supplyArea} fill="url(#supplyGrad)" />
      <path d={supplyPath} fill="none" stroke={color} strokeWidth="2" />
      <path d={demandPath} fill="none" stroke={color2} strokeWidth="2" strokeDasharray="4 3" />
      {data.map((d, i) => (
        <g key={i}>
          <circle cx={i * step} cy={y(d.supply)} r="2.5" fill={color} />
          <text x={i * step} y={height - 2} fontSize="9" fill="#5a7193" textAnchor="middle" fontFamily="JetBrains Mono">{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

export function Badge({ level }: { level: string }) {
  const map: Record<string, string> = {
    Low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    High: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    Critical: 'bg-red-500/15 text-red-300 border-red-500/30',
    Optimal: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Delayed: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    Ready: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Draft: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    Scheduled: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    Simulated: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    Recommended: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Deployed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[level] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>{level}</span>;
}

export function SectionTitle({ icon: Icon, title, sub, action }: { icon: React.ElementType; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
          {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}
