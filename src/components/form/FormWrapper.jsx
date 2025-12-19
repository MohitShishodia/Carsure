import { useState } from 'react';
import useFormStore from '../../stores/formStore';

// Import all step components
import GeneralDetails from './steps/GeneralDetails';
import VehicleDetails from './steps/VehicleDetails';
import TyreCondition from './steps/TyreCondition';
import BodyDamageMap from './steps/BodyDamageMap';
import CarExterior from './steps/CarExterior';
import CarInterior from './steps/CarInterior';
import EngineCompartment from './steps/EngineCompartment';
import Suspension from './steps/Suspension';
import UnderChassis from './steps/UnderChassis';
import Transmission from './steps/Transmission';
import Electricals from './steps/Electricals';
import ACFunction from './steps/ACFunction';
import Miscellaneous from './steps/Miscellaneous';
import Service from './steps/Service';
import AccessoriesRefurb from './steps/AccessoriesRefurb';
import ImageUpload from './steps/ImageUpload';
import PublicRemarks from './steps/PublicRemarks';

const STEPS = [
  { component: GeneralDetails, title: 'General Details' },
  { component: VehicleDetails, title: 'Vehicle Details' },
  { component: TyreCondition, title: 'Tyre Condition' },
  { component: BodyDamageMap, title: 'Body Damage Map' },
  { component: CarExterior, title: 'Car Exterior' },
  { component: CarInterior, title: 'Car Interior' },
  { component: EngineCompartment, title: 'Engine Compartment' },
  { component: Suspension, title: 'Suspension' },
  { component: UnderChassis, title: 'Under Chassis' },
  { component: Transmission, title: 'Transmission' },
  { component: Electricals, title: 'Electricals' },
  { component: ACFunction, title: 'A/C Function' },
  { component: Miscellaneous, title: 'Miscellaneous' },
  { component: Service, title: 'Service' },
  { component: AccessoriesRefurb, title: 'Accessories & Refurbishment' },
  { component: ImageUpload, title: 'Vehicle Images' },
  { component: PublicRemarks, title: 'Public Remarks' },
];

export default function FormWrapper({ onSubmit }) {
  const { currentStep, nextStep, prevStep, goToStep } = useFormStore();
  
  const CurrentStepComponent = STEPS[currentStep]?.component;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onSubmit();
    } else {
      nextStep();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    prevStep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Header - Responsive */}
      <div className="header flex flex-col sm:flex-row items-center mb-4 sm:mb-8 p-3 sm:p-5 bg-gradient-to-r from-primary to-primary-dark rounded-lg">
        <div className="text-white font-bold text-xl sm:text-3xl sm:mr-5 tracking-wider mb-1 sm:mb-0">Carsure360.</div>
        <h1 className="text-white text-sm sm:text-2xl font-bold tracking-wide text-center sm:text-left">Enter Vehicle Evaluation Details</h1>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
          <span className="font-medium">Step {currentStep + 1} of {STEPS.length}</span>
          <span className="truncate ml-2 max-w-[150px] sm:max-w-none">{STEPS[currentStep]?.title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div
            className="bg-primary h-2 sm:h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Navigator - Scrollable on mobile */}
      <div className="mb-4 sm:mb-6 -mx-2 px-2">
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {STEPS.map((step, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`flex-shrink-0 text-xs px-2.5 py-1.5 rounded-full transition-all ${
                index === currentStep 
                  ? 'bg-primary text-white shadow-md' 
                  : index < currentStep 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
              }`}
              title={step.title}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <form onSubmit={(e) => e.preventDefault()}>
        {CurrentStepComponent && <CurrentStepComponent />}

        {/* Navigation Buttons - Sticky on mobile */}
        <div className="sticky bottom-0 left-0 right-0 bg-gray-50 border-t border-gray-200 -mx-2 px-3 py-3 sm:relative sm:bg-transparent sm:border-0 sm:mx-0 sm:px-0 sm:py-0 sm:mt-8 flex justify-between gap-3 safe-area-bottom">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`flex-1 sm:flex-none btn-primary ${isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            ← Previous
          </button>
          
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 sm:flex-none btn-primary"
          >
            {isLastStep ? '✓ Generate Report' : 'Next →'}
          </button>
        </div>
      </form>
    </div>
  );
}

