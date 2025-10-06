# 🪁 Kite Token Manager

A **simplified**, production-ready token management system for Zerodha Kite API with daily auto-expiry at 6 AM.

## ✨ Features

- **Simple Token Lifecycle**: Tokens expire automatically at 6 AM daily (matches Kite's behavior)
- **Secure Storage**: API secrets and access tokens encrypted using AES-256-GCM
- **Multi-Account Support**: Manage multiple Kite API accounts in one place
- **Real-time Status**: Visual indicators showing token validity and time remaining
- **Auto Scheduler**: Cron jobs for automatic token expiry and status updates
- **Modern UI**: Clean Vue 3 dashboard with responsive design
- **Docker Ready**: Complete Docker Compose setup for easy deployment

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Vue 3 UI   │────▶│  Express    │────▶│  MongoDB    │
│  Frontend   │     │  Backend    │     │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Kite API  │
                    │  (Zerodha)  │
                    └─────────────┘
```

## 📦 Project Structure

```
kite-token-manager/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas (Account, Token, Log)
│   │   ├── services/        # Business logic
│   │   │   ├── TokenService.js      # Simple token lifecycle
│   │   │   ├── KiteAPI.js           # Kite SDK wrapper
│   │   │   ├── CryptoService.js     # Encryption/decryption
│   │   │   └── SchedulerService.js  # Cron jobs
│   │   ├── routes/          # API endpoints
│   │   │   ├── accounts.js          # Account CRUD
│   │   │   ├── auth.js              # Authentication flow
│   │   │   └── tokens.js            # Token management
│   │   └── server.js        # Main Express app
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── froentend/               # Note: Keep original folder name
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccountCard.vue      # Account display card
│   │   │   ├── TokenStatus.vue      # Status indicator
│   │   │   └── AddAccount.vue       # Add account modal
│   │   ├── views/
│   │   │   └── Dashboard.vue        # Main dashboard
│   │   ├── App.vue
│   │   └── main.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Full stack setup
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- MongoDB 7+ (or use Docker)
- Kite Connect API credentials ([Get here](https://kite.trade/connect))

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo-url>
cd kite-token-manager

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../froentend
npm install
```

### 2. Configure Environment

```bash
# Generate encryption key
cd backend
npm run generate-key

# Create .env file
cp .env.example .env

# Edit .env and add:
# - ENCRYPTION_KEY (from generate-key output)
# - MONGODB_URI (if not using default)
```

Example `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kite-token-manager
ENCRYPTION_KEY=abc123...your_generated_key
```

### 3. Start Services

**Option A: Docker (Recommended)**

```bash
# Set encryption key in root .env
echo "ENCRYPTION_KEY=your_key_here" > .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

**Option B: Manual**

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
cd froentend
npm run dev
```

### 4. Access Dashboard

Open [http://localhost:5173](http://localhost:5173)

## 📖 Usage Guide

### Adding an Account

1. Click **"Add Account"** button
2. Fill in details:
   - **Account Name**: Friendly name (e.g., "Trading Account 1")
   - **API Key**: From Kite Connect dashboard
   - **API Secret**: From Kite Connect dashboard
3. Click **"Create Account"**

### Authenticating

1. Click **"Authenticate"** on account card
2. Login popup opens with Kite login page
3. Enter your Kite credentials
4. After successful login, you'll be redirected back
5. Token is automatically generated and saved

### Token Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│  User Authenticates (Anytime)                           │
│  └─ Token Generated                                     │
│     └─ Expires: Tomorrow 6:00 AM                        │
│        └─ Status: 🟢 Active                             │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  Next Day at 6:00 AM (Automatic)                        │
│  └─ Cron Job Runs                                       │
│     └─ All Tokens Marked as Expired                     │
│        └─ Status: 🔴 Expired                            │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│  User Re-authenticates                                   │
│  └─ New Token Generated                                 │
│     └─ Cycle Repeats                                    │
└─────────────────────────────────────────────────────────┘
```

### Status Indicators

| Icon | Status | Meaning |
|------|--------|---------|
| 🟢 | **Active** | Token valid, expires in > 1 hour |
| 🟡 | **Expiring Soon** | Token valid, expires in < 1 hour |
| 🔴 | **Expired** | Token expired, re-authentication needed |
| ⚫ | **Never Authenticated** | No token generated yet |

### Copying Access Token

1. Click **"Copy Token"** on an active account
2. Token is copied to clipboard
3. Use in your trading scripts/applications

## 🔧 API Reference

### Accounts

```http
GET    /api/accounts           # List all accounts
GET    /api/accounts/:id       # Get single account
POST   /api/accounts           # Create account
PUT    /api/accounts/:id       # Update account
DELETE /api/accounts/:id       # Delete account
```

### Authentication

```http
GET  /api/auth/login/:accountId       # Get Kite login URL
GET  /api/auth/callback                # Kite redirect callback
POST /api/auth/complete                # Complete authentication
POST /api/auth/invalidate/:accountId   # Manually invalidate token
```

### Tokens

```http
GET  /api/tokens                       # List all tokens status
GET  /api/tokens/:accountId            # Get token info
GET  /api/tokens/:accountId/access     # Get decrypted access token
GET  /api/tokens/stats/summary         # Get statistics
POST /api/tokens/admin/expire-all      # Force expire all (admin)
```

## 🔐 Security Features

### Encryption

- **Algorithm**: AES-256-GCM (Galois/Counter Mode)
- **Key Management**: 256-bit keys from environment variables
- **Encrypted Data**:
  - API Secrets (stored in Account model)
  - Access Tokens (stored in Token model)

### Best Practices

1. **Never commit `.env` file** to version control
2. **Rotate encryption key periodically** (requires re-authentication)
3. **Use HTTPS in production** for frontend-backend communication
4. **Implement rate limiting** on authentication endpoints
5. **Add authentication** for production API access

## 📊 Database Schema

### Account Collection
```javascript
{
  _id: ObjectId,
  accountName: String,
  apiKey: String,
  apiSecret: String,        // Encrypted
  status: String,           // 'active' | 'expired' | 'never_authenticated'
  createdAt: Date,
  updatedAt: Date
}
```

### Token Collection
```javascript
{
  _id: ObjectId,
  accountId: ObjectId,      // Reference to Account
  accessToken: String,      // Encrypted
  userId: String,           // Kite user ID
  generatedAt: Date,
  expiresAt: Date,          // Always 6 AM next day
  isValid: Boolean,
  createdAt: Date
}
```

### Log Collection
```javascript
{
  _id: ObjectId,
  accountId: ObjectId,
  event: String,            // 'authenticated' | 'expired' | 'error'
  message: String,
  metadata: Mixed,
  timestamp: Date
}
```

## 🕐 Scheduler Jobs

### Daily Expiry (6:01 AM)
```javascript
// Runs: Every day at 6:01 AM
// Action: Marks all valid tokens as expired
cron.schedule('1 6 * * *', async () => {
  // Update all tokens: isValid = false
  // Update all accounts: status = 'expired'
});
```

### Hourly Check (Every hour)
```javascript
// Runs: Every hour at :00
// Action: Catches any tokens that should be expired but aren't
cron.schedule('0 * * * *', async () => {
  // Find tokens with expiresAt < now and isValid = true
  // Update them to isValid = false
});
```

### Daily Stats (7:00 AM)
```javascript
// Runs: Every day at 7:00 AM
// Action: Logs statistics
cron.schedule('0 7 * * *', async () => {
  // Log: Total accounts, active, expired, etc.
});
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check MongoDB is running
mongosh

# Check environment variables
cd backend
cat .env

# Regenerate encryption key if needed
npm run generate-key
```

### Frontend can't connect to backend

```bash
# Verify backend is running
curl http://localhost:3000/health

# Check CORS settings in backend/src/server.js
# Ensure frontend URL is allowed
```

### Authentication callback fails

1. **Check redirect URL** in Kite Connect dashboard matches: `http://localhost:3000/api/auth/callback`
2. **Verify API key and secret** are correct
3. **Check browser console** for errors
4. **Ensure popup blocker** is disabled

### Tokens not expiring

```bash
# Check scheduler is running (backend logs should show)
# "✅ Scheduler service started successfully"

# Manually trigger expiry (for testing)
curl -X POST http://localhost:3000/api/tokens/admin/expire-all
```

## 🚀 Production Deployment

### Environment Variables

```env
# Production .env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://your-mongo-host:27017/kite-production
ENCRYPTION_KEY=your-secure-production-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment

```bash
# Build images
docker-compose build

# Start production services
docker-compose up -d

# Scale backend (optional)
docker-compose up -d --scale backend=3
```

### Nginx Reverse Proxy

```nginx
# Example Nginx config
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check [Kite Connect Documentation](https://kite.trade/docs/connect/v3/)

---

**Built with ❤️ for the Zerodha Kite Community**
