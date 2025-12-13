import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getModelInfo, getMyPrediction, predictAndSave } from '../../utils/api';

const defaultForm = {
  total_submissions: 0,
  avg_submission_rating: 0,
  avg_exam_score: 0,
  total_journeys_completed: 0,
  avg_speed_ratio: 0,
};

export default function LearningInsightContainer() {
  const profile = useSelector((state) => state.profile.data);

  const [form, setForm] = useState(defaultForm);
  const [modelInfo, setModelInfo] = useState(null);
  const [infoLoading, setInfoLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loadingPrediction, setLoadingPrediction] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setInfoLoading(true);
      const res = await getModelInfo();
      if (!active) return;
      if (!res.error) {
        setModelInfo(res.data);
      }
      setInfoLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const featureOrder = useMemo(() => modelInfo?.features || [], [modelInfo]);
  const learningStyles = useMemo(
    () => modelInfo?.learning_styles || [],
    [modelInfo]
  );

  const buildPayloadFromState = () => ({
    total_submissions: form.total_submissions,
    avg_submission_rating: form.avg_submission_rating,
    avg_exam_score: form.avg_exam_score,
    total_journeys_completed: form.total_journeys_completed,
    avg_speed_ratio: form.avg_speed_ratio,
  });

  const getMyPrediction = async (userId) => {
    const res = await fetch(`/api/predict/me?user_id=${userId}`);

    const text = await res.text();

    try {
      const json = JSON.parse(text);

      if (!res.ok) {
        throw new Error(json.error || 'Failed to load prediction');
      }

      return json;
    } catch {
      console.error('Non-JSON response from /api/predict/me:', text);
      throw new Error('Server returned invalid response');
    }
  };

  const handleLoadFromDB = async () => {
    if (!profile?.id) return;

    setLoadingPrediction(true);
    setError('');

    const res = await getMyPrediction(profile.id);

    if (res.error) {
      setError(res.message || 'Failed to load data');
    } else {
      const d = res.data;

      setForm({
        total_submissions: d.total_submissions ?? 0,
        avg_submission_rating: d.avg_submission_rating ?? 0,
        avg_exam_score: d.avg_exam_score ?? 0,
        total_journeys_completed: d.total_journeys_completed ?? 0,
        avg_speed_ratio: d.avg_speed_ratio ?? 0,
      });

      setResult({
        learningStyle: d.learning_style,
        cluster: d.cluster,
        confidence: d.confidence,
        distance_to_centroid: d.distance_to_centroid,
        recommendation: d.recommendation,
      });
    }

    setLoadingPrediction(false);
  };

  const hasLoadedData =
    form.total_submissions !== 0 ||
    form.avg_submission_rating !== 0 ||
    form.avg_exam_score !== 0 ||
    form.total_journeys_completed !== 0 ||
    form.avg_speed_ratio !== 0;

  const handlePredict = async () => {
    if (!profile?.id) return;

    setError('');
    setPredicting(true);

    const payload = {
      ...buildPayloadFromState(),
      user_id: profile.id,
    };

    const res = await predictAndSave(payload);

    if (res.error) {
      setError(res.message || 'Prediction failed');
    } else {
      setResult(res.data);
    }

    setPredicting(false);
  };

  return (
    <div className="insight-card">
      <div className="insight-header">
        <div>
          <p className="eyebrow">Model</p>
          <h4 className="title">Learning Style Recommender</h4>
          {modelInfo && (
            <p className="muted">
              v{modelInfo.version} · {modelInfo.description}
            </p>
          )}
        </div>
        <div className="meta">
          <span className="pill neutral">{featureOrder.length} features</span>
          <span className="pill positive">
            {learningStyles.length} learning styles
          </span>
        </div>
      </div>

      <div className="insight-grid">
        {featureOrder.map((featureKey) => (
          <label key={featureKey} className="input-group">
            <span>{featureKey.replaceAll('_', ' ')}</span>
            <input
              type="number"
              step="any"
              value={form[featureKey] ?? 0}
              readOnly
              disabled
            />
          </label>
        ))}

        {featureOrder.length === 0 && (
          <div className="skeleton-grid">
            {infoLoading ? 'Loading model...' : 'Model info unavailable'}
          </div>
        )}
      </div>

      <div className="insight-actions">
        <button
          className="btn ghost"
          onClick={handleLoadFromDB}
          disabled={!profile?.id || loadingPrediction}
        >
          {loadingPrediction ? 'Loading...' : 'Load My Data'}
        </button>

        <button
          className="btn primary"
          onClick={handlePredict}
          disabled={!profile?.id || predicting || !hasLoadedData}
        >
          {predicting ? 'Working...' : 'Recompute & Save'}
        </button>
      </div>

      {loadingPrediction && (
        <div className="alert neutral">Loading your latest prediction...</div>
      )}
      {error && <div className="alert error">{error}</div>}

      {result && (
        <div className="result-card">
          <div className="result-main">
            <p className="eyebrow">Predicted Learning Style</p>
            <h3 className="result-title">{result.learningStyle}</h3>
            <p className="muted">Cluster #{result.cluster}</p>
          </div>
          <div className="result-meta">
            <div className="stat">
              <span>Confidence</span>
              <strong>{(result.confidence * 100).toFixed(1)}%</strong>
            </div>
            <div className="stat">
              <span>Distance to centroid</span>
              <strong>{result.distance_to_centroid?.toFixed(3)}</strong>
            </div>
          </div>
          {result.recommendation && (
            <div className="recommendation">
              <p className="eyebrow">AI Recommendation</p>

              {typeof result.recommendation === 'object' ? (
                <>
                  {result.recommendation.judul_saran && (
                    <h4 className="recommendation-title">
                      {result.recommendation.judul_saran}
                    </h4>
                  )}
                  {result.recommendation.deskripsi_saran && (
                    <p className="recommendation-text">
                      {result.recommendation.deskripsi_saran}
                    </p>
                  )}
                  {result.recommendation.action_button && (
                    <button className="btn secondary">
                      {result.recommendation.action_button}
                    </button>
                  )}
                </>
              ) : (
                <p className="recommendation-text">{result.recommendation}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
