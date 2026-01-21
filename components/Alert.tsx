'use client';

import { AlertType } from '@/types';
import { useEffect } from 'react';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const iconMap: Record<AlertType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  purple: '⬤',
};

export default function Alert({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000
}: AlertProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, duration]);

  return (
    <div className={`alert ${type}`}>
      <div className="flex-shrink-0">
        <span className="text-xl font-bold">{iconMap[type]}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-500 hover:text-gray-700 ml-4"
        >
          <span className="text-xl">×</span>
        </button>
      )}
    </div>
  );
}
