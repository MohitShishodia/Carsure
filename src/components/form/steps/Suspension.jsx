import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function Suspension() {
  const { formData, updateField } = useFormStore();

  const suspensionItems = [
    { label: '1. Steering Lock', id: 'steering_lock', options: STATUS_OPTIONS.workingOnly },
    { label: '2. Steering Operation', id: 'steering_op', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: '3. Rack/Pinion', id: 'rack_pinion', options: STATUS_OPTIONS.condition },
    { label: '4. Power Steering', id: 'power_steering', options: STATUS_OPTIONS.workingNA },
    { label: '5. Power Steering Pump/Motor', id: 'ps_pump', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: '6. EPS', id: 'eps', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: '7. Wheel Alignment / Balancing / Wobbling', id: 'wheel_align', options: STATUS_OPTIONS.workNeeded },
    { label: '8. Suspension Noise While Driving - Front', id: 'front_noise', options: STATUS_OPTIONS.noise },
    { label: '9. Front Struts', id: 'front_struts', options: STATUS_OPTIONS.condition },
    { label: '10. Lower Arm / Ball Joints', id: 'lower_arm', options: STATUS_OPTIONS.condition },
    { label: '11. Tie Rod / Ball Joint', id: 'tie_rod', options: STATUS_OPTIONS.condition },
    { label: '12. Stabilizer Links', id: 'stab_links', options: STATUS_OPTIONS.condition },
    { label: '13. Fr Wheel Bearings', id: 'fr_bearings', options: STATUS_OPTIONS.condition },
    { label: '14. Suspension Noise While Driving - Rear', id: 'rear_noise', options: STATUS_OPTIONS.noise },
    { label: '15. Rear Shockers', id: 'rear_shockers', options: STATUS_OPTIONS.condition },
    { label: '16. Stabilizer Bar', id: 'stab_bar', options: STATUS_OPTIONS.condition },
    { label: '17. Rr Wheel Bearing', id: 'rr_bearing', options: STATUS_OPTIONS.condition },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Suspension</legend>
      
      <div className="section-title">SUSPENSION</div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {suspensionItems.map((item) => (
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
          label="Suspension Rating"
          id="suspension_rating"
          value={formData.suspension_rating}
          onChange={(value) => updateField('suspension_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
