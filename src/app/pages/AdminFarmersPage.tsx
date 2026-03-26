import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabase';
import { useApp } from '../context/AppContext';
import {
  Search, Users, Loader2, ChevronLeft, ChevronRight,
  ArrowUpDown, Sprout, ShieldCheck, MapPin, Phone,
  Calendar, UserCheck, UserX, Clock,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────────
   Type for a farmer row coming from the Supabase `farmers` table
   ────────────────────────────────────────────────────────────────────────── */
interface Farmer {
  id: string;
  username: string;
  crop: string;
  contact: string;
  location: string;
  status: string;
  created_at: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────────────────────────── */
const PAGE_SIZE = 10;

const ADMIN_EMAILS = [
  'admin@krishaksaarthi.com',
  'sarveshchonde@gmail.com',
  'chsrvindia@gmail.com',
];

/* ──────────────────────────────────────────────────────────────────────────
   Helper — format date to readable string
   ────────────────────────────────────────────────────────────────────────── */
function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Status badge component
   ────────────────────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase() ?? '';
  let bg = '#f3f4f6';
  let color = '#6b7280';
  let dotColor = '#9ca3af';
  let label = status || 'Unknown';

  if (s === 'active') {
    bg = '#f0fdf4'; color = '#15803d'; dotColor = '#22c55e';
  } else if (s === 'inactive') {
    bg = '#fef2f2'; color = '#dc2626'; dotColor = '#ef4444';
  } else if (s === 'pending') {
    bg = '#fffbeb'; color = '#d97706'; dotColor = '#f59e0b';
  }

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 12px', borderRadius: 999,
        background: bg, color, fontSize: 13, fontWeight: 700,
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
      {label}
    </span>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */
export default function AdminFarmersPage() {
  const navigate = useNavigate();
  const { user } = useApp();

  /* ── State ─────────────────────────────────────────────────────────────── */
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'username' | 'created_at'>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [authChecked, setAuthChecked] = useState(false);

  /* ── Admin gate — redirect non-admin users ─────────────────────────────── */
  useEffect(() => {
    // Check local override first for hardcoded hackathon bypass
    if (localStorage.getItem('isAdminOverride') === 'true') {
      setAuthChecked(true);
      return;
    }

    // Wait until we know who the user is
    if (user === undefined) return;
    const email = user?.email ?? '';
    if (!ADMIN_EMAILS.includes(email)) {
      navigate('/app', { replace: true });
    } else {
      setAuthChecked(true);
    }
  }, [user, navigate]);

  /* ── Fetch farmers on mount ────────────────────────────────────────────── */
  useEffect(() => {
    if (!authChecked) return;

    const fetchFarmers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('farmers')
          .select('id, username, crop, contact, location, status, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFarmers(data ?? []);
      } catch (err) {
        console.error('[AdminFarmers] Fetch error:', err);
        setFarmers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmers();
  }, [authChecked]);

  /* ── Derived data: search → sort → paginate ────────────────────────────── */
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return farmers;
    return farmers.filter(
      (f) =>
        f.username?.toLowerCase().includes(q) ||
        f.location?.toLowerCase().includes(q),
    );
  }, [farmers, searchQuery]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const valA = (a[sortField] ?? '').toLowerCase();
      const valB = (b[sortField] ?? '').toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Reset to page 1 when search changes
  useEffect(() => { setCurrentPage(1); }, [searchQuery]);

  /* ── Sorting toggle ───────────────────────────────────────────────────── */
  const toggleSort = (field: 'username' | 'created_at') => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  /* ── Stats ─────────────────────────────────────────────────────────────── */
  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter((f) => f.status?.toLowerCase() === 'active').length;
  const pendingFarmers = farmers.filter((f) => f.status?.toLowerCase() === 'pending').length;
  const inactiveFarmers = farmers.filter((f) => f.status?.toLowerCase() === 'inactive').length;

  /* ── Render gate — wait for auth check ─────────────────────────────────── */
  if (!authChecked) {
    return (
      <div style={styles.pageOverlay}>
        <div style={styles.fullCenter}>
          <Loader2 size={32} color="#15803d" className="animate-spin" />
          <p style={{ color: '#6b7280', fontFamily: 'Nunito, sans-serif', marginTop: 12, fontWeight: 600 }}>
            Verifying admin access…
          </p>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div style={styles.pageOverlay}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: -30, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                <ShieldCheck size={22} color="#86efac" />
              </div>
              <div>
                <h1 style={{ color: 'white', margin: 0, fontSize: 22, fontWeight: 900, fontFamily: 'Nunito, sans-serif' }}>
                  Admin Dashboard
                </h1>
                <p style={{ color: '#86efac', margin: 0, fontSize: 13, fontWeight: 600 }}>
                  Registered Farmers Overview
                </p>
              </div>
            </div>
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate('/app')}
            style={{
              position: 'absolute', top: 20, right: 20, zIndex: 2,
              background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: 12, padding: '8px 16px', color: 'white',
              fontSize: 13, fontWeight: 700, fontFamily: 'Nunito, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          >
            ← Back to App
          </button>
        </div>
      </header>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <main style={styles.main}>

        {/* ── Stats Cards ────────────────────────────────────────────────────── */}
        <div style={styles.statsGrid}>
          {[
            { icon: Users, label: 'Total Farmers', value: totalFarmers, bg: '#f0fdf4', iconBg: '#dcfce7', iconColor: '#15803d', valueColor: '#14532d' },
            { icon: UserCheck, label: 'Active', value: activeFarmers, bg: '#f0fdf4', iconBg: '#dcfce7', iconColor: '#16a34a', valueColor: '#15803d' },
            { icon: Clock, label: 'Pending', value: pendingFarmers, bg: '#fffbeb', iconBg: '#fef3c7', iconColor: '#d97706', valueColor: '#92400e' },
            { icon: UserX, label: 'Inactive', value: inactiveFarmers, bg: '#fef2f2', iconBg: '#fee2e2', iconColor: '#dc2626', valueColor: '#991b1b' },
          ].map(({ icon: Icon, label, value, bg, iconBg, iconColor, valueColor }) => (
            <div key={label} style={{ ...styles.statCard, background: bg }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={22} color={iconColor} />
              </div>
              <div>
                <p style={{ ...styles.statLabel }}>{label}</p>
                <p style={{ ...styles.statValue, color: valueColor }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search Bar ─────────────────────────────────────────────────────── */}
        <div style={styles.searchContainer}>
          <Search size={18} color="#9ca3af" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            id="admin-farmer-search"
            type="text"
            placeholder="Search by username or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: '#f3f4f6', border: 'none', borderRadius: 8,
                padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#6b7280',
                cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* ── Table Card ─────────────────────────────────────────────────────── */}
        <div style={styles.tableCard}>

          {/* Table Header Bar */}
          <div style={styles.tableHeader}>
            <Sprout size={18} color="#15803d" />
            <span style={{ fontSize: 15, fontWeight: 800, color: '#15803d' }}>
              Farmer Records
            </span>
            <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div style={{ ...styles.fullCenter, padding: '60px 0' }}>
              <div style={styles.spinnerContainer}>
                <Loader2 size={36} color="#15803d" style={{ animation: 'spin-slow 1s linear infinite' }} />
              </div>
              <p style={{ color: '#6b7280', fontFamily: 'Nunito, sans-serif', marginTop: 16, fontWeight: 600, fontSize: 15 }}>
                Loading farmer data…
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filtered.length === 0 && (
            <div style={{ ...styles.fullCenter, padding: '60px 20px' }}>
              <div style={{ width: 72, height: 72, borderRadius: 20, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Users size={32} color="#15803d" />
              </div>
              <p style={{ color: '#374151', fontFamily: 'Nunito, sans-serif', fontSize: 17, fontWeight: 800, margin: 0 }}>
                {searchQuery ? 'No matching farmers found' : 'No registered farmers found.'}
              </p>
              <p style={{ color: '#9ca3af', fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 500, margin: '8px 0 0', textAlign: 'center' }}>
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : 'Farmers will appear here once they register on the platform.'}
              </p>
            </div>
          )}

          {/* Data Table */}
          {!loading && filtered.length > 0 && (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>#</th>
                      <th style={styles.th}>
                        <button onClick={() => toggleSort('username')} style={styles.sortBtn}>
                          Username
                          <ArrowUpDown size={13} color={sortField === 'username' ? '#15803d' : '#9ca3af'} />
                        </button>
                      </th>
                      <th style={styles.th}>Crop</th>
                      <th style={styles.th}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Phone size={13} color="#6b7280" /> Contact
                        </span>
                      </th>
                      <th style={styles.th}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={13} color="#6b7280" /> Location
                        </span>
                      </th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>
                        <button onClick={() => toggleSort('created_at')} style={styles.sortBtn}>
                          <Calendar size={13} color={sortField === 'created_at' ? '#15803d' : '#9ca3af'} />
                          Signup Date
                          <ArrowUpDown size={13} color={sortField === 'created_at' ? '#15803d' : '#9ca3af'} />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((farmer, idx) => (
                      <tr
                        key={farmer.id}
                        style={{
                          background: idx % 2 === 0 ? 'white' : '#fafafa',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#fafafa')}
                      >
                        <td style={styles.td}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#9ca3af' }}>
                            {(currentPage - 1) * PAGE_SIZE + idx + 1}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 10,
                              background: '#f0fdf4', display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0, fontWeight: 900, fontSize: 14,
                              color: '#15803d', fontFamily: 'Nunito, sans-serif',
                            }}>
                              {farmer.username?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                              {farmer.username || '—'}
                            </span>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '4px 10px', borderRadius: 999,
                            background: '#f0fdf4', color: '#15803d',
                            fontSize: 13, fontWeight: 700,
                          }}>
                            🌾 {farmer.crop || '—'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                            {farmer.contact || '—'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 600, color: '#374151' }}>
                            <MapPin size={14} color="#9ca3af" />
                            {farmer.location || '—'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <StatusBadge status={farmer.status} />
                        </td>
                        <td style={styles.td}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
                            {formatDate(farmer.created_at)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Pagination ──────────────────────────────────────────────────── */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{
                        ...styles.pageBtn,
                        opacity: currentPage === 1 ? 0.4 : 1,
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{
                        ...styles.pageBtn,
                        opacity: currentPage === totalPages ? 0.4 : 1,
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
          <p style={{ fontSize: 12, color: '#9ca3af', fontFamily: 'Nunito, sans-serif', fontWeight: 500 }}>
            Krishak Saarthi · Admin Panel · © 2026
          </p>
        </div>
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STYLES
   ══════════════════════════════════════════════════════════════════════════ */
const styles: Record<string, React.CSSProperties> = {
  /* Full-screen overlay to break out of the 430px phone frame */
  pageOverlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9999,
    background: '#f7f5f0',
    fontFamily: 'Nunito, sans-serif',
    overflowY: 'auto' as const,
  },
  header: {
    background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
    position: 'relative',
    overflow: 'hidden',
  },
  headerInner: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '28px 24px 32px',
    position: 'relative',
  },
  main: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '0 24px',
    marginTop: -8,
  },
  /* Stats */
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 20,
    marginTop: 20,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '20px 22px',
    borderRadius: 18,
    boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: '#6b7280',
    margin: 0,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.04em',
    fontFamily: 'Nunito, sans-serif',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    margin: '2px 0 0',
    fontFamily: 'Nunito, sans-serif',
    lineHeight: 1,
  },
  /* Search */
  searchContainer: {
    position: 'relative' as const,
    marginBottom: 20,
  },
  searchInput: {
    width: '100%',
    padding: '14px 16px 14px 46px',
    borderRadius: 16,
    border: '2px solid #e5e7eb',
    background: 'white',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: 'Nunito, sans-serif',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box' as const,
  },
  /* Table Card */
  tableCard: {
    borderRadius: 20,
    overflow: 'hidden',
    background: 'white',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    marginBottom: 20,
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '16px 24px',
    background: '#f0fdf4',
    borderBottom: '1.5px solid #dcfce7',
    fontFamily: 'Nunito, sans-serif',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontFamily: 'Nunito, sans-serif',
  },
  th: {
    textAlign: 'left' as const,
    padding: '14px 16px',
    fontSize: 12,
    fontWeight: 800,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    borderBottom: '2px solid #f3f4f6',
    whiteSpace: 'nowrap' as const,
    fontFamily: 'Nunito, sans-serif',
    background: '#fafafa',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f3f4f6',
    whiteSpace: 'nowrap' as const,
    verticalAlign: 'middle' as const,
  },
  sortBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: 'none',
    border: 'none',
    fontSize: 12,
    fontWeight: 800,
    color: '#6b7280',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    padding: 0,
  },
  /* Pagination */
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderTop: '1px solid #f3f4f6',
    fontFamily: 'Nunito, sans-serif',
  },
  pageBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '8px 16px',
    borderRadius: 12,
    border: '2px solid #e5e7eb',
    background: 'white',
    fontSize: 13,
    fontWeight: 700,
    color: '#374151',
    fontFamily: 'Nunito, sans-serif',
    transition: 'all 0.2s',
  },
  /* Utility */
  fullCenter: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinnerContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    background: '#f0fdf4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
