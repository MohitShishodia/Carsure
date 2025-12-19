import useFormStore from '../../../stores/formStore';
import { RangeSlider } from '../../common/FormComponents';

export default function TyreCondition() {
  const { formData, updateField } = useFormStore();

  const tyres = [
    { id: 'front_right_tyre', label: 'Front Right Tyre (%)' },
    { id: 'front_left_tyre', label: 'Front Left Tyre (%)' },
    { id: 'rear_right_tyre', label: 'Rear Right Tyre (%)' },
    { id: 'rear_left_tyre', label: 'Rear Left Tyre (%)' },
    { id: 'stepney_tyre', label: 'Stepney Tyre (%)' },
  ];

  return (
    <fieldset className="fieldset-container">
      <legend className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-primary">Tyre Condition</legend>
      
      <div className="section-title">Tyre Condition</div>
      
      <div className="space-y-4 sm:space-y-6">
        {tyres.map((tyre) => (
          <RangeSlider
            key={tyre.id}
            label={tyre.label}
            id={tyre.id}
            value={formData[tyre.id]}
            onChange={(value) => updateField(tyre.id, value)}
            min={1}
            max={100}
          />
        ))}
      </div>

      {/* Visual tyre diagram */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-sm sm:text-base mb-3 sm:mb-4 text-center">Tyre Condition Overview</h3>
        <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-sm sm:max-w-md mx-auto">
          <div className="text-center">
            <div className={`w-12 h-16 sm:w-16 sm:h-24 mx-auto rounded-lg ${formData.front_left_tyre >= 70 ? 'bg-rating-excellent' : formData.front_left_tyre >= 40 ? 'bg-rating-average' : 'bg-rating-damaged'} flex items-center justify-center text-white font-bold text-xs sm:text-base`}>
              {formData.front_left_tyre}%
            </div>
            <p className="mt-1 text-xs sm:text-sm">Front Left</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-16 sm:w-16 sm:h-24 mx-auto rounded-lg ${formData.front_right_tyre >= 70 ? 'bg-rating-excellent' : formData.front_right_tyre >= 40 ? 'bg-rating-average' : 'bg-rating-damaged'} flex items-center justify-center text-white font-bold text-xs sm:text-base`}>
              {formData.front_right_tyre}%
            </div>
            <p className="mt-1 text-xs sm:text-sm">Front Right</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-16 sm:w-16 sm:h-24 mx-auto rounded-lg ${formData.rear_left_tyre >= 70 ? 'bg-rating-excellent' : formData.rear_left_tyre >= 40 ? 'bg-rating-average' : 'bg-rating-damaged'} flex items-center justify-center text-white font-bold text-xs sm:text-base`}>
              {formData.rear_left_tyre}%
            </div>
            <p className="mt-1 text-xs sm:text-sm">Rear Left</p>
          </div>
          <div className="text-center">
            <div className={`w-12 h-16 sm:w-16 sm:h-24 mx-auto rounded-lg ${formData.rear_right_tyre >= 70 ? 'bg-rating-excellent' : formData.rear_right_tyre >= 40 ? 'bg-rating-average' : 'bg-rating-damaged'} flex items-center justify-center text-white font-bold text-xs sm:text-base`}>
              {formData.rear_right_tyre}%
            </div>
            <p className="mt-1 text-xs sm:text-sm">Rear Right</p>
          </div>
        </div>
        <div className="text-center mt-3 sm:mt-4">
          <div className={`w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-full ${formData.stepney_tyre >= 70 ? 'bg-rating-excellent' : formData.stepney_tyre >= 40 ? 'bg-rating-average' : 'bg-rating-damaged'} flex items-center justify-center text-white font-bold text-xs sm:text-sm`}>
            {formData.stepney_tyre}%
          </div>
          <p className="mt-1 text-xs sm:text-sm">Stepney</p>
        </div>
      </div>
    </fieldset>
  );
}

