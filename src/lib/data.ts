// Navigation for the Government Portal. All figures come from the FarmXpress API (see lib/gov.ts);
// the earlier static demo figures were removed on 23 Oct 2026 (backup: data/backups/phase23-government-4c3).
export const navItems = [
  { id: 'overview', label: 'National Overview', icon: 'LayoutDashboard' },
  { id: 'supply', label: 'Food Supply Monitoring', icon: 'Wheat' },
  { id: 'logistics', label: 'Agricultural Logistics', icon: 'Truck' },
  { id: 'regional', label: 'Regional Analysis', icon: 'Map' },
  { id: 'farmer', label: 'Farmer Development', icon: 'Users' },
  { id: 'waste', label: 'Food Waste Monitoring', icon: 'Recycle' },
  { id: 'climate', label: 'Climate Risk Intelligence', icon: 'CloudRain' },
  { id: 'carbon', label: 'Carbon Sustainability', icon: 'Leaf' },
  { id: 'policy', label: 'Policy Simulation', icon: 'FlaskConical' },
  { id: 'reports', label: 'Reports', icon: 'FileText' },
] as const;

export type NavId = (typeof navItems)[number]['id'];
