import { useState } from 'react';
import axios from 'axios';
import { Lock, Upload, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function UploadBid() {
  const [file, setFile] = useState(null);
  const [tenderId, setTenderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success(`File locked: ${selectedFile.name}`);
    }
  };

  const handleSealBid = async (e) => {
    e.preventDefault();
    
    if (!file || !tenderId) {
      toast.error('Incomplete data detected');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tender_id', tenderId);

      const response = await axios.post(`${API}/seal`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);
      toast.success('Bid encrypted and sealed');
      
      setFile(null);
      setTenderId('');
      document.getElementById('file-input').value = '';
      
    } catch (error) {
      console.error('Sealing failed:', error);
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
          <Shield className="page-title-icon" size={48} />
          BID ENCRYPTION
        </h1>
        <p className="page-description">
          Military-grade AES-256 encryption + SHA-3-512 hashing | Autonomous notification system
        </p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">SEAL YOUR BID</h2>
          <p className="card-description">Upload document for cryptographic sealing</p>
        </div>
        
        <form onSubmit={handleSealBid}>
          <div className="input-group">
            <label className="input-label">TENDER ID</label>
            <input
              data-testid="tender-id-input"
              type="text"
              className="input-field"
              placeholder="TENDER-2025-001"
              value={tenderId}
              onChange={(e) => setTenderId(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">BID DOCUMENT</label>
            <div className="upload-zone">
              <Upload className="upload-icon" size={48} />
              <input
                id="file-input"
                data-testid="file-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                required
              />
              <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                <span className="upload-text">
                  <span className="upload-text-highlight">CLICK TO SELECT</span>
                  {' '}or drag and drop
                </span>
              </label>
              {file && (
                <p style={{ marginTop: '1rem', color: 'var(--accent-green)' }}>
                  ✓ {file.name}
                </p>
              )}
            </div>
          </div>

          <button
            data-testid="seal-bid-button"
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner" />
                ENCRYPTING...
              </>
            ) : (
              <>
                <Lock size={20} />
                SEAL BID
              </>
            )}
          </button>
        </form>

        {result && (
          <div data-testid="seal-result" className="result-box result-success">
            <div className="result-header">
              <CheckCircle className="result-icon" size={24} />
              <h3 className="result-title">ENCRYPTION COMPLETE</h3>
            </div>
            <div className="result-content">
              <div className="result-item">
                <span className="result-label">BIDDER ID</span>
                <div className="result-value">{result.bidderId}</div>
              </div>
              <div className="result-item">
                <span className="result-label">CRYPTOGRAPHIC HASH (SHA-3-512)</span>
                <div className="result-value">{result.bidHash}</div>
              </div>
              <div className="result-item">
                <span className="result-label">STATUS</span>
                <div className="result-value">
                  {result.automated ? '✓ AUTO-NOTIFICATION SENT' : 'SEALED'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
