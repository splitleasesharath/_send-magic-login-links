'use client';

interface StepIndicatorProps {
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  label: string;
}

export default function StepIndicator({
  stepNumber,
  isActive,
  isCompleted,
  label
}: StepIndicatorProps) {
  const getStepClass = () => {
    if (isCompleted) return 'completed';
    if (isActive) return 'active';
    return 'inactive';
  };

  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className={`step-indicator ${getStepClass()}`}>
        {isCompleted ? '✓' : stepNumber}
      </div>
      <span className={`text-sm font-medium ${
        isActive ? 'text-brand-purple' : isCompleted ? 'text-green-600' : 'text-gray-500'
      }`}>
        {label}
      </span>
    </div>
  );
}
