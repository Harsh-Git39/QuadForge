import { useState } from 'react';
import axios from 'axios';
import { Brain, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ComplianceCheck() {
  const [tenderRequirements, setTenderRequirements] = useState('');
  const [bidSummary, setBidSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckCompliance = async (e) => {
    e.preventDefault();
    
    if (!tenderRequirements || !bidSummary) {
      toast.error('All fields required');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/compliance`, {
        tenderRequirements,
        bidSummary
      });

      setResult(response.data);
      toast.success('AI analysis complete');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error(error.response?.data?.detail || 'System error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="grid-background"></div>
      
      <div className="page-header">
        <h1 className="page-title">
          <Brain className="page-title-icon" size={48} />
          AI COMPLIANCE
        </h1>
        <p className="page-description">
          Google Gemini 3 Flash | Real-time violation detection | Sub-second analysis
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">TENDER REQUIREMENTS</h2>
            <p className="card-description">Official tender specifications</p>
          </div>
          <textarea
            data-testid="tender-requirements-input"
            className="textarea-field"
            placeholder="Must include: ISO certification, 2-year warranty, 30-day delivery..."
            value={tenderRequirements}
            onChange={(e) => setTenderRequirements(e.target.value)}
            required
          />
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">BID SUMMARY</h2>
            <p className="card-description">Proposal to analyze</p>
          </div>
          <textarea
            data-testid="bid-summary-input"
            className="textarea-field"
            placeholder="We offer ISO 9001 certification, 3-year warranty, 25-day delivery..."
            value={bidSummary}
            onChange={(e) => setBidSummary(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        data-testid="check-compliance-button"
        onClick={handleCheckCompliance}
        className="btn btn-primary btn-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <div className="spinner" />
            AI ANALYZING...
          </>
        ) : (
          <>
            <Brain size={20} />
            RUN COMPLIANCE CHECK
          </>
        )}
      </button>

      {result && (
        <div data-testid="compliance-result" className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {result.violations.length === 1 && result.violations[0] === "No violations detected" ? (
                <>
                  <CheckCircle style={{ color: 'var(--accent-green)' }} size={32} />
                  <h2 className="card-title" style={{ color: 'var(--accent-green)' }}>COMPLIANT</h2>
                </>
              ) : (
                <>
                  <AlertTriangle style={{ color: '#ff0000' }} size={32} />
                  <h2 className="card-title" style={{ color: '#ff0000' }}>VIOLATIONS DETECTED</h2>
                </>
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI ANALYSIS</h3>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-primary)', fontFamily: 'JetBrains Mono', fontSize: '0.9rem', lineHeight: '1.8', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
              {result.analysis}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VIOLATIONS SUMMARY</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {result.violations.map((violation, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-primary)' }}>
                  {violation === "No violations detected" ? (
                    <CheckCircle style={{ color: 'var(--accent-green)', minWidth: '20px' }} size={20} />
                  ) : (
                    <AlertTriangle style={{ color: '#ff0000', minWidth: '20px' }} size={20} />
                  )}
                  <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{violation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
