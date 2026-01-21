// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePhoto?: string;
  userType: 'guest' | 'host' | 'admin';
}

// Destination Page Types
export type DestinationPage =
  | 'account-profile'
  | 'favorite-listings'
  | 'guest-dashboard'
  | 'guest-house-manual'
  | 'guest-leases'
  | 'host-dashboard'
  | 'host-house-manual'
  | 'host-leases'
  | 'host-proposals'
  | 'messaging'
  | 'rental-app'
  | 'self-listing'
  | 'view-split-lease'
  | 'virtual-meetings'
  | 'date-change-request';

// Data Attachment Types
export interface Listing {
  id: string;
  title: string;
  address: string;
}

export interface Proposal {
  id: string;
  listingId: string;
  status: string;
  createdAt: string;
}

export interface Lease {
  id: string;
  listingId: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface HouseManual {
  id: string;
  listingId: string;
  title: string;
}

export interface Visit {
  id: string;
  listingId: string;
  scheduledDate: string;
  status: string;
}

export interface Thread {
  id: string;
  participants: string[];
  lastMessage?: string;
}

export interface VirtualMeeting {
  id: string;
  meetingUrl: string;
  scheduledTime: string;
}

export interface DateChangeRequest {
  id: string;
  leaseId: string;
  requestedStartDate: string;
  requestedEndDate: string;
  status: string;
}

// Form State
export interface MagicLinkFormState {
  selectedUser: User | null;
  phoneOverride: string;
  selectedPage: DestinationPage | null;
  selectedListing: Listing | null;
  selectedProposal: Proposal | null;
  selectedLease: Lease | null;
  selectedHouseManual: HouseManual | null;
  selectedVisit: Visit | null;
  selectedThread: Thread | null;
  selectedVirtualMeeting: VirtualMeeting | null;
  selectedDateChangeRequest: DateChangeRequest | null;
  selectedAccountUser: User | null;
}

// Alert Types
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'purple';

export interface Alert {
  type: AlertType;
  message: string;
  id: string;
}

// Magic Link Response
export interface MagicLinkResponse {
  success: boolean;
  magicLink?: string;
  message: string;
  error?: string;
}

// API Request
export interface SendMagicLinkRequest {
  userId: string;
  phoneOverride?: string;
  destinationPage: DestinationPage;
  attachedData?: {
    listingId?: string;
    proposalId?: string;
    leaseId?: string;
    houseManualId?: string;
    visitId?: string;
    threadId?: string;
    virtualMeetingId?: string;
    dateChangeRequestId?: string;
    accountUserId?: string;
  };
}
