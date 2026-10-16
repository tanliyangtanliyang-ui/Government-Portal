import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { navItems, type NavId } from '@/lib/data';
import {
  OverviewView, SupplyView, LogisticsView, RegionalView, FarmerView,
  WasteView, ClimateView, CarbonView, PolicyView, ReportsView,
} from '@/components/Views';

const subs: Record<NavId, string> = {
  overview: 'National smart agriculture command center · Malaysia',
  supply: 'Real-time food supply stability & risk monitoring',
  logistics: 'AI-powered agricultural logistics intelligence',
  regional: 'State-by-state agricultural performance analysis',
  farmer: 'Farmer ecosystem growth & digital adoption',
  waste: 'Food waste reduction across the supply chain',
  climate: 'Weather, disaster prediction & agricultural impact',
  carbon: 'Sustainability & carbon performance dashboard',
  policy: 'AI policy simulation & impact prediction',
  reports: 'Generated intelligence & policy documents',
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
            {render()}
          </div>
        </main>
      </div>
    </div>
  );
}
