import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, 
         ComposedChart, Bar, Tooltip } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  target?: string;
  unit: string;
  trend?: number;
}

// Sample data - replace with real data later
const throughputData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  tokens: Math.random() * 2 + 3, // 3-5M tokens/s
}));

const utilizationData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  utilization: Math.random() * 30 + 65, // 65-95%
  users: Math.floor(Math.random() * 1000 + 2000), // 2000-3000 users
}));

const memoryData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  vram: Math.random() * 20 + 60, // 60-80GB
  ram: Math.random() * 10 + 30, // 30-40GB
}));

const costData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  totalCost: Math.random() * 0.2 + 0.8, // $0.8-1.0 per 1M tokens
  revenue: Math.random() * 0.4 + 1.2, // $1.2-1.6 per 1M tokens
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

export function TokensView() {
  return (
    <div className="p-6 bg-cyber-black min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="Token Throughput"
          value="4.2M"
          target="5.0M"
          unit="tokens per second"
          trend={84}
        />
        <MetricCard
          title="GPU Utilization"
          value="89.4"
          target="95.0"
          unit="percent"
          trend={94}
        />
        <MetricCard
          title="Active Users"
          value="2,847"
          unit="concurrent users"
          trend={112}
        />
        <MetricCard
          title="P99 Latency"
          value="450"
          target="500"
          unit="milliseconds"
          trend={90}
        />
        <MetricCard
          title="Cost per 1M"
          value="$0.92"
          target="$0.85"
          unit="USD"
          trend={108}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Token Throughput Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Token Throughput</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={throughputData}>
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
                dataKey="tokens"
                stroke="#00f0ff"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* GPU Utilization vs Users Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">GPU Utilization vs Users</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={utilizationData}>
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
              <Line
                yAxisId="left"
                type="linear"
                dataKey="utilization"
                stroke="#00f0ff"
                dot={false}
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="users"
                stroke="#00ff9f"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Usage Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Memory Utilization</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={memoryData}>
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
                dataKey="vram"
                stackId="1"
                stroke="#00f0ff"
                fill="#00f0ff"
                fillOpacity={0.2}
              />
              <Area
                type="linear"
                dataKey="ram"
                stackId="1"
                stroke="#00ff9f"
                fill="#00ff9f"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Cost vs Revenue Chart */}
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm font-mono text-cyber-text/60 mb-4 uppercase">Cost vs Revenue</h3>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={costData}>
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
              />
              <Line
                yAxisId="right"
                type="linear"
                dataKey="revenue"
                stroke="#00ff9f"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 