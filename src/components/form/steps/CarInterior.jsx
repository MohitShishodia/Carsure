import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function CarInterior() {
  const { formData, updateField } = useFormStore();

  const interiorItems = [
    { label: 'Seat Recliner', id: 'seat_recliner', options: STATUS_OPTIONS.workingOnly },
    { label: 'Seat Belts', id: 'seat_belt', options: STATUS_OPTIONS.workingOnly },
    { label: 'Roof Wear & Tear', id: 'roof_interior', options: STATUS_OPTIONS.condition },
    { label: 'Horn', id: 'horn', options: STATUS_OPTIONS.workingOnly },
    { label: 'Seat Condition', id: 'seat_condition', options: STATUS_OPTIONS.condition },
    { label: 'Central Locking', id: 'central_locking', options: STATUS_OPTIONS.workingNA },
    { label: 'Power Window Front', id: 'power_window_front', options: STATUS_OPTIONS.workingNA },
    { label: 'Power Window Rear', id: 'power_window_rear', options: STATUS_OPTIONS.workingNA },
    { label: 'Switches', id: 'switch', options: STATUS_OPTIONS.workingOnly },
    { label: 'Tool Kit', id: 'tool_kit', options: STATUS_OPTIONS.available },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Car Interior</legend>
      
      <div className="section-title">CAR INTERIOR</div>
      
      <div className="space-y-4">
        {interiorItems.map((item) => (
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
          label="Car Interior Rating"
          id="interior_rating"
          value={formData.interior_rating}
          onChange={(value) => updateField('interior_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
