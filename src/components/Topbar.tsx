import { useEffect, useState } from 'react';
import { Calendar, Globe2, Database } from 'lucide-react';
import { API } from '@/lib/gov';

export function Topbar({ title, sub }: { title: string; sub: string }) {
  const [now, setNow] = useState(new Date());
  const [api, setApi] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => fetch(`${API}/health`).then((r) => setApi(r.ok)).catch(() => setApi(false));
    check(); const id = setInterval(check, 20_000); return () => clearInterval(id);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-16 shrink-0 px-6 flex items-center justify-between border-b border-slate-800/60 bg-[#080d18]/80 backdrop-blur">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">PILOT NETWORK</span>
        </div>
        <p className="text-[11px] text-slate-500">{sub}</p>
      </div>

      <div className="flex items-center gap-3">

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {now.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
          <span className="text-slate-600">·</span>
          {now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/80 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/20">
          <Database className="w-3.5 h-3.5" />
          {api === null ? 'Checking API…' : api ? 'FarmXpress API connected' : 'API not reachable'}
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">GA</div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-white leading-tight">Government analyst</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1"><Globe2 className="w-2.5 h-2.5" /> Read-only view</div>
          </div>
        </div>
      </div>
    </header>
  );
}
