import useFormStore from '../../stores/formStore';
import { 
  calculateOverallRating, 
  getRatingClass, 
  getConditionText,
  calculateRefurbCost,
  formatINR 
} from '../../utils/ratingCalculator';
import { ACCESSORIES_LIST, IMAGE_SLOTS } from '../../data/formOptions';
import { bodyDamageSegments } from '../../data/bodyDamageSegments';

// Damage type color coding
const getDamageColor = (status) => {
  if (!status || status === 'OK') return '#4caf50'; // Green - OK
  if (status === 'Repainted' || status === 'Repaired') return '#ff9800'; // Orange - Fixed
  return '#f44336'; // Red - Damage (Dent, Scratch, Crack, Corrosion, Replaced)
};

// Helper component for section items with status and remark
const StatusRow = ({ label, status, remark }) => (
  <tr>
    <td className="p-3 border text-base font-medium bg-gray-50">{label}</td>
    <td className={`p-3 border text-base ${
      status?.includes('Excellent') || status?.includes('Working') || status?.includes('Perfect') || status?.includes('Good') || status === 'NO FLOOD SIGNS' 
        ? 'text-green-600' 
        : status?.includes('Damaged') || status?.includes('Not') || status?.includes('Leakage') 
          ? 'text-red-600' 
          : ''
    }`}>{status || '—'}</td>
    <td className="p-3 border text-base text-gray-600 italic">{remark || '—'}</td>
  </tr>
);

// Section header component
const SectionHeader = ({ title, className = '' }) => (
  <div className={`bg-black text-white px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-lg uppercase font-bold tracking-wide mt-4 sm:mt-6 mb-2 sm:mb-3 ${className}`}>
    {title}
  </div>
);

// Table wrapper for consistent styling
const DetailTable = ({ children, headers = ['Item', 'Status', 'Remark'] }) => (
  <table className="w-full border-collapse mb-4 text-base">
    <thead>
      <tr className="bg-primary text-white">
        {headers.map((h, i) => (
          <th key={i} className={`p-3 text-left text-base ${i === 0 ? 'w-1/3' : i === 1 ? 'w-1/3' : 'w-1/3'}`}>{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>{children}</tbody>
  </table>
);

export default function Report({ onGeneratePdf, onReset, onBack }) {
  const { formData } = useFormStore();
  const { overall, sections } = calculateOverallRating(formData);
  const totalRefurbCost = calculateRefurbCost(formData.refurb_items);

  const checkedAccessories = ACCESSORIES_LIST
    .filter(acc => formData[acc.id])
    .map(acc => acc.label);

  // Get uploaded images
  const uploadedImages = [...IMAGE_SLOTS, ...Array.from({ length: 20 }, (_, i) => `EXTRA ${i + 1}`)]
    .map((label, index) => ({ label, slotId: `slot_${index}`, data: formData.images[`slot_${index}`] }))
    .filter(img => img.data);

  // Group images into rows of 3 for PDF
  const imageRows = [];
  for (let i = 0; i < uploadedImages.length; i += 3) {
    imageRows.push(uploadedImages.slice(i, i + 3));
  }

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none" id="report-content">
      {/* Print-specific styles */}
      <style>{`
        @media print {
          .no-page-break { page-break-inside: avoid; }
          .page-break-before { page-break-before: always; }
          .image-row { page-break-inside: avoid; break-inside: avoid; }
        }
        .image-row { page-break-inside: avoid; break-inside: avoid; }
      `}</style>

      {/* Header */}
      <div className="header flex flex-col sm:flex-row items-center p-3 sm:p-5" style={{ background: 'linear-gradient(to right, #d32f2f, #b71c1c)' }}>
        <img
          src="https://carsure360.com/assets/front/img/69276ee43bf41.jpg"
          alt="Carsure360 Logo"
          className="h-12 sm:h-16 sm:mr-5 object-contain mb-2 sm:mb-0"
        />
        <h1 className="text-white text-base sm:text-2xl font-bold tracking-wide text-center sm:text-left">VEHICLE EVALUATION SUMMARY</h1>
      </div>

      {/* Evaluation Info */}
      <div className="text-center sm:text-right text-xs sm:text-base p-2 sm:p-4 flex flex-wrap justify-center sm:justify-end gap-1 sm:gap-0" style={{ color: '#d32f2f' }}>
        <span>Engineer: <span className="font-bold">{formData.evaluation_id || 'N/A'}</span></span>
        <span className="hidden sm:inline"> | </span>
        <span>Date: <span className="font-bold">{formData.evaluation_date}</span></span>
        <span className="hidden sm:inline"> | </span>
        <span>Location: <span className="font-bold">{formData.inspection_location || 'N/A'}</span></span>
        <span className="hidden sm:inline"> | </span>
        <span>City: <span className="font-bold">{formData.inspection_city}</span></span>
      </div>

      {/* SECTION 1 & 2: Car Specification & Vehicle Details */}
      <SectionHeader title="Vehicle Specifications" />
      <table className="w-full border-collapse mb-4 no-page-break" style={{ fontSize: '14px' }}>
        <tbody>
          <tr>
            <th className="bg-gray-100 p-2 text-left border" style={{ width: '25%' }}>Brand</th>
            <td className="p-2 border" style={{ width: '25%' }}>{formData.brand}</td>
            <th className="bg-gray-100 p-2 text-left border" style={{ width: '25%' }}>Model</th>
            <td className="p-2 border" style={{ width: '25%' }}>{formData.model}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Variant</th>
            <td className="p-2 border">{formData.variant}</td>
            <th className="bg-gray-100 p-2 text-left border">Fuel Type</th>
            <td className="p-2 border">{formData.fuel_type}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Mfg Year</th>
            <td className="p-2 border">{formData.mfg_year}</td>
            <th className="bg-gray-100 p-2 text-left border">Mfg Month</th>
            <td className="p-2 border">{formData.mfg_month}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">KM Run</th>
            <td className="p-2 border">{formData.km_run}</td>
            <th className="bg-gray-100 p-2 text-left border">Color</th>
            <td className="p-2 border">{formData.color}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Registration No.</th>
            <td className="p-2 border">{formData.registration_no}</td>
            <th className="bg-gray-100 p-2 text-left border">Reg. Date</th>
            <td className="p-2 border">{formData.registration_date}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Reg. Type</th>
            <td className="p-2 border">{formData.registration_type}</td>
            <th className="bg-gray-100 p-2 text-left border">Owners</th>
            <td className="p-2 border">{formData.number_of_owners}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Insurance</th>
            <td className="p-2 border">{formData.insurance_type}</td>
            <th className="bg-gray-100 p-2 text-left border">Valid Till</th>
            <td className="p-2 border">{formData.insu_valid || 'N/A'}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Engine No.</th>
            <td className="p-2 border">{formData.engine_number}</td>
            <th className="bg-gray-100 p-2 text-left border">Chassis No.</th>
            <td className="p-2 border">{formData.chassis_number}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Hypothecation</th>
            <td className="p-2 border">{formData.hypothecation} {formData.hypothecation_remark && `- ${formData.hypothecation_remark}`}</td>
            <th className="bg-gray-100 p-2 text-left border">Hypo. Valid Upto</th>
            <td className="p-2 border">{formData.hypothecation_valid_upto || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {/* SECTION 3: Tyre Condition */}
      <SectionHeader title="Tyre Condition" />
      <div className="no-page-break p-3 bg-gray-50 rounded mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
        {[
          { key: 'front_left_tyre', label: 'Front Left' },
          { key: 'front_right_tyre', label: 'Front Right' },
          { key: 'rear_left_tyre', label: 'Rear Left' },
          { key: 'rear_right_tyre', label: 'Rear Right' }
        ].map((tyre) => (
          <div key={tyre.key} className="text-center">
            <div className="text-xs sm:text-sm font-bold uppercase mb-1">{tyre.label}</div>
            <div className="text-2xl sm:text-3xl font-bold" style={{ color: formData[tyre.key] >= 70 ? '#4caf50' : formData[tyre.key] >= 40 ? '#ff9800' : '#f44336' }}>
              {formData[tyre.key] || 0}%
            </div>
            <div className="text-xs sm:text-sm text-gray-500">Tread Remaining</div>
          </div>
        ))}
        <div className="col-span-2 sm:col-span-4 text-center mt-2">
          <span className="text-sm sm:text-base font-medium">Stepney: </span>
          <span className="text-sm sm:text-base font-bold" style={{ color: formData.stepney_tyre >= 70 ? '#4caf50' : formData.stepney_tyre >= 40 ? '#ff9800' : '#f44336' }}>
            {formData.stepney_tyre || 0}%
          </span>
        </div>
      </div>

      {/* SECTION 4: Body Damage Map */}
      <SectionHeader title="Body Damage Map" />
      <div className="no-page-break" style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
        {/* Visual Car Diagram */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ 
            position: 'relative', 
            maxWidth: '400px', 
            width: '100%', 
            aspectRatio: '1/1', 
            border: '2px solid #d1d5db', 
            borderRadius: '8px', 
            overflow: 'hidden', 
            backgroundColor: '#ffffff' 
          }}>
            <img
              src="https://cdn.dribbble.com/userupload/7981471/file/original-972efe59158b49cfa374c9d49f7ae990.jpg"
              alt="Car Body Damage Map"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain', 
                transform: 'rotate(90deg)' 
              }}
            />
            
            {/* Colored Overlay Segments - dynamically from bodyDamageSegments */}
            {Object.entries(bodyDamageSegments).map(([segmentId, segment]) => {
              const data = formData.bodyDamageData?.[segmentId] || {};
              const hasDamage = Object.values(data).some(p => p.status && p.status !== 'OK');
              
              return (
                <div 
                  key={segmentId}
                  style={{
                    position: 'absolute',
                    top: segment.position.top,
                    left: segment.position.left,
                    width: segment.position.width,
                    height: segment.position.height,
                    border: '2px solid',
                    borderColor: hasDamage ? '#f44336' : '#4caf50',
                    boxSizing: 'border-box',
                  }} 
                />
              );
            })}
          </div>
        </div>
        
        {/* Legend - Simple style */}
        <div style={{ textAlign: 'center', fontSize: '16px', color: '#4b5563', marginBottom: '16px' }}>
          <span style={{ color: '#4caf50' }}>Green</span> = OK · <span style={{ color: '#f44336' }}>Red</span> = Issue
        </div>
        
        {/* Damage Details Table */}
        {Object.keys(formData.bodyDamageData || {}).length > 0 && (
          <table className="w-full border-collapse text-base">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-3 text-left">Area</th>
                <th className="p-3 text-left">Part</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(bodyDamageSegments).map(([segmentId, segment]) => {
                const segmentData = formData.bodyDamageData?.[segmentId] || {};
                const damagedParts = Object.entries(segmentData).filter(([_, data]) => data.status && data.status !== 'OK');
                
                if (damagedParts.length === 0) return null;
                
                return damagedParts.map(([partName, data], idx) => (
                  <tr key={`${segmentId}-${partName}`} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {idx === 0 && (
                      <td className="p-3 border font-medium" rowSpan={damagedParts.length}>
                        {segment.name}
                      </td>
                    )}
                    <td className="p-3 border">{partName}</td>
                    <td className="p-3 border font-medium" style={{ color: getDamageColor(data.status) }}>
                      {data.status}
                    </td>
                    <td className="p-3 border text-gray-600 italic">{data.remark || '—'}</td>
                  </tr>
                ));
              })}
            </tbody>
          </table>
        )}
        
        {/* No damage message */}
        {(!formData.bodyDamageData || Object.keys(formData.bodyDamageData).length === 0 || 
          !Object.entries(formData.bodyDamageData).some(([_, segData]) => 
            Object.values(segData).some(p => p.status && p.status !== 'OK')
          )) && (
          <p className="text-center text-green-600 font-bold text-lg mt-4">
            ✓ No damage reported on any body part
          </p>
        )}
      </div>

      {/* Damage Images Section */}
      {formData.damageImages && Object.keys(formData.damageImages).length > 0 && (
        <>
          <SectionHeader title="Damage Photos" />
          <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {Object.entries(formData.damageImages).map(([key, img]) => (
              <div key={key} className="no-page-break text-center">
                <div style={{ border: '2px solid #d32f2f', borderRadius: '8px', padding: '4px', backgroundColor: '#fff' }}>
                  <img 
                    src={img.data} 
                    alt={`Damage: ${img.partName}`}
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
                <p style={{ marginTop: '4px', fontSize: '12px', fontWeight: 'bold', color: '#d32f2f', textTransform: 'uppercase' }}>
                  {img.segmentName} - {img.partName}
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SECTION 5: Car Exterior */}
      <SectionHeader title="Car Exterior" />
      <DetailTable>
        <StatusRow label="Headlight" status={formData.headlight_status} remark={formData.headlight_remark} />
        <StatusRow label="Wiper" status={formData.wiper_status} remark={formData.wiper_remark} />
        <StatusRow label="Car Body Dents" status={formData.car_body_status} remark={formData.car_body_remark} />
        <StatusRow label="Turn Indicators" status={formData.turn_indicator_status} remark={formData.turn_indicator_remark} />
        <StatusRow label="Tail Lights" status={formData.tail_light_status} remark={formData.tail_light_remark} />
        <StatusRow label="Mirrors" status={formData.mirror_status} remark={formData.mirror_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Exterior Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.exterior_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 6: Car Interior */}
      <SectionHeader title="Car Interior" />
      <DetailTable>
        <StatusRow label="Seat Recliner" status={formData.seat_recliner_status} remark={formData.seat_recliner_remark} />
        <StatusRow label="Seat Belt" status={formData.seat_belt_status} remark={formData.seat_belt_remark} />
        <StatusRow label="Roof Interior" status={formData.roof_interior_status} remark={formData.roof_interior_remark} />
        <StatusRow label="Horn" status={formData.horn_status} remark={formData.horn_remark} />
        <StatusRow label="Seat Condition" status={formData.seat_condition_status} remark={formData.seat_condition_remark} />
        <StatusRow label="Central Locking" status={formData.central_locking_status} remark={formData.central_locking_remark} />
        <StatusRow label="Power Windows (Front)" status={formData.power_window_front_status} remark={formData.power_window_front_remark} />
        <StatusRow label="Power Windows (Rear)" status={formData.power_window_rear_status} remark={formData.power_window_rear_remark} />
        <StatusRow label="Switches" status={formData.switch_status} remark={formData.switch_remark} />
        <StatusRow label="Tool Kit" status={formData.tool_kit_status} remark={formData.tool_kit_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Interior Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.interior_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 7: Engine Compartment */}
      <SectionHeader title="Engine Compartment" />
      <DetailTable>
        <StatusRow label="Engine Oil" status={formData.oil_status} remark={formData.oil_remark} />
        <StatusRow label="Engine Condition" status={formData.engine_status} remark={formData.engine_remark} />
        <StatusRow label="Brake Fluid" status={formData.brake_status} remark={formData.brake_remark} />
        <StatusRow label="Engine Mounting" status={formData.mounting_status} remark={formData.mounting_remark} />
        <StatusRow label="Radiator/Condensor" status={formData.radiator_condensor_status} remark={formData.radiator_condensor_remark} />
        <StatusRow label="Coolant Reservoir" status={formData.coolant_reserve_status} remark={formData.coolant_reserve_remark} />
        <StatusRow label="Oil Leakage" status={formData.oil_leakage_status} remark={formData.oil_leakage_remark} />
        <StatusRow label="Gasket Leak" status={formData.gasket_leak_status} remark={formData.gasket_leak_remark} />
        <StatusRow label="Silencer" status={formData.silencer_status} remark={formData.silencer_remark} />
        <StatusRow label="Knocking Noise" status={formData.knocking_status} remark={formData.knocking_remark} />
        <StatusRow label="Cooling System" status={formData.cooling_system_status} remark={formData.cooling_system_remark} />
        <StatusRow label="Radiator Fan" status={formData.radiator_fan_status} remark={formData.radiator_fan_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Engine Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.engine_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 8: Suspension */}
      <SectionHeader title="Suspension & Steering" />
      <DetailTable>
        <StatusRow label="Steering Lock" status={formData.steering_lock_status} remark={formData.steering_lock_remark} />
        <StatusRow label="Steering Operation" status={formData.steering_op_status} remark={formData.steering_op_remark} />
        <StatusRow label="Rack & Pinion" status={formData.rack_pinion_status} remark={formData.rack_pinion_remark} />
        <StatusRow label="Power Steering" status={formData.power_steering_status} remark={formData.power_steering_remark} />
        <StatusRow label="Wheel Alignment" status={formData.wheel_align_status} remark={formData.wheel_align_remark} />
        <StatusRow label="Front Suspension Noise" status={formData.front_noise_status} remark={formData.front_noise_remark} />
        <StatusRow label="Front Struts" status={formData.front_struts_status} remark={formData.front_struts_remark} />
        <StatusRow label="Lower Arm" status={formData.lower_arm_status} remark={formData.lower_arm_remark} />
        <StatusRow label="Tie Rod" status={formData.tie_rod_status} remark={formData.tie_rod_remark} />
        <StatusRow label="Rear Shockers" status={formData.rear_shockers_status} remark={formData.rear_shockers_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Suspension Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.suspension_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 9: Under Chassis */}
      <SectionHeader title="Under Chassis & Brakes" />
      <DetailTable>
        <StatusRow label="Brake Pedal" status={formData.brake_pedal_status} remark={formData.brake_pedal_remark} />
        <StatusRow label="Front Disc" status={formData.front_disc_status} remark={formData.front_disc_remark} />
        <StatusRow label="Rear Disc/Drum" status={formData.rear_disc_status} remark={formData.rear_disc_remark} />
        <StatusRow label="Front Pads" status={formData.front_pads_status} remark={formData.front_pads_remark} />
        <StatusRow label="Rear Pads" status={formData.rear_pads_status} remark={formData.rear_pads_remark} />
        <StatusRow label="ABS" status={formData.abs_status} remark={formData.abs_remark} />
        <StatusRow label="Chassis Tampering" status={formData.chassis_tamper_status} remark={formData.chassis_tamper_remark} />
        <StatusRow label="Brake Assembly" status={formData.brake_assembly_status} remark={formData.brake_assembly_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Under Chassis Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.underchassis_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 10: Transmission */}
      <SectionHeader title="Transmission" />
      <DetailTable>
        <StatusRow label="Gear Box" status={formData.gear_box_status} remark={formData.gear_box_remark} />
        <StatusRow label="Axel Boots/CVJ" status={formData.axel_boots_status} remark={formData.axel_boots_remark} />
        <StatusRow label="Differential" status={formData.differential_status} remark={formData.differential_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Transmission Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.transmission_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 11: Electricals */}
      <SectionHeader title="Electricals" />
      <DetailTable>
        <StatusRow label="Instrument Cluster" status={formData.instrument_cluster_status} remark={formData.instrument_cluster_remark} />
        <StatusRow label="Combo Switch" status={formData.combo_switch_status} remark={formData.combo_switch_remark} />
        <StatusRow label="Battery" status={formData.battery_status} remark={formData.battery_remark} />
        <StatusRow label="Alternator" status={formData.alternator_status} remark={formData.alternator_remark} />
        <StatusRow label="Fuel Pump" status={formData.fuel_pump_status} remark={formData.fuel_pump_remark} />
        <StatusRow label="Wiper Motor" status={formData.wiper_motor_status} remark={formData.wiper_motor_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Electricals Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.electrical_rating || '4'}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 12: A/C Function */}
      <SectionHeader title="A/C & HVAC" />
      <DetailTable>
        <StatusRow label="Compressor" status={formData.compressor_status} remark={formData.compressor_remark} />
        <StatusRow label="Condensor" status={formData.condensor_status} remark={formData.condensor_remark} />
        <StatusRow label="Blower Motor" status={formData.blower_motor_status} remark={formData.blower_motor_remark} />
        <StatusRow label="Heating" status={formData.heating_status} remark={formData.heating_remark} />
        <StatusRow label="Blower Fan" status={formData.blower_fan_status} remark={formData.blower_fan_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">A/C Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.ac_rating}/5</td>
        </tr>
      </DetailTable>

      {/* SECTION 13: Miscellaneous & Accident */}
      <SectionHeader title="Miscellaneous & Accident History" />
      <DetailTable>
        <StatusRow label="Gear Lever" status={formData.gear_lever_status} remark={formData.gear_lever_remark} />
        <StatusRow label="Gear Engagement" status={formData.gear_engage_status} remark={formData.gear_engage_remark} />
        <StatusRow label="Clutch Engagement" status={formData.clutch_engage_status} remark={formData.clutch_engage_remark} />
        <StatusRow label="Clutch Pedal" status={formData.clutch_pedal_status} remark={formData.clutch_pedal_remark} />
        <StatusRow label="Flood Symptoms" status={formData.flood_symptoms_status} remark={formData.flood_symptoms_remark} />
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Miscellaneous Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.misc_rating}/5</td>
        </tr>
        <tr className="bg-gray-100 font-bold">
          <td className="p-2 border">Accident Rating</td>
          <td className="p-2 border text-center" colSpan={2}>{formData.accident_rating}/5 {formData.accident_remark && `(${formData.accident_remark})`}</td>
        </tr>
      </DetailTable>

      {/* SECTION 14: Service History */}
      <SectionHeader title="Service History" />
      <table className="w-full border-collapse mb-4 text-sm no-page-break">
        <tbody>
          <tr>
            <th className="bg-gray-100 p-2 text-left border w-1/3">Last Service Date</th>
            <td className="p-2 border">{formData.last_service_date || 'N/A'}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Service History Available</th>
            <td className="p-2 border">{formData.service_history || 'N/A'}</td>
          </tr>
        </tbody>
      </table>

      {/* Overall Rating */}
      <SectionHeader title="Overall Rating Summary" />
      <div 
        className="no-page-break" 
        style={{ 
          backgroundColor: overall >= 4 ? '#e8f5e9' : overall >= 3 ? '#fff3e0' : '#ffebee',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '16px'
        }}
      >
        {/* Rating Circles Grid */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px', 
          marginBottom: '20px',
          justifyContent: 'center'
        }}>
          {sections.map((section) => (
            <div 
              key={section.name}
              style={{
                border: '3px solid',
                borderColor: section.score >= 4 ? '#4caf50' : section.score >= 3 ? '#ff9800' : '#f44336',
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '12px 8px',
                minWidth: '85px',
                textAlign: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                fontSize: '22px', 
                fontWeight: 'bold', 
                color: section.score >= 4 ? '#4caf50' : section.score >= 3 ? '#ff9800' : '#f44336'
              }}>
                {section.score.toFixed(1)}
              </div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: '600',
                color: '#555',
                textTransform: 'uppercase',
                marginTop: '4px'
              }}>
                {section.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall Score Box */}
        <div style={{ 
          textAlign: 'center',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          border: '3px solid',
          borderColor: overall >= 4 ? '#4caf50' : overall >= 3 ? '#ff9800' : '#f44336',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <div style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            color: overall >= 4 ? '#4caf50' : overall >= 3 ? '#ff9800' : '#f44336',
            lineHeight: '1'
          }}>
            {overall.toFixed(1)}/5
          </div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600',
            color: overall >= 4 ? '#2e7d32' : overall >= 3 ? '#e65100' : '#c62828',
            marginTop: '8px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {getConditionText(overall)} CONDITION
          </div>
        </div>
      </div>

      {/* Refurbishment & Pricing */}
      <SectionHeader title="Refurbishment & Pricing" />
      <table className="w-full border-collapse mb-4 text-sm no-page-break">
        <thead>
          <tr className="bg-black text-white">
            <th className="p-2 text-left">Refurbishment Item</th>
            <th className="p-2 text-right w-1/4">Estimated Cost (INR)</th>
          </tr>
        </thead>
        <tbody>
          {formData.refurb_items.map((item, index) => (
            <tr key={index}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border text-right">{formatINR(item.price)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="font-bold bg-gray-100">
          <tr>
            <td className="p-2 border">TOTAL ESTIMATED REFURBISHMENT</td>
            <td className="p-2 border text-right">INR {formatINR(totalRefurbCost)}</td>
          </tr>
        </tfoot>
      </table>

      <table className="w-full border-collapse mb-4 text-sm no-page-break">
        <tbody>
          <tr className="bg-green-100">
            <td className="p-3 border font-bold">Minimum Buying Price</td>
            <td className="p-3 border text-right font-bold text-green-700">INR {formatINR(formData.min_buying_price)}</td>
          </tr>
          <tr className="bg-green-50">
            <td className="p-3 border font-bold">Maximum Buying Price</td>
            <td className="p-3 border text-right font-bold text-green-700">INR {formatINR(formData.max_buying_price)}</td>
          </tr>
        </tbody>
      </table>

      {/* Refurbishment Images Section */}
      {formData.refurbImages && Object.keys(formData.refurbImages).length > 0 && (
        <>
          <SectionHeader title="Refurbishment Photos" />
          <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {Object.entries(formData.refurbImages).map(([key, img]) => (
              <div key={key} className="no-page-break text-center">
                <div style={{ border: '2px solid #1976d2', borderRadius: '8px', padding: '4px', backgroundColor: '#fff' }}>
                  <img 
                    src={img.data} 
                    alt={img.name || 'Refurbishment photo'}
                    style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </div>
                <p style={{ marginTop: '4px', fontSize: '12px', fontWeight: 'bold', color: '#1976d2', textTransform: 'uppercase' }}>
                  Refurbishment Photo
                </p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Accessories */}
      <SectionHeader title="Accessories Available" />
      <div className="p-4 bg-gray-50 border rounded mb-4 no-page-break">
        {checkedAccessories.length > 0 ? (
          <p className="text-green-700 font-semibold">✓ {checkedAccessories.join(' • ')}</p>
        ) : (
          <p className="text-gray-500 italic">— No accessories selected —</p>
        )}
      </div>

      {/* Vehicle Images - Same styling as damage/refurb photos */}
      <SectionHeader title="Vehicle Images" />
      <div className="grid grid-cols-3 gap-2 mb-4">
        {uploadedImages.map((img) => (
          <div key={img.slotId} className="no-page-break text-center">
            <div style={{ border: '2px solid #d32f2f', borderRadius: '8px', padding: '4px', backgroundColor: '#fff' }}>
              <img 
                src={img.data} 
                alt={img.label}
                className="w-full aspect-square object-cover rounded"
              />
            </div>
            <p className="mt-1 text-xs font-bold text-primary uppercase">
              {img.label}
            </p>
          </div>
        ))}
      </div>

      {/* Final Remarks */}
      <SectionHeader title="Final Remarks & Document Check" />
      <table className="w-full border-collapse mb-4 text-sm no-page-break">
        <tbody>
          <tr>
            <th className="bg-gray-100 p-2 text-left w-1/3 border">Public Remarks</th>
            <td className="p-2 border whitespace-pre-wrap">{formData.public_remarks || '—'}</td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Documents Checked</th>
            <td className="p-2 border">
              <span 
                className="px-3 py-1 rounded-full font-bold text-white text-sm"
                style={{ backgroundColor: formData.doc_checked === 'YES' ? '#4caf50' : formData.doc_checked === 'NO' ? '#f44336' : '#9e9e9e' }}
              >
                {formData.doc_checked || '—'}
              </span>
            </td>
          </tr>
          <tr>
            <th className="bg-gray-100 p-2 text-left border">Public Link</th>
            <td className="p-2 border">
              {formData.public_link ? (
                <a href={formData.public_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                  {formData.public_link}
                </a>
              ) : '—'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Terms & Disclaimer */}
      <div className="bg-gray-100 p-3 text-xs text-gray-600 mb-4 rounded no-page-break">
        <strong>Terms & Conditions:</strong> This evaluation report is valid for 7 days from the date of inspection. 
        The condition ratings are based on visual and mechanical inspection performed by certified engineers.
      </div>

      <div className="text-xs text-gray-500 text-center mb-4 no-page-break">
        DISCLAIMER: This report is based on the condition of the vehicle on the date of inspection 
        and provides an approximate estimate of the condition on that date. Carsure360 Tech Limited 
        has relied on the odometer reading for KMs driven as seen at the time of inspection and is 
        not responsible for verifying its genuineness.
      </div>

      {/* Action Buttons - Hidden in print */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 p-3 sm:p-4 border-t print:hidden safe-area-bottom">
        <button onClick={onBack} className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto order-last sm:order-first">
          ← Back to Edit
        </button>
        <button onClick={onGeneratePdf} className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
          📄 Generate PDF
        </button>
        <button onClick={onReset} className="btn-secondary text-base sm:text-lg px-6 sm:px-8 py-3 w-full sm:w-auto">
          🔄 New Evaluation
        </button>
      </div>
    </div>
  );
}
