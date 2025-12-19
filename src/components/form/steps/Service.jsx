import useFormStore from '../../../stores/formStore';
import { Select, Textarea, Input } from '../../common/FormComponents';
import { SERVICE_OPTIONS, LAST_SERVICE_OPTIONS } from '../../../data/formOptions';

export default function Service() {
  const { formData, updateField } = useFormStore();

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Service</legend>
      
      <div className="section-title">SERVICE</div>
      
      <div className="space-y-4">
        <Select
          label="Need Service"
          id="need_service_status"
          value={formData.need_service_status}
          onChange={(value) => updateField('need_service_status', value)}
          options={SERVICE_OPTIONS}
        />
        
        {formData.need_service_status === 'WORK NEEDED' && (
          <Textarea
            label="Remark"
            id="need_service_remark"
            value={formData.need_service_remark}
            onChange={(value) => updateField('need_service_remark', value)}
            placeholder="e.g. Oil change due, brake pads low"
            rows={3}
          />
        )}

        <Select
          label="Last Service Date"
          id="last_service_status"
          value={formData.last_service_status}
          onChange={(value) => updateField('last_service_status', value)}
          options={LAST_SERVICE_OPTIONS}
        />
        
        {formData.last_service_status === 'KNOWN' && (
          <Input
            label="Select Last Service Date"
            id="last_service_date"
            type="date"
            value={formData.last_service_date}
            onChange={(value) => updateField('last_service_date', value)}
          />
        )}
      </div>
    </fieldset>
  );
}
