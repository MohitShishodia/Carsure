import useFormStore from '../../../stores/formStore';
import { Textarea, Select, Input } from '../../common/FormComponents';
import { DOC_CHECKED_OPTIONS } from '../../../data/formOptions';

export default function PublicRemarks() {
  const { formData, updateField } = useFormStore();

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Public Remarks & Document Check</legend>
      
      <div className="section-title">FINAL REMARKS</div>
      
      <div className="space-y-6">
        <div>
          <label className="block font-bold text-primary mb-2">
            1. PUBLIC REMARKS ABOUT CAR
          </label>
          <textarea
            id="public_remarks"
            value={formData.public_remarks}
            onChange={(e) => updateField('public_remarks', e.target.value)}
            placeholder="Write your remarks here..."
            className="w-full h-32 p-3 border-2 border-primary rounded-lg text-base resize-y"
          />
        </div>

        <div>
          <label className="block font-bold text-primary mb-2">
            2. CAR DOCUMENTS CHECKED
          </label>
          <select
            id="doc_checked"
            value={formData.doc_checked}
            onChange={(e) => updateField('doc_checked', e.target.value)}
            className="w-full p-3 border-2 border-primary rounded-lg text-base bg-white"
          >
            {DOC_CHECKED_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-primary mb-2">
            3. PUBLIC LINK (paste a public URL to docs/images)
          </label>
          <input
            type="url"
            id="public_link"
            value={formData.public_link}
            onChange={(e) => updateField('public_link', e.target.value)}
            placeholder="https://..."
            className="w-full p-3 border-2 border-primary rounded-lg text-base"
          />
        </div>
      </div>
    </fieldset>
  );
}
