'use client';

import { User } from '@/types';
import StepIndicator from './StepIndicator';

interface SendButtonProps {
  selectedUser: User | null;
  onSend: () => void;
  disabled: boolean;
  loading: boolean;
}

export default function SendButton({
  selectedUser,
  onSend,
  disabled,
  loading
}: SendButtonProps) {
  return (
    <div className="mb-6">
      <StepIndicator
        stepNumber={4}
        isActive={!disabled}
        isCompleted={false}
        label="Send Magic Login Link"
      />

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
        {selectedUser && (
          <div className="flex items-center space-x-4 mb-4">
            {selectedUser.profilePhoto ? (
              <img
                src={selectedUser.profilePhoto}
                alt={selectedUser.firstName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-brand-purple flex items-center justify-center text-white font-semibold text-lg">
                {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
            </div>
          </div>
        )}

        <button
          className="btn-primary w-full"
          onClick={onSend}
          disabled={disabled || loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Magic Login Link...
            </span>
          ) : (
            'Send Magic Login Link'
          )}
        </button>

        {disabled && !selectedUser && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Please select a user and destination page to continue
          </p>
        )}
      </div>
    </div>
  );
}
