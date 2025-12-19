import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function ACFunction() {
  const { formData, updateField } = useFormStore();

  const acItems = [
    { label: 'Cooling', id: 'cooling', options: STATUS_OPTIONS.conditionNA },
    { label: 'A/C Compressor', id: 'compressor', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: 'Condensor', id: 'condensor', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: 'Blower Motor', id: 'blower_motor', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: 'Heating', id: 'heating', options: STATUS_OPTIONS.conditionNA },
    { label: 'Blower Fan', id: 'blower_fan', options: [
      { value: 'Good', label: 'Good' },
      { value: 'Average', label: 'Average' },
    ]},
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">A/C Function</legend>
      
      <div className="section-title">A/C FUNCTION</div>
      
      <div className="space-y-4">
        {acItems.map((item) => (
          <SubField
            key={item.id}
            label={item.label}
            statusId={`${item.id}_status`}
            statusValue={formData[`${item.id}_status`]}
            statusOptions={item.options}
            onStatusChange={(value) => updateField(`${item.id}_status`, value)}
            remarkId={`${item.id}_remark`}
            remarkValue={formData[`${item.id}_remark`]}
            onRemarkChange={(value) => updateField(`${item.id}_remark`, value)}
          />
        ))}
      </div>

      <div className="mt-6">
        <Select
          label="A/C Function Rating"
          id="ac_rating"
          value={formData.ac_rating}
          onChange={(value) => updateField('ac_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
