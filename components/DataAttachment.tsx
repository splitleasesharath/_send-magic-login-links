'use client';

import { DestinationPage, User, Listing, Proposal, Lease, HouseManual, Visit, Thread, VirtualMeeting, DateChangeRequest } from '@/types';
import { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';

interface DataAttachmentProps {
  selectedUser: User | null;
  selectedPage: DestinationPage | null;
  onDataChange: (data: any) => void;
}

export default function DataAttachment({
  selectedUser,
  selectedPage,
  onDataChange
}: DataAttachmentProps) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [houseManuals, setHouseManuals] = useState<HouseManual[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [virtualMeetings, setVirtualMeetings] = useState<VirtualMeeting[]>([]);
  const [dateChangeRequests, setDateChangeRequests] = useState<DateChangeRequest[]>([]);

  const [selectedData, setSelectedData] = useState<any>({
    listingId: '',
    proposalId: '',
    leaseId: '',
    houseManualId: '',
    visitId: '',
    threadId: '',
    virtualMeetingId: '',
    dateChangeRequestId: '',
    accountUserId: '',
  });

  // Fetch data when user is selected
  useEffect(() => {
    if (selectedUser) {
      fetchUserData(selectedUser.id);
    }
  }, [selectedUser]);

  // Update parent when data changes
  useEffect(() => {
    onDataChange(selectedData);
  }, [selectedData, onDataChange]);

  const fetchUserData = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-data?userId=${userId}`);
      const data = await response.json();

      setListings(data.listings || []);
      setProposals(data.proposals || []);
      setLeases(data.leases || []);
      setHouseManuals(data.houseManuals || []);
      setVisits(data.visits || []);
      setThreads(data.threads || []);
      setVirtualMeetings(data.virtualMeetings || []);
      setDateChangeRequests(data.dateChangeRequests || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleDataChange = (field: string, value: string) => {
    setSelectedData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  if (!selectedPage) {
    return null;
  }

  const showListingSelect = ['self-listing', 'view-split-lease'].includes(selectedPage);
  const showProposalSelect = selectedPage === 'host-proposals';
  const showLeaseSelect = ['guest-leases', 'host-leases'].includes(selectedPage);
  const showHouseManualSelect = ['guest-house-manual', 'host-house-manual'].includes(selectedPage);
  const showVisitSelect = selectedPage === 'rental-app';
  const showThreadSelect = selectedPage === 'messaging';
  const showVirtualMeetingSelect = selectedPage === 'virtual-meetings';
  const showDateChangeRequestSelect = selectedPage === 'date-change-request';
  const showAccountUserSelect = selectedPage === 'account-profile';
  const showFavoriteListingsNote = selectedPage === 'favorite-listings';

  const hasAnyDataField = showListingSelect || showProposalSelect || showLeaseSelect ||
    showHouseManualSelect || showVisitSelect || showThreadSelect || showVirtualMeetingSelect ||
    showDateChangeRequestSelect || showAccountUserSelect || showFavoriteListingsNote;

  if (!hasAnyDataField) {
    return null;
  }

  return (
    <div className="mb-6">
      <StepIndicator
        stepNumber={3}
        isActive={!!selectedPage}
        isCompleted={false}
        label="Attach Data (Optional)"
      />

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        {/* Listing Selection */}
        {showListingSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Listing
            </label>
            <select
              className="form-dropdown"
              value={selectedData.listingId}
              onChange={(e) => handleDataChange('listingId', e.target.value)}
            >
              <option value="">Choose a listing...</option>
              {listings.map(listing => (
                <option key={listing.id} value={listing.id}>
                  {listing.title} - {listing.address}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Proposal Selection */}
        {showProposalSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Proposal
            </label>
            <select
              className="form-dropdown"
              value={selectedData.proposalId}
              onChange={(e) => handleDataChange('proposalId', e.target.value)}
            >
              <option value="">Choose a proposal...</option>
              {proposals.map(proposal => (
                <option key={proposal.id} value={proposal.id}>
                  Proposal #{proposal.id} - {proposal.status}
                </option>
              ))}
            </select>

            {/* Optional Thread for Proposal */}
            {selectedData.proposalId && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Thread (Optional)
                </label>
                <select
                  className="form-dropdown"
                  value={selectedData.threadId}
                  onChange={(e) => handleDataChange('threadId', e.target.value)}
                >
                  <option value="">Choose a thread...</option>
                  {threads.map(thread => (
                    <option key={thread.id} value={thread.id}>
                      Thread #{thread.id}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Lease Selection */}
        {showLeaseSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Lease
            </label>
            <select
              className="form-dropdown"
              value={selectedData.leaseId}
              onChange={(e) => handleDataChange('leaseId', e.target.value)}
            >
              <option value="">Choose a lease...</option>
              {leases.map(lease => (
                <option key={lease.id} value={lease.id}>
                  Lease #{lease.id} - {lease.startDate} to {lease.endDate}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* House Manual Selection */}
        {showHouseManualSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select House Manual
            </label>
            <select
              className="form-dropdown"
              value={selectedData.houseManualId}
              onChange={(e) => handleDataChange('houseManualId', e.target.value)}
            >
              <option value="">Choose a house manual...</option>
              {houseManuals.map(manual => (
                <option key={manual.id} value={manual.id}>
                  {manual.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Visit Selection */}
        {showVisitSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Visit
            </label>
            <select
              className="form-dropdown"
              value={selectedData.visitId}
              onChange={(e) => handleDataChange('visitId', e.target.value)}
            >
              <option value="">Choose a visit...</option>
              {visits.map(visit => (
                <option key={visit.id} value={visit.id}>
                  Visit on {visit.scheduledDate} - {visit.status}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Thread Selection */}
        {showThreadSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Thread
            </label>
            <select
              className="form-dropdown"
              value={selectedData.threadId}
              onChange={(e) => handleDataChange('threadId', e.target.value)}
            >
              <option value="">Choose a thread...</option>
              {threads.map(thread => (
                <option key={thread.id} value={thread.id}>
                  Thread #{thread.id} - {thread.lastMessage || 'No messages'}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Virtual Meeting Selection */}
        {showVirtualMeetingSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Virtual Meeting
            </label>
            <select
              className="form-dropdown"
              value={selectedData.virtualMeetingId}
              onChange={(e) => handleDataChange('virtualMeetingId', e.target.value)}
            >
              <option value="">Choose a virtual meeting...</option>
              {virtualMeetings.map(meeting => (
                <option key={meeting.id} value={meeting.id}>
                  Meeting on {meeting.scheduledTime}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Change Request Selection */}
        {showDateChangeRequestSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date Change Request
            </label>
            <select
              className="form-dropdown"
              value={selectedData.dateChangeRequestId}
              onChange={(e) => handleDataChange('dateChangeRequestId', e.target.value)}
            >
              <option value="">Choose a date change request...</option>
              {dateChangeRequests.map(request => (
                <option key={request.id} value={request.id}>
                  Request #{request.id} - {request.status}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Account User Selection */}
        {showAccountUserSelect && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account User
            </label>
            <input
              type="text"
              className="form-input"
              value={selectedUser?.email || ''}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Using selected user's account
            </p>
          </div>
        )}

        {/* Favorite Listings Note */}
        {showFavoriteListingsNote && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 font-medium">
              Favourite listings sending
            </p>
            <p className="text-xs text-blue-600 mt-1">
              No need to attach data, just send the link
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
