# Deployment Guide - Send Magic Login Links

This guide covers deploying the Send Magic Login Links application to production.

## 📦 Deployment Options

### Option 1: Vercel (Recommended for Next.js)

Vercel is the easiest way to deploy Next.js applications.

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add all variables from `.env.example`

5. **Custom Domain** (Optional)
   - Add your custom domain in Vercel project settings
   - Update DNS records as instructed

**Vercel Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### Option 2: AWS (EC2 or ECS)

#### Using EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04 LTS
   - Instance type: t3.small or larger
   - Configure security groups (ports 80, 443, 22)

2. **SSH into Instance**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PM2
   sudo npm install -g pm2

   # Install Nginx
   sudo apt install -y nginx
   ```

4. **Clone and Build**
   ```bash
   git clone https://github.com/splitleasesharath/_send-magic-login-links.git
   cd _send-magic-login-links
   npm install
   npm run build
   ```

5. **Configure Environment**
   ```bash
   cp .env.example .env
   nano .env
   # Edit with your production values
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "magic-links" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/magic-links
   ```

   Add configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/magic-links /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

8. **SSL with Let's Encrypt**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

### Option 3: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT 3000

   CMD ["node", "server.js"]
   ```

2. **Create .dockerignore**
   ```
   node_modules
   .next
   .git
   .env
   README.md
   ```

3. **Build and Run**
   ```bash
   docker build -t magic-links .
   docker run -p 3000:3000 --env-file .env magic-links
   ```

4. **Docker Compose** (docker-compose.yml)
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       env_file:
         - .env
       restart: unless-stopped
   ```

   Run:
   ```bash
   docker-compose up -d
   ```

## 🔒 Security Checklist

Before deploying to production:

- [ ] Set strong `JWT_SECRET` and `ENCRYPTION_KEY`
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up firewall rules (allow only 80, 443, 22)
- [ ] Implement rate limiting
- [ ] Add authentication/authorization
- [ ] Configure CORS policies
- [ ] Enable security headers
- [ ] Set up database backups
- [ ] Configure monitoring and logging
- [ ] Review and restrict API access
- [ ] Set up IP whitelisting if applicable
- [ ] Enable audit logging
- [ ] Test all environment variables
- [ ] Remove development endpoints

## 📊 Monitoring

### Application Monitoring

**Using PM2:**
```bash
pm2 monit
pm2 logs magic-links
```

**Health Check Endpoint:**
Add to `app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

### Logging

**Recommended Services:**
- Datadog
- New Relic
- CloudWatch (for AWS)
- Vercel Analytics (for Vercel)

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🗄️ Database Setup

### PostgreSQL on AWS RDS

1. **Create RDS Instance**
   - Engine: PostgreSQL 15
   - Instance class: db.t3.micro (for testing) or larger
   - Storage: 20 GB SSD
   - Enable automated backups

2. **Connect**
   ```bash
   psql -h your-rds-endpoint.amazonaws.com -U postgres -d splitlease
   ```

3. **Create Schema**
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     first_name VARCHAR(100),
     last_name VARCHAR(100),
     phone VARCHAR(20),
     user_type VARCHAR(20),
     profile_photo VARCHAR(500),
     created_at TIMESTAMP DEFAULT NOW()
   );

   CREATE TABLE magic_tokens (
     id SERIAL PRIMARY KEY,
     token VARCHAR(255) UNIQUE NOT NULL,
     user_id INTEGER REFERENCES users(id),
     destination_page VARCHAR(100) NOT NULL,
     attached_data JSONB,
     expires_at TIMESTAMP NOT NULL,
     used BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW(),
     INDEX idx_token (token),
     INDEX idx_user_id (user_id)
   );

   CREATE TABLE audit_log (
     id SERIAL PRIMARY KEY,
     action VARCHAR(100) NOT NULL,
     user_id INTEGER REFERENCES users(id),
     metadata JSONB,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

4. **Update DATABASE_URL**
   ```
   DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/splitlease
   ```

## 🧪 Testing Production Build Locally

```bash
# Build
npm run build

# Test production build locally
npm start

# Or with PM2
pm2 start npm --name "magic-links-test" -- start
```

## 🚨 Rollback Plan

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 stop magic-links
git checkout previous-commit
npm install
npm run build
pm2 restart magic-links
```

### Docker
```bash
docker stop magic-links-container
docker run -d --name magic-links-container previous-image:tag
```

## 📞 Support

For deployment issues:
- Check logs: `pm2 logs` or Vercel dashboard
- Review error messages
- Verify environment variables
- Test database connectivity
- Check API service status (Twilio, SendGrid)

---

**Note:** Always test deployments in a staging environment before pushing to production.
