import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

interface MetricCardProps {
  title: string;
  value: string;
  target?: string;
  unit: string;
  trend?: number;
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

export function Dashboard() {
  return (
    <div className="p-6 bg-cyber-black min-h-screen">
      {/* Metrics Grid */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <MetricCard
          title="GPUs Online"
          value="6,824"
          target="6,912"
          unit="utilization"
          trend={98.7}
        />
        <MetricCard
          title="Power Draw"
          value="8.2 MW"
          target="10 MW"
          unit="megawatts"
          trend={82}
        />
        <MetricCard
          title="Token Throughput"
          value="4.2M tok/s"
          unit="tokens per second"
          trend={82}
        />
        <MetricCard
          title="PUE"
          value="1.12"
          target="1.10"
          unit="ratio"
          trend={101.8}
        />
        <MetricCard
          title="Temperature"
          value="72°F / 75°F"
          unit="fahrenheit"
          trend={96}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-cyber-blue/20 bg-cyber-dark/50 p-4 rounded">
          <h3 className="text-sm text-cyber-text/60 mb-4">Performance Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={[]}>
              <XAxis dataKey="time" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
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