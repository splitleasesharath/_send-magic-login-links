import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/types';

/**
 * GET /api/users
 * Fetches all users from the database
 *
 * TODO: Replace with actual database integration
 * This is a mock implementation. In production, you should:
 * 1. Connect to your actual database (PostgreSQL, MongoDB, etc.)
 * 2. Query the users table
 * 3. Apply proper authentication/authorization
 * 4. Implement pagination for large datasets
 */
export async function GET(request: NextRequest) {
  try {
    // Mock data - Replace with actual database query
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        userType: 'guest',
        profilePhoto: undefined
      },
      {
        id: '2',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1987654321',
        userType: 'host',
        profilePhoto: undefined
      },
      {
        id: '3',
        email: 'admin@splitlease.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1555555555',
        userType: 'admin',
        profilePhoto: undefined
      }
    ];

    // In production, replace above with:
    // const users = await db.users.findMany();

    return NextResponse.json({
      success: true,
      users: mockUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users'
      },
      { status: 500 }
    );
  }
}
