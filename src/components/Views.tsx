import { useState, type ReactNode } from 'react';
import * as Icons from 'lucide-react';
import { useGov, t, kgf, pc, rm, mon, day, period, downloadCsv, type Gov } from '@/lib/gov';
import { Sparkline, Donut, Gauge, Bars, Badge, SectionTitle, AreaChart } from './ui';
import { MalaysiaMap, BALANCE } from './MalaysiaMap';

// Every figure comes from GET /v1/government/insights: the FarmXpress pilot network in the v2 dataset (synthetic,
// Jan-Jun 2026) plus records created in the portals. Calculated figures say how; nothing here is a forecast.
const COLORS = ['#10b981', '#22d3ee', '#f59e0b', '#fb923c', '#a78bfa', '#3b82f6', '#f472b6', '#64748b'];

function Shell({ children }: { children: (g: Gov) => ReactNode }) {
  const { data, error } = useGov();
  if (error) return <div role="alert" className="panel p-4 text-sm text-red-300">Network figures unavailable: {error}. Is the FarmXpress API running?</div>;
  if (!data) return <div role="status" className="panel p-6 text-sm text-slate-400 flex items-center gap-2"><Icons.Loader2 className="w-4 h-4 animate-spin" /> Loading network figures…</div>;
  return <div className="space-y-4">{children(data)}</div>;
}
function Scope({ g }: { g: Gov }) {
  return <p className="text-[11px] text-slate-500 flex items-start gap-1.5" data-testid="gov-scope"><Icons.Info className="w-3.5 h-3.5 shrink-0 mt-px" /> {g.scope} Dataset period {period(g)}.</p>;
}
function Kpi({ label, value, hint, spark, color = '#34d399', testId }: { label: string; value: string; hint: string; spark?: number[]; color?: string; testId?: string }) {
  return (
    <div className="panel panel-hover p-4 flex flex-col gap-2" data-testid={testId}>
      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-medium">{label}</span>
      <div className="flex items-end justify-between gap-2">
        <div><div className="text-2xl font-bold tabular text-white">{value}</div><div className="text-[10px] text-slate-500 mt-0.5">{hint}</div></div>
        {spark && spark.length > 1 && <Sparkline data={spark} color={color} width={90} height={32} />}
      </div>
    </div>
  );
}
function Stat({ label, value, tone = 'text-white' }: { label: string; value: string; tone?: string }) {
  return <div><div className="text-[9px] uppercase text-slate-500">{label}</div><div className={`text-base font-bold tabular ${tone}`}>{value}</div></div>;
}
function Signals({ g, limit }: { g: Gov; limit?: number }) {
  const list = limit ? g.signals.slice(0, limit) : g.signals;
  if (!list.length) return <p className="text-xs text-slate-500">No rule is triggered by the current records.</p>;
  return (
    <div className="space-y-2.5" data-testid="gov-signals">
      {list.map((s, i) => (
        <div key={i} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3">
          <div className="flex items-center justify-between mb-1 gap-2"><span className="text-sm font-semibold text-white">{s.title}</span><Badge level={s.level} /></div>
          <div className="text-[11px] text-slate-300">{s.area} · {s.detail}</div>
          <div className="text-[10px] text-slate-500 mt-1">Rule: {s.rule}</div>
        </div>
      ))}
    </div>
  );
}
const trend = (g: Gov) => g.monthly.map((m) => ({ month: mon(m.month), supply: Math.round(m.supply_kg / 1000), demand: Math.round(m.demand_kg / 1000), risk: 0 }));

/* ============ OVERVIEW ============ */
export function OverviewView() {
  return <Shell>{(g) => <>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" data-testid="gov-kpis">
      <Kpi label="Produce supplied" value={t(g.kpis.supply_kg)} hint={`${g.totals.batches.toLocaleString()} batches from ${g.totals.farmers} farmers`} spark={g.monthly.map((m) => m.supply_kg)} />
      <Kpi label="Orders filled" value={pc(g.kpis.fill_rate_pct)} hint={`${t(g.kpis.delivered_kg)} delivered of ${t(g.totals.demand_kg)} ordered`} spark={g.monthly.map((m) => m.delivered_kg)} color="#22d3ee" />
      <Kpi label="On-time deliveries" value={pc(g.kpis.on_time_pct)} hint="failed or rejected stops count as missed (KPI K01)" spark={g.monthly.map((m) => m.on_time_pct ?? 0)} color="#2dd4bf" />
      <Kpi label="Produce lost" value={pc(g.kpis.loss_pct_of_received)} hint={`${t(g.loss.total_kg)} of ${t(g.totals.received_kg)} received at hubs`} spark={g.monthly.map((m) => m.loss_kg)} color="#f59e0b" />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="panel p-4 xl:col-span-2">
        <SectionTitle icon={Icons.Map} title="Network Map" sub="Where produce is grown, consolidated and delivered" action={<Badge level="Records" />} />
        <div className="h-[420px]"><MalaysiaMap data={g} /></div>
      </div>
      <div className="panel p-4 flex flex-col">
        <SectionTitle icon={Icons.ShieldAlert} title="Supply Chain Signals" sub="Fixed rules on the records (no prediction)" />
        <div className="overflow-y-auto pr-1 flex-1"><Signals g={g} /></div>
      </div>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
      <div className="panel p-4">
        <SectionTitle icon={Icons.Activity} title="Live Portal Activity" sub="Records created in the FarmXpress portals" />
        <div className="grid grid-cols-2 gap-3" data-testid="gov-live">
          <Stat label="Produce registered" value={String(g.live.produce_registrations)} /><Stat label="Delivery requests" value={String(g.live.delivery_requests)} />
          <Stat label="Buyer orders" value={String(g.live.orders)} /><Stat label="Trips dispatched" value={String(g.live.trips)} />
          <Stat label="Proofs of delivery" value={String(g.live.proofs_of_delivery)} /><Stat label="Cargo temperature alerts" value={String(g.live.cargo_alerts)} tone={g.live.cargo_alerts ? 'text-amber-400' : 'text-white'} />
        </div>
      </div>
      <div className="panel p-4">
        <SectionTitle icon={Icons.CloudRain} title="Weather and Delays" sub="Simulated weather inputs in the dataset" />
        <div className="space-y-2">
          {g.weather.delay_by_weather.map((w) => (
            <div key={w.condition} className="flex items-center justify-between text-xs">
              <span className="text-slate-300 capitalize">{w.condition.replace('_', ' ')}</span>
              <span className="font-mono text-slate-400">{w.trips} trips · avg delay {w.avg_delay_min} min</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-3">{g.weather.note}</p>
      </div>
      <div className="panel p-4">
        <SectionTitle icon={Icons.TrendingUp} title="Supply vs Demand" sub="Tonnes per month (harvest vs orders)" />
        <div className="flex items-center gap-4 mb-2 text-[10px] font-mono">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400" /> Supply</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-t border-dashed border-amber-400" /> Demand</span>
        </div>
        <AreaChart data={trend(g)} height={140} />
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800">
          <Stat label="Supply" value={t(g.totals.supply_kg)} tone="text-emerald-400" /><Stat label="Demand" value={t(g.totals.demand_kg)} tone="text-amber-400" />
          <Stat label="Supply / demand" value={pc(Math.round((g.totals.supply_kg / g.totals.demand_kg) * 1000) / 10)} />
        </div>
      </div>
    </div>
    <Scope g={g} />
  </>}</Shell>;
}

/* ============ SUPPLY ============ */
export function SupplyView() {
  return <Shell>{(g) => {
    const last = g.monthly[g.monthly.length - 1];
    return <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.PieChart} title="Produce Mix" sub="Share of kg supplied" />
          <div className="flex items-center gap-4">
            <Donut segments={g.produce_mix.map((p, i) => ({ label: p.name, value: p.kg, color: COLORS[i % COLORS.length] }))} centerLabel={t(g.totals.supply_kg)} centerSub="supplied" />
            <div className="flex-1 space-y-1.5">
              {g.produce_mix.map((p, i) => (
                <div key={p.product_id} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />{p.name}</span>
                  <span className="font-mono text-slate-400">{pc(p.share_pct)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel p-4 lg:col-span-2">
          <SectionTitle icon={Icons.TrendingUp} title="Supply-Demand Balance" sub="Tonnes per month, recorded" />
          <AreaChart data={trend(g)} height={180} />
          <div className="grid grid-cols-4 gap-3 mt-3 pt-3 border-t border-slate-800">
            <Stat label={`Supply ${mon(last.month)}`} value={t(last.supply_kg)} tone="text-emerald-400" />
            <Stat label={`Demand ${mon(last.month)}`} value={t(last.demand_kg)} tone="text-amber-400" />
            <Stat label="Orders filled (all)" value={pc(g.kpis.fill_rate_pct)} />
            <Stat label="Active farmers" value={`${last.active_farmers} / ${g.totals.farmers}`} />
          </div>
        </div>
      </div>
      <div className="panel p-4">
        <SectionTitle icon={Icons.ShieldAlert} title="Signal Console" sub="All rules triggered by the records" />
        <Signals g={g} />
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ LOGISTICS ============ */
export function LogisticsView() {
  return <Shell>{(g) => {
    const avgLoad = g.logistics.reduce((a, h) => a + (h.avg_load_pct_of_capacity ?? 0) * h.shipments, 0) / Math.max(1, g.logistics.reduce((a, h) => a + h.shipments, 0));
    return <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Gauge} title="Truck Load" sub="Loaded kg / vehicle capacity, average per trip" />
          <div className="flex flex-col items-center py-2">
            <Gauge value={Math.round(avgLoad)} label="Avg load" color="#10b981" size={150} />
            <div className="grid grid-cols-3 gap-3 w-full mt-3 text-center">
              <div><div className="text-lg font-bold tabular text-emerald-400">{g.totals.shipments.toLocaleString()}</div><div className="text-[9px] uppercase text-slate-500">Trips</div></div>
              <div><div className="text-lg font-bold tabular text-cyan-400">{g.totals.refrigerated_vehicles}/{g.totals.vehicles}</div><div className="text-[9px] uppercase text-slate-500">Refrigerated</div></div>
              <div><div className="text-lg font-bold tabular text-amber-400">{pc(g.sustainability.multi_stop_share_pct)}</div><div className="text-[9px] uppercase text-slate-500">Multi-stop</div></div>
            </div>
          </div>
        </div>
        <div className="panel p-4 lg:col-span-2">
          <SectionTitle icon={Icons.Warehouse} title="Hub Performance" sub="Per consolidation hub" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="gov-hubs">
              <thead><tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                {['Hub', 'Trips', 'Avg load', 'On time*', 'Avg delay', 'Temp alerts', 'Received', 'Delivered'].map((h) => <th key={h} className="text-left font-medium py-2 px-2">{h}</th>)}
              </tr></thead>
              <tbody>{g.logistics.map((h) => (
                <tr key={h.hub_id} className="border-b border-slate-800/50">
                  <td className="py-2 px-2 text-xs text-slate-200">{h.name}<div className="text-[10px] text-slate-500">{h.state}</div></td>
                  <td className="px-2 font-mono text-xs">{h.shipments}</td><td className="px-2 font-mono text-xs">{pc(h.avg_load_pct_of_capacity)}</td>
                  <td className="px-2 font-mono text-xs">{pc(h.on_time_pct)}</td><td className="px-2 font-mono text-xs">{h.avg_delay_min} min</td>
                  <td className="px-2 font-mono text-xs">{h.temp_alerts}</td><td className="px-2 font-mono text-xs">{t(h.received_kg)}</td><td className="px-2 font-mono text-xs">{t(h.delivered_kg)}</td>
                </tr>
              ))}</tbody>
            </table><p className="text-[10px] text-slate-500 mt-2">* On time = delivered or partially delivered by the requested time; failed or rejected stops count as missed (same rule as FarmXpress KPI K01).</p>
          </div>
          <p className="text-[10px] text-slate-500 mt-2">Route optimisation suggestions are made per trip in the Hub dispatch planner and Route Navigator, with their own explanations.</p>
        </div>
      </div>
      <div className="panel p-4">
        <SectionTitle icon={Icons.Truck} title="Latest Trips" sub="Most recent trips in the dataset" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="gov-trips">
            <thead><tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
              {['Trip', 'Hub', 'Planned', 'Stops', 'Load', 'Distance', 'Weather / traffic', 'Delay', 'Status'].map((h) => <th key={h} className="text-left font-medium py-2 px-2">{h}</th>)}
            </tr></thead>
            <tbody>{g.recent_trips.map((r) => (
              <tr key={r.shipment_id} className="border-b border-slate-800/50 text-xs">
                <td className="py-2 px-2 font-mono text-slate-200">{r.shipment_id}</td><td className="px-2">{r.hub_id}</td><td className="px-2">{day(r.planned_start_at)}</td>
                <td className="px-2 font-mono">{r.stops}</td>
                <td className="px-2"><div className="flex items-center gap-2"><div className="w-14 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, r.load_pct ?? 0)}%` }} /></div><span className="font-mono text-[10px]">{pc(r.load_pct)}</span></div></td>
                <td className="px-2 font-mono">{Math.round(r.km)} km</td><td className="px-2 capitalize">{(r.weather_input ?? '—').replace('_', ' ')} / {r.traffic_input ?? '—'}</td>
                <td className="px-2 font-mono">{r.delay_minutes ?? '—'} min</td><td className="px-2"><Badge level={r.status === 'completed' ? 'Ready' : r.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ REGIONAL ============ */
export function RegionalView() {
  return <Shell>{(g) => <>
    <div className="panel p-4">
      <SectionTitle icon={Icons.Map} title="Regional Map" sub="Supply and demand balance by state" />
      <div className="h-[420px]"><MalaysiaMap data={g} /></div>
    </div>
    <div className="panel p-4">
      <SectionTitle icon={Icons.BarChart3} title="State Comparison" sub="Tonnes, all months" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Produce supplied by farms in the state (t)</div>
          <Bars data={g.states.map((s) => ({ label: s.state.slice(0, 3), value: Math.round(s.production_kg / 1000) }))} color="#10b981" height={120} /></div>
        <div><div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Ordered by buyers in the state (t)</div>
          <Bars data={g.states.map((s) => ({ label: s.state.slice(0, 3), value: Math.round(s.demand_kg / 1000) }))} color="#f59e0b" height={120} /></div>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-xs" data-testid="gov-states">
          <thead><tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">{['State', 'Farms', 'Supplied', 'Buyers', 'Ordered', 'Delivered', 'On time*', 'Balance'].map((h) => <th key={h} className="text-left font-medium py-2 px-2">{h}</th>)}</tr></thead>
          <tbody>{g.states.map((s) => (
            <tr key={s.state} className="border-b border-slate-800/50"><td className="py-1.5 px-2 text-slate-200">{s.state}</td><td className="px-2 font-mono">{s.farms}</td><td className="px-2 font-mono">{t(s.production_kg)}</td>
              <td className="px-2 font-mono">{s.buyers}</td><td className="px-2 font-mono">{t(s.demand_kg)}</td><td className="px-2 font-mono">{t(s.delivered_kg)}</td><td className="px-2 font-mono">{pc(s.on_time_pct)}</td>
              <td className="px-2" style={{ color: BALANCE[s.balance].color }}>{BALANCE[s.balance].label}</td></tr>
          ))}</tbody>
        </table><p className="text-[10px] text-slate-500 mt-2">* On time = delivered or partially delivered by the requested time; failed or rejected stops count as missed (same rule as FarmXpress KPI K01).</p>
      </div>
    </div>
    <Scope g={g} />
  </>}</Shell>;
}

/* ============ FARMER ============ */
export function FarmerView() {
  return <Shell>{(g) => {
    const f = g.farmer;
    return <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" data-testid="gov-farmer-kpis">
        <Kpi label="Farmers in the network" value={String(f.total)} hint={`${g.totals.farms} farms · ${f.active_in_last_month} supplied in the last month`} spark={g.monthly.map((m) => m.active_farmers)} />
        <Kpi label="Cooperative members" value={pc(f.cooperative_share_pct)} hint={`${f.cooperative_members} farmers in ${f.cooperatives} cooperatives`} />
        <Kpi label="Sales value per farmer" value={rm(f.avg_sales_value_sen)} hint="allocated kg × order price, dataset period (not income)" color="#22d3ee" />
        <Kpi label="Using the Farmer portal" value={String(f.using_portal)} hint="farmers who registered produce in the portal" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Users} title="Farmers by State" sub="Where FarmXpress farms are" />
          <div className="space-y-2.5">
            {f.by_state.map((s) => {
              const max = Math.max(...f.by_state.map((x) => x.farmers));
              return (
                <div key={s.state} className="flex items-center gap-3">
                  <span className="text-xs text-slate-300 w-20">{s.state}</span>
                  <div className="flex-1 h-6 rounded-md bg-slate-800/40 overflow-hidden"><div className="h-full rounded-md bg-gradient-to-r from-emerald-500/40 to-emerald-400 flex items-center justify-end pr-2" style={{ width: `${(s.farmers / max) * 100}%` }}><span className="text-[10px] font-mono text-white">{s.farmers}</span></div></div>
                  <span className="text-[10px] font-mono text-slate-400 w-20 text-right">{s.farms} farms</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="panel p-4">
          <SectionTitle icon={Icons.LineChart} title="Supply and Quality by Month" sub="All farmers" />
          <div className="grid grid-cols-2 gap-4">
            <div><div className="text-[10px] uppercase text-slate-500 mb-2">Supplied (t)</div><Bars data={g.monthly.map((m) => ({ label: mon(m.month), value: Math.round(m.supply_kg / 1000) }))} color="#34d399" height={140} /></div>
            <div><div className="text-[10px] uppercase text-slate-500 mb-2">QC pass rate (%)</div><Bars data={g.monthly.map((m) => ({ label: mon(m.month), value: m.qc_pass_pct ?? 0 }))} color="#22d3ee" height={140} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
            <Stat label="Total farmers" value={String(f.total)} /><Stat label="Sales value (all)" value={rm(f.sales_value_sen)} tone="text-emerald-400" /><Stat label="QC pass rate" value={pc(f.qc_pass_pct)} tone="text-cyan-400" />
          </div>
        </div>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ WASTE ============ */
export function WasteView() {
  return <Shell>{(g) => {
    const L = g.loss; const stages = [
      { stage: 'Rejected at hub quality check', kg: L.qc_reject_kg }, { stage: 'Written off in hub stock (spoiled)', kg: L.spoiled_in_hub_kg },
      { stage: 'Rejected or not accepted at buyers', kg: L.rejected_at_delivery_kg }];
    const max = Math.max(1, ...stages.map((s) => s.kg));
    return <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Recycle} title="Recorded Losses" sub="Share of produce received at hubs" />
          <div className="flex flex-col items-center py-2">
            <Gauge value={g.kpis.loss_pct_of_received ?? 0} label="Lost" color="#f59e0b" size={150} />
            <div className="grid grid-cols-2 gap-3 w-full mt-3">
              <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-center"><div className="text-xl font-bold tabular text-amber-400">{t(L.total_kg)}</div><div className="text-[9px] uppercase text-slate-500">lost</div></div>
              <div className="rounded-lg bg-slate-500/5 border border-slate-500/20 p-3 text-center"><div className="text-xl font-bold tabular text-slate-200">{L.expired_batches}</div><div className="text-[9px] uppercase text-slate-500">batches expired</div></div>
            </div>
          </div>
        </div>
        <div className="panel p-4 lg:col-span-2">
          <SectionTitle icon={Icons.BarChart3} title="Losses by Supply Chain Stage" sub="Recorded kg" />
          <div className="space-y-3" data-testid="gov-loss">
            {stages.map((s) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between text-xs mb-1"><span className="text-slate-300">{s.stage}</span><span className="font-mono text-slate-400">{kgf(s.kg)} · {pc(Math.round((s.kg / g.totals.received_kg) * 1000) / 10)} of received</span></div>
                <div className="h-2 rounded-md bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${(s.kg / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-4"><div className="text-[10px] uppercase text-slate-500 mb-2">Lost per month (t)</div><Bars data={g.monthly.map((m) => ({ label: mon(m.month), value: Math.round(m.loss_kg / 100) / 10 }))} color="#f59e0b" height={90} /></div>
          <p className="text-[10px] text-slate-500 mt-3">The dataset has no "before FarmXpress" baseline, so this page reports losses and does not claim waste prevented. {L.expired_batches} batches ({t(L.expired_batches_kg)} declared at harvest) have the status "expired" in the dataset.</p>
        </div>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ CLIMATE ============ */
export function ClimateView() {
  return <Shell>{(g) => {
    const w = g.weather;
    return <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.CloudRain} title="Weather by Hub" sub="Days per condition (simulated input)" action={<Badge level="Simulated" />} />
          <div className="space-y-3">
            {g.logistics.map((h) => {
              const rows = w.days_by_hub.filter((x) => x.hub_id === h.hub_id); const total = rows.reduce((a, r) => a + r.days, 0);
              const latest = w.latest.find((x) => x.hub_id === h.hub_id);
              return (
                <div key={h.hub_id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-3">
                  <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-white">{h.name}</span><span className="text-[10px] text-slate-500">last input {latest ? `${latest.date}: ${latest.condition.replace('_', ' ')}` : '—'}</span></div>
                  <div className="flex h-2 rounded-full overflow-hidden">{rows.map((r, i) => <div key={r.condition} title={`${r.condition}: ${r.days} days`} style={{ width: `${(r.days / total) * 100}%`, background: COLORS[i + 1] }} />)}</div>
                  <div className="flex flex-wrap gap-2 mt-1.5">{rows.map((r, i) => <span key={r.condition} className="text-[10px] text-slate-400"><span className="inline-block w-2 h-2 rounded-sm mr-1" style={{ background: COLORS[i + 1] }} />{r.condition.replace('_', ' ')} {r.days}d</span>)}</div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-slate-500 mt-3">{w.note} No weather service is connected.</p>
        </div>
        <div className="panel p-4">
          <SectionTitle icon={Icons.Thermometer} title="Effect on Trips" sub="Recorded delay by route weather and traffic input" />
          <div className="space-y-2.5" data-testid="gov-weather-effect">
            {w.delay_by_weather.map((x) => (
              <div key={x.condition} className="flex items-center gap-3">
                <span className="text-xs text-slate-300 w-24 capitalize">{x.condition.replace('_', ' ')}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-orange-400" style={{ width: `${x.late_share_pct ?? 0}%` }} /></div>
                <span className="text-[10px] font-mono text-slate-400 w-44 text-right">{pc(x.late_share_pct)} &gt;30 min late · avg {x.avg_delay_min} min</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-800">
            {w.delay_by_traffic.map((x) => <Stat key={x.level} label={`${x.level} traffic`} value={`${x.avg_delay_min} min`} tone={x.level === 'heavy' ? 'text-orange-400' : 'text-white'} />)}
          </div>
        </div>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ CARBON ============ */
export function CarbonView() {
  return <Shell>{(g) => {
    const s = g.sustainability;
    return <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" data-testid="gov-carbon">
        <Kpi label="CO₂e avoided (estimate)" value={`${t(s.co2e_avoided_kg)}`} hint={`${s.co2e_factor?.co2e_kg_per_km ?? '—'} kg CO₂e per km`} spark={g.monthly.map((m) => m.co2e_avoided_kg)} />
        <Kpi label="Trips avoided" value={s.trips_avoided.toLocaleString()} hint={`${s.multi_stop_shipments} of ${s.shipments} trips served several buyers`} spark={g.monthly.map((m) => m.trips_avoided)} color="#22d3ee" />
        <Kpi label="Distance avoided (estimate)" value={`${s.km_avoided.toLocaleString()} km`} hint="outbound legs" color="#2dd4bf" />
        <Kpi label="Refrigerated fleet" value={`${g.totals.refrigerated_vehicles} of ${g.totals.vehicles}`} hint="vehicles able to carry chilled/cool produce" color="#f59e0b" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="panel p-4">
          <SectionTitle icon={Icons.Leaf} title="CO₂e Avoided per Month" sub="kg CO₂e (estimate)" />
          <Bars data={g.monthly.map((m) => ({ label: mon(m.month), value: m.co2e_avoided_kg }))} color="#10b981" height={150} />
        </div>
        <div className="panel p-4">
          <SectionTitle icon={Icons.Calculator} title="How It Is Calculated" sub="Same method as the Hub Sustainability Report" />
          <ol className="text-xs text-slate-300 list-decimal pl-5 space-y-1.5">{s.formulas.map((f) => <li key={f}>{f}</li>)}</ol>
          {s.co2e_factor && <p className="text-[10px] text-slate-500 mt-3">{s.co2e_factor.co2e_factor_source}</p>}
          <p className="text-[10px] text-slate-500 mt-1">No composite sustainability score is shown: the dataset has no agreed weighting for one.</p>
        </div>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ POLICY ============ */
export function PolicyView() {
  const [multi, setMulti] = useState<number | null>(null);
  const [spoil, setSpoil] = useState(20);
  return <Shell>{(g) => {
    const s = g.sustainability; const cur = s.multi_stop_share_pct ?? 0; const target = multi ?? Math.min(100, Math.round(cur + 10));
    const perMulti = s.multi_stop_shipments ? s.trips_avoided / s.multi_stop_shipments : 0; const co2PerTrip = s.trips_avoided ? s.co2e_avoided_kg / s.trips_avoided : 0;
    const extraMulti = Math.max(0, ((target - cur) / 100) * s.shipments); const extraTrips = Math.round(extraMulti * perMulti); const extraCo2 = Math.round(extraTrips * co2PerTrip);
    const kgSaved = Math.round((g.loss.spoiled_in_hub_kg * spoil) / 100);
    return <>
      <div className="panel p-4" data-testid="gov-policy">
        <SectionTitle icon={Icons.FlaskConical} title="Policy What-If Calculator" sub="Linear estimates from the pilot network's recorded averages" action={<Badge level="Calculated" />} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <h3 className="text-sm font-bold text-white">Encourage shared (multi-stop) delivery trips</h3>
            <p className="text-[11px] text-slate-400 mb-3">Today {pc(cur)} of {s.shipments.toLocaleString()} trips serve several buyers. Each such trip avoided {perMulti.toFixed(2)} separate trips on average.</p>
            <label className="text-xs text-slate-300 flex items-center gap-3">Target share <input type="range" min={Math.ceil(cur)} max={100} value={target} onChange={(e) => setMulti(Number(e.target.value))} className="flex-1" aria-label="Target multi-stop share" /><span className="font-mono w-12 text-right">{target}%</span></label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-lg bg-slate-900/40 border border-slate-700/40 p-3"><div className="text-2xl font-bold tabular text-emerald-400" data-testid="policy-trips">{extraTrips.toLocaleString()}</div><div className="text-[10px] text-slate-400">more trips avoided over the same period</div></div>
              <div className="rounded-lg bg-slate-900/40 border border-slate-700/40 p-3"><div className="text-2xl font-bold tabular text-emerald-400">{t(extraCo2)}</div><div className="text-[10px] text-slate-400">more CO₂e avoided (estimate)</div></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">= (target − current share) × trips × {perMulti.toFixed(2)} trips avoided per shared trip × {co2PerTrip.toFixed(1)} kg CO₂e per avoided trip.</p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="text-sm font-bold text-white">Reduce spoilage in hub stock</h3>
            <p className="text-[11px] text-slate-400 mb-3">Hubs wrote off {kgf(g.loss.spoiled_in_hub_kg)} as spoiled ({pc(Math.round((g.loss.spoiled_in_hub_kg / g.totals.received_kg) * 1000) / 10)} of produce received).</p>
            <label className="text-xs text-slate-300 flex items-center gap-3">Reduction <input type="range" min={0} max={100} step={5} value={spoil} onChange={(e) => setSpoil(Number(e.target.value))} className="flex-1" aria-label="Spoilage reduction" /><span className="font-mono w-12 text-right">{spoil}%</span></label>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="rounded-lg bg-slate-900/40 border border-slate-700/40 p-3"><div className="text-2xl font-bold tabular text-amber-400" data-testid="policy-kg">{t(kgSaved)}</div><div className="text-[10px] text-slate-400">produce kept sellable</div></div>
              <div className="rounded-lg bg-slate-900/40 border border-slate-700/40 p-3"><div className="text-2xl font-bold tabular text-amber-400">{pc(Math.round(((g.loss.total_kg - kgSaved) / g.totals.received_kg) * 1000) / 10)}</div><div className="text-[10px] text-slate-400">losses as share of received (was {pc(g.kpis.loss_pct_of_received)})</div></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">= recorded hub spoilage × reduction. Assumes the kept produce is sold; no price effect is modelled.</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 gap-3">
          <p className="text-[10px] text-slate-500">These are simple proportional estimates for discussion, not predictions or AI output. Real effects depend on routes, demand and costs not in the dataset.</p>
          <button type="button" disabled title="Not available in this prototype" className="text-xs font-semibold px-4 py-2 rounded-lg bg-emerald-500/30 text-slate-300 cursor-not-allowed flex items-center gap-1.5 shrink-0"><Icons.Rocket className="w-3.5 h-3.5" /> Deploy policy (not available in prototype)</button>
        </div>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}

/* ============ REPORTS ============ */
export function ReportsView() {
  return <Shell>{(g) => {
    const reports = [
      { id: 'monthly', title: 'Monthly network report', desc: 'Supply, demand, deliveries, on-time (failed or rejected = missed), losses, trips and CO₂e per month', rows: () => g.monthly },
      { id: 'states', title: 'State supply and demand', desc: 'Farms, buyers, kg supplied, ordered and delivered per state', rows: () => g.states },
      { id: 'hubs', title: 'Hub logistics performance', desc: 'Trips, load, on-time (failed or rejected = missed), delay and alerts per hub', rows: () => g.logistics.map(({ lat: _a, lng: _b, ...h }: any) => h) },
      { id: 'produce', title: 'Produce mix', desc: 'Kg and batches per product', rows: () => g.produce_mix },
      { id: 'losses', title: 'Recorded losses', desc: 'Losses by stage with kg and share of received', rows: () => [g.loss] },
      { id: 'signals', title: 'Supply chain signals', desc: 'Rules triggered by the records', rows: () => g.signals },
    ];
    return <>
      <div className="panel p-4">
        <SectionTitle icon={Icons.FileText} title="Reports" sub="Download the figures on these pages as CSV" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3" data-testid="gov-reports">
          {reports.map((r) => (
            <div key={r.id} className="rounded-lg bg-slate-800/30 border border-slate-700/40 p-4">
              <div className="flex items-start justify-between mb-2"><div className="w-9 h-9 rounded-lg bg-slate-700/40 flex items-center justify-center"><Icons.FileText className="w-4 h-4 text-emerald-400" /></div><Badge level="Ready" /></div>
              <h4 className="text-sm font-semibold text-white leading-snug mb-1">{r.title}</h4>
              <p className="text-[11px] text-slate-400">{r.desc}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/40">
                <span className="text-[10px] text-slate-500">{period(g)} · {r.rows().length} rows</span>
                <button type="button" onClick={() => downloadCsv(`farmxpress-${r.id}.csv`, r.rows() as Record<string, unknown>[])} data-testid={`report-${r.id}`} className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1"><Icons.Download className="w-3 h-3" /> CSV</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel p-4">
        <SectionTitle icon={Icons.BookOpen} title="Definitions" sub="How the figures are counted" />
        <ol className="text-xs text-slate-300 list-decimal pl-5 space-y-1.5">{g.basis.map((b) => <li key={b}>{b}</li>)}</ol>
      </div>
      <Scope g={g} />
    </>;
  }}</Shell>;
}
