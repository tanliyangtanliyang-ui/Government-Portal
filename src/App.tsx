import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { navItems, type NavId } from '@/lib/data';
import {
  OverviewView, SupplyView, LogisticsView, RegionalView, FarmerView,
  WasteView, ClimateView, CarbonView, PolicyView, ReportsView,
} from '@/components/Views';
import { CanonicalShipment } from '@/components/CanonicalShipment';
import { NetworkSummaryPanel } from '@/components/NetworkSummaryPanel';
import { DataDetails } from '@/components/DataDetails';

const subs: Record<NavId, string> = {
  overview: 'FarmXpress pilot network at a glance · records, not forecasts',
  supply: 'Supply and demand recorded in the network',
  logistics: 'Trips, truck load and hub performance',
  regional: 'Supply and demand by state',
  farmer: 'Farmers and cooperatives in the network',
  waste: 'Produce losses recorded along the chain',
  climate: 'Weather inputs and their recorded effect on trips',
  carbon: 'Trips, distance and CO₂e avoided by shared trips (estimates)',
  policy: 'What-if calculator from recorded averages',
  reports: 'Download the figures as CSV',
};

export default function App() {
  const [active, setActive] = useState<NavId>('overview');

  const render = () => {
    switch (active) {
      case 'overview': return <OverviewView />;
      case 'supply': return <SupplyView />;
      case 'logistics': return <LogisticsView />;
      case 'regional': return <RegionalView />;
      case 'farmer': return <FarmerView />;
      case 'waste': return <WasteView />;
      case 'climate': return <ClimateView />;
      case 'carbon': return <CarbonView />;
      case 'policy': return <PolicyView />;
      case 'reports': return <ReportsView />;
      default: return <OverviewView />;
    }
  };

  const current = navItems.find((n) => n.id === active)!;

  return (
    <div className="h-screen flex bg-[#060b14] text-slate-200 overflow-hidden">
      <Sidebar active={active} onChange={setActive} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={current.label} sub={subs[active]} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-grid bg-radial-glow">
          <div className="max-w-[1600px] mx-auto">
            <DataDetails storageKey="fx.gov.dataDetails" className="border-slate-700/70 bg-slate-900/40" mutedClassName="text-slate-400">
              <CanonicalShipment />
              <NetworkSummaryPanel />
            </DataDetails>
            {render()}
          </div>
        </main>
      </div>
    </div>
  );
}
