import { NextRequest, NextResponse } from 'next/server';
import { Listing, Proposal, Lease, HouseManual, Visit, Thread, VirtualMeeting, DateChangeRequest } from '@/types';

/**
 * GET /api/user-data?userId={userId}
 * Fetches all related data for a specific user
 *
 * TODO: Replace with actual database integration
 * This is a mock implementation. In production, you should:
 * 1. Connect to your actual database
 * 2. Query related tables using proper joins
 * 3. Apply proper authentication/authorization
 * 4. Only return data the user has access to
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // Mock data - Replace with actual database queries
    const mockListings: Listing[] = [
      {
        id: 'listing-1',
        title: '2BR Apartment Downtown',
        address: '123 Main St, San Francisco, CA'
      },
      {
        id: 'listing-2',
        title: '3BR House with Garden',
        address: '456 Oak Ave, Oakland, CA'
      }
    ];

    const mockProposals: Proposal[] = [
      {
        id: 'proposal-1',
        listingId: 'listing-1',
        status: 'pending',
        createdAt: '2026-01-15'
      },
      {
        id: 'proposal-2',
        listingId: 'listing-2',
        status: 'accepted',
        createdAt: '2026-01-10'
      }
    ];

    const mockLeases: Lease[] = [
      {
        id: 'lease-1',
        listingId: 'listing-1',
        startDate: '2026-02-01',
        endDate: '2027-02-01',
        status: 'active'
      }
    ];

    const mockHouseManuals: HouseManual[] = [
      {
        id: 'manual-1',
        listingId: 'listing-1',
        title: 'House Rules and Guide'
      }
    ];

    const mockVisits: Visit[] = [
      {
        id: 'visit-1',
        listingId: 'listing-1',
        scheduledDate: '2026-01-25',
        status: 'scheduled'
      }
    ];

    const mockThreads: Thread[] = [
      {
        id: 'thread-1',
        participants: [userId, 'other-user-1'],
        lastMessage: 'Looking forward to the viewing!'
      }
    ];

    const mockVirtualMeetings: VirtualMeeting[] = [
      {
        id: 'meeting-1',
        meetingUrl: 'https://zoom.us/j/123456789',
        scheduledTime: '2026-01-22 14:00'
      }
    ];

    const mockDateChangeRequests: DateChangeRequest[] = [
      {
        id: 'dcr-1',
        leaseId: 'lease-1',
        requestedStartDate: '2026-02-15',
        requestedEndDate: '2027-02-15',
        status: 'pending'
      }
    ];

    // In production, replace above with actual queries:
    // const listings = await db.listings.findMany({ where: { userId } });
    // const proposals = await db.proposals.findMany({ where: { userId } });
    // etc.

    return NextResponse.json({
      success: true,
      listings: mockListings,
      proposals: mockProposals,
      leases: mockLeases,
      houseManuals: mockHouseManuals,
      visits: mockVisits,
      threads: mockThreads,
      virtualMeetings: mockVirtualMeetings,
      dateChangeRequests: mockDateChangeRequests
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user data'
      },
      { status: 500 }
    );
  }
}
