import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";
import type { ChurnByGroup, TenureBucket, ChargesComparison } from "@workspace/api-client-react";

export const CHART_COLORS = {
  blue: "#0079F2",
  purple: "#795EFF",
  green: "#009118",
  red: "#A60808",
  pink: "#ec4899",
};

export function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "6px",
        padding: "10px 14px",
        border: "1px solid #e0e0e0",
        color: "#1a1a1a",
        fontSize: "13px",
      }}
    >
      <div style={{ marginBottom: "6px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
        {payload.length === 1 && payload[0].color && payload[0].color !== "#ffffff" && (
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: payload[0].color, flexShrink: 0 }} />
        )}
        {label}
      </div>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
          {payload.length > 1 && entry.color && entry.color !== "#ffffff" && (
            <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          )}
          <span style={{ color: "#444" }}>{entry.name}</span>
          <span style={{ marginLeft: "auto", fontWeight: 600 }}>
            {typeof entry.value === "number" ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) : entry.value}
            {entry.dataKey === "churnRate" ? "%" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CustomLegend({ payload }: any) {
  if (!payload || payload.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", fontSize: "13px", marginTop: "12px" }}>
      {payload.map((entry: any, index: number) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: entry.color, flexShrink: 0 }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  loading,
  isDark,
  data,
  filename,
  children,
}: {
  title: string;
  loading: boolean;
  isDark: boolean;
  data: any[];
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="px-4 pt-4 pb-2 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        {!loading && data && data.length > 0 && (
          <CSVLink
            data={data}
            filename={`${filename}.csv`}
            className="print:hidden flex items-center justify-center w-[26px] h-[26px] rounded-[6px] transition-colors hover:opacity-80"
            style={{
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#F0F1F2",
              color: isDark ? "#c8c9cc" : "#4b5563",
            }}
            aria-label="Export chart data as CSV"
          >
            <Download className="w-3.5 h-3.5" />
          </CSVLink>
        )}
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading ? (
          <Skeleton className="w-full h-[300px]" />
        ) : !data || data.length === 0 ? (
          <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground text-sm">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300} debounce={0}>
            {children}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function GroupedBarChart({
  title,
  data,
  loading,
  isDark,
  filename,
}: {
  title: string;
  data: ChurnByGroup[] | undefined;
  loading: boolean;
  isDark: boolean;
  filename: string;
}) {
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  return (
    <ChartCard title={title} loading={loading} isDark={isDark} data={data || []} filename={filename}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey="group" tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
        <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
        <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="retained" name="Retained" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
        <Bar dataKey="churned" name="Churned" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}

export function StackedBarChart({
  title,
  data,
  loading,
  isDark,
  filename,
  xAxisKey,
}: {
  title: string;
  data: any[] | undefined;
  loading: boolean;
  isDark: boolean;
  filename: string;
  xAxisKey: string;
}) {
  const gridColor = isDark ? "rgba(255,255,255,0.08)" : "#e5e5e5";
  const tickColor = isDark ? "#98999C" : "#71717a";

  return (
    <ChartCard title={title} loading={loading} isDark={isDark} data={data || []} filename={filename}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
        <YAxis tick={{ fontSize: 12, fill: tickColor }} stroke={tickColor} />
        <Tooltip content={<CustomTooltip />} isAnimationActive={false} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="retained" name="Retained" stackId="a" fill={CHART_COLORS.blue} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} />
        <Bar dataKey="churned" name="Churned" stackId="a" fill={CHART_COLORS.purple} fillOpacity={0.8} activeBar={{ fillOpacity: 1 }} isAnimationActive={false} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}
