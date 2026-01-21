'use client';

import { useState } from 'react';
import { User, DestinationPage, Alert as AlertType, SendMagicLinkRequest } from '@/types';
import UserSearch from '@/components/UserSearch';
import PhoneOverride from '@/components/PhoneOverride';
import PageSelection from '@/components/PageSelection';
import DataAttachment from '@/components/DataAttachment';
import SendButton from '@/components/SendButton';
import Alert from '@/components/Alert';

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [phoneOverride, setPhoneOverride] = useState('');
  const [selectedPage, setSelectedPage] = useState<DestinationPage | null>(null);
  const [attachedData, setAttachedData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = (type: AlertType['type'], message: string) => {
    const newAlert: AlertType = {
      id: Date.now().toString(),
      type,
      message
    };
    setAlerts(prev => [...prev, newAlert]);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleSendMagicLink = async () => {
    if (!selectedUser || !selectedPage) {
      addAlert('error', 'Please select a user and destination page');
      return;
    }

    setLoading(true);

    try {
      const request: SendMagicLinkRequest = {
        userId: selectedUser.id,
        phoneOverride: phoneOverride || undefined,
        destinationPage: selectedPage,
        attachedData: {
          listingId: attachedData.listingId || undefined,
          proposalId: attachedData.proposalId || undefined,
          leaseId: attachedData.leaseId || undefined,
          houseManualId: attachedData.houseManualId || undefined,
          visitId: attachedData.visitId || undefined,
          threadId: attachedData.threadId || undefined,
          virtualMeetingId: attachedData.virtualMeetingId || undefined,
          dateChangeRequestId: attachedData.dateChangeRequestId || undefined,
          accountUserId: attachedData.accountUserId || undefined,
        }
      };

      const response = await fetch('/api/send-magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (data.success) {
        addAlert('success', data.message || 'Magic login link sent successfully!');
        // Reset form
        setSelectedUser(null);
        setPhoneOverride('');
        setSelectedPage(null);
        setAttachedData({});
      } else {
        addAlert('error', data.error || 'Failed to send magic login link');
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      addAlert('error', 'An error occurred while sending the magic login link');
    } finally {
      setLoading(false);
    }
  };

  const canSend = selectedUser && selectedPage && !loading;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-brand-purple to-brand-blue text-white py-6 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Send Magic Login Links</h1>
          <p className="text-purple-100 mt-2">
            Generate and send secure magic login links for Split Lease users
          </p>
        </div>
      </header>

      {/* Alerts */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            type={alert.type}
            message={alert.message}
            onClose={() => removeAlert(alert.id)}
          />
        ))}
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Magic Login Link Generator
            </h2>
            <p className="text-sm text-gray-600">
              Follow the steps below to generate and send a magic login link to a user
            </p>
          </div>

          {/* Step 1: User Search */}
          <UserSearch
            selectedUser={selectedUser}
            onUserSelect={setSelectedUser}
          />

          {/* Step 2: Phone Override (Optional) */}
          <PhoneOverride
            phoneOverride={phoneOverride}
            onPhoneChange={setPhoneOverride}
            disabled={!selectedUser}
          />

          {/* Step 3: Page Selection */}
          <PageSelection
            selectedPage={selectedPage}
            onPageSelect={setSelectedPage}
            disabled={!selectedUser}
          />

          {/* Step 4: Data Attachment */}
          <DataAttachment
            selectedUser={selectedUser}
            selectedPage={selectedPage}
            onDataChange={setAttachedData}
          />

          {/* Step 5: Send Button */}
          <SendButton
            selectedUser={selectedUser}
            onSend={handleSendMagicLink}
            disabled={!canSend}
            loading={loading}
          />
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            ℹ️ About Magic Login Links
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Magic links provide secure, passwordless access to specific pages</li>
            <li>• Links are single-use and expire after a set time period</li>
            <li>• Users will be automatically logged in when they click the link</li>
            <li>• Optional phone override sends the link to an alternative number</li>
            <li>• Attached data provides context for the destination page</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
