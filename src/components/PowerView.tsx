import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, 
         ComposedChart, Bar, Tooltip } from 'recharts';
import { useState } from 'react';

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

function Heatmap({ data }: { data: { x: number; y: number; power: number }[] }) {
  const minPower = 0;
  const maxPower = 10; // MW
  
  const getColor = (power: number) => {
    const ratio = (power - minPower) / (maxPower - minPower);
    const r = Math.round(255 * ratio);
    const b = Math.round(255 * (1 - ratio));
    return `rgb(${r}, 0, ${b})`;
  };

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    content: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    content: ''
  });

  return (
    <div className="relative w-full h-full">
      <canvas
        id="power-heatmap"
        className="w-full h-full"
        style={{ imageRendering: 'pixelated' }}
        width={18}
        height={12}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.floor((e.clientX - rect.left) / (rect.width / 18));
          const y = Math.floor((e.clientY - rect.top) / (rect.height / 12));
          
          const point = data.find(p => p.x === x && p.y === y);
          if (point) {
            setTooltip({
              visible: true,
              x: e.clientX,
              y: e.clientY,
              content: `Power Draw: ${point.power.toFixed(2)} MW`
            });
          }
        }}
        onMouseLeave={() => {
          setTooltip(prev => ({ ...prev, visible: false }));
        }}
        ref={canvas => {
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          data.forEach(point => {
            ctx.fillStyle = getColor(point.power);
            ctx.fillRect(point.x, point.y, 1, 1);
          });
        }}
      />
      {tooltip.visible && (
        <div 
          className="absolute z-10 px-3 py-2 text-xs font-mono bg-cyber-dark border border-cyber-blue/20 rounded shadow-lg"
          style={{ 
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            transform: 'translate(0, 0)'
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

const generatePowerHeatmapData = () => {
  const data = [];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 18; x++) {
      // Generate power draw with spatial correlation
      const basePower = 5; // 5 MW base
      const variation = Math.sin(x/3) * Math.cos(y/2) * 2;
      const noise = Math.random() * 1;
      data.push({
        x,
        y,
        power: basePower + variation + noise
      });
    }
  }
  return data;
};

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

      {/* Power Distribution Heatmap */}
      <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded mb-4">
        <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Power Distribution</h3>
        <div className="h-64">
          <Heatmap data={generatePowerHeatmapData()} />
        </div>
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