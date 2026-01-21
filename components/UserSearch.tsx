'use client';

import { User } from '@/types';
import { useState, useEffect } from 'react';
import StepIndicator from './StepIndicator';

interface UserSearchProps {
  onUserSelect: (user: User | null) => void;
  selectedUser: User | null;
}

export default function UserSearch({ onUserSelect, selectedUser }: UserSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.phone.includes(query) ||
      user.id.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredUsers([]);
  };

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    if (!userId) {
      onUserSelect(null);
      return;
    }

    const user = users.find(u => u.id === userId);
    onUserSelect(user || null);
  };

  return (
    <div className="mb-6">
      <StepIndicator
        stepNumber={1}
        isActive={!selectedUser}
        isCompleted={!!selectedUser}
        label="Select User"
      />

      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            className="form-input pr-10"
            placeholder="Search user using ID, email, name, phone number, etc"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* User Selection Dropdown */}
        <select
          className="form-dropdown"
          value={selectedUser?.id || ''}
          onChange={handleUserSelect}
          disabled={loading}
        >
          <option value="">Choose an user...</option>
          {(searchQuery ? filteredUsers : users).map(user => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName} - {user.email} ({user.phone})
            </option>
          ))}
        </select>

        {loading && (
          <p className="text-sm text-gray-500">Loading users...</p>
        )}

        {searchQuery && filteredUsers.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No users found matching your search.</p>
        )}
      </div>
    </div>
  );
}
