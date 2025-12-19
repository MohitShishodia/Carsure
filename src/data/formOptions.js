export const STATUS_OPTIONS = {
  working: [
    { value: 'Working', label: 'Working' },
    { value: 'Not Working', label: 'Not Working' },
    { value: 'Damage', label: 'Damage' },
  ],
  workingOnly: [
    { value: 'Working', label: 'Working' },
    { value: 'Not Working', label: 'Not Working' },
  ],
  condition: [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Average', label: 'Average' },
  ],
  perfectCondition: [
    { value: 'Perfect Condition', label: 'Perfect Condition' },
    { value: 'Minor Work Needed', label: 'Minor Work Needed' },
    { value: 'Major Work Needed', label: 'Major Work Needed' },
  ],
  leakage: [
    { value: 'No Leakage', label: 'No Leakage' },
    { value: 'Minor Leakage', label: 'Minor Leakage' },
    { value: 'Major Leakage', label: 'Major Leakage' },
  ],
  oilLeakage: [
    { value: 'No Oil Leakage', label: 'No Oil Leakage' },
    { value: 'Minor Leakage', label: 'Minor Leakage' },
    { value: 'Major Leakage', label: 'Major Leakage' },
  ],
  noise: [
    { value: 'No Noise', label: 'No Noise' },
    { value: 'Test Drive Not Available', label: 'Test Drive Not Available' },
    { value: 'Work Needed', label: 'Work Needed' },
  ],
  available: [
    { value: 'Available', label: 'Available' },
    { value: 'Not Available', label: 'Not Available' },
  ],
  proper: [
    { value: 'Proper', label: 'Proper' },
    { value: 'Work Needed', label: 'Work Needed' },
    { value: 'N/A', label: 'N/A' },
  ],
  yesNo: [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ],
  carBody: [
    { value: 'Perfect Condition', label: 'Perfect Condition' },
    { value: 'Minor Work Needed', label: 'Minor Work Needed' },
    { value: 'Major Work Needed', label: 'Major Work Needed' },
  ],
  excellentWorking: [
    { value: 'Excellent Working', label: 'Excellent Working' },
    { value: 'Good', label: 'Good' },
    { value: 'Average', label: 'Average' },
    { value: 'Not Work/Minor Work Needed', label: 'Not Work/Minor Work Needed' },
    { value: 'Damage/Major Work Needed', label: 'Damage/Major Work Needed' },
  ],
  workNeeded: [
    { value: 'Perfect Condition', label: 'Perfect Condition' },
    { value: 'Work Needed', label: 'Work Needed' },
  ],
  workingNA: [
    { value: 'Working', label: 'Working' },
    { value: 'Not Working', label: 'Not Working' },
    { value: 'N/A', label: 'N/A' },
  ],
  conditionNA: [
    { value: 'Excellent', label: 'Excellent' },
    { value: 'Good', label: 'Good' },
    { value: 'Average', label: 'Average' },
    { value: 'N/A', label: 'N/A' },
  ],
};

export const RATING_OPTIONS = [
  { value: '5', label: 'Excellent' },
  { value: '4', label: 'Good' },
  { value: '3', label: 'Average' },
  { value: '2', label: 'Minor Work Needed' },
  { value: '1', label: 'Major Work Needed' },
];

export const CITIES = [
  { value: 'Delhi', label: 'Delhi' },
  { value: 'Noida', label: 'Noida' },
  { value: 'Gurgaon', label: 'Gurgaon' },
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
].map(m => ({ value: m, label: m }));

export const REGISTRATION_TYPES = [
  { value: 'Unregistered', label: 'Unregistered' },
  { value: 'Individual', label: 'Individual' },
  { value: 'Commercial', label: 'Commercial' },
];

export const INSURANCE_TYPES = [
  { value: 'Comprehensive', label: 'Comprehensive' },
  { value: 'Third Party', label: 'Third Party' },
  { value: 'Zero Depreciation', label: 'Zero Depreciation' },
  { value: 'Expired', label: 'Expired' },
  { value: 'N/A', label: 'N/A' },
];

export const ACCIDENT_OPTIONS = [
  { value: '5', label: 'No Accident History' },
  { value: '4', label: 'Minor Accident (Repaired)' },
  { value: '3', label: 'Moderate Accident' },
  { value: '2', label: 'Major Accident' },
  { value: '1', label: 'Flood / Total Loss' },
];

export const FLOOD_OPTIONS = [
  { value: 'NO FLOOD SIGNS', label: 'NO FLOOD SIGNS' },
  { value: 'FLOOD SUSPECTED', label: 'FLOOD SUSPECTED' },
];

export const SERVICE_OPTIONS = [
  { value: 'N/A', label: 'N/A' },
  { value: 'WORK NEEDED', label: 'WORK NEEDED' },
];

export const LAST_SERVICE_OPTIONS = [
  { value: 'N/A', label: 'N/A' },
  { value: 'KNOWN', label: 'FILL THE DATE' },
];

export const DOC_CHECKED_OPTIONS = [
  { value: '', label: '-- Select --' },
  { value: 'YES', label: 'YES' },
  { value: 'NO', label: 'NO' },
];

export const ACCESSORIES_LIST = [
  { id: 'acc_abs', label: 'ABS' },
  { id: 'acc_airbags', label: 'AIRBAGS' },
  { id: 'acc_alloy', label: 'ALLOY WHEELS' },
  { id: 'acc_reverse_cam', label: 'REVERSE CAMERA' },
  { id: 'acc_360_cam', label: '360 CAMERA' },
  { id: 'acc_rear_sensor', label: 'REAR SENSOR' },
  { id: 'acc_central_lock', label: 'CENTRAL LOCKING' },
  { id: 'acc_floor_mats', label: 'FLOOR MATS' },
  { id: 'acc_fog_lamps', label: 'FOG LAMPS' },
  { id: 'acc_seat_cover', label: 'SEAT COVER' },
  { id: 'acc_speakers', label: 'SOUND SPEAKER' },
  { id: 'acc_sunroof', label: 'SUNROOF' },
  { id: 'acc_drl', label: 'DRL' },
  { id: 'acc_music', label: 'MUSIC SYSTEM' },
  { id: 'acc_power_window', label: 'POWER WINDOW' },
];

export const IMAGE_SLOTS = [
  '1. FRONT STRAIGHT SHOT',
  '2. RHS ANGULAR SHOT',
  '3. LHS ANGULAR SHOT',
  '4. RHS SHOT',
  '5. LHS SHOT',
  '6. REAR STRAIGHT SHOT',
  '7. INTERIOR WINDSHIELD',
  '8. FRHS DOORS OPEN SHOT',
  '9. TECHOMETER/SPEEDOMETER',
  '10. REAR DOOR OPEN SHOT',
  '11. DICKY OPEN-BOOT SPACE',
  '12. BONNET OPEN-ENGINE',
  '13. FRONT RIGHT TYRE',
  '14. FRONT LEFT TYRE',
  '15. REAR RIGHT TYRE',
  '16. REAR LEFT TYRE',
  '17. SPARE WHEEL',
  '18. RHS AXLE OUTER',
  '19. LHS AXLE OUTER',
  '20. FRONT UNDER BODY',
  '21. REAR UNDERBODY',
  '22. PEDALS PHOTO',
  '23. CAR KEY PHOTO',
  '24. R.C. PHOTO',
  '25. CHASSIS PLATE',
  '26. CHASSIS EMBOSSING',
];
