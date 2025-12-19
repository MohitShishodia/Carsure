import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function UnderChassis() {
  const { formData, updateField } = useFormStore();

  const chassisItems = [
    { label: '1. Brake Pedal Operation', id: 'brake_pedal', options: STATUS_OPTIONS.workNeeded },
    { label: '2. Brakes and Hand Brake', id: 'brakes_hand', options: STATUS_OPTIONS.workNeeded },
    { label: '3. Brake Booster', id: 'booster', options: STATUS_OPTIONS.workNeeded },
    { label: '4. Master Cylinder', id: 'master_cyl', options: STATUS_OPTIONS.workNeeded },
    { label: '5. Wheel Cylinder', id: 'wheel_cyl', options: STATUS_OPTIONS.workNeeded },
    { label: '6. Front Brakes Pads', id: 'front_pads', options: STATUS_OPTIONS.workNeeded },
    { label: '7. Rear Brakes Liners/Pads', id: 'rear_pads', options: STATUS_OPTIONS.workNeeded },
    { label: '8. ABS', id: 'abs', options: STATUS_OPTIONS.workingNA },
    { label: '9. Chassis Tampering', id: 'chassis_tamper', options: STATUS_OPTIONS.workNeeded },
    { label: '10. Brake Assembly', id: 'brake_assembly', options: STATUS_OPTIONS.workNeeded },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Under Chassis</legend>
      
      <div className="section-title">UNDER CHASSIS</div>
      
      <div className="space-y-4">
        {chassisItems.map((item) => (
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
          label="Under Chassis Rating"
          id="underchassis_rating"
          value={formData.underchassis_rating}
          onChange={(value) => updateField('underchassis_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
