# Quick Start Guide

Get the Send Magic Login Links application running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/splitleasesharath/_send-magic-login-links.git
cd _send-magic-login-links
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment (Optional for Development)
```bash
cp .env.example .env
```

For local development with mock data, you can skip editing the `.env` file.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## Using the Application

### Step 1: Select a User
1. Type in the search box to filter users by name, email, phone, or ID
2. Select a user from the dropdown

### Step 2: Phone Override (Optional)
- Enter an alternative phone number if you want to send the SMS to a different number

### Step 3: Choose Destination Page
- Select where the user should be redirected after clicking the magic link
- Options include dashboards, leases, proposals, messaging, etc.

### Step 4: Attach Data (Optional)
- Depending on the destination page, you can attach contextual data
- For example: specific listing, lease, proposal, or thread

### Step 5: Send
- Review the selected user in the preview
- Click "Send Magic Login Link"
- The magic link will be generated and sent (currently displays in console for development)

## What You'll See

- **Success Alert**: "Magic login link sent successfully"
- **Console Output**: In development, the magic link is logged to the console
- **Form Reset**: After successful send, the form clears for the next link

## Development Notes

- The app currently uses **mock data** for demonstration
- User list shows 3 sample users (John Doe, Jane Smith, Admin User)
- No actual emails/SMS are sent in development mode
- Magic link is displayed in the API response for testing

## Next Steps

To use in production:

1. **Configure Database**
   - Set `DATABASE_URL` in `.env`
   - Update API routes to query real database

2. **Configure Email/SMS**
   - Set Twilio credentials for SMS
   - Set SendGrid/Mailgun credentials for email
   - Uncomment notification code in `app/api/send-magic-link/route.ts`

3. **Add Authentication**
   - Protect the application with admin authentication
   - Only authorized users should access this tool

4. **Deploy**
   - See `DEPLOYMENT.md` for deployment instructions
   - Use Vercel for easiest deployment

## Troubleshooting

### Port 3000 already in use
```bash
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
npm run type-check
npm run lint
```

## Testing the Magic Link Flow

1. Send a magic link using the form
2. Copy the magic link from the console/API response
3. The link format will be:
   ```
   https://splitlease.com/[destination-page]?token=[secure-token]&[optional-data]
   ```
4. In production, users click this link and are automatically logged in

## Project Structure Overview

```
repo/
├── app/
│   ├── api/           # API endpoints
│   └── page.tsx       # Main page
├── components/        # React components
├── types/            # TypeScript types
├── .env.example      # Environment template
└── README.md         # Full documentation
```

## Common Commands

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Need Help?

- Read the full `README.md` for detailed documentation
- Check `DEPLOYMENT.md` for production setup
- Review the code comments for implementation details

---

**Happy Magic Link Sending! ✨**
