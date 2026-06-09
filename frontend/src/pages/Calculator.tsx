import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface CalculationResult {
  id: string;
  userId: string;
  energyEmission: number;
  transportEmission: number;
  foodEmission: number;
  totalEmission: number;
  suggestions: string[];
  pointsAwarded: number;
}

export const Calculator: React.FC = () => {
  const { token, updatePoints } = useAuth();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!inputText.trim()) {
      setError('Please describe your activities first.');
      return;
    }

    setLoading(true);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/footprint/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(data.data);
        // Add points in context
        updatePoints(data.data.pointsAwarded || 10);
        setInputText('');
      } else {
        setError(data.message || 'Failed to analyze footprint.');
      }
    } catch (err) {
      console.error('Calculation error:', err);
      setError('Failed to reach backend services. Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="calculator-container fade-in">
      <header className="calculator-intro">
        <h1>AI Carbon Sustainability Assistant</h1>
        <p className="subtitle">
          Describe your daily activities in natural language (e.g., transport modes, food consumption, electricity usage), and our Gemini model will estimate your footprint and reward points!
        </p>
      </header>

      <section className="grid-2 calculator-layout" aria-label="Carbon Calculation Workspace">
        {/* Input Panel */}
        <div className="input-panel glass-card">
          <h3>Describe your day</h3>
          <form onSubmit={handleCalculate} className="calculator-form">
            <div className="form-group">
              <label className="form-label" htmlFor="chat-input">DAILY ACTIVITIES CHAT</label>
              <textarea
                id="chat-input"
                className="form-input text-area-input"
                placeholder="Example: I drove 20 miles in an SUV, ate a beef cheeseburger for dinner, and left the AC running for 4 hours."
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
                aria-required="true"
                aria-label="Daily activities description input field"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading} aria-busy={loading} aria-label="Submit Log to AI">
              {loading ? (
                <>
                  <span className="mini-spinner"></span> Analyzing Activities...
                </>
              ) : (
                'Submit Log to AI'
              )}
            </button>
          </form>

          {error && <div className="alert-error mt-4" role="alert" aria-live="assertive">{error}</div>}
        </div>

        {/* Results Panel */}
        <div className="results-panel" aria-live="polite">
          {loading && (
            <div className="results-placeholder glass-card loading-glow flex-center flex-direction-column">
              <div className="spinner" role="progressbar" aria-label="Analyzing footprints"></div>
              <h4>AI Sustainability Engine Running</h4>
              <p>Analyzing your logs, parsing emissions, and calculating points...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="results-placeholder glass-card flex-center flex-direction-column">
              <span className="placeholder-icon" role="img" aria-label="Seedling">🌱</span>
              <h4>Waiting for logs</h4>
              <p>Submit your daily routine details on the left to see your carbon analysis here.</p>
            </div>
          )}

          {!loading && result && (
            <div className="results-card glass-card fade-in">
              <div className="results-header flex-between">
                <h3>Calculation Analysis</h3>
                <span className="points-award-badge">+{result.pointsAwarded} Points!</span>
              </div>

              <div className="total-emission-banner flex-between">
                <div>
                  <span className="banner-label">TOTAL EMISSIONS LOGGED</span>
                  <h2>{result.totalEmission} kg CO2</h2>
                </div>
                <span className="eco-rating-badge">
                  {result.totalEmission < 15 ? (
                    <>
                      <span role="img" aria-label="Leaf">🍃</span> Low Footprint
                    </>
                  ) : (
                    <>
                      <span role="img" aria-label="Warning sign">⚠️</span> Alert: Moderate/High
                    </>
                  )}
                </span>
              </div>

              <div className="emissions-sub-details">
                <h4>Breakdown details</h4>
                <div className="detail-row flex-between">
                  <span>
                    <span role="img" aria-label="Lightning bolt">⚡</span> Energy Sector
                  </span>
                  <strong>{result.energyEmission} kg CO2</strong>
                </div>
                <div className="detail-row flex-between">
                  <span>
                    <span role="img" aria-label="Automobile">🚗</span> Transport Sector
                  </span>
                  <strong>{result.transportEmission} kg CO2</strong>
                </div>
                <div className="detail-row flex-between">
                  <span>
                    <span role="img" aria-label="Meat cut">🥩</span> Diet & Food Sector
                  </span>
                  <strong>{result.foodEmission} kg CO2</strong>
                </div>
              </div>

              <div className="recommendations-container">
                <h4>Tailored Sustainability Tips</h4>
                <div className="tips-list">
                  {result.suggestions.map((tip, idx) => (
                    <div key={idx} className="tip-item">
                      <span className="tip-number">{idx + 1}</span>
                      <p className="tip-text">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
