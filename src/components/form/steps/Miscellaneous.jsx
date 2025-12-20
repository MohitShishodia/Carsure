import useFormStore from '../../../stores/formStore';
import { Select, Textarea } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS, ACCIDENT_OPTIONS, FLOOD_OPTIONS } from '../../../data/formOptions';

export default function Miscellaneous() {
  const { formData, updateField } = useFormStore();

  const miscItems = [
    { label: '1. Gear Lever Play', id: 'gear_lever', options: STATUS_OPTIONS.proper },
    { label: '3. FRHS Axel Drive Shaft', id: 'frhs_drive', options: STATUS_OPTIONS.workNeeded },
    { label: '4. FLHS Axel Drive Shaft', id: 'flhs_drive', options: STATUS_OPTIONS.workNeeded },
    { label: '5. Gear Engagement', id: 'gear_engage', options: [
      { value: 'Proper', label: 'Proper' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: '6. Clutch Engagement', id: 'clutch_engage', options: [
      { value: 'Proper', label: 'Proper' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: '7. Clutch Pedal/Cable', id: 'clutch_pedal', options: [
      { value: 'Proper', label: 'Proper' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
    { label: '8. Differential & Crown', id: 'diff_crown', options: STATUS_OPTIONS.proper },
    { label: '9. Diff Units/Pinion RWD', id: 'diff_pinion', options: STATUS_OPTIONS.proper },
    { label: '10. Crown Wheel/Pinion RWD', id: 'crown_pinion', options: STATUS_OPTIONS.proper },
    { label: '11. Cross Wheel/Pinion RWD', id: 'cross_pinion', options: STATUS_OPTIONS.proper },
    { label: '12. Flood Symptoms', id: 'flood_symptoms', options: FLOOD_OPTIONS },
    { label: '13. Gear Box', id: 'misc_gear_box', options: [
      { value: 'Proper', label: 'Proper' },
      { value: 'Work Needed', label: 'Work Needed' },
    ]},
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Miscellaneous</legend>
      
      <div className="section-title">MISCELLANEOUS</div>
      
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {miscItems.map((item) => (
          <SubField
            key={item.id}
            label={item.label}
            statusId={`${item.id}_status`}
            statusValue={formData[`${item.id}_status`] || item.options[0]?.value}
            statusOptions={item.options}
            onStatusChange={(value) => updateField(`${item.id}_status`, value)}
            remarkId={`${item.id}_remark`}
            remarkValue={formData[`${item.id}_remark`]}
            onRemarkChange={(value) => updateField(`${item.id}_remark`, value)}
          />
        ))}
      </div>

      <Textarea
        label="14. Any Other Observation"
        id="misc_remark"
        value={formData.misc_remark}
        onChange={(value) => updateField('misc_remark', value)}
        placeholder="Any other observation..."
        rows={4}
      />

      <div className="section-title mt-8">Accident History</div>
      
      <Select
        label="Accident History Check"
        id="accident_rating"
        value={formData.accident_rating}
        onChange={(value) => updateField('accident_rating', value)}
        options={ACCIDENT_OPTIONS}
      />
      
      <Textarea
        label="Remark (if any)"
        id="accident_remark"
        value={formData.accident_remark}
        onChange={(value) => updateField('accident_remark', value)}
        placeholder="e.g. Minor bumper scratch, professionally repaired"
        rows={3}
      />

      <div className="mt-6">
        <Select
          label="Miscellaneous Overall Rating"
          id="misc_rating"
          value={formData.misc_rating}
          onChange={(value) => updateField('misc_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
