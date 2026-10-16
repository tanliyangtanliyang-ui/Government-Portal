export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Kpi {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: number;
  deltaLabel: string;
  spark: number[];
  accent: 'emerald' | 'teal' | 'cyan' | 'amber';
}

export const nationalKpis: Kpi[] = [
  {
    id: 'farmers',
    label: 'Active Farmers',
    value: '28,560',
    delta: 3.2,
    deltaLabel: 'vs last month',
    spark: [261, 264, 268, 270, 274, 279, 282, 285],
    accent: 'emerald',
  },
  {
    id: 'hubs',
    label: 'Operating Consolidation Hubs',
    value: '126',
    delta: 1.6,
    deltaLabel: '3 new this quarter',
    spark: [118, 119, 121, 122, 123, 124, 125, 126],
    accent: 'teal',
  },
  {
    id: 'produce',
    label: 'Total Produce Managed',
    value: '2.8M',
    unit: 'tonnes',
    delta: 7.4,
    deltaLabel: 'YTD throughput',
    spark: [2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8],
    accent: 'cyan',
  },
  {
    id: 'waste',
    label: 'Food Waste Reduction',
    value: '24%',
    delta: 5.0,
    deltaLabel: 'vs baseline 2023',
    spark: [12, 14, 16, 18, 20, 21, 23, 24],
    accent: 'amber',
  },
];

export interface MapState {
  id: string;
  name: string;
  region: 'Peninsular' | 'Borneo';
  production: number;
  productionTrend: number;
  mainProduce: string;
  hubCapacity: number;
  risk: RiskLevel;
  hubCount: number;
  x: number;
  y: number;
}

export const malaysiaStates: MapState[] = [
  { id: 'jhr', name: 'Johor', region: 'Peninsular', production: 320, productionTrend: 15, mainProduce: 'Vegetables', hubCapacity: 82, risk: 'Low', hubCount: 14, x: 250, y: 300 },
  { id: 'phg', name: 'Pahang', region: 'Peninsular', production: 280, productionTrend: 8, mainProduce: 'Oil Palm', hubCapacity: 64, risk: 'High', hubCount: 9, x: 205, y: 215 },
  { id: 'trg', name: 'Terengganu', region: 'Peninsular', production: 150, productionTrend: -4, mainProduce: 'Rice', hubCapacity: 58, risk: 'High', hubCount: 5, x: 240, y: 185 },
  { id: 'ktn', name: 'Kelantan', region: 'Peninsular', production: 190, productionTrend: -2, mainProduce: 'Rice', hubCapacity: 61, risk: 'Medium', hubCount: 6, x: 225, y: 150 },
  { id: 'prk', name: 'Perak', region: 'Peninsular', production: 260, productionTrend: 6, mainProduce: 'Vegetables', hubCapacity: 73, risk: 'Low', hubCount: 11, x: 150, y: 200 },
  { id: 'plg', name: 'Penang', region: 'Peninsular', production: 140, productionTrend: 4, mainProduce: 'Fruits', hubCapacity: 70, risk: 'Low', hubCount: 4, x: 120, y: 170 },
  { id: 'kdh', name: 'Kedah', region: 'Peninsular', production: 240, productionTrend: 9, mainProduce: 'Rice', hubCapacity: 78, risk: 'Low', hubCount: 8, x: 130, y: 130 },
  { id: 'pls', name: 'Perlis', region: 'Peninsular', production: 70, productionTrend: 3, mainProduce: 'Rice', hubCapacity: 55, risk: 'Low', hubCount: 2, x: 110, y: 110 },
  { id: 'nsn', name: 'N. Sembilan', region: 'Peninsular', production: 180, productionTrend: 5, mainProduce: 'Fruits', hubCapacity: 66, risk: 'Low', hubCount: 6, x: 200, y: 270 },
  { id: 'mlk', name: 'Melaka', region: 'Peninsular', production: 120, productionTrend: 2, mainProduce: 'Vegetables', hubCapacity: 60, risk: 'Low', hubCount: 4, x: 215, y: 285 },
  { id: 'slr', name: 'Selangor', region: 'Peninsular', production: 210, productionTrend: 11, mainProduce: 'Vegetables', hubCapacity: 88, risk: 'Medium', hubCount: 12, x: 170, y: 220 },
  { id: 'kul', name: 'Kuala Lumpur', region: 'Peninsular', production: 40, productionTrend: 6, mainProduce: 'Demand Hub', hubCapacity: 92, risk: 'Medium', hubCount: 3, x: 175, y: 235 },
  { id: 'sbh', name: 'Sabah', region: 'Borneo', production: 230, productionTrend: 12, mainProduce: 'Oil Palm', hubCapacity: 69, risk: 'Medium', hubCount: 8, x: 360, y: 230 },
  { id: 'srk', name: 'Sarawak', region: 'Borneo', production: 210, productionTrend: 7, mainProduce: 'Pepper', hubCapacity: 63, risk: 'Low', hubCount: 7, x: 320, y: 250 },
  { id: 'lbn', name: 'Labuan', region: 'Borneo', production: 30, productionTrend: 1, mainProduce: 'Fishery', hubCapacity: 48, risk: 'Low', hubCount: 1, x: 350, y: 255 },
];

export interface RiskAlert {
  id: string;
  region: string;
  level: RiskLevel;
  cause: string;
  impact: string;
  confidence: number;
  eta: string;
}

export const riskAlerts: RiskAlert[] = [
  { id: 'r1', region: 'Kelantan', level: 'Medium', cause: 'Heavy rainfall forecast', impact: 'Transportation delay 24-48h', confidence: 78, eta: '36h' },
  { id: 'r2', region: 'Pahang', level: 'High', cause: 'Monsoon flooding risk', impact: 'Route disruption, crop loss', confidence: 84, eta: '18h' },
  { id: 'r3', region: 'Terengganu', level: 'High', cause: 'Coastal storm surge', impact: 'Hub access limited', confidence: 71, eta: '12h' },
  { id: 'r4', region: 'Selangor', level: 'Medium', cause: 'Demand spike vs supply', impact: 'Price pressure on vegetables', confidence: 66, eta: '5d' },
  { id: 'r5', region: 'Sabah', level: 'Medium', cause: 'Logistics bottleneck', impact: 'Hub congestion 14%', confidence: 69, eta: '3d' },
  { id: 'r6', region: 'Johor', level: 'Low', cause: 'Stable conditions', impact: 'No action required', confidence: 92, eta: '-' },
];

export interface AiRecommendation {
  id: string;
  problem: string;
  action: string;
  impact: { label: string; value: string; positive: boolean }[];
  confidence: number;
  region: string;
}

export const aiRecommendations: AiRecommendation[] = [
  {
    id: 'a1',
    problem: 'High transportation cost detected in East Coast region.',
    action: 'Deploy additional consolidation hub in Kuala Krai, Kelantan.',
    impact: [
      { label: 'Logistics cost', value: '-18%', positive: true },
      { label: 'Food waste', value: '-12%', positive: true },
      { label: 'Hub utilization', value: '+9%', positive: true },
    ],
    confidence: 87,
    region: 'East Coast',
  },
  {
    id: 'a2',
    problem: 'Vegetable supply shortfall projected for Klang Valley.',
    action: 'Reroute Cameron Highlands produce via Tapah hub with cold-chain priority.',
    impact: [
      { label: 'Supply gap', value: '-22%', positive: true },
      { label: 'Price volatility', value: '-15%', positive: true },
      { label: 'Transit time', value: '+4%', positive: false },
    ],
    confidence: 81,
    region: 'Central',
  },
  {
    id: 'a3',
    problem: 'Sabah inter-hub transfers underperforming vs capacity.',
    action: 'Consolidate Kota Kinabalu + Sandakan routes into overnight cold-chain loop.',
    impact: [
      { label: 'Throughput', value: '+19%', positive: true },
      { label: 'Carbon', value: '-8%', positive: true },
      { label: 'Driver hours', value: '-11%', positive: true },
    ],
    confidence: 76,
    region: 'Sabah',
  },
];

export interface WeatherAlert {
  id: string;
  title: string;
  areas: string[];
  severity: RiskLevel;
  recommendation: string;
  window: string;
}

export const weatherAlerts: WeatherAlert[] = [
  { id: 'w1', title: 'Heavy Rain Expected', areas: ['Pahang', 'Terengganu'], severity: 'High', recommendation: 'Adjust transportation routes to inland corridors; pre-position cold storage.', window: 'Next 48h' },
  { id: 'w2', title: 'Heat Wave Advisory', areas: ['Perlis', 'Kedah'], severity: 'Medium', recommendation: 'Increase irrigation scheduling; monitor poultry heat stress.', window: 'Next 72h' },
  { id: 'w3', title: 'Stable Conditions', areas: ['Johor', 'Melaka', 'N. Sembilan'], severity: 'Low', recommendation: 'Normal operations. Favorable for harvest logistics.', window: 'Next 96h' },
];

export interface FarmerMetric {
  label: string;
  value: string;
  delta: number;
  detail: string;
}

export const farmerMetrics: FarmerMetric[] = [
  { label: 'New Registered Farmers', value: '+240', delta: 12, detail: 'This month, across 9 states' },
  { label: 'Average Income', value: 'RM 4,820', delta: 12, detail: 'Per farmer / month' },
  { label: 'Digital Adoption', value: '78%', delta: 6, detail: 'App + IoT sensors' },
  { label: 'Training Completion', value: '1,420', delta: 18, detail: 'Agri-tech certifications' },
];

export interface FarmerRegionStat {
  state: string;
  farmers: number;
  adoption: number;
  income: number;
}

export const farmerRegionStats: FarmerRegionStat[] = [
  { state: 'Johor', farmers: 3820, adoption: 84, income: 5200 },
  { state: 'Sabah', farmers: 3110, adoption: 71, income: 4400 },
  { state: 'Sarawak', farmers: 2890, adoption: 68, income: 4100 },
  { state: 'Perak', farmers: 2640, adoption: 80, income: 4900 },
  { state: 'Pahang', farmers: 2410, adoption: 73, income: 4500 },
  { state: 'Kedah', farmers: 2230, adoption: 82, income: 4700 },
];

export interface CarbonMetric {
  label: string;
  value: string;
  detail: string;
  trend: number;
}

export const carbonMetrics: CarbonMetric[] = [
  { label: 'Carbon Reduction', value: '42,000', detail: 'tonnes CO₂', trend: 14 },
  { label: 'Optimized Routes', value: '18,500', detail: 'trips rerouted', trend: 9 },
  { label: 'Reusable Containers', value: '320,000', detail: 'units in circulation', trend: 21 },
  { label: 'Cold-chain Efficiency', value: '91%', detail: 'energy optimized', trend: 4 },
];

export interface PolicyScenario {
  id: string;
  name: string;
  description: string;
  predictions: { label: string; value: string; positive: boolean }[];
  status: 'Simulated' | 'Recommended' | 'Deployed';
}

export const policyScenarios: PolicyScenario[] = [
  {
    id: 'p1',
    name: 'Increase consolidation hubs in Sabah',
    description: 'Add 4 new hubs across Sandakan, Tawau, and Lahad Datu to relieve east-coast Borneo logistics.',
    predictions: [
      { label: 'Transportation efficiency', value: '+22%', positive: true },
      { label: 'Food waste', value: '-15%', positive: true },
      { label: 'Farmer income', value: '+8%', positive: true },
      { label: 'Carbon', value: '-6%', positive: true },
    ],
    status: 'Recommended',
  },
  {
    id: 'p2',
    name: 'Cold-chain subsidy for East Coast',
    description: 'Subsidize refrigerated transport for Pahang, Terengganu, Kelantan during monsoon season.',
    predictions: [
      { label: 'Produce spoilage', value: '-31%', positive: true },
      { label: 'Logistics cost', value: '+5%', positive: false },
      { label: 'Supply stability', value: '+18%', positive: true },
    ],
    status: 'Simulated',
  },
  {
    id: 'p3',
    name: 'Digital adoption grant for smallholders',
    description: 'Match-funding for IoT sensors and FarmXpress app onboarding across 6 states.',
    predictions: [
      { label: 'Digital adoption', value: '+27%', positive: true },
      { label: 'Yield forecasting', value: '+12%', positive: true },
      { label: 'Budget', value: 'RM 4.2M', positive: false },
    ],
    status: 'Simulated',
  },
];

export interface LogisticsRoute {
  id: string;
  origin: string;
  destination: string;
  load: number;
  efficiency: number;
  status: 'Optimal' | 'Delayed' | 'Critical';
  produce: string;
}

export const logisticsRoutes: LogisticsRoute[] = [
  { id: 'l1', origin: 'Cameron Highlands', destination: 'Klang Valley', load: 92, efficiency: 88, status: 'Optimal', produce: 'Vegetables' },
  { id: 'l2', origin: 'Kota Bharu', destination: 'Kuala Lumpur', load: 78, efficiency: 61, status: 'Delayed', produce: 'Rice' },
  { id: 'l3', origin: 'Kuantan Hub', destination: 'Johor Bahru', load: 84, efficiency: 72, status: 'Optimal', produce: 'Fruits' },
  { id: 'l4', origin: 'Kuala Terengganu', destination: 'Kuantan Hub', load: 67, efficiency: 44, status: 'Critical', produce: 'Fishery' },
  { id: 'l5', origin: 'Sandakan', destination: 'Kota Kinabalu', load: 88, efficiency: 79, status: 'Optimal', produce: 'Oil Palm' },
  { id: 'l6', origin: 'Miri', destination: 'Bintulu', load: 71, efficiency: 83, status: 'Optimal', produce: 'Pepper' },
];

export interface FoodWasteRecord {
  stage: string;
  waste: number;
  reduction: number;
}

export const foodWasteByStage: FoodWasteRecord[] = [
  { stage: 'Harvest', waste: 18, reduction: 22 },
  { stage: 'Consolidation', waste: 12, reduction: 31 },
  { stage: 'Transport', waste: 14, reduction: 28 },
  { stage: 'Hub Storage', waste: 9, reduction: 35 },
  { stage: 'Distribution', waste: 11, reduction: 19 },
];

export interface ReportItem {
  id: string;
  title: string;
  category: string;
  period: string;
  status: 'Ready' | 'Draft' | 'Scheduled';
  updated: string;
}

export const reports: ReportItem[] = [
  { id: 'rp1', title: 'National Food Supply Stability — Q2 2026', category: 'Supply', period: 'Q2 2026', status: 'Ready', updated: '2h ago' },
  { id: 'rp2', title: 'East Coast Monsoon Logistics Response', category: 'Logistics', period: 'May 2026', status: 'Ready', updated: '1d ago' },
  { id: 'rp3', title: 'Farmer Digital Adoption Benchmark', category: 'Farmer', period: 'H1 2026', status: 'Draft', updated: '3d ago' },
  { id: 'rp4', title: 'Carbon Sustainability Annual Review', category: 'Sustainability', period: '2026', status: 'Scheduled', updated: 'pending' },
  { id: 'rp5', title: 'Sabah Hub Expansion Feasibility', category: 'Policy', period: 'Q3 2026', status: 'Draft', updated: '5h ago' },
  { id: 'rp6', title: 'Food Waste Reduction Quarterly', category: 'Waste', period: 'Q2 2026', status: 'Ready', updated: '6h ago' },
];

export const supplyTrend = [
  { month: 'Jan', supply: 210, demand: 195, risk: 32 },
  { month: 'Feb', supply: 225, demand: 200, risk: 28 },
  { month: 'Mar', supply: 240, demand: 215, risk: 30 },
  { month: 'Apr', supply: 235, demand: 230, risk: 41 },
  { month: 'May', supply: 255, demand: 240, risk: 38 },
  { month: 'Jun', supply: 270, demand: 250, risk: 34 },
  { month: 'Jul', supply: 285, demand: 265, risk: 29 },
];

export const produceMix = [
  { label: 'Vegetables', value: 32, color: '#10b981' },
  { label: 'Rice', value: 24, color: '#f59e0b' },
  { label: 'Fruits', value: 18, color: '#fb923c' },
  { label: 'Oil Palm', value: 14, color: '#22d3ee' },
  { label: 'Fishery', value: 8, color: '#3b82f6' },
  { label: 'Other', value: 4, color: '#64748b' },
];

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
