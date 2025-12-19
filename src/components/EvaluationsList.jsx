import { useState, useEffect } from 'react';
import { evaluationsApi } from '../services/api';

function EvaluationsList({ onLoad, onClose }) {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setLoading(true);
      const result = await evaluationsApi.getAll();
      setEvaluations(result.evaluations || []);
    } catch (err) {
      setError('Failed to load evaluations. Is the server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (id) => {
    try {
      setLoading(true);
      const evaluation = await evaluationsApi.getById(id);
      onLoad(evaluation);
    } catch (err) {
      alert('Failed to load evaluation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this evaluation?')) return;
    
    try {
      setDeleting(id);
      await evaluationsApi.delete(id);
      setEvaluations(prev => prev.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">📋 Saved Evaluations</h2>
          <button 
            onClick={onClose}
            className="text-white hover:bg-red-700 rounded-full p-2 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={fetchEvaluations}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-4xl mb-4">📭</p>
              <p>No saved evaluations yet.</p>
              <p className="text-sm mt-2">Complete an evaluation and save it to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {evaluations.map((evaluation) => (
                <div 
                  key={evaluation.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg">
                          {evaluation.brand} {evaluation.model}
                        </span>
                        {evaluation.registration_no && (
                          <span className="bg-gray-200 px-2 py-1 rounded text-sm font-mono">
                            {evaluation.registration_no}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <span>ID: {evaluation.evaluation_id}</span>
                        <span className="mx-2">•</span>
                        <span>Saved: {formatDate(evaluation.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleLoad(evaluation.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => handleDelete(evaluation.id)}
                        disabled={deleting === evaluation.id}
                        className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {deleting === evaluation.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EvaluationsList;
