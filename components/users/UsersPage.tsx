"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { mockUsers, roleStyle, type User, type UserRole } from "./mockUsers";
import AddUserModal from "./AddUserModal";

function RoleBadge({ role }: { role: UserRole }) {
  const s = roleStyle[role];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {role}
    </span>
  );
}

function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: active ? "#0D2E1A" : "#3B0F0F", color: active ? "#4ADE80" : "#F87171" }}>
      {active ? "Yes" : "No"}
    </span>
  );
}

function fmt(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 14, padding: 28, maxWidth: 400, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
          <span style={{ color: "#F87171", flexShrink: 0, marginTop: 2 }}><AlertTriangle size={20} /></span>
          <div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>Confirm Delete</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#94A3B8" }}>{message}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#EF4444", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const filtered = useMemo(() =>
    users.filter((u) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }),
    [users, search]);

  const addUser = (data: Omit<User, "id" | "createdAt">) =>
    setUsers((prev) => [...prev, { ...data, id: prev.length + 1, createdAt: "2026-03-14" }]);

  const userToDelete = users.find((u) => u.id === deleteConfirmId);

  return (
    <div style={{ padding: "32px 32px 48px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Users</h1>
          <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "#64748B" }}>
            Manage portal user accounts and roles.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} style={addBtn}>
          <Plus size={15} strokeWidth={2.5} /> Add New User
        </button>
      </div>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <Search size={14} color="#64748B" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..."
            style={{ ...filterInput, paddingLeft: 30, width: 240 }} />
        </div>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#64748B" }}>
          {filtered.length} user{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#0F172A", borderBottom: "1px solid #334155" }}>
                {["#", "First Name", "Last Name", "Telephone", "Email", "Role", "Active", "Created At", "Actions"].map((col) => (
                  <th key={col} style={thStyle}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: "48px 0", textAlign: "center", color: "#475569" }}>No users found.</td></tr>
              ) : (
                filtered.map((u, i) => <UserRow key={u.id} user={u} index={i + 1} onDelete={(id) => setDeleteConfirmId(id)} />)
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <span style={{ fontSize: 12, color: "#64748B" }}>
            {filtered.length} of {users.length} users — {users.filter((u) => u.active).length} active
          </span>
        </div>
      </div>

      {showModal && <AddUserModal onClose={() => setShowModal(false)} onSave={addUser} />}
      {deleteConfirmId !== null && (
        <ConfirmDialog
          message={`Delete user "${userToDelete?.firstName} ${userToDelete?.lastName}"? This action cannot be undone.`}
          onConfirm={() => { setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmId)); setDeleteConfirmId(null); }}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}

function UserRow({ user: u, index, onDelete }: { user: User; index: number; onDelete: (id: number) => void }) {
  const [hov, setHov] = useState(false);
  return (
    <tr onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderBottom: "1px solid #1E293B", background: hov ? "#162032" : "transparent", transition: "background 0.1s" }}>
      <td style={tdStyle}>{index}</td>
      <td style={{ ...tdStyle, fontWeight: 600, color: "#F8FAFC" }}>{u.firstName}</td>
      <td style={{ ...tdStyle, fontWeight: 600, color: "#F8FAFC" }}>{u.lastName}</td>
      <td style={{ ...tdStyle, color: "#94A3B8", whiteSpace: "nowrap" }}>{u.telephone}</td>
      <td style={{ ...tdStyle, color: "#60A5FA" }}>{u.email}</td>
      <td style={tdStyle}><RoleBadge role={u.role} /></td>
      <td style={tdStyle}><ActiveBadge active={u.active} /></td>
      <td style={{ ...tdStyle, color: "#94A3B8", whiteSpace: "nowrap" }}>{fmt(u.createdAt)}</td>
      <td style={tdStyle}>
        <div style={{ display: "flex", gap: 4 }}>
          <IBtn title="Edit" color="#60A5FA"><Pencil size={14} /></IBtn>
          <IBtn title="Delete" color="#F87171" onClick={() => onDelete(u.id)} ><Trash2 size={14} /></IBtn>
        </div>
      </td>
    </tr>
  );
}

function IBtn({ children, title, color, onClick }: { children: React.ReactNode; title: string; color: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? "#0F172A" : "none", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: h ? color : "#475569", display: "flex", alignItems: "center", transition: "color 0.15s, background 0.15s" }}>
      {children}
    </button>
  );
}

const thStyle: React.CSSProperties = { padding: "11px 14px", textAlign: "left", color: "#64748B", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" };
const tdStyle: React.CSSProperties = { padding: "13px 14px", color: "#E2E8F0", verticalAlign: "middle" };
const filterInput: React.CSSProperties = { background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 13, padding: "7px 12px", outline: "none", height: 36, colorScheme: "dark" };
const addBtn: React.CSSProperties = { background: "#2563EB", border: "none", borderRadius: 8, color: "#fff", fontSize: 13, fontWeight: 600, padding: "8px 18px", cursor: "pointer", height: 38, display: "flex", alignItems: "center", gap: 6 };
