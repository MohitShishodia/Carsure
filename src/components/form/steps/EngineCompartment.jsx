import useFormStore from '../../../stores/formStore';
import { Select } from '../../common/FormComponents';
import { SubField } from '../../common/FormComponents';
import { STATUS_OPTIONS, RATING_OPTIONS } from '../../../data/formOptions';

export default function EngineCompartment() {
  const { formData, updateField } = useFormStore();

  const engineItems = [
    { label: '1. Oil', id: 'oil', options: STATUS_OPTIONS.condition },
    { label: '2. Engine', id: 'engine', options: STATUS_OPTIONS.condition },
    { label: '3. Brake', id: 'brake', options: STATUS_OPTIONS.condition },
    { label: '4. Mounting', id: 'mounting', options: STATUS_OPTIONS.perfectCondition },
    { label: '5. Belts', id: 'belts', options: STATUS_OPTIONS.condition },
    { label: '6. Fan Belts', id: 'fan_belts', options: STATUS_OPTIONS.condition },
    { label: '7. Alternator Drive Belt', id: 'alt_belt', options: STATUS_OPTIONS.condition },
    { label: '8. Hoses', id: 'hoses', options: STATUS_OPTIONS.condition },
    { label: '9. Turbo Hoses', id: 'turbo_hoses', options: STATUS_OPTIONS.conditionNA },
    { label: '10. Inter-cooler Hoses', id: 'intercooler_hoses', options: STATUS_OPTIONS.conditionNA },
    { label: '11. Radiator/Condensor', id: 'radiator_condensor', options: STATUS_OPTIONS.perfectCondition },
    { label: '12. Coolant Reserve Tank Leakage', id: 'coolant_reserve', options: STATUS_OPTIONS.perfectCondition },
    { label: '13. Coolant Pipe Leakage', id: 'coolant_pipe', options: STATUS_OPTIONS.perfectCondition },
    { label: '14. Radiator Leakage/Damage', id: 'radiator_leak', options: STATUS_OPTIONS.perfectCondition },
    { label: '15. Oil Leakage', id: 'oil_leakage', options: STATUS_OPTIONS.oilLeakage },
    { label: '16. Gasket/Tappet Cover Oil Leakage', id: 'gasket_leak', options: STATUS_OPTIONS.leakage },
    { label: '17. Cylinder Head Oil Leakage', id: 'cyl_head_leak', options: STATUS_OPTIONS.leakage },
    { label: '18. Camshaft/Crankshaft Oil Seals', id: 'camshaft_seals', options: STATUS_OPTIONS.leakage },
    { label: '19. Engine Sump Leakage/Condition', id: 'engine_sump', options: STATUS_OPTIONS.leakage },
    { label: '20. Plugs', id: 'plugs', options: STATUS_OPTIONS.condition },
    { label: '21. Heater Plugs', id: 'heater_plugs', options: STATUS_OPTIONS.conditionNA },
    { label: '22. Spark Plugs', id: 'spark_plugs', options: STATUS_OPTIONS.conditionNA },
    { label: '23. Filters', id: 'filters', options: STATUS_OPTIONS.condition },
    { label: '24. Fuel Filter', id: 'fuel_filter', options: STATUS_OPTIONS.condition },
    { label: '25. Air Filter', id: 'air_filter', options: STATUS_OPTIONS.condition },
    { label: '26. Silencer', id: 'silencer', options: STATUS_OPTIONS.perfectCondition },
    { label: '27. Silencer Leakage', id: 'silencer_leak', options: STATUS_OPTIONS.perfectCondition },
    { label: '28. Exhaust System', id: 'exhaust_system', options: STATUS_OPTIONS.perfectCondition },
    { label: '29. Abnormal Engine Noise', id: 'abnormal_noise', options: [
      { value: 'No Abnormal Engine Noise', label: 'No Abnormal Engine Noise' },
      { value: 'Minor Work Needed', label: 'Minor Work Needed' },
      { value: 'Major Work Needed', label: 'Major Work Needed' },
    ]},
    { label: '30. Tappet Noise', id: 'tappet_noise', options: STATUS_OPTIONS.perfectCondition },
    { label: '31. Camshaft Noise', id: 'camshaft_noise', options: STATUS_OPTIONS.perfectCondition },
    { label: '32. Knocking', id: 'knocking', options: STATUS_OPTIONS.perfectCondition },
    { label: '33. Connecting Noise', id: 'connecting_noise', options: STATUS_OPTIONS.perfectCondition },
    { label: '34. Turbo Whistling Noise', id: 'turbo_whistle', options: STATUS_OPTIONS.perfectCondition },
    { label: '35. Tensioner Bearing', id: 'tensioner_bearing', options: STATUS_OPTIONS.perfectCondition },
    { label: '36. Engine RPM Missing', id: 'rpm_missing', options: STATUS_OPTIONS.perfectCondition },
    { label: '37. Ignition Coil Petrol', id: 'ignition_coil', options: [
      { value: 'Perfect Condition', label: 'Perfect Condition' },
      { value: 'Minor Work Needed', label: 'Minor Work Needed' },
      { value: 'Major Work Needed', label: 'Major Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: '38. Ignition Wire Harness - Petrol', id: 'ignition_wire', options: [
      { value: 'Perfect Condition', label: 'Perfect Condition' },
      { value: 'Minor Work Needed', label: 'Minor Work Needed' },
      { value: 'Major Work Needed', label: 'Major Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: '39. Cooling System', id: 'cooling_system', options: STATUS_OPTIONS.perfectCondition },
    { label: '40. Radiator Fan Cut Off/On', id: 'radiator_fan', options: STATUS_OPTIONS.perfectCondition },
    { label: '41. Temperature Switch OK', id: 'temp_switch', options: STATUS_OPTIONS.perfectCondition },
    { label: '42. Pumps & Pressure', id: 'pumps_pressure', options: STATUS_OPTIONS.perfectCondition },
    { label: '43. Oil Pump', id: 'oil_pump', options: STATUS_OPTIONS.perfectCondition },
    { label: '44. Oil Pressure', id: 'oil_pressure', options: STATUS_OPTIONS.perfectCondition },
    { label: '45. Water Pump', id: 'water_pump', options: STATUS_OPTIONS.perfectCondition },
    { label: '46. Water Pump Play', id: 'water_pump_play', options: STATUS_OPTIONS.perfectCondition },
    { label: '47. Water Pump Noise', id: 'water_pump_noise', options: STATUS_OPTIONS.perfectCondition },
    { label: '48. Back Compression', id: 'back_compression', options: STATUS_OPTIONS.perfectCondition },
    { label: '49. Blue/Black Smoke', id: 'smoke', options: STATUS_OPTIONS.workNeeded },
    { label: '50. Transmission from 2WD to 4WD', id: 'trans_2wd_4wd', options: [
      { value: 'Perfect Condition', label: 'Perfect Condition' },
      { value: 'Work Needed', label: 'Work Needed' },
      { value: 'Major Work Needed', label: 'Major Work Needed' },
      { value: 'N/A', label: 'N/A' },
    ]},
    { label: '51. Transmission Case and Pan for Leaks', id: 'trans_case_leak', options: STATUS_OPTIONS.workNeeded },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-xl mb-4 text-primary">Engine Compartment</legend>
      
      <div className="section-title">ENGINE COMPARTMENT</div>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {engineItems.map((item) => (
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
          label="Engine Compartment Rating"
          id="engine_rating"
          value={formData.engine_rating}
          onChange={(value) => updateField('engine_rating', value)}
          options={RATING_OPTIONS}
        />
      </div>
    </fieldset>
  );
}
