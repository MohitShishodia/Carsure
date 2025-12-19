import useFormStore from '../../../stores/formStore';
import { Input, Select } from '../../common/FormComponents';
import { CITIES } from '../../../data/formOptions';

export default function GeneralDetails() {
  const { formData, updateField } = useFormStore();

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">General Details</legend>
      
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          label="Engineer Name"
          id="evaluation_id"
          value={formData.evaluation_id}
          onChange={(value) => updateField('evaluation_id', value)}
          placeholder="Enter engineer name"
        />
        
        <Input
          label="Evaluation Date"
          id="evaluation_date"
          type="date"
          value={formData.evaluation_date}
          onChange={(value) => updateField('evaluation_date', value)}
        />
        
        <Input
          label="Location"
          id="inspection_location"
          value={formData.inspection_location}
          onChange={(value) => updateField('inspection_location', value)}
          placeholder="Enter inspection location"
        />
        
        <Select
          label="City"
          id="inspection_city"
          value={formData.inspection_city}
          onChange={(value) => updateField('inspection_city', value)}
          options={CITIES}
        />
      </div>
    </fieldset>
  );
}
