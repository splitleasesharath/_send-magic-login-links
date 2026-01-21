'use client';

interface PhoneOverrideProps {
  phoneOverride: string;
  onPhoneChange: (phone: string) => void;
  disabled: boolean;
}

export default function PhoneOverride({
  phoneOverride,
  onPhoneChange,
  disabled
}: PhoneOverrideProps) {
  const handleClear = () => {
    onPhoneChange('');
  };

  if (disabled) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Phone Number Override (Optional)
      </label>
      <div className="relative">
        <textarea
          className="form-input resize-none h-20"
          placeholder="Enter alternative phone number for SMS redirect (optional)"
          value={phoneOverride}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
        {phoneOverride && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1">
        If provided, the magic link SMS will be sent to this number instead of the user's registered phone.
      </p>
    </div>
  );
}
