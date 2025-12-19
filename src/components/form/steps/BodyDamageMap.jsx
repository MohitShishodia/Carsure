import { useState, useRef } from 'react';
import useFormStore from '../../../stores/formStore';
import { bodyDamageSegments } from '../../../data/bodyDamageSegments';

const DAMAGE_OPTIONS = ['Dent', 'Scratch', 'Crack', 'Corrosion', 'Repainted', 'Replaced', 'Repaired', 'OK'];

export default function BodyDamageMap() {
  const { formData, setBodyDamageData, setDamageImage, removeDamageImage } = useFormStore();
  const [activeSegment, setActiveSegment] = useState(null);
  const fileInputRefs = useRef({});

  const handleSegmentClick = (segmentId) => {
    setActiveSegment(activeSegment === segmentId ? null : segmentId);
  };

  const handlePartChange = (segmentId, partName, value) => {
    const currentData = formData.bodyDamageData[segmentId] || {};
    setBodyDamageData(segmentId, {
      ...currentData,
      [partName]: {
        ...(currentData[partName] || {}),
        status: value,
      }
    });
  };

  const handleRemarkChange = (segmentId, partName, value) => {
    const currentData = formData.bodyDamageData[segmentId] || {};
    setBodyDamageData(segmentId, {
      ...currentData,
      [partName]: {
        ...(currentData[partName] || {}),
        remark: value,
      }
    });
  };

  const handleImageUpload = (segmentId, partName, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageKey = `${segmentId}__${partName}`;
      setDamageImage(imageKey, {
        data: e.target.result,
        partName,
        segmentName: bodyDamageSegments[segmentId]?.name || segmentId,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (segmentId, partName) => {
    const imageKey = `${segmentId}__${partName}`;
    removeDamageImage(imageKey);
  };

  const getImageKey = (segmentId, partName) => `${segmentId}__${partName}`;

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-primary">Body Damage Map</legend>
      
      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
        Tap on a car area, select the type of damage, add remarks and upload damage photos. These details will appear in the final report.
      </p>

      {/* Car Image with Segments */}
      <div className="relative w-full mx-auto aspect-[4/3] sm:aspect-square max-w-lg border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
        <img
          src="https://cdn.dribbble.com/userupload/7981471/file/original-972efe59158b49cfa374c9d49f7ae990.jpg"
          alt="Car Body Map"
          className="w-full h-full object-contain rotate-90"
        />
        
        {/* Clickable Segments */}
        {Object.entries(bodyDamageSegments).map(([id, segment], index) => (
          <div
            key={id}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleSegmentClick(id);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            className={`absolute cursor-pointer border-2 transition-all ${
              activeSegment === id 
                ? 'border-blue-500 bg-blue-500/30' 
                : 'border-red-500/50 hover:border-blue-400 hover:bg-blue-400/10 active:bg-blue-400/20'
            }`}
            style={{
              top: segment.position.top,
              left: segment.position.left,
              width: segment.position.width,
              height: segment.position.height,
              zIndex: id === 'others-segment' ? 20 : 10 + index,
            }}
            title={segment.name}
          >
            {/* Show label on hover/active for larger screens */}
            <span className="hidden sm:block absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center opacity-0 hover:opacity-100 transition-opacity">
              {segment.name}
            </span>
          </div>
        ))}
      </div>

      {/* Segment Legend for Mobile */}
      <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
        {Object.entries(bodyDamageSegments).map(([id, segment]) => (
          <button
            key={id}
            type="button"
            onClick={() => handleSegmentClick(id)}
            className={`text-xs px-2 py-1 rounded-full transition-all ${
              activeSegment === id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {segment.name}
          </button>
        ))}
      </div>

      {/* Segment Details */}
      {activeSegment && bodyDamageSegments[activeSegment] && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-primary">
            {bodyDamageSegments[activeSegment].name}
          </h3>
          
          <div className="space-y-3 sm:space-y-4 max-h-[50vh] sm:max-h-[400px] overflow-y-auto">
            {bodyDamageSegments[activeSegment].parts.map((part) => {
              const partData = formData.bodyDamageData[activeSegment]?.[part.name] || {};
              const imageKey = getImageKey(activeSegment, part.name);
              const damageImage = formData.damageImages?.[imageKey];
              
              return (
                <div key={part.name} className="p-2 sm:p-3 bg-white rounded-lg shadow-sm">
                  <label className="block font-medium text-sm sm:text-base mb-2">{part.name}</label>
                  <select
                    value={partData.status || 'OK'}
                    onChange={(e) => handlePartChange(activeSegment, part.name, e.target.value)}
                    className="form-select mb-2"
                  >
                    {DAMAGE_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <textarea
                    value={partData.remark || ''}
                    onChange={(e) => handleRemarkChange(activeSegment, part.name, e.target.value)}
                    placeholder="Add remark..."
                    className="form-textarea mb-2"
                    rows={2}
                  />
                  
                  {/* Image Upload */}
                  <div className="mt-2">
                    {damageImage ? (
                      <div className="flex items-center gap-2">
                        <img 
                          src={damageImage.data} 
                          alt={`Damage: ${part.name}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(activeSegment, part.name)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => fileInputRefs.current[imageKey] = el}
                          onChange={(e) => handleImageUpload(activeSegment, part.name, e)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRefs.current[imageKey]?.click()}
                          className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors"
                        >
                          📷 Add Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          <button
            type="button"
            onClick={() => setActiveSegment(null)}
            className="mt-3 sm:mt-4 w-full sm:w-auto btn-secondary"
          >
            ✓ Done
          </button>
        </div>
      )}
    </fieldset>
  );
}
