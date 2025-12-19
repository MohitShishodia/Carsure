import { useRef, useState } from 'react';
import useFormStore from '../../../stores/formStore';
import { Input, Checkbox } from '../../common/FormComponents';
import { ACCESSORIES_LIST } from '../../../data/formOptions';

export default function AccessoriesRefurb() {
  const { formData, updateField, addRefurbItem, removeRefurbItem, updateRefurbItem, setRefurbImage, removeRefurbImage } = useFormStore();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ data: e.target.result, name: file.name });
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: files.length });

    const fileArray = Array.from(files);
    const timestamp = Date.now();
    
    // Process files one by one for better memory handling
    for (let i = 0; i < fileArray.length; i++) {
      try {
        const result = await readFileAsDataURL(fileArray[i]);
        const imageKey = `refurb_${timestamp}_${i}`;
        setRefurbImage(imageKey, result);
        setUploadProgress({ current: i + 1, total: files.length });
      } catch (error) {
        console.error('Error reading file:', error);
      }
    }
    
    setIsUploading(false);
    
    // Clear input for next upload
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const refurbImageCount = Object.keys(formData.refurbImages || {}).length;

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Refurbishment, Pricing, and Accessories</legend>
      
      {/* Refurbishment Items */}
      <div className="section-title">REFURBISHMENT ITEMS</div>
      
      <div className="space-y-3">
        {formData.refurb_items.map((item, index) => (
          <div key={index} className="flex gap-3 items-center bg-gray-50 p-3 rounded-lg">
            <input
              type="text"
              placeholder="Item Name (e.g., Dent Removal)"
              value={item.name}
              onChange={(e) => updateRefurbItem(index, 'name', e.target.value)}
              className="flex-grow-[2] form-input"
            />
            <input
              type="number"
              placeholder="Price (INR)"
              value={item.price}
              onChange={(e) => updateRefurbItem(index, 'price', parseInt(e.target.value) || 0)}
              className="flex-grow-[1] form-input w-32"
            />
            <button
              type="button"
              onClick={() => removeRefurbItem(index)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
            >
              −
            </button>
          </div>
        ))}
      </div>
      
      <button
        type="button"
        onClick={() => addRefurbItem('', 0)}
        className="mt-4 btn-primary"
      >
        + Add Refurbishment Item
      </button>

      {/* Refurbishment Images */}
      <div className="section-title mt-8">REFURBISHMENT IMAGES</div>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-3">
          Upload photos documenting refurbishment needs. These will appear in the final report.
        </p>
        
        {/* Upload Button */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`px-4 py-2 rounded transition-colors ${isUploading ? 'bg-gray-400 cursor-wait' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            disabled={isUploading}
          >
            {isUploading ? `⏳ Uploading ${uploadProgress.current}/${uploadProgress.total}...` : '📷 Add Refurbishment Photos'}
          </button>
          <span className="ml-3 text-sm text-gray-500">
            {refurbImageCount} photo{refurbImageCount !== 1 ? 's' : ''} uploaded
          </span>
        </div>
        
        {/* Image Grid */}
        {refurbImageCount > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {Object.entries(formData.refurbImages || {}).map(([key, img]) => (
              <div key={key} className="relative">
                <img 
                  src={img.data} 
                  alt={img.name || 'Refurbishment photo'}
                  className="w-full aspect-square object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeRefurbImage(key)}
                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="section-title mt-8">PRICING</div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Min Buying Price (INR)"
          id="min_buying_price"
          type="number"
          value={formData.min_buying_price}
          onChange={(value) => updateField('min_buying_price', value)}
        />
        
        <Input
          label="Max Buying Price (INR)"
          id="max_buying_price"
          type="number"
          value={formData.max_buying_price}
          onChange={(value) => updateField('max_buying_price', value)}
        />
      </div>

      {/* Accessories Checklist */}
      <div className="section-title mt-8">ACCESSORIES CHECKLIST</div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        {ACCESSORIES_LIST.map((acc) => (
          <Checkbox
            key={acc.id}
            id={acc.id}
            label={acc.label}
            checked={formData[acc.id] || false}
            onChange={(checked) => updateField(acc.id, checked)}
          />
        ))}
      </div>
    </fieldset>
  );
}
