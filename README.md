# Send Magic Login Links - Split Lease Internal Tool

An internal administrative tool for generating and sending secure magic login links to Split Lease users. This application allows support staff and admins to create passwordless authentication links that direct users to specific pages with optional context data.

## 🎯 Features

- **4-Step Workflow**: Intuitive step-by-step interface for generating magic links
- **User Search**: Search and select users by ID, email, name, or phone number
- **Phone Override**: Optional alternative phone number for SMS delivery
- **15 Destination Pages**: Support for guest, host, and admin workflows
- **Data Attachment**: Contextual data (listings, leases, proposals, etc.) can be attached
- **Real-time Validation**: Form validation with clear visual feedback
- **Alert System**: Success, error, warning, and info notifications
- **Responsive Design**: Mobile-friendly interface with modern UI

## 📋 Destination Pages

The tool supports magic links for 15 different destination pages:

1. **Account Profile** - User account settings page
2. **Favorite Listings** - User saved/favorite properties
3. **Guest Dashboard** - Guest user home dashboard
4. **Guest House Manual** - Guest house rules and manual
5. **Guest Leases** - Guest lease management
6. **Host Dashboard** - Host user home dashboard
7. **Host House Manual** - Host manage house manual
8. **Host Leases** - Host lease management
9. **Host Proposals** - Host proposals and negotiations
10. **Messaging** - Messaging/chat interface
11. **Rental Application** - Rental application page
12. **Self Listing** - User own listing management
13. **View Split Lease** - Browse split lease properties
14. **Virtual Meetings** - Virtual meeting page
15. **Date Change Request** - Lease date change request

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A database (PostgreSQL recommended)
- Email service (SendGrid, Mailgun, etc.)
- SMS service (Twilio recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/splitleasesharath/_send-magic-login-links.git
   cd _send-magic-login-links
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   - Database connection string
   - Email service credentials
   - SMS service credentials (Twilio)
   - Security keys
   - Application URL

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## 🏗️ Architecture

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

### Project Structure

```
repo/
├── app/
│   ├── api/                    # API routes
│   │   ├── users/             # User list endpoint
│   │   ├── user-data/         # User-specific data endpoint
│   │   └── send-magic-link/   # Magic link generation endpoint
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Main page component
├── components/
│   ├── Alert.tsx              # Alert notifications
│   ├── DataAttachment.tsx     # Data attachment selector (Step 4)
│   ├── PageSelection.tsx      # Destination page selector (Step 3)
│   ├── PhoneOverride.tsx      # Phone override input (Step 2)
│   ├── SendButton.tsx         # Send button with user preview
│   ├── StepIndicator.tsx      # Step progress indicator
│   └── UserSearch.tsx         # User search and selection (Step 1)
├── types/
│   └── index.ts               # TypeScript type definitions
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── next.config.js             # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.js          # PostCSS configuration
├── README.md                  # This file
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## 🔧 Configuration

### Database Integration

The current implementation uses mock data. To integrate with your database:

1. **Install a database client** (e.g., Prisma, TypeORM, or raw drivers)
   ```bash
   npm install @prisma/client
   # or
   npm install pg
   ```

2. **Update API routes** in `app/api/` to query your database:
   - `app/api/users/route.ts` - Fetch users
   - `app/api/user-data/route.ts` - Fetch user-related data
   - `app/api/send-magic-link/route.ts` - Store tokens and send notifications

3. **Create database schema** for magic tokens:
   ```sql
   CREATE TABLE magic_tokens (
     id SERIAL PRIMARY KEY,
     token VARCHAR(255) UNIQUE NOT NULL,
     user_id INTEGER NOT NULL,
     destination_page VARCHAR(100) NOT NULL,
     attached_data JSONB,
     expires_at TIMESTAMP NOT NULL,
     used BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### Email/SMS Integration

Replace the mock notification function in `app/api/send-magic-link/route.ts`:

**For Twilio (SMS):**
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: `Click here to login: ${magicLink}`,
  to: phone,
  from: process.env.TWILIO_PHONE_NUMBER
});
```

**For SendGrid (Email):**
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.EMAIL_SERVICE_API_KEY);

await sgMail.send({
  to: userEmail,
  from: process.env.EMAIL_FROM_ADDRESS,
  subject: 'Your Magic Login Link',
  html: `<a href="${magicLink}">Click here to login</a>`
});
```

## 🔐 Security Considerations

### Token Generation
- Uses `crypto.randomBytes(32)` for secure token generation
- Tokens are 64 characters (256 bits) long

### Recommendations
1. **Implement rate limiting** to prevent abuse
2. **Add authentication** - Only authorized admins should access this tool
3. **Enable HTTPS** in production
4. **Set token expiration** (default: 24 hours)
5. **Single-use tokens** - Mark tokens as used after first access
6. **Audit logging** - Track who generates links and when
7. **IP whitelisting** - Restrict access to internal networks

## 📝 API Endpoints

### GET /api/users
Fetches all users from the database.

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "1",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1234567890",
      "userType": "guest"
    }
  ]
}
```

### GET /api/user-data?userId={userId}
Fetches all related data for a specific user.

**Response:**
```json
{
  "success": true,
  "listings": [...],
  "proposals": [...],
  "leases": [...],
  "houseManuals": [...],
  "visits": [...],
  "threads": [...],
  "virtualMeetings": [...],
  "dateChangeRequests": [...]
}
```

### POST /api/send-magic-link
Generates and sends a magic login link.

**Request:**
```json
{
  "userId": "123",
  "phoneOverride": "+1987654321",
  "destinationPage": "guest-dashboard",
  "attachedData": {
    "listingId": "listing-1",
    "leaseId": "lease-1"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Magic login link sent successfully",
  "magicLink": "https://splitlease.com/guest/dashboard?token=..."
}
```

## 🎨 Customization

### Styling
- Edit `tailwind.config.js` to change brand colors
- Modify `app/globals.css` for custom CSS classes
- Update component styles in individual component files

### Adding New Destination Pages
1. Add the page to the `DestinationPage` type in `types/index.ts`
2. Add the page option in `components/PageSelection.tsx`
3. Add conditional data fields in `components/DataAttachment.tsx` if needed
4. Update the route mapping in `app/api/send-magic-link/route.ts`

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

**Database connection errors:**
- Verify DATABASE_URL in `.env`
- Ensure database is running
- Check firewall settings

**SMS/Email not sending:**
- Verify API credentials in `.env`
- Check service quotas and limits
- Review service provider logs

## 📄 License

This is an internal tool for Split Lease. All rights reserved.

## 🤝 Support

For issues or questions, contact the Split Lease development team.

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [SendGrid Email Documentation](https://docs.sendgrid.com/)

---

**Version:** 1.0.0
**Last Updated:** January 2026
**Built with** ❤️ **by the Split Lease Team**
