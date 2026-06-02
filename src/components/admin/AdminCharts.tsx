"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function AdminCharts(props: {
  ordersByStatus: { status: string; count: number }[];
  revenueByDay: { day: string; revenue: number }[];
  topResellers: { name: string; revenue: number }[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card">
        <h2 className="text-sm font-semibold text-ink-100">Orders by status</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={props.ordersByStatus}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="status" tick={{ fill: "#b6b8bf", fontSize: 12 }} />
              <YAxis tick={{ fill: "#b6b8bf", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f7b62b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-ink-100">Revenue (last 30 days)</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={props.revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="day" tick={{ fill: "#b6b8bf", fontSize: 12 }} />
              <YAxis tick={{ fill: "#b6b8bf", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#f7b62b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="text-sm font-semibold text-ink-100">Top resellers</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={props.topResellers} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis type="number" tick={{ fill: "#b6b8bf", fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#b6b8bf", fontSize: 12 }} width={90} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#f7b62b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

