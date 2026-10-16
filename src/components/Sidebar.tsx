import { navItems, type NavId } from '@/lib/data';
import * as Icons from 'lucide-react';

export function Sidebar({ active, onChange }: { active: NavId; onChange: (id: NavId) => void }) {
  return (
    <aside className="w-60 shrink-0 h-full flex flex-col bg-[#080d18] border-r border-slate-800/60">
      <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-800/60">
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Icons.Sprout className="w-5 h-5 text-white" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#080d18]">
            <span className="pulse-ring absolute inset-0 text-emerald-400" />
          </span>
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-tight">FarmXpress</div>
          <div className="text-[10px] text-emerald-400/70 font-mono uppercase tracking-widest">Gov Portal</div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <div className="text-[9px] font-mono uppercase tracking-widest text-slate-600 px-3 mb-2">Command Center</div>
        {navItems.map((item) => {
          const Icon = (Icons as any)[item.icon] as Icons.LucideIcon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-r-lg text-sm transition-all mb-0.5 ${isActive ? 'nav-active' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
              <Icon className={`nav-icon w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span className="font-medium">{item.label}</span>
              {isActive && <Icons.ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800/60">
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Icons.ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">System Status</span>
          </div>
          <div className="text-xs text-slate-300">All systems operational</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="status-dot text-emerald-400" style={{ background: '#34d399' }} />
            <span className="text-[10px] font-mono text-slate-500">99.98% uptime · 42ms</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
