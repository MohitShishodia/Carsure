import useFormStore from '../../../stores/formStore';
import { Input, Select, Textarea } from '../../common/FormComponents';
import { MONTHS, REGISTRATION_TYPES, INSURANCE_TYPES, STATUS_OPTIONS } from '../../../data/formOptions';

export default function VehicleDetails() {
  const { formData, updateField } = useFormStore();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  }));

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-primary">Vehicle Details</legend>
      
      {/* Car Specification */}
      <div className="section-title">Car Specification</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Select
          label="Manufacturing Year"
          id="mfg_year"
          value={formData.mfg_year}
          onChange={(value) => updateField('mfg_year', value)}
          options={years}
        />
        
        <Select
          label="Manufacturing Month"
          id="mfg_month"
          value={formData.mfg_month}
          onChange={(value) => updateField('mfg_month', value)}
          options={MONTHS}
        />
        
        <Input
          label="Brand"
          id="brand"
          value={formData.brand}
          onChange={(value) => updateField('brand', value)}
          placeholder="Enter brand"
        />
        
        <Input
          label="Model"
          id="model"
          value={formData.model}
          onChange={(value) => updateField('model', value)}
          placeholder="Enter model"
        />
        
        <Input
          label="Variant"
          id="variant"
          value={formData.variant}
          onChange={(value) => updateField('variant', value)}
          placeholder="Enter variant"
        />
        
        <Input
          label="Fuel Type"
          id="fuel_type"
          value={formData.fuel_type}
          onChange={(value) => updateField('fuel_type', value)}
          placeholder="Petrol/Diesel/CNG/Electric"
        />
        
        <Input
          label="KM Run"
          id="km_run"
          value={formData.km_run}
          onChange={(value) => updateField('km_run', value)}
          placeholder="e.g., 18,008 Kms"
        />
        
        <Input
          label="Color"
          id="color"
          value={formData.color}
          onChange={(value) => updateField('color', value)}
          placeholder="Enter color"
        />
      </div>

      {/* Registration Details */}
      <div className="section-title">Registration Details</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Select
          label="Registration Type"
          id="registration_type"
          value={formData.registration_type}
          onChange={(value) => updateField('registration_type', value)}
          options={REGISTRATION_TYPES}
        />
        
        <Input
          label="Registration Number"
          id="registration_no"
          value={formData.registration_no}
          onChange={(value) => updateField('registration_no', value)}
          placeholder="e.g., UP78GD5899"
        />
        
        <Input
          label="Registration Date"
          id="registration_date"
          type="date"
          value={formData.registration_date}
          onChange={(value) => updateField('registration_date', value)}
        />
        
        <Input
          label="Number of Owners"
          id="number_of_owners"
          type="number"
          value={formData.number_of_owners}
          onChange={(value) => updateField('number_of_owners', value)}
          placeholder="Enter number"
        />
      </div>

      {/* Insurance Details */}
      <div className="section-title">Insurance Details</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <Select
          label="Insurance Type"
          id="insurance_type"
          value={formData.insurance_type}
          onChange={(value) => updateField('insurance_type', value)}
          options={INSURANCE_TYPES}
        />
        
        <Input
          label="Insurance Valid Upto"
          id="insu_valid"
          type="date"
          value={formData.insu_valid}
          onChange={(value) => updateField('insu_valid', value)}
        />
      </div>

      {/* Other Details */}
      <div className="section-title">Other Details</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="sm:col-span-2 md:col-span-1">
          <Select
            label="Hypothecation"
            id="hypothecation"
            value={formData.hypothecation}
            onChange={(value) => updateField('hypothecation', value)}
            options={STATUS_OPTIONS.yesNo}
          />
          {formData.hypothecation === 'Yes' && (
            <>
              <Input
                label="Hypothecation By"
                id="hypothecation_by"
                value={formData.hypothecation_by}
                onChange={(value) => updateField('hypothecation_by', value)}
                placeholder="Enter bank/financier name"
              />
              <Textarea
                label="Hypothecation Remark"
                id="hypothecation_remark"
                value={formData.hypothecation_remark}
                onChange={(value) => updateField('hypothecation_remark', value)}
                placeholder="Enter hypothecation details (Bank name, etc.)"
              />
            </>
          )}
        </div>
        
        <Input
          label="Engine Number"
          id="engine_number"
          value={formData.engine_number}
          onChange={(value) => updateField('engine_number', value)}
          placeholder="Enter engine number"
        />
        
        <Input
          label="Chassis Number"
          id="chassis_number"
          value={formData.chassis_number}
          onChange={(value) => updateField('chassis_number', value)}
          placeholder="Enter chassis number"
        />
      </div>
    </fieldset>
  );
}

