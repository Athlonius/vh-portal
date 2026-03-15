import StatsGrid from "@/components/StatsGrid";
import ExchangeRate from "@/components/ExchangeRate";

export default function OverviewPage() {
  return (
    <div style={{ padding: "32px 32px 48px" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>
          Overview
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
          Operations summary for current season
        </p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <ExchangeRate />
      </div>

      <StatsGrid />
    </div>
  );
}
