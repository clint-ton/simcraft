"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Ability {
  name: string;
  portion_dps: number;
  school: string;
}

interface ResultsChartProps {
  dps: number;
  dpsError: number;
  fightLength: number;
  playerName: string;
  playerClass: string;
  abilities: Ability[];
}

const SCHOOL_COLORS: Record<string, string> = {
  physical: "#D4A843",
  holy: "#F5E6A3",
  fire: "#EF6461",
  nature: "#6BCB77",
  frost: "#6CB4EE",
  shadow: "#B07CD8",
  arcane: "#E88AED",
};

export default function ResultsChart({
  dps,
  dpsError,
  fightLength,
  playerName,
  playerClass,
  abilities,
}: ResultsChartProps) {
  const chartData = abilities.slice(0, 15).map((a) => ({
    name: a.name.replace(/_/g, " "),
    dps: Math.round(a.portion_dps),
    fill: SCHOOL_COLORS[a.school] || SCHOOL_COLORS.physical,
  }));

  return (
    <div className="space-y-6">
      <div className="card p-8 text-center">
        <p className="text-xs text-muted mb-4">
          {playerName} &middot; {playerClass}
        </p>
        <p className="text-5xl font-bold text-white tabular-nums tracking-tight">
          {Math.round(dps).toLocaleString()}
        </p>
        <p className="text-xs text-muted mt-2 uppercase tracking-widest">DPS</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-600">
          <span>&plusmn; {Math.round(dpsError).toLocaleString()}</span>
          <span className="w-px h-3 bg-border" />
          <span>{fightLength}s fight</span>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="text-xs font-medium text-muted uppercase tracking-widest mb-5">
          Ability Breakdown
        </h3>
        <ResponsiveContainer
          width="100%"
          height={Math.max(280, chartData.length * 32)}
        >
          <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" horizontal={false} />
            <XAxis type="number" stroke="#404044" tick={{ fontSize: 10, fill: "#71717a" }} />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#404044"
              tick={{ fontSize: 11, fill: "#a1a1aa" }}
              width={95}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#141416",
                border: "1px solid #2a2a2e",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "#e4e4e7" }}
              formatter={(value: number) => [
                `${value.toLocaleString()} DPS`,
                "Damage",
              ]}
            />
            <Bar dataKey="dps" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
