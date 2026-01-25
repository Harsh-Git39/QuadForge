import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, FileText, Calendar, DollarSign, CheckSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CreateTender() {
  const [formData, setFormData] = useState({
    tenderId: '',
    description: '',
    budget: '',
    deadline: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTenders, setActiveTenders] = useState([]);

  useEffect(() => {
    fetchActiveTenders();
  }, []);

  const fetchActiveTenders = async () => {
    try {
      const response = await axios.get(`${API}/tenders`);
      setActiveTenders(response.data);
    } catch (error) {
      console.error('Failed to fetch tenders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(`${API}/tender`, {
        tenderId: formData.tenderId,
        description: formData.description,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
        requirements: formData.requirements
      });

      setResult(response.data);
      toast.success('Tender created successfully');
      
      // Reset form
      setFormData({
        tenderId: '',
        description: '',
        budget: '',
        deadline: '',
        requirements: ''
      });
      
      // Refresh tender list
      fetchActiveTenders();
    } catch (error) {
      console.error('Error creating tender:', error);
      toast.error(error.response?.data?.detail || 'Failed to create tender');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="page-container">
      <div className="grid-background"></div>
      
      <div className="page-header">
        <h1 className="page-title">
          <Plus className="page-title-icon" size={48} />
          CREATE TENDER
        </h1>
        <p className="page-description">
          Define tender requirements | Set compliance criteria | Publish for bidders
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Create Tender Form */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">NEW TENDER</h2>
            <p className="card-description">Create tender with compliance requirements</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">
                <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                TENDER ID
              </label>
              <input
                data-testid="tender-id-input"
                type="text"
                name="tenderId"
                className="input-field"
                placeholder="HOSPITAL-MED-2025"
                value={formData.tenderId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                DESCRIPTION
              </label>
              <textarea
                data-testid="description-input"
                name="description"
                className="textarea-field"
                placeholder="Medical equipment procurement for City Hospital..."
                value={formData.description}
                onChange={handleChange}
                style={{ minHeight: '100px' }}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <DollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                BUDGET (USD)
              </label>
              <input
                data-testid="budget-input"
                type="number"
                name="budget"
                className="input-field"
                placeholder="5000000"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                DEADLINE
              </label>
              <input
                data-testid="deadline-input"
                type="datetime-local"
                name="deadline"
                className="input-field"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                <CheckSquare size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                COMPLIANCE REQUIREMENTS
              </label>
              <textarea
                data-testid="requirements-input"
                name="requirements"
                className="textarea-field"
                placeholder="1. FDA certification required&#10;2. Minimum 2-year warranty&#10;3. ISO 13485 compliance&#10;4. Delivery within 60 days&#10;5. Budget ceiling: $5,000,000"
                value={formData.requirements}
                onChange={handleChange}
                style={{ minHeight: '180px' }}
                required
              />
            </div>

            <button
              data-testid="create-tender-button"
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  CREATING...
                </>
              ) : (
                <>
                  <Plus size={20} />
                  CREATE TENDER
                </>
              )}
            </button>
          </form>

          {result && (
            <div data-testid="create-result" className="result-box result-success" style={{ marginTop: '1.5rem' }}>
              <div className="result-header">
                <CheckSquare className="result-icon" size={24} />
                <h3 className="result-title">TENDER CREATED</h3>
              </div>
              <div className="result-content">
                <div className="result-item">
                  <span className="result-label">TENDER HASH</span>
                  <div className="result-value">{result.updateHash}</div>
                </div>
                <div className="result-item">
                  <span className="result-label">TIMESTAMP</span>
                  <div className="result-value">{result.timestamp}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Tenders List */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">ACTIVE TENDERS</h2>
            <p className="card-description">Currently open for bidding</p>
          </div>
          
          {activeTenders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
              <p>No active tenders yet</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeTenders.map((tender, index) => (
                <div 
                  key={index} 
                  data-testid={`tender-${index}`}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: 'var(--accent-green)',
                      fontFamily: 'JetBrains Mono'
                    }}>
                      {tender.tenderId}
                    </h3>
                    <span className="audit-badge" style={{ fontSize: '0.7rem' }}>
                      {tender.status}
                    </span>
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {tender.description}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                      <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
                        ${tender.budget?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Deadline:</span>
                      <span style={{ color: 'var(--text-primary)', marginLeft: '0.5rem' }}>
                        {tender.deadline ? new Date(tender.deadline).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
