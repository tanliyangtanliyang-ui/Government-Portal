import { useState } from 'react';
import * as Icons from 'lucide-react';
import {
  nationalKpis, riskAlerts, aiRecommendations, weatherAlerts, farmerMetrics,
  farmerRegionStats, carbonMetrics, policyScenarios, logisticsRoutes, foodWasteByStage,
  reports, supplyTrend, produceMix, malaysiaStates,
} from '@/lib/data';
import { Sparkline, Donut, Gauge, Bars, Badge, SectionTitle, AreaChart } from './ui';
import { MalaysiaMap } from './MalaysiaMap';

const accentMap: Record<string, { text: string; bg: string; stroke: string; hex: string }> = {
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', stroke: '#34d399', hex: '#10b981' },
  teal: { text: 'text-teal-400', bg: 'bg-teal-500/10', stroke: '#2dd4bf', hex: '#2dd4bf' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', stroke: '#22d3ee', hex: '#22d3ee' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', stroke: '#f59e0b', hex: '#f59e0b' },
};

function KpiCard({ kpi }: { kpi: typeof nationalKpis[number] }) {
  const a = accentMap[kpi.accent];
  return (
    <div className="panel panel-hover p-4 animate-in flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{kpi.label}</span>
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${a.bg} ${a.text}`}>+{kpi.delta}%</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold tabular text-white glow-text">{kpi.value}<span className="text-sm text-slate-500 ml-1 font-normal">{kpi.unit}</span></div>
          <div className="text-[10px] text-slate-500 mt-0.5">{kpi.deltaLabel}</div>
        </div>
        <Sparkline data={kpi.spark} color={a.stroke} width={90} height={32} />
      </div>
    </div>
  );
}

/* ============ OVERVIEW ============ */
export function OverviewView() {
  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {nationalKpis.map((k) => <KpiCard key={k.id} kpi={k} />)}
      </div>

      {/* Map + Risk */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="panel p-4 xl:col-span-2">
          <SectionTitle icon={Icons.Map} title="National Supply Chain Digital Map" sub="Real-time hub, route & demand visualization" action={<Badge level="Live" />} />
          <div className="h-[420px]"><MalaysiaMap /></div>
        </div>
        <div className="panel p-4 flex flex-col">
          <SectionTitle icon={Icons.ShieldAlert} title="Food Supply Risk Monitoring" sub="AI-predicted disruption alerts" />
          <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
            {riskAlerts.map((r) => (
              <div key={r.id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3 hover:border-slate-600 transition">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-white">{r.region}</span>
                  <Badge level={r.level} />
                </div>
                <div className="text-[11px] text-slate-400 mb-1"><span className="text-slate-500">Cause:</span> {r.cause}</div>
                <div className="text-[11px] text-slate-400"><span className="text-slate-500">Impact:</span> {r.impact}</div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/40">
                  <span className="text-[9px] font-mono text-slate-500">ETA {r.eta}</span>
                  <span className="text-[9px] font-mono text-emerald-400">{r.confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI + Weather + Supply trend */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Sparkles} title="AI Logistics Intelligence" sub="Recommendation engine" />
          <div className="space-y-3">
            {aiRecommendations.slice(0, 2).map((rec) => (
              <div key={rec.id} className="rounded-lg bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Icons.Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">AI Recommendation · {rec.region}</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">{rec.problem}</p>
                <div className="text-[11px] text-emerald-300 mb-2"><span className="font-semibold">Action:</span> {rec.action}</div>
                <div className="flex flex-wrap gap-1.5">
                  {rec.impact.map((im, i) => (
                    <span key={i} className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${im.positive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {im.label} {im.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-4">
          <SectionTitle icon={Icons.CloudRain} title="Climate & Weather Intelligence" sub="Disaster prediction & advisory" />
          <div className="space-y-3">
            {weatherAlerts.map((w) => {
              const Icon = w.severity === 'Low' ? Icons.Sun : Icons.CloudRain;
              return (
                <div key={w.id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${w.severity === 'Low' ? 'text-amber-400' : 'text-cyan-400'}`} />
                      <span className="text-sm font-semibold text-white">{w.title}</span>
                    </div>
                    <Badge level={w.severity} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {w.areas.map((ar) => <span key={ar} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300">{ar}</span>)}
                  </div>
                  <p className="text-[11px] text-slate-400">{w.recommendation}</p>
                  <div className="text-[9px] font-mono text-slate-500 mt-1.5">{w.window}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel p-4">
          <SectionTitle icon={Icons.TrendingUp} title="Supply vs Demand Trend" sub="National, last 7 months" />
          <div className="flex items-center gap-4 mb-2 text-[10px] font-mono">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400" /> Supply</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-t border-dashed border-amber-400" /> Demand</span>
          </div>
          <AreaChart data={supplyTrend} height={140} />
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800">
            <div><div className="text-[9px] uppercase text-slate-500">Avg Supply</div><div className="text-sm font-bold tabular text-emerald-400">245k t</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Avg Demand</div><div className="text-sm font-bold tabular text-amber-400">228k t</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Reserve</div><div className="text-sm font-bold tabular text-white">+7.4%</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ SUPPLY ============ */
export function SupplyView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.PieChart} title="Produce Mix" sub="National composition" />
          <div className="flex items-center gap-4">
            <Donut segments={produceMix} centerLabel="2.8M" centerSub="tonnes" />
            <div className="flex-1 space-y-1.5">
              {produceMix.map((p) => (
                <div key={p.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} />{p.label}</span>
                  <span className="font-mono text-slate-400">{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel p-4 lg:col-span-2">
          <SectionTitle icon={Icons.TrendingUp} title="Supply-Demand Balance" sub="7-month rolling forecast" />
          <AreaChart data={supplyTrend} height={180} />
          <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-800">
            <div><div className="text-[9px] uppercase text-slate-500">Current Supply</div><div className="text-base font-bold tabular text-emerald-400">285k t</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Current Demand</div><div className="text-base font-bold tabular text-amber-400">265k t</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Self-Sufficiency</div><div className="text-base font-bold tabular text-white">107.5%</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Risk Index</div><div className="text-base font-bold tabular text-amber-400">29 / Low</div></div>
          </div>
        </div>
      </div>

      <div className="panel p-4">
        <SectionTitle icon={Icons.ShieldAlert} title="Risk Monitoring Console" sub="All active supply risk predictions" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {riskAlerts.map((r) => (
            <div key={r.id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">{r.region}</span>
                <Badge level={r.level} />
              </div>
              <div className="text-[11px] text-slate-400 mb-1">{r.cause}</div>
              <div className="text-[11px] text-slate-500 mb-2">{r.impact}</div>
              <div className="flex items-center justify-between">
                <div className="flex-1 h-1 rounded-full bg-slate-800 overflow-hidden mr-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${r.confidence}%` }} />
                </div>
                <span className="text-[9px] font-mono text-slate-400">{r.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ LOGISTICS ============ */
export function LogisticsView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Gauge} title="Network Utilization" sub="Hub capacity index" />
          <div className="flex flex-col items-center py-2">
            <Gauge value={74} label="Avg Capacity" color="#10b981" size={150} />
            <div className="grid grid-cols-3 gap-3 w-full mt-3 text-center">
              <div><div className="text-lg font-bold tabular text-emerald-400">92</div><div className="text-[9px] uppercase text-slate-500">Optimal</div></div>
              <div><div className="text-lg font-bold tabular text-amber-400">21</div><div className="text-[9px] uppercase text-slate-500">Delayed</div></div>
              <div><div className="text-lg font-bold tabular text-red-400">4</div><div className="text-[9px] uppercase text-slate-500">Critical</div></div>
            </div>
          </div>
        </div>
        <div className="panel p-4 lg:col-span-2">
          <SectionTitle icon={Icons.Sparkles} title="AI Logistics Recommendations" sub="Optimization engine" />
          <div className="space-y-3">
            {aiRecommendations.map((rec) => (
              <div key={rec.id} className="rounded-lg bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icons.Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">{rec.region}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">{rec.confidence}% confidence</span>
                </div>
                <p className="text-xs text-slate-300 mb-1.5">{rec.problem}</p>
                <div className="text-[11px] text-emerald-300 mb-2"><span className="font-semibold">Suggested:</span> {rec.action}</div>
                <div className="flex flex-wrap gap-1.5">
                  {rec.impact.map((im, i) => (
                    <span key={i} className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${im.positive ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                      {im.label} {im.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel p-4">
        <SectionTitle icon={Icons.Truck} title="Active Logistics Routes" sub="Live corridor monitoring" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="text-left font-medium py-2 px-3">Route</th>
                <th className="text-left font-medium py-2 px-3">Produce</th>
                <th className="text-left font-medium py-2 px-3">Load</th>
                <th className="text-left font-medium py-2 px-3">Efficiency</th>
                <th className="text-left font-medium py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {logisticsRoutes.map((r) => (
                <tr key={r.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                  <td className="py-2.5 px-3 text-slate-200 text-xs">{r.origin} <span className="text-slate-600">→</span> {r.destination}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-xs">{r.produce}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${r.load}%` }} /></div>
                      <span className="text-[10px] font-mono text-slate-400">{r.load}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className={`h-full ${r.efficiency > 75 ? 'bg-emerald-400' : r.efficiency > 55 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${r.efficiency}%` }} /></div>
                      <span className="text-[10px] font-mono text-slate-400">{r.efficiency}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3"><Badge level={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============ REGIONAL ============ */
export function RegionalView() {
  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <SectionTitle icon={Icons.Map} title="Regional Analysis Map" sub="State-by-state agricultural performance" />
        <div className="h-[420px]"><MalaysiaMap /></div>
      </div>
      <div className="panel p-4">
        <SectionTitle icon={Icons.BarChart3} title="State Comparison" sub="Production & hub capacity" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Production (k tonnes)</div>
            <Bars data={malaysiaStates.slice(0, 10).map((s) => ({ label: s.name.slice(0, 3), value: s.production }))} color="#10b981" height={120} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Hub Capacity (%)</div>
            <Bars data={malaysiaStates.slice(0, 10).map((s) => ({ label: s.name.slice(0, 3), value: s.hubCapacity }))} color="#22d3ee" height={120} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ FARMER ============ */
export function FarmerView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {farmerMetrics.map((m, i) => {
          const Icon = [Icons.UserPlus, Icons.Wallet, Icons.Smartphone, Icons.GraduationCap][i];
          return (
            <div key={m.label} className="panel panel-hover p-4 animate-in">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">↑{m.delta}%</span>
              </div>
              <div className="text-2xl font-bold tabular text-white">{m.value}</div>
              <div className="text-[11px] text-slate-400">{m.label}</div>
              <div className="text-[10px] text-slate-500 mt-1">{m.detail}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Users} title="Farmer Distribution by State" sub="Top 6 regions" />
          <div className="space-y-2.5">
            {farmerRegionStats.map((s) => {
              const max = Math.max(...farmerRegionStats.map((x) => x.farmers));
              return (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="text-xs text-slate-300 w-16">{s.state}</span>
                  <div className="flex-1 h-6 rounded-md bg-slate-800/40 overflow-hidden relative">
                    <div className="h-full rounded-md bg-gradient-to-r from-emerald-500/40 to-emerald-400 flex items-center justify-end pr-2" style={{ width: `${(s.farmers / max) * 100}%` }}>
                      <span className="text-[10px] font-mono text-white">{s.farmers.toLocaleString()}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 w-10 text-right">{s.adoption}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel p-4">
          <SectionTitle icon={Icons.LineChart} title="Income & Adoption Trend" sub="6-month progression" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase text-slate-500 mb-2">Avg Income (RM)</div>
              <Bars data={farmerRegionStats.slice(0, 6).map((s) => ({ label: s.state.slice(0, 3), value: s.income }))} color="#34d399" height={140} />
            </div>
            <div>
              <div className="text-[10px] uppercase text-slate-500 mb-2">Digital Adoption</div>
              <Bars data={farmerRegionStats.slice(0, 6).map((s) => ({ label: s.state.slice(0, 3), value: s.adoption }))} color="#22d3ee" height={140} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
            <div><div className="text-[9px] uppercase text-slate-500">Total Farmers</div><div className="text-base font-bold tabular text-white">28,560</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Avg Income</div><div className="text-base font-bold tabular text-emerald-400">RM 4,820</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Adoption</div><div className="text-base font-bold tabular text-cyan-400">78%</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ WASTE ============ */
export function WasteView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Recycle} title="National Waste Reduction" sub="Cumulative impact" />
          <div className="flex flex-col items-center py-2">
            <Gauge value={24} label="Reduction" color="#f59e0b" size={150} />
            <div className="grid grid-cols-2 gap-3 w-full mt-3">
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-center">
                <div className="text-xl font-bold tabular text-amber-400">672k</div>
                <div className="text-[9px] uppercase text-slate-500">tonnes saved</div>
              </div>
              <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3 text-center">
                <div className="text-xl font-bold tabular text-emerald-400">RM 84M</div>
                <div className="text-[9px] uppercase text-slate-500">value recovered</div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel p-4 lg:col-span-2">
          <SectionTitle icon={Icons.BarChart3} title="Waste by Supply Chain Stage" sub="Current % vs reduction achieved" />
          <div className="space-y-3">
            {foodWasteByStage.map((s) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300">{s.stage}</span>
                  <span className="font-mono text-slate-400">{s.waste}% waste · <span className="text-emerald-400">-{s.reduction}%</span></span>
                </div>
                <div className="flex gap-1 h-2">
                  <div className="flex-1 rounded-md bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${s.waste * 3}%` }} />
                  </div>
                  <div className="flex-1 rounded-md bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${s.reduction * 2}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ CLIMATE ============ */
export function ClimateView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.CloudRain} title="Weather Alerts" sub="Active advisories" />
          <div className="space-y-3">
            {weatherAlerts.map((w) => {
              const Icon = w.severity === 'Low' ? Icons.Sun : Icons.CloudRain;
              return (
                <div key={w.id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${w.severity === 'Low' ? 'text-amber-400' : 'text-cyan-400'}`} />
                      <span className="text-sm font-semibold text-white">{w.title}</span>
                    </div>
                    <Badge level={w.severity} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {w.areas.map((ar) => <span key={ar} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-300">{ar}</span>)}
                  </div>
                  <p className="text-[11px] text-slate-400">{w.recommendation}</p>
                  <div className="text-[9px] font-mono text-slate-500 mt-1.5">Window: {w.window}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel p-4">
          <SectionTitle icon={Icons.Thermometer} title="Climate Risk Index" sub="Regional exposure" />
          <div className="space-y-2.5">
            {malaysiaStates.filter((s) => s.risk !== 'Low').map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs text-slate-300 w-20">{s.name}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${s.risk === 'High' ? 78 : s.risk === 'Medium' ? 52 : 25}%`, background: s.risk === 'High' ? '#fb923c' : '#f59e0b' }} />
                </div>
                <Badge level={s.risk} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
            <div><div className="text-[9px] uppercase text-slate-500">Monsoon Risk</div><div className="text-base font-bold tabular text-orange-400">High</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Flood Zones</div><div className="text-base font-bold tabular text-white">3</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Heat Advisory</div><div className="text-base font-bold tabular text-amber-400">2</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ CARBON ============ */
export function CarbonView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {carbonMetrics.map((m, i) => {
          const Icon = [Icons.Leaf, Icons.Route, Icons.Package, Icons.ThermometerSnowflake][i];
          return (
            <div key={m.label} className="panel panel-hover p-4 animate-in">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">↑{m.trend}%</span>
              </div>
              <div className="text-2xl font-bold tabular text-white glow-text">{m.value}</div>
              <div className="text-[11px] text-slate-400">{m.label}</div>
              <div className="text-[10px] text-slate-500 mt-1">{m.detail}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Leaf} title="Green Logistics Performance" sub="Carbon reduction trajectory" />
          <AreaChart data={supplyTrend.map((s) => ({ month: s.month, supply: s.supply - 40, demand: s.demand - 50, risk: 0 }))} height={160} color="#10b981" color2="#22d3ee" />
          <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800">
            <div><div className="text-[9px] uppercase text-slate-500">CO₂ Saved</div><div className="text-base font-bold tabular text-emerald-400">42k t</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Routes</div><div className="text-base font-bold tabular text-cyan-400">18,500</div></div>
            <div><div className="text-[9px] uppercase text-slate-500">Containers</div><div className="text-base font-bold tabular text-white">320k</div></div>
          </div>
        </div>
        <div className="panel p-4">
          <SectionTitle icon={Icons.Award} title="Sustainability Score" sub="National composite" />
          <div className="flex items-center gap-6">
            <Gauge value={87} label="Score" color="#10b981" size={150} />
            <div className="flex-1 space-y-2">
              {[
                { l: 'Carbon Reduction', v: 92 }, { l: 'Route Efficiency', v: 84 },
                { l: 'Container Reuse', v: 88 }, { l: 'Cold-chain Energy', v: 81 },
              ].map((x) => (
                <div key={x.l}>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5"><span>{x.l}</span><span className="font-mono">{x.v}</span></div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: `${x.v}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ POLICY ============ */
export function PolicyView() {
  const [selected, setSelected] = useState(policyScenarios[0]);
  return (
    <div className="space-y-4">
      <div className="panel p-4">
        <SectionTitle icon={Icons.FlaskConical} title="Policy Simulation Module" sub="AI-predicted impact of policy scenarios" action={<Badge level="AI" />} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {policyScenarios.map((p) => (
              <button key={p.id} onClick={() => setSelected(p)} className={`w-full text-left rounded-lg p-3 border transition ${selected.id === p.id ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-800/30 border-slate-700/40 hover:border-slate-600'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-white">{p.name}</span>
                  <Badge level={p.status} />
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-2">{p.description}</p>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2 rounded-lg bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/20 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">AI Prediction</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{selected.name}</h3>
            <p className="text-xs text-slate-400 mb-4">{selected.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selected.predictions.map((p, i) => (
                <div key={i} className="rounded-lg bg-slate-900/40 border border-slate-700/40 p-3">
                  <div className={`text-2xl font-bold tabular ${p.positive ? 'text-emerald-400' : 'text-amber-400'}`}>{p.value}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{p.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Confidence</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400" style={{ width: '83%' }} /></div>
                  <span className="text-xs font-mono text-emerald-400">83%</span>
                </div>
              </div>
              <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500 text-slate-900 hover:bg-emerald-400 transition flex items-center gap-1.5">
                <Icons.Rocket className="w-3.5 h-3.5" /> Deploy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ REPORTS ============ */
export function ReportsView() {
  return (
    <div className="panel p-4">
      <SectionTitle icon={Icons.FileText} title="Reports" sub="Generated intelligence & policy documents" action={<button className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-900 hover:bg-emerald-400 transition flex items-center gap-1.5"><Icons.Plus className="w-3.5 h-3.5" /> New Report</button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {reports.map((r) => {
          const Icon = Icons.FileText;
          return (
            <div key={r.id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-4 panel-hover">
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-slate-700/40 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-emerald-400" />
                </div>
                <Badge level={r.status} />
              </div>
              <h4 className="text-sm font-semibold text-white leading-snug mb-1">{r.title}</h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span>{r.category}</span><span>·</span><span>{r.period}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/40">
                <span className="text-[10px] text-slate-500">Updated {r.updated}</span>
                <button className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><Icons.Download className="w-3 h-3" /> Export</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
