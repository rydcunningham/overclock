import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, ScatterChart, 
         Scatter, Tooltip } from 'recharts';
import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  target?: string;
  unit: string;
  trend?: number;
}

// Sample data generators
const temperatureData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  gpu: Math.random() * 10 + 65, // 65-75°F
  cpu: Math.random() * 10 + 60, // 60-70°F
  ambient: Math.random() * 5 + 68, // 68-73°F
}));

const coolingEfficiencyData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  efficiency: Math.random() * 0.2 + 0.7, // 70-90% efficiency
}));

const fanSpeedData = Array.from({ length: 50 }, () => ({
  temp: Math.random() * 20 + 60, // 60-80°F
  rpm: Math.random() * 2000 + 1000, // 1000-3000 RPM
}));

const coolantData = Array.from({ length: 24 }, (_, i) => ({
  deltaT: i * 0.5, // 0-12°F delta
  flowRate: Math.random() * 5 + 15, // 15-20 L/min
}));

// Generate heatmap data for 18x12 rack layout
const generateHeatmapData = () => {
  const data = [];
  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 18; x++) {
      // Generate temperature with spatial correlation
      const baseTemp = 70;
      const variation = Math.sin(x/3) * Math.cos(y/2) * 10;
      const noise = Math.random() * 5;
      data.push({
        x,
        y,
        temperature: baseTemp + variation + noise
      });
    }
  }
  return data;
};

function Heatmap({ data }: { data: { x: number; y: number; temperature: number }[] }) {
  const minTemp = 65;
  const maxTemp = 85;
  
  const getColor = (temp: number) => {
    const ratio = (temp - minTemp) / (maxTemp - minTemp);
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
        id="thermal-heatmap"
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
              content: `Temperature: ${point.temperature.toFixed(1)}°F`
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
            ctx.fillStyle = getColor(point.temperature);
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

export function ThermalView() {
  return (
    <div className="p-6 bg-cyber-black min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Avg GPU Temp"
          value="72.4"
          target="75.0"
          unit="fahrenheit"
          trend={96.5}
        />
        <MetricCard
          title="Cooling Power"
          value="2.8"
          target="3.0"
          unit="megawatts"
          trend={93.3}
        />
        <MetricCard
          title="Flow Rate"
          value="17.2"
          target="20.0"
          unit="liters/min"
          trend={86}
        />
        <MetricCard
          title="Efficiency"
          value="82.4"
          target="85.0"
          unit="percent"
          trend={97}
        />
        <MetricCard
          title="Delta T"
          value="8.2"
          target="10.0"
          unit="fahrenheit"
          trend={82}
        />
      </div>

      {/* Main Heatmap */}
      <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded mb-4">
        <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Temperature Distribution</h3>
        <div className="h-64">
          <Heatmap data={generateHeatmapData()} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4 space-x-2">
        {/* Temperature Trends */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Temperature Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={temperatureData}>
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
                dataKey="gpu"
                stroke="#00f0ff"
                dot={false}
              />
              <Line
                type="linear"
                dataKey="cpu"
                stroke="#00ff9f"
                dot={false}
              />
              <Line
                type="linear"
                dataKey="ambient"
                stroke="#ff9f00"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Cooling Efficiency */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Cooling Efficiency</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={coolingEfficiencyData}>
              <XAxis 
                dataKey="time" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
              />
              <YAxis 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
                domain={[0.5, 1]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid rgba(0, 240, 255, 0.2)' 
                }} 
              />
              <Line
                type="linear"
                dataKey="efficiency"
                stroke="#00f0ff"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Fan Speed vs Temperature */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Fan Speed vs Temperature</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <XAxis 
                dataKey="temp" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
                name="Temperature"
              />
              <YAxis 
                dataKey="rpm" 
                stroke="#e0e0e0" 
                tick={{ fontSize: 10 }}
                name="Fan Speed"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  border: '1px solid rgba(0, 240, 255, 0.2)' 
                }} 
              />
              <Scatter
                data={fanSpeedData}
                fill="#00f0ff"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Coolant Flow Rate */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Coolant Flow vs Delta T</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={coolantData}>
              <XAxis 
                dataKey="deltaT" 
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
                dataKey="flowRate"
                stroke="#00f0ff"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 