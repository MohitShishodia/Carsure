import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function Transmission() {
  const { formData, updateField } = useFormStore();

  const transmissionItems = [
    { label: 'Gear Box Status', id: 'gear_box', options: STATUS_OPTIONS.excellentWorking },
    { label: 'Axel and Boots Status', id: 'axel_boots', options: STATUS_OPTIONS.excellentWorking },
    { label: 'Differential and Crown Status', id: 'differential', options: STATUS_OPTIONS.excellentWorking },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Transmission</legend>
      
      <div className="section-title">TRANSMISSION</div>
      
      <div className="space-y-4">
        {transmissionItems.map((item) => (
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
          label="Transmission Rating"
          id="transmission_rating"
          value={formData.transmission_rating}
          onChange={(value) => updateField('transmission_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
