import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function Electricals() {
  const { formData, updateField } = useFormStore();

  const electricalItems = [
    { label: 'Instrument Cluster', id: 'instrument_cluster', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: 'Combination Switch', id: 'combo_switch', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: 'A/C Switch', id: 'ac_switch', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: 'Wiper Switch', id: 'wiper_switch', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: 'Wiper Motor', id: 'wiper_motor', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: 'Battery Condition', id: 'battery', options: STATUS_OPTIONS.condition },
    { label: 'Alternator & Starter Motor', id: 'alternator', options: [
      { value: 'Excellent', label: 'Excellent' },
      { value: 'Good', label: 'Good' },
    ]},
    { label: 'Fuel Pump', id: 'fuel_pump', options: [
      { value: 'Excellent', label: 'Excellent' },
      { value: 'Good', label: 'Good' },
    ]},
    { label: 'Injectors (Petrol)', id: 'injectors', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: 'CNG Fitting', id: 'chg_fitting', options: [
      { value: 'Not Available', label: 'Not Available' },
      { value: 'Company Fitted Available', label: 'Company Fitted Available' },
      { value: 'Outside Fitted Available', label: 'Outside Fitted Available' },
    ]},
    { label: 'Speedometer', id: 'speedometer', options: [
      { value: 'Working', label: 'Working' },
      { value: 'Not Working', label: 'Not Working' },
      { value: 'Not Available', label: 'Not Available' },
    ]},
    { label: 'Temperature Gauge Level', id: 'temp_gauge', options: STATUS_OPTIONS.workNeeded },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Electricals</legend>
      
      <div className="section-title">ELECTRICALS</div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {electricalItems.map((item) => (
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
          label="Electricals Rating"
          id="electrical_rating"
          value={formData.electrical_rating}
          onChange={(value) => updateField('electrical_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
