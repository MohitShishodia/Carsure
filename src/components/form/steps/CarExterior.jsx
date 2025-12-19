import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function CarExterior() {
  const { formData, updateField } = useFormStore();

  const exteriorItems = [
    { label: 'Headlight', id: 'headlight', options: STATUS_OPTIONS.working },
    { label: 'Wiper', id: 'wiper', options: STATUS_OPTIONS.workingOnly },
    { label: 'Car Body', id: 'car_body', options: STATUS_OPTIONS.carBody },
    { label: 'Turn Indicators', id: 'turn_indicator', options: STATUS_OPTIONS.working },
    { label: 'Tail Lights', id: 'tail_light', options: STATUS_OPTIONS.working },
    { label: 'Rear View Mirrors', id: 'mirror', options: [{ value: 'Working', label: 'Working' }] },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Car Exterior</legend>
      
      <div className="section-title">CAR EXTERIOR</div>
      
      <div className="space-y-4">
        {exteriorItems.map((item) => (
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
          label="Car Exterior Rating"
          id="exterior_rating"
          value={formData.exterior_rating}
          onChange={(value) => updateField('exterior_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
