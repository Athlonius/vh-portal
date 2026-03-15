import { mockPartners } from "../../partners/mockPartners";

const STATUS_OPTIONS = ["In Progress", "Quoted", "Confirmed", "Cancelled", "Lost"];
const RECEIVED_VIA = ["Email", "WhatsApp", "Phone", "Other"];

interface Props {
  agencyId: number | null; setAgencyId: (v: number | null) => void;
  agentName: string; setAgentName: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  receivedVia: string; setReceivedVia: (v: string) => void;
  requestDate: string; setRequestDate: (v: string) => void;
  requestNumber: string;
}

export default function S1Context(p: Props) {
  const partner = mockPartners.find((x) => x.id === p.agencyId);
  const agents = partner ? partner.agents.map((a) => a.name) : [];

  return (
    <div style={grid3}>
      <Field label="Travel Agency" required>
        <select value={p.agencyId ?? ""} onChange={(e) => { p.setAgencyId(e.target.value ? Number(e.target.value) : null); p.setAgentName(""); }} style={sel}>
          <option value="">Select agency…</option>
          {mockPartners.map((x) => <option key={x.id} value={x.id}>{x.companyName}</option>)}
        </select>
      </Field>

      <Field label="Agent">
        <select value={p.agentName} onChange={(e) => p.setAgentName(e.target.value)} style={sel} disabled={!p.agencyId}>
          <option value="">Select agent…</option>
          {agents.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </Field>

      <Field label="Status">
        <select value={p.status} onChange={(e) => p.setStatus(e.target.value)} style={sel}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Received Via">
        <select value={p.receivedVia} onChange={(e) => p.setReceivedVia(e.target.value)} style={sel}>
          {RECEIVED_VIA.map((v) => <option key={v} value={v}>{v}</option>)}
        </select>
      </Field>

      <Field label="Request Date">
        <input type="date" value={p.requestDate} onChange={(e) => p.setRequestDate(e.target.value)} style={{ ...inp, colorScheme: "dark" }} />
      </Field>

      <Field label="Request Number">
        <input readOnly value={p.requestNumber} style={{ ...inp, color: "#60A5FA", fontWeight: 700, cursor: "default" }} />
      </Field>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={lbl}>{label}{required && <span style={{ color: "#F87171", marginLeft: 2 }}>*</span>}</span>
      {children}
    </label>
  );
}

const grid3: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 };
export const inp: React.CSSProperties = { background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "8px 12px", outline: "none", width: "100%" };
export const sel: React.CSSProperties = { ...inp, cursor: "pointer" } as React.CSSProperties;
export const lbl: React.CSSProperties = { fontSize: 11, color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" };
