import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../utils/supabase';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const ADMIN_EMAILS = [
  'admin@krishaksaarthi.com',
  'sarveshchonde@gmail.com',
  'chsrvindia@gmail.com'
];

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [email, setEmail] = useState('chsrvindia@gmail.com');
  const [password, setPassword] = useState('chsrvindia');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect
  useEffect(() => {
    if (localStorage.getItem('isAdminOverride') === 'true') {
      navigate('/admin/farmers', { replace: true });
      return;
    }
    if (user) {
      if (ADMIN_EMAILS.includes(user.email ?? '')) {
        navigate('/admin/farmers', { replace: true });
      } else {
        // Logged in but not admin -> standard app
        navigate('/app', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const safeEmail = email.trim().toLowerCase();

    // Hardcoded bypass for the specific request
    if (safeEmail === 'chsrvindia@gmail.com' && password === 'chsrvindia') {
      localStorage.setItem('isAdminOverride', 'true');
      navigate('/admin/farmers', { replace: true });
      return;
    }

    // Minor client-side check just for UX
    if (!ADMIN_EMAILS.includes(safeEmail)) {
      setError('Unauthorized: Email is not registered as an admin.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      // On success, useEffect above will handle redirection
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Decorative background elements */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Back to App */}
      <button onClick={() => navigate('/')} style={styles.backButton}>
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={styles.card}
      >
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <ShieldCheck size={32} color="#15803d" />
          </div>
          <h1 style={styles.title}>Admin Portal</h1>
          <p style={styles.subtitle}>Sign in to manage farmer accounts</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={styles.errorBox}>
              {error}
            </motion.div>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin Email</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} color="#9ca3af" style={styles.inputIcon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Secure Login'}
          </button>
        </form>

        <div style={styles.footer}>
          This portal is restricted to authorized administrative personnel only.
        </div>
      </motion.div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100dvh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    fontFamily: 'Nunito, sans-serif',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: -150,
    left: -100,
    width: 400,
    height: 400,
    background: '#dcfce7',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.6,
  },
  blob2: {
    position: 'absolute',
    bottom: -150,
    right: -100,
    width: 500,
    height: 500,
    background: '#cffafe',
    borderRadius: '50%',
    filter: 'blur(100px)',
    opacity: 0.6,
  },
  backButton: {
    position: 'absolute',
    top: 24,
    left: 24,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: 12,
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 700,
    color: '#475569',
    cursor: 'pointer',
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: 'white',
    borderRadius: 24,
    padding: '40px 32px',
    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
    border: '1px solid #f1f5f9',
    position: 'relative',
    zIndex: 2,
    margin: 20,
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    background: '#f0fdf4',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    boxShadow: '0 4px 12px rgba(21, 128, 61, 0.1)',
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 900,
    color: '#0f172a',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: 14,
    color: '#64748b',
    fontWeight: 500,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  errorBox: {
    background: '#fef2f2',
    border: '1px solid #fee2e2',
    color: '#ef4444',
    padding: '12px 16px',
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'center',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: 800,
    letterSpacing: '0.05em',
    color: '#64748b',
    marginLeft: 4,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 42px',
    background: '#f8fafc',
    border: '2px solid transparent',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 600,
    color: '#1e293b',
    outline: 'none',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  },
  submitBtn: {
    width: '100%',
    padding: '16px',
    background: '#15803d',
    color: 'white',
    border: 'none',
    borderRadius: 14,
    fontSize: 16,
    fontWeight: 800,
    marginTop: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)',
    transition: 'transform 0.1s, box-shadow 0.2s',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 1.5,
    fontWeight: 500,
  },
};
