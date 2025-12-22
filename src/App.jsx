import { useState } from 'react';
import FormWrapper from './components/form/FormWrapper';
import Report from './components/report/Report';
import EvaluationsList from './components/EvaluationsList';
import useFormStore from './stores/formStore';
import { evaluationsApi } from './services/api';
import './index.css';

function App() {
  const [showReport, setShowReport] = useState(false);
  const [showEvaluationsList, setShowEvaluationsList] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { resetForm, goToStep, formData, loadFromDatabase, getDatabaseId, setDatabaseId } = useFormStore();

  const handleSubmit = () => {
    setShowReport(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to start a new evaluation? All data will be lost.')) {
      resetForm();
      setShowReport(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save evaluation to Supabase
  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    try {
      // Clear any corrupted localStorage first
      try {
        localStorage.removeItem('carsure360-form-storage');
      } catch (e) {
        console.warn('Could not clear localStorage:', e);
      }

      const databaseId = getDatabaseId();
      const evalId = formData.evaluation_id || `EVL-${Date.now()}`;
      
      // Upload images to Supabase Storage
      const uploadedImages = {};
      const allImages = {
        ...formData.images,
        ...formData.damageImages,
        ...formData.refurbImages
      };
      
      const imageEntries = Object.entries(allImages).filter(([_, value]) => value);
      
      if (imageEntries.length > 0) {
        console.log(`Uploading ${imageEntries.length} images...`);
        
        for (const [slotId, imageData] of imageEntries) {
          try {
            // Skip if already a URL (not base64)
            if (typeof imageData === 'string' && imageData.startsWith('http')) {
              uploadedImages[slotId] = imageData;
              continue;
            }
            
            // Convert base64 to file and upload
            const { uploadApi } = await import('./services/api');
            const file = uploadApi.base64ToFile(imageData, `${slotId}.jpg`);
            const result = await uploadApi.uploadImage(file, evalId, slotId);
            
            if (result.url) {
              uploadedImages[slotId] = result.url;
              console.log(`Uploaded ${slotId}`);
            }
          } catch (imgError) {
            console.error(`Failed to upload ${slotId}:`, imgError);
            // Continue with other images even if one fails
          }
        }
      }
      
      // Prepare form data without base64 images
      const cleanFormData = { ...formData };
      delete cleanFormData.images;
      delete cleanFormData.damageImages;
      delete cleanFormData.refurbImages;
      
      const evaluationData = {
        evaluation_id: evalId,
        data: cleanFormData,
        images: uploadedImages
      };

      let result;
      if (databaseId) {
        // Try to update existing
        try {
          result = await evaluationsApi.update(databaseId, evaluationData);
          alert(`✅ Evaluation updated successfully!\n\n${Object.keys(uploadedImages).length} images saved to cloud.`);
        } catch (updateError) {
          // If update fails (e.g., record doesn't exist), create new instead
          console.warn('Update failed, creating new evaluation:', updateError);
          result = await evaluationsApi.create(evaluationData);
          setDatabaseId(result.id);
          alert(`✅ Evaluation saved as new!\n\n${Object.keys(uploadedImages).length} images saved to cloud.`);
        }
      } else {
        // Create new
        result = await evaluationsApi.create(evaluationData);
        setDatabaseId(result.id);
        alert(`✅ Evaluation saved successfully!\n\n${Object.keys(uploadedImages).length} images saved to cloud.`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Failed to save: ' + error.message + '\n\nMake sure:\n1. Server is running (npm start in server folder)\n2. Supabase table exists (run SQL in dashboard)\n3. Storage bucket "evaluation-images" exists');
    } finally {
      setIsSaving(false);
    }
  };

  // Load evaluation from list
  const handleLoadEvaluation = (evaluation) => {
    loadFromDatabase(evaluation);
    setShowEvaluationsList(false);
    setShowReport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    alert('✅ Evaluation loaded! You can now edit and update it.');
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    const API_URL = 'https://carsure.onrender.com';
    const MAX_RETRIES = 3;
    
    try {
      const content = document.getElementById('report-content');
      if (!content) throw new Error('Report content not found');

      // Get the full HTML with styles
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Carsure360 Vehicle Report</title>
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                font-family: 'Roboto', sans-serif;
                background: #fff;
                color: #333;
                line-height: 1.5;
                font-size: 16px;
              }
              .bg-primary { background-color: #d32f2f; }
              .bg-primary-dark { background-color: #b71c1c; }
              .text-primary { color: #d32f2f; }
              .border-primary { border-color: #d32f2f; }
              .bg-rating-excellent { background-color: #4caf50; }
              .bg-rating-good { background-color: #8bc34a; }
              .bg-rating-average { background-color: #ffeb3b; }
              .bg-rating-notgood { background-color: #ff9800; }
              .bg-rating-damaged { background-color: #f44336; }
              table { border-collapse: collapse; width: 100%; }
              th, td { padding: 12px 14px; text-align: left; border: 1px solid #e5e7eb; font-size: 15px; }
              th { font-size: 17px; font-weight: 600; }
              img { max-width: 100%; height: auto; }
              
              /* Page break protection */
              .no-page-break { page-break-inside: avoid; break-inside: avoid; }
              .image-row { page-break-inside: avoid; break-inside: avoid; display: flex; gap: 10px; margin-bottom: 10px; }
              .image-row > div { flex: 1; max-width: 33.33%; }
              
              /* Section headers */
              .section-title, [class*="bg-black"] { 
                background-color: #000 !important; 
                color: #fff !important; 
                padding: 14px 18px; 
                margin: 24px 0 14px 0;
                font-size: 18px;
                font-weight: 700;
              }
              
              /* Rating circle styles */
              .rating-circle { 
                display: inline-block; 
                padding: 8px; 
                margin: 4px; 
                border-radius: 8px;
                text-align: center;
              }
              
              /* Tyre grid */
              .grid-cols-4 { display: flex; justify-content: space-around; }
              .grid-cols-4 > div { flex: 1; text-align: center; }
              
              /* Grid for images - 3 per row */
              .grid-cols-3 { display: flex; flex-wrap: wrap; gap: 10px; }
              .grid-cols-3 > div { width: calc(33.33% - 10px); }
              
              /* Buttons hidden in PDF */
              .print\\:hidden, button { display: none !important; }
            </style>
          </head>
          <body>
            ${content.outerHTML}
          </body>
        </html>
      `;

      // Helper function to attempt PDF generation with retry
      const attemptPdfGeneration = async (retryCount = 0) => {
        try {
          // First, wake up the server if it might be sleeping (Render free tier sleeps after 15 min)
          if (retryCount === 0) {
            try {
              console.log('Waking up server...');
              await fetch(`${API_URL}/api/health`, { 
                method: 'GET',
                signal: AbortSignal.timeout(30000) // 30 second timeout for wake-up
              });
              console.log('Server is awake!');
            } catch (wakeError) {
              console.log('Server wake-up ping failed, will retry with main request...');
            }
          }

          // Make the PDF generation request with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout

          const response = await fetch(`${API_URL}/api/generate-pdf`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              htmlContent,
              filename: 'Carsure360_Vehicle_Report.pdf'
            }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            let errorMessage = 'Failed to generate PDF';
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch {}
            throw new Error(errorMessage);
          }

          return response;
        } catch (error) {
          // Retry logic for network errors
          if (retryCount < MAX_RETRIES - 1 && 
              (error.name === 'AbortError' || 
               error.message.includes('Failed to fetch') ||
               error.message.includes('NetworkError') ||
               error.message.includes('timeout'))) {
            console.log(`Retry attempt ${retryCount + 1}/${MAX_RETRIES}...`);
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
            return attemptPdfGeneration(retryCount + 1);
          }
          throw error;
        }
      };

      // Attempt PDF generation with retries
      const response = await attemptPdfGeneration();

      // Download the PDF
      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      // Download file directly
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'Carsure360_Vehicle_Report.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up after short delay
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
      
      // Show success and reset form for new evaluation
      alert('PDF downloaded successfully! Starting fresh for new evaluation.');
      resetForm(); // Clear all form data including images
      setShowReport(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error) {
      console.error('PDF generation error:', error);
      
      // User-friendly error messages
      let userMessage = 'Error generating PDF: ';
      if (error.message.includes('Failed to fetch') || error.name === 'AbortError') {
        userMessage += 'Server is temporarily unavailable. Please wait a moment and try again.\n\n(The server may be waking up from sleep mode)';
      } else {
        userMessage += error.message;
      }
      
      alert(userMessage);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 safe-area-top">
      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-4 flex gap-2 justify-end print:hidden">
        <button
          onClick={() => setShowEvaluationsList(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
        >
          📋 Saved Evaluations
        </button>
        <button
          onClick={handleSaveToDatabase}
          disabled={isSaving}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? '⏳ Saving...' : '💾 Save to Database'}
        </button>
      </div>

      {/* Loading overlays */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-bold">Generating PDF...</p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      {isSaving && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-bold">Saving to Database...</p>
            <p className="text-sm text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      {/* Evaluations List Modal */}
      {showEvaluationsList && (
        <EvaluationsList 
          onLoad={handleLoadEvaluation}
          onClose={() => setShowEvaluationsList(false)}
        />
      )}

      {showReport ? (
        <Report 
          onGeneratePdf={handleGeneratePdf} 
          onReset={handleReset}
          onBack={() => {
            setShowReport(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <FormWrapper onSubmit={handleSubmit} />
      )}
    </div>
  );
}

export default App;

