import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialFormData = {
  // Step 1: General Details
  evaluation_id: '',
  evaluation_date: new Date().toISOString().split('T')[0],
  inspection_location: '',
  inspection_city: 'Delhi',
  
  // Step 2: Vehicle Details
  mfg_year: '2020',
  mfg_month: 'July',
  brand: '',
  model: '',
  variant: '',
  fuel_type: '',
  km_run: '',
  color: '',
  registration_type: 'Individual',
  registration_no: '',
  registration_date: '',
  number_of_owners: '1',
  insurance_type: 'Comprehensive',
  insu_valid: '',
  hypothecation: 'No',
  hypothecation_remark: '',
  hypothecation_by: '',
  engine_number: '',
  chassis_number: '',
  
  // Step 3: Tyre Condition
  front_right_tyre: 100,
  front_left_tyre: 100,
  rear_right_tyre: 100,
  rear_left_tyre: 100,
  stepney_tyre: 100,
  
  // Step 4: Body Damage Map
  bodyDamageData: {},
  damageImages: {},  // Damage photos keyed by 'segmentId-partName'
  
  // Step 5: Car Exterior
  headlight_status: 'Working',
  headlight_remark: '',
  wiper_status: 'Working',
  wiper_remark: '',
  car_body_status: 'Perfect Condition',
  car_body_remark: '',
  turn_indicator_status: 'Working',
  turn_indicator_remark: '',
  tail_light_status: 'Working',
  tail_light_remark: '',
  mirror_status: 'Working',
  mirror_remark: '',
  exterior_rating: '4',
  
  // Step 6: Car Interior
  seat_recliner_status: 'Working',
  seat_recliner_remark: '',
  seat_belt_status: 'Working',
  seat_belt_remark: '',
  roof_interior_status: 'Good',
  roof_interior_remark: '',
  horn_status: 'Working',
  horn_remark: '',
  seat_condition_status: 'Good',
  seat_condition_remark: '',
  central_locking_status: 'Working',
  central_locking_remark: '',
  power_window_front_status: 'Working',
  power_window_front_remark: '',
  power_window_rear_status: 'Working',
  power_window_rear_remark: '',
  switch_status: 'Working',
  switch_remark: '',
  tool_kit_status: 'Available',
  tool_kit_remark: '',
  interior_rating: '4',
  
  // Step 7: Engine Compartment
  oil_status: 'Excellent',
  oil_remark: '',
  engine_status: 'Excellent',
  engine_remark: '',
  brake_status: 'Excellent',
  brake_remark: '',
  mounting_status: 'Perfect Condition',
  mounting_remark: '',
  belts_status: 'Excellent',
  belts_remark: '',
  fan_belts_status: 'Excellent',
  fan_belts_remark: '',
  alt_belt_status: 'Excellent',
  alt_belt_remark: '',
  hoses_status: 'Excellent',
  hoses_remark: '',
  turbo_hoses_status: 'Excellent',
  turbo_hoses_remark: '',
  intercooler_hoses_status: 'Excellent',
  intercooler_hoses_remark: '',
  radiator_condensor_status: 'Perfect Condition',
  radiator_condensor_remark: '',
  coolant_reserve_status: 'Perfect Condition',
  coolant_reserve_remark: '',
  coolant_pipe_status: 'Perfect Condition',
  coolant_pipe_remark: '',
  radiator_leak_status: 'Perfect Condition',
  radiator_leak_remark: '',
  oil_leakage_status: 'No Oil Leakage',
  oil_leakage_remark: '',
  gasket_leak_status: 'No Leakage',
  gasket_leak_remark: '',
  cyl_head_leak_status: 'No Leakage',
  cyl_head_leak_remark: '',
  camshaft_seals_status: 'No Leakage',
  camshaft_seals_remark: '',
  engine_sump_status: 'No Leakage',
  engine_sump_remark: '',
  plugs_status: 'Excellent',
  plugs_remark: '',
  heater_plugs_status: 'Excellent',
  heater_plugs_remark: '',
  spark_plugs_status: 'Excellent',
  spark_plugs_remark: '',
  filters_status: 'Excellent',
  filters_remark: '',
  fuel_filter_status: 'Excellent',
  fuel_filter_remark: '',
  air_filter_status: 'Excellent',
  air_filter_remark: '',
  silencer_status: 'Perfect Condition',
  silencer_remark: '',
  silencer_leak_status: 'Perfect Condition',
  silencer_leak_remark: '',
  exhaust_system_status: 'Perfect Condition',
  exhaust_system_remark: '',
  abnormal_noise_status: 'No Abnormal Engine Noise',
  abnormal_noise_remark: '',
  tappet_noise_status: 'Perfect Condition',
  tappet_noise_remark: '',
  camshaft_noise_status: 'Perfect Condition',
  camshaft_noise_remark: '',
  knocking_status: 'Perfect Condition',
  knocking_remark: '',
  connecting_noise_status: 'Perfect Condition',
  connecting_noise_remark: '',
  turbo_whistle_status: 'Perfect Condition',
  turbo_whistle_remark: '',
  tensioner_bearing_status: 'Perfect Condition',
  tensioner_bearing_remark: '',
  rpm_missing_status: 'Perfect Condition',
  rpm_missing_remark: '',
  ignition_coil_status: 'Perfect Condition',
  ignition_coil_remark: '',
  ignition_wire_status: 'Perfect Condition',
  ignition_wire_remark: '',
  cooling_system_status: 'Perfect Condition',
  cooling_system_remark: '',
  radiator_fan_status: 'Perfect Condition',
  radiator_fan_remark: '',
  temp_switch_status: 'Perfect Condition',
  temp_switch_remark: '',
  pumps_pressure_status: 'Perfect Condition',
  pumps_pressure_remark: '',
  oil_pump_status: 'Perfect Condition',
  oil_pump_remark: '',
  oil_pressure_status: 'Perfect Condition',
  oil_pressure_remark: '',
  water_pump_status: 'Perfect Condition',
  water_pump_remark: '',
  water_pump_play_status: 'Perfect Condition',
  water_pump_play_remark: '',
  water_pump_noise_status: 'Perfect Condition',
  water_pump_noise_remark: '',
  back_compression_status: 'Perfect Condition',
  back_compression_remark: '',
  smoke_status: 'Perfect Condition',
  smoke_remark: '',
  trans_2wd_4wd_status: 'Perfect Condition',
  trans_2wd_4wd_remark: '',
  trans_case_leak_status: 'Perfect Condition',
  trans_case_leak_remark: '',
  engine_rating: '4',
  
  // Step 8: Suspension
  steering_lock_status: 'Working',
  steering_lock_remark: '',
  steering_op_status: 'Working',
  steering_op_remark: '',
  rack_pinion_status: 'Excellent',
  rack_pinion_remark: '',
  power_steering_status: 'Working',
  power_steering_remark: '',
  ps_pump_status: 'Working',
  ps_pump_remark: '',
  eps_status: 'Working',
  eps_remark: '',
  wheel_align_status: 'Perfect Condition',
  wheel_align_remark: '',
  front_noise_status: 'No Noise',
  front_noise_remark: '',
  front_struts_status: 'Excellent',
  front_struts_remark: '',
  lower_arm_status: 'Excellent',
  lower_arm_remark: '',
  tie_rod_status: 'Excellent',
  tie_rod_remark: '',
  stab_links_status: 'Excellent',
  stab_links_remark: '',
  fr_bearings_status: 'Excellent',
  fr_bearings_remark: '',
  rear_noise_status: 'No Noise',
  rear_noise_remark: '',
  rear_shockers_status: 'Excellent',
  rear_shockers_remark: '',
  stab_bar_status: 'Excellent',
  stab_bar_remark: '',
  rr_bearing_status: 'Excellent',
  rr_bearing_remark: '',
  suspension_rating: '4',
  
  // Step 9: Under Chassis
  brake_pedal_status: 'Perfect Condition',
  brake_pedal_remark: '',
  brakes_hand_status: 'Perfect Condition',
  brakes_hand_remark: '',
  booster_status: 'Perfect Condition',
  booster_remark: '',
  master_cyl_status: 'Perfect Condition',
  master_cyl_remark: '',
  wheel_cyl_status: 'Perfect Condition',
  wheel_cyl_remark: '',
  front_pads_status: 'Perfect Condition',
  front_pads_remark: '',
  rear_pads_status: 'Perfect Condition',
  rear_pads_remark: '',
  abs_status: 'Working',
  abs_remark: '',
  chassis_tamper_status: 'Perfect Condition',
  chassis_tamper_remark: '',
  brake_assembly_status: 'Perfect Condition',
  brake_assembly_remark: '',
  underchassis_rating: '4',
  
  // Step 10: Transmission
  gear_box_status: 'Excellent Working',
  gear_box_remark: '',
  axel_boots_status: 'Excellent Working',
  axel_boots_remark: '',
  differential_status: 'Excellent Working',
  differential_remark: '',
  transmission_rating: '5',
  
  // Step 11: Electricals
  instrument_cluster_status: 'Working',
  instrument_cluster_remark: '',
  combo_switch_status: 'Working',
  combo_switch_remark: '',
  ac_switch_status: 'Working',
  ac_switch_remark: '',
  wiper_switch_status: 'Working',
  wiper_switch_remark: '',
  wiper_motor_status: 'Working',
  wiper_motor_remark: '',
  battery_status: 'Excellent',
  battery_remark: '',
  alternator_status: 'Excellent',
  alternator_remark: '',
  fuel_pump_status: 'Excellent',
  fuel_pump_remark: '',
  injectors_status: 'Working',
  injectors_remark: '',
  chg_fitting_status: 'Not Available',
  chg_fitting_remark: '',
  speedometer_status: 'Working',
  speedometer_remark: '',
  temp_gauge_status: 'Perfect Condition',
  temp_gauge_remark: '',
  electrical_rating: '4',
  
  // Step 12: A/C Function
  cooling_status: 'Excellent',
  cooling_remark: '',
  compressor_status: 'Working',
  compressor_remark: '',
  condensor_status: 'Working',
  condensor_remark: '',
  blower_motor_status: 'Working',
  blower_motor_remark: '',
  heating_status: 'Excellent',
  heating_remark: '',
  blower_fan_status: 'Good',
  blower_fan_remark: '',
  ac_rating: '4',
  
  // Step 13: Miscellaneous
  gear_lever_status: 'Proper',
  gear_lever_remark: '',
  frhs_drive_status: 'Perfect Condition',
  frhs_drive_remark: '',
  flhs_drive_status: 'Perfect Condition',
  flhs_drive_remark: '',
  gear_engage_status: 'Proper',
  gear_engage_remark: '',
  clutch_engage_status: 'Proper',
  clutch_engage_remark: '',
  clutch_pedal_status: 'Proper',
  clutch_pedal_remark: '',
  diff_crown_status: 'Perfect Condition',
  diff_crown_remark: '',
  diff_pinion_status: 'Perfect Condition',
  diff_pinion_remark: '',
  crown_pinion_status: 'Perfect Condition',
  crown_pinion_remark: '',
  cross_pinion_status: 'Perfect Condition',
  cross_pinion_remark: '',
  flood_symptoms_status: 'NO FLOOD SIGNS',
  flood_symptoms_remark: '',
  misc_gear_box_status: 'Proper',
  misc_gear_box_remark: '',
  misc_remark: '',
  accident_rating: '5',
  accident_remark: '',
  misc_rating: '4',
  
  // Step 14: Service
  need_service_status: 'N/A',
  need_service_remark: '',
  last_service_status: 'N/A',
  last_service_date: '',
  
  // Step 15: Accessories & Refurbishment
  refurb_items: [{ name: 'Dent Removal', price: 5000 }],
  refurbImages: {},  // Refurbishment photos
  min_buying_price: '1500000',
  max_buying_price: '1600000',
  
  // Accessories Checklist
  acc_abs: false,
  acc_airbags: false,
  acc_alloy: false,
  acc_reverse_cam: false,
  acc_360_cam: false,
  acc_rear_sensor: false,
  acc_central_lock: false,
  acc_floor_mats: false,
  acc_fog_lamps: false,
  acc_seat_cover: false,
  acc_speakers: false,
  acc_sunroof: false,
  acc_drl: false,
  acc_music: false,
  acc_power_window: false,
  
  // Step 16: Images
  images: {},
  
  // Step 17: Public Remarks
  public_remarks: '',
  doc_checked: '',
  public_link: '',
};

const useFormStore = create(
  persist(
    (set, get) => ({
      formData: { ...initialFormData },
      currentStep: 0,
      totalSteps: 17,
      
      updateField: (field, value) => 
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        })),
      
      updateMultipleFields: (fields) =>
        set((state) => ({
          formData: { ...state.formData, ...fields }
        })),
      
      setImage: (slotId, imageData) =>
        set((state) => ({
          formData: {
            ...state.formData,
            images: { ...state.formData.images, [slotId]: imageData }
          }
        })),
      
      removeImage: (slotId) =>
        set((state) => {
          const newImages = { ...state.formData.images };
          delete newImages[slotId];
          return { formData: { ...state.formData, images: newImages } };
        }),
      
      addRefurbItem: (name = '', price = 0) =>
        set((state) => ({
          formData: {
            ...state.formData,
            refurb_items: [...state.formData.refurb_items, { name, price }]
          }
        })),
      
      removeRefurbItem: (index) =>
        set((state) => ({
          formData: {
            ...state.formData,
            refurb_items: state.formData.refurb_items.filter((_, i) => i !== index)
          }
        })),
      
      updateRefurbItem: (index, field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            refurb_items: state.formData.refurb_items.map((item, i) =>
              i === index ? { ...item, [field]: value } : item
            )
          }
        })),
      
      setBodyDamageData: (segmentId, data) =>
        set((state) => ({
          formData: {
            ...state.formData,
            bodyDamageData: { ...state.formData.bodyDamageData, [segmentId]: data }
          }
        })),
      
      setDamageImage: (key, imageData) =>
        set((state) => ({
          formData: {
            ...state.formData,
            damageImages: { ...state.formData.damageImages, [key]: imageData }
          }
        })),
      
      removeDamageImage: (key) =>
        set((state) => {
          const newDamageImages = { ...state.formData.damageImages };
          delete newDamageImages[key];
          return { formData: { ...state.formData, damageImages: newDamageImages } };
        }),
      
      setRefurbImage: (key, imageData) =>
        set((state) => ({
          formData: {
            ...state.formData,
            refurbImages: { ...state.formData.refurbImages, [key]: imageData }
          }
        })),
      
      removeRefurbImage: (key) =>
        set((state) => {
          const newRefurbImages = { ...state.formData.refurbImages };
          delete newRefurbImages[key];
          return { formData: { ...state.formData, refurbImages: newRefurbImages } };
        }),
      
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1)
        })),
      
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 0)
        })),
      
      goToStep: (step) =>
        set({ currentStep: Math.max(0, Math.min(step, get().totalSteps - 1)) }),
      
      // Database operations
      setDatabaseId: (id) => set({ databaseId: id }),
      
      getDatabaseId: () => get().databaseId,
      
      loadFromDatabase: (evaluation) => {
        // Load evaluation data from database
        const { data, images, id } = evaluation;
        set({
          formData: {
            ...initialFormData,
            ...data,
            images: images || {}
          },
          databaseId: id,
          currentStep: 0
        });
      },
      
      resetForm: () => {
        // Clear localStorage to ensure complete reset
        localStorage.removeItem('carsure360-form-storage');
        set({
          formData: { ...initialFormData, images: {}, bodyDamageData: {}, damageImages: {}, refurbImages: {} },
          currentStep: 0,
          databaseId: null
        });
      },
      
      getFormData: () => get().formData,
    }),
    {
      name: 'carsure360-form-storage',
      // Exclude images from storage to prevent quota exceeded errors
      partialize: (state) => ({
        ...state,
        formData: {
          ...state.formData,
          images: {}, // Don't persist images - they're too large
          damageImages: {}, // Don't persist damage images
          refurbImages: {} // Don't persist refurbishment images
        }
      }),
    }
  )
);

export default useFormStore;

