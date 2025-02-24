import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, 
         ComposedChart, Bar, Tooltip } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  target?: string;
  unit: string;
  trend?: number;
}

// Sample data generators
const powerBreakdownData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  gpus: Math.random() * 2 + 6, // 6-8 MW
  cpus: Math.random() * 0.5 + 1, // 1-1.5 MW
  networking: Math.random() * 0.3 + 0.5, // 0.5-0.8 MW
  cooling: Math.random() * 1 + 2, // 2-3 MW
  misc: Math.random() * 0.2 + 0.3, // 0.3-0.5 MW
}));

const powerSupplyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  available: 15, // 15 MW total capacity
  used: Math.random() * 3 + 10, // 10-13 MW usage
}));

const pueData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  pue: Math.random() * 0.1 + 1.1, // 1.1-1.2 PUE
}));

const energyCostData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  totalCost: Math.random() * 500 + 2000, // $2000-2500 per hour
  ratePerKwh: Math.random() * 0.02 + 0.08, // $0.08-0.10 per kWh
}));

function MetricCard({ title, value, target, unit, trend }: MetricCardProps) {
  return (
    <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs font-mono font-medium text-cyber-text/60">
          {title}
        </div>
        {trend !== undefined && (
          <div className={`text-xs font-mono ${
            trend > 100 ? 'text-red-500' : 'text-cyber-green'
          }`}>
            {trend}%
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <div className="text-xl text-cyber-blue font-mono">{value}</div>
        {target && (
          <div className="text-sm text-cyber-text/60">/ {target}</div>
        )}
      </div>
      <div className="text-xs text-cyber-text/60 mt-1">{unit}</div>
    </div>
  );
}

export function PowerView() {
  return (
    <div className="p-6 bg-cyber-black min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Total Power"
          value="12.4"
          target="15.0"
          unit="megawatts"
          trend={82.7}
        />
        <MetricCard
          title="PUE"
          value="1.12"
          target="1.10"
          unit="ratio"
          trend={101.8}
        />
        <MetricCard
          title="Cost Rate"
          value="2,347"
          target="2,200"
          unit="USD per hour"
          trend={106.7}
        />
        <MetricCard
          title="GPU Power"
          value="7.2"
          target="8.0"
          unit="megawatts"
          trend={90}
        />
        <MetricCard
          title="UPS Reserve"
          value="92"
          target="100"
          unit="percent"
          trend={92}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Power Breakdown Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Power Consumption Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={powerBreakdownData}>
              <XAxis 
                dataKey="time" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid rgba(0, 240, 255, 0.2)' 
                }} 
              />
              <Area
                type="linear"
                dataKey="gpus"
                stackId="1"
                stroke="#00f0ff"
                fill="#00f0ff"
                fillOpacity={0.2}
              />
              <Area
                type="linear"
                dataKey="cpus"
                stackId="1"
                stroke="#00ff9f"
                fill="#00ff9f"
                fillOpacity={0.2}
              />
              <Area
                type="linear"
                dataKey="networking"
                stackId="1"
                stroke="#ff9f00"
                fill="#ff9f00"
                fillOpacity={0.2}
              />
              <Area
                type="linear"
                dataKey="cooling"
                stackId="1"
                stroke="#ff00ff"
                fill="#ff00ff"
                fillOpacity={0.2}
              />
              <Area
                type="linear"
                dataKey="misc"
                stackId="1"
                stroke="#9f00ff"
                fill="#9f00ff"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Power Supply vs Demand Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Power Supply vs Demand</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={powerSupplyData}>
              <XAxis 
                dataKey="time" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid rgba(0, 240, 255, 0.2)' 
                }} 
              />
              <Line
                type="linear"
                dataKey="available"
                stroke="#00ff9f"
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="linear"
                dataKey="used"
                stroke="#00f0ff"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* PUE Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Power Usage Effectiveness</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={pueData}>
              <XAxis 
                dataKey="time" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
                domain={[1, 1.5]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid rgba(0, 240, 255, 0.2)' 
                }} 
              />
              <Line
                type="linear"
                dataKey="pue"
                stroke="#00f0ff"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Energy Cost Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Energy Cost Per Hour</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={energyCostData}>
              <XAxis 
                dataKey="time" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid rgba(0, 240, 255, 0.2)' 
                }} 
              />
              <Bar 
                yAxisId="left"
                dataKey="totalCost" 
                fill="#00f0ff" 
                fillOpacity={0.2} 
                name="Total Cost"
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="ratePerKwh"
                stroke="#00ff9f"
                dot={false}
                name="Rate per kWh"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 