import { useRef, useState } from 'react';
import useFormStore from '../../../stores/formStore';
import { IMAGE_SLOTS } from '../../../data/formOptions';

export default function ImageUpload() {
  const { formData, setImage, removeImage } = useFormStore();
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const multiFileInputRef = useRef(null);
  const currentSlotRef = useRef(null);
  const [showOptions, setShowOptions] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Generate 20 extra slots
  const extraSlots = Array.from({ length: 20 }, (_, i) => `EXTRA ${i + 1}`);
  const allSlots = [...IMAGE_SLOTS, ...extraSlots];

  // Get empty slot IDs
  const getEmptySlots = () => {
    return allSlots.map((_, index) => `slot_${index}`).filter(slotId => !formData.images[slotId]);
  };

  const handleBoxClick = (slotId) => {
    currentSlotRef.current = slotId;
    setShowOptions(slotId);
  };

  const handleCameraCapture = () => {
    const slotId = showOptions;
    currentSlotRef.current = slotId;
    setShowOptions(null);
    cameraInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    const slotId = showOptions;
    currentSlotRef.current = slotId;
    setShowOptions(null);
    fileInputRef.current?.click();
  };

  const handleMultiSelect = () => {
    setShowOptions(null);
    multiFileInputRef.current?.click();
  };

  // Optimized image processing with compression and timeout
  const processImageForSlot = (file, slotId) => {
    return new Promise((resolve) => {
      // Timeout after 15 seconds to prevent hanging
      const timeout = setTimeout(() => {
        console.warn(`Image processing timeout for slot ${slotId}`);
        resolve(); // Continue with next image
      }, 15000);

      // Use createObjectURL for faster initial loading
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        try {
          // Smaller max size for mobile optimization (1200px instead of 1920px)
          const MAX_SIZE = 1200;
          let width = img.width;
          let height = img.height;

          // Always resize and compress for consistency
          const needsResize = width > MAX_SIZE || height > MAX_SIZE;
          
          if (needsResize) {
            const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          
          // Use faster rendering for large images
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = needsResize ? 'medium' : 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Lower quality (0.7) for smaller file size and faster processing
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          setImage(slotId, dataUrl);
          
          // Cleanup
          canvas.width = 0;
          canvas.height = 0;
        } catch (err) {
          console.error(`Error processing image for slot ${slotId}:`, err);
        } finally {
          clearTimeout(timeout);
          URL.revokeObjectURL(objectUrl);
          resolve();
        }
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(objectUrl);
        console.error(`Failed to load image for slot ${slotId}`);
        resolve(); // Continue with next image
      };
      
      img.src = objectUrl;
    });
  };

  const handleSingleFileChange = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    processImageForSlot(files[0], currentSlotRef.current);
    e.target.value = '';
  };

  const handleMultiFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const emptySlots = getEmptySlots();
    const filesToProcess = files.slice(0, emptySlots.length);

    if (files.length > emptySlots.length) {
      alert(`Only ${emptySlots.length} empty slots available. ${files.length - emptySlots.length} images will be skipped.`);
    }

    setUploadProgress({ current: 0, total: filesToProcess.length });

    // Process images in batches of 3 for better performance
    const BATCH_SIZE = 3;
    for (let i = 0; i < filesToProcess.length; i += BATCH_SIZE) {
      const batch = filesToProcess.slice(i, i + BATCH_SIZE);
      const batchSlots = emptySlots.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel
      await Promise.all(
        batch.map((file, idx) => processImageForSlot(file, batchSlots[idx]))
      );
      
      // Update progress after each batch (synchronously)
      const processed = Math.min(i + BATCH_SIZE, filesToProcess.length);
      setUploadProgress({ current: processed, total: filesToProcess.length });
    }

    // Clear progress and reset input
    setUploadProgress(null);
    e.target.value = '';
  };

  const handleRemove = (e, slotId) => {
    e.stopPropagation();
    removeImage(slotId);
  };

  const imageCount = Object.keys(formData.images).length;

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-primary">Vehicle Images (26 + 20 Extra)</legend>
      
      <div className="section-title">📸 CAPTURE OR UPLOAD IMAGES</div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-4">
        <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1 sm:mb-2">
          📱 Tap any box to add a single image, or use "Add Multiple" to upload many at once
        </p>
        <p className="text-xs text-blue-600">
          💡 Tip: Use camera for real-time capture, gallery for existing photos
        </p>
      </div>

      {/* Bulk Upload Button */}
      <button
        type="button"
        onClick={handleMultiSelect}
        className="w-full mb-4 flex items-center justify-center gap-2 sm:gap-3 bg-green-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold text-sm sm:text-lg hover:bg-green-700 active:scale-98 transition-all shadow-lg"
      >
        <span className="text-xl sm:text-2xl">📁</span>
        <span>Add Multiple Photos</span>
        <span className="text-xs bg-green-700 px-2 py-0.5 rounded hidden sm:inline">({allSlots.length - imageCount} slots)</span>
      </button>

      {/* Upload Progress */}
      {uploadProgress && (
        <div className="mb-4 p-4 bg-blue-100 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Uploading {uploadProgress.current} of {uploadProgress.total} images...</span>
          </div>
          <div className="mt-2 bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSingleFileChange}
        accept="image/*"
        className="hidden"
      />

      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleSingleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      <input
        type="file"
        ref={multiFileInputRef}
        onChange={handleMultiFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Modal for choosing camera or gallery */}
      {showOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowOptions(null)}>
          <div className="bg-white rounded-xl shadow-2xl p-6 m-4 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 text-center">Add Image</h3>
            <p className="text-sm text-gray-500 mb-4 text-center">
              Choose how to add an image
            </p>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCameraCapture}
                className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors"
              >
                <span className="text-2xl">📷</span>
                Take Photo
              </button>
              
              <button
                type="button"
                onClick={handleGallerySelect}
                className="w-full flex items-center justify-center gap-3 bg-gray-100 text-gray-800 py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors"
              >
                <span className="text-2xl">🖼️</span>
                Choose from Gallery
              </button>
              
              <button
                type="button"
                onClick={() => setShowOptions(null)}
                className="w-full text-gray-500 py-2 text-sm hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {allSlots.map((slotLabel, index) => {
          const slotId = `slot_${index}`;
          const hasImage = formData.images[slotId];
          const isExtra = index >= IMAGE_SLOTS.length;
          
          return (
            <div
              key={slotId}
              className={`image-box ${isExtra ? 'border-dashed border-gray-300' : ''}`}
              onClick={() => handleBoxClick(slotId)}
            >
              {hasImage && (
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, slotId)}
                  className="absolute top-1 right-1 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-red-600 shadow-lg"
                >
                  ×
                </button>
              )}
              
              {hasImage ? (
                <img
                  src={formData.images[slotId]}
                  alt={slotLabel}
                  className="flex-1 w-full object-cover"
                />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-2">
                  <span className="text-3xl mb-1">📷</span>
                  <span className="text-xs">Tap to add</span>
                </div>
              )}
              
              <div className={`${isExtra ? 'bg-gray-600' : 'bg-black'} text-white p-2 text-xs text-center font-bold`}>
                {slotLabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Image count summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-center font-bold text-lg">
          📊 {imageCount} / {allSlots.length} Images Uploaded
        </p>
        {imageCount > 0 && (
          <p className="text-center text-sm text-gray-500 mt-1">
            {allSlots.length - imageCount} slots remaining
          </p>
        )}
      </div>
    </fieldset>
  );
}
