import { NextRequest, NextResponse } from 'next/server';
import { SendMagicLinkRequest, MagicLinkResponse } from '@/types';
import crypto from 'crypto';

/**
 * POST /api/send-magic-link
 * Generates and sends a magic login link to a user
 *
 * TODO: Replace with actual implementation
 * This is a mock implementation. In production, you should:
 * 1. Generate a secure token using crypto
 * 2. Store the token in your database with expiration time
 * 3. Associate the token with user ID and destination page
 * 4. Send email/SMS using your notification service
 * 5. Implement proper rate limiting
 * 6. Add audit logging
 */

// Helper function to generate secure token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper function to build magic link URL
function buildMagicLinkUrl(token: string, destinationPage: string, attachedData?: any): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://splitlease.com';

  // Build the URL based on destination page
  const pageRoutes: Record<string, string> = {
    'account-profile': '/account/profile',
    'favorite-listings': '/listings/favorites',
    'guest-dashboard': '/guest/dashboard',
    'guest-house-manual': '/guest/house-manual',
    'guest-leases': '/guest/leases',
    'host-dashboard': '/host/dashboard',
    'host-house-manual': '/host/house-manual',
    'host-leases': '/host/leases',
    'host-proposals': '/host/proposals',
    'messaging': '/messages',
    'rental-app': '/rental-application',
    'self-listing': '/listings/manage',
    'view-split-lease': '/listings/browse',
    'virtual-meetings': '/meetings',
    'date-change-request': '/leases/date-change',
  };

  const route = pageRoutes[destinationPage] || '/';
  const params = new URLSearchParams({ token });

  // Add attached data to URL params
  if (attachedData) {
    if (attachedData.listingId) params.append('listingId', attachedData.listingId);
    if (attachedData.proposalId) params.append('proposalId', attachedData.proposalId);
    if (attachedData.leaseId) params.append('leaseId', attachedData.leaseId);
    if (attachedData.houseManualId) params.append('houseManualId', attachedData.houseManualId);
    if (attachedData.visitId) params.append('visitId', attachedData.visitId);
    if (attachedData.threadId) params.append('threadId', attachedData.threadId);
    if (attachedData.virtualMeetingId) params.append('virtualMeetingId', attachedData.virtualMeetingId);
    if (attachedData.dateChangeRequestId) params.append('dateChangeRequestId', attachedData.dateChangeRequestId);
  }

  return `${baseUrl}${route}?${params.toString()}`;
}

// Mock function to send SMS/Email
async function sendNotification(
  userEmail: string,
  phone: string,
  magicLink: string
): Promise<boolean> {
  // TODO: Integrate with your actual SMS/Email service
  // Examples: Twilio for SMS, SendGrid for Email, etc.

  console.log('=== MOCK NOTIFICATION ===');
  console.log('To:', userEmail);
  console.log('Phone:', phone);
  console.log('Magic Link:', magicLink);
  console.log('========================');

  // In production, replace with:
  // await twilioClient.messages.create({
  //   body: `Click here to login: ${magicLink}`,
  //   to: phone,
  //   from: process.env.TWILIO_PHONE_NUMBER
  // });
  //
  // await sendgridClient.send({
  //   to: userEmail,
  //   from: 'noreply@splitlease.com',
  //   subject: 'Your Magic Login Link',
  //   html: `<a href="${magicLink}">Click here to login</a>`
  // });

  return true; // Simulate successful send
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMagicLinkRequest = await request.json();

    // Validate request
    if (!body.userId || !body.destinationPage) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID and destination page are required'
        } as MagicLinkResponse,
        { status: 400 }
      );
    }

    // Generate secure token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // TODO: Store token in database
    // await db.magicTokens.create({
    //   data: {
    //     token,
    //     userId: body.userId,
    //     destinationPage: body.destinationPage,
    //     attachedData: body.attachedData,
    //     expiresAt,
    //     used: false
    //   }
    // });

    // Build magic link URL
    const magicLink = buildMagicLinkUrl(
      token,
      body.destinationPage,
      body.attachedData
    );

    // TODO: Fetch user details from database
    // const user = await db.users.findUnique({ where: { id: body.userId } });
    const mockUserEmail = 'user@example.com'; // Replace with actual user email
    const phoneToUse = body.phoneOverride || '+1234567890'; // Replace with actual user phone

    // Send notification
    const sent = await sendNotification(mockUserEmail, phoneToUse, magicLink);

    if (!sent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send notification'
        } as MagicLinkResponse,
        { status: 500 }
      );
    }

    // TODO: Log audit trail
    // await db.auditLog.create({
    //   data: {
    //     action: 'MAGIC_LINK_SENT',
    //     userId: body.userId,
    //     metadata: {
    //       destinationPage: body.destinationPage,
    //       phoneOverride: body.phoneOverride,
    //       timestamp: new Date()
    //     }
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: `Magic login link sent successfully to ${mockUserEmail}${body.phoneOverride ? ` (SMS to ${body.phoneOverride})` : ''}`,
      magicLink // Only return in development for testing
    } as MagicLinkResponse);

  } catch (error) {
    console.error('Error sending magic link:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred'
      } as MagicLinkResponse,
      { status: 500 }
    );
  }
}
