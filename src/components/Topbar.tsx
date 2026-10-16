import { useEffect, useState } from 'react';
import { Search, Bell, Calendar, Globe2, Cpu } from 'lucide-react';

export function Topbar({ title, sub }: { title: string; sub: string }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header className="h-16 shrink-0 px-6 flex items-center justify-between border-b border-slate-800/60 bg-[#080d18]/80 backdrop-blur">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">LIVE</span>
        </div>
        <p className="text-[11px] text-slate-500">{sub}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 w-64">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input placeholder="Search regions, hubs, farmers…" className="bg-transparent text-xs text-slate-300 placeholder:text-slate-600 outline-none w-full" />
          <kbd className="text-[9px] font-mono text-slate-600 border border-slate-700 rounded px-1">⌘K</kbd>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          {now.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' })}
          <span className="text-slate-600">·</span>
          {now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>

        <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400/80 px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/20">
          <Cpu className="w-3.5 h-3.5" />
          AI Engine: Active
        </div>

        <button className="relative w-9 h-9 rounded-lg bg-slate-800/40 border border-slate-700/50 flex items-center justify-center hover:border-emerald-500/40 transition">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">MA</div>
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-white leading-tight">Ministry of Agriculture</div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1"><Globe2 className="w-2.5 h-2.5" /> Putrajaya, MY</div>
          </div>
        </div>
      </div>
    </header>
  );
}
