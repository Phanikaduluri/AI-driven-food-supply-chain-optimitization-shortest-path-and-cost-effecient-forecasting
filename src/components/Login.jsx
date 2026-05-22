import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Truck } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      onLogin(); // Mock login logic
    } else {
      setError(true);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, rgba(0, 184, 212, 0.05), rgba(168, 85, 247, 0.05))',
    }}>
      <div className="glass-panel" style={{ padding: '40px', width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--primary-glow)',
            color: 'var(--primary)',
            marginBottom: '16px'
          }}>
            <Truck size={32} />
          </div>
          <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>ACAR Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to manage logistics policies</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label className="stat-label" style={{ display: 'block', marginBottom: '8px' }}>Administrator ID / Email</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="admin@logistics.gov"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(false); }}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.8)',
                  color: 'var(--text-main)',
                  fontFamily: 'Outfit',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
          </div>

          <div>
            <label className="stat-label" style={{ display: 'block', marginBottom: '8px' }}>Security Passkey</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(false); }}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.8)',
                  color: 'var(--text-main)',
                  fontFamily: 'Outfit',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center' }}>
              Please enter valid administration credentials.
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <ShieldCheck size={20} /> Authenticate Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
