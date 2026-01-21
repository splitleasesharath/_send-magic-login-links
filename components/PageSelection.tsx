'use client';

import { DestinationPage } from '@/types';
import StepIndicator from './StepIndicator';

interface PageSelectionProps {
  selectedPage: DestinationPage | null;
  onPageSelect: (page: DestinationPage | null) => void;
  disabled: boolean;
}

const destinationPages: { value: DestinationPage; label: string; description: string }[] = [
  { value: 'account-profile', label: 'Account Profile', description: 'User account settings page' },
  { value: 'favorite-listings', label: 'Favorite Listings', description: 'User saved/favorite properties' },
  { value: 'guest-dashboard', label: 'Guest Dashboard', description: 'Guest user home dashboard' },
  { value: 'guest-house-manual', label: 'Guest House Manual', description: 'Guest house rules and manual' },
  { value: 'guest-leases', label: 'Guest Leases', description: 'Guest lease management' },
  { value: 'host-dashboard', label: 'Host Dashboard', description: 'Host user home dashboard' },
  { value: 'host-house-manual', label: 'Host House Manual', description: 'Host manage house manual' },
  { value: 'host-leases', label: 'Host Leases', description: 'Host lease management' },
  { value: 'host-proposals', label: 'Host Proposals', description: 'Host proposals and negotiations' },
  { value: 'messaging', label: 'Messaging', description: 'Messaging/chat interface' },
  { value: 'rental-app', label: 'Rental Application', description: 'Rental application page' },
  { value: 'self-listing', label: 'Self Listing', description: 'User own listing management' },
  { value: 'view-split-lease', label: 'View Split Lease', description: 'Browse split lease properties' },
  { value: 'virtual-meetings', label: 'Virtual Meetings', description: 'Virtual meeting page' },
  { value: 'date-change-request', label: 'Date Change Request', description: 'Lease date change request' },
];

export default function PageSelection({
  selectedPage,
  onPageSelect,
  disabled
}: PageSelectionProps) {
  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as DestinationPage;
    onPageSelect(value || null);
  };

  return (
    <div className="mb-6">
      <StepIndicator
        stepNumber={2}
        isActive={!disabled && !selectedPage}
        isCompleted={!!selectedPage}
        label="Select Destination Page"
      />

      <select
        className="form-dropdown"
        value={selectedPage || ''}
        onChange={handlePageChange}
        disabled={disabled}
      >
        <option value="">Choose a page...</option>
        {destinationPages.map(page => (
          <option key={page.value} value={page.value}>
            {page.label} - {page.description}
          </option>
        ))}
      </select>
    </div>
  );
}
