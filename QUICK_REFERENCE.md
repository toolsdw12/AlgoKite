# 🎯 Quick Reference - Kite Token Manager

## 🚀 Quick Start Commands

### Using Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend
```

### Manual Start
```bash
# Backend
cd backend && npm run dev

# Frontend (in new terminal)
cd froentend && npm run dev
```

### Using Start Scripts
```bash
# Linux/macOS
chmod +x start.sh
./start.sh

# Windows
start.bat
```

---

## 🔑 Common Operations

### Generate New Encryption Key
```bash
cd backend
npm run generate-key
```

### Add Account via API
```bash
curl -X POST http://localhost:3000/api/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "accountName": "My Account",
    "apiKey": "your_api_key",
    "apiSecret": "your_api_secret"
  }'
```

### Get Access Token
```bash
curl http://localhost:3000/api/tokens/{accountId}/access
```

### Force Expire All Tokens (Testing)
```bash
curl -X POST http://localhost:3000/api/tokens/admin/expire-all
```

### Check System Health
```bash
curl http://localhost:3000/health
```

---

## 📊 Token Status Reference

| Icon | Status | Hours Left | Action |
|------|--------|-----------|--------|
| 🟢 | Active | > 1 hour | Token ready to use |
| 🟡 | Expiring Soon | < 1 hour | Token still works, but expiring soon |
| 🔴 | Expired | 0 | Re-authenticate required |
| ⚫ | Never Auth | - | Authenticate for first time |

---

## 🕐 Daily Schedule

| Time | Event | Action |
|------|-------|--------|
| 6:00 AM | Tokens Expire | All tokens become invalid |
| 6:01 AM | Cron Job | Marks all tokens as expired |
| 7:00 AM | Stats Log | Daily statistics logged |
| Every Hour | Health Check | Verifies token states |

---

## 🔧 API Endpoints Cheat Sheet

### Accounts
```bash
GET    /api/accounts              # List all
GET    /api/accounts/:id          # Get one
POST   /api/accounts              # Create
PUT    /api/accounts/:id          # Update
DELETE /api/accounts/:id          # Delete
```

### Authentication
```bash
GET  /api/auth/login/:accountId        # Get login URL
GET  /api/auth/callback                # Kite callback
POST /api/auth/complete                # Finish auth
POST /api/auth/invalidate/:accountId   # Invalidate token
```

### Tokens
```bash
GET  /api/tokens                       # All tokens
GET  /api/tokens/:accountId            # Token info
GET  /api/tokens/:accountId/access     # Get access token
GET  /api/tokens/stats/summary         # Statistics
POST /api/tokens/admin/expire-all      # Force expire (admin)
```

---

## 🐛 Quick Troubleshooting

### Backend won't start
```bash
# Check MongoDB
mongosh

# Check .env exists
cat backend/.env

# Regenerate key
cd backend && npm run generate-key
```

### Frontend can't connect
```bash
# Test backend
curl http://localhost:3000/health

# Check CORS in backend/src/server.js
```

### Authentication fails
1. Check Kite Connect redirect URL: `http://localhost:3000/api/auth/callback`
2. Verify API key/secret are correct
3. Disable popup blocker
4. Check browser console for errors

### Tokens not expiring
```bash
# Check scheduler logs
docker-compose logs backend | grep "scheduler"

# Manually expire
curl -X POST http://localhost:3000/api/tokens/admin/expire-all
```

---

## 📝 Environment Variables

### Backend .env
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kite-token-manager
ENCRYPTION_KEY=your_generated_key
```

### Docker Root .env
```env
ENCRYPTION_KEY=your_generated_key
```

---

## 🔐 Security Checklist

- [ ] Never commit `.env` files
- [ ] Keep `ENCRYPTION_KEY` secret
- [ ] Use HTTPS in production
- [ ] Rotate encryption key periodically
- [ ] Add authentication to API in production
- [ ] Use strong MongoDB credentials in production

---

## 📦 Database Collections

### `accounts`
```javascript
{
  accountName: String,
  apiKey: String,
  apiSecret: String,      // Encrypted
  status: String,         // active | expired | never_authenticated
  createdAt: Date,
  updatedAt: Date
}
```

### `tokens`
```javascript
{
  accountId: ObjectId,
  accessToken: String,    // Encrypted
  userId: String,
  generatedAt: Date,
  expiresAt: Date,        // Always 6 AM tomorrow
  isValid: Boolean,
  createdAt: Date
}
```

### `logs`
```javascript
{
  accountId: ObjectId,
  event: String,          // authenticated | expired | error
  message: String,
  metadata: Object,
  timestamp: Date
}
```

---

## 💻 Using Tokens in Code

### Python (kiteconnect)
```python
from kiteconnect import KiteConnect

kite = KiteConnect(api_key="your_api_key")
kite.set_access_token("token_from_manager")

# Trade!
positions = kite.positions()
```

### Node.js (kiteconnect)
```javascript
const KiteConnect = require('kiteconnect').KiteConnect;

const kite = new KiteConnect({ api_key: 'your_api_key' });
kite.setAccessToken('token_from_manager');

// Trade!
kite.getPositions().then(console.log);
```

### JavaScript (fetch)
```javascript
// Get token from API
const response = await fetch('http://localhost:3000/api/tokens/{id}/access');
const { accessToken } = await response.json();

// Use in your app
```

---

## 🎨 Color Scheme Reference

| Color | Hex | Usage |
|-------|-----|-------|
| Active Green | `#10b981` | Active tokens |
| Warning Yellow | `#f59e0b` | Expiring soon |
| Danger Red | `#ef4444` | Expired tokens |
| Neutral Gray | `#6b7280` | Never authenticated |
| Primary Blue | `#3b82f6` | Primary actions |

---

## 📱 Ports Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 3000 | http://localhost:3000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 🔄 Daily Workflow

```
Morning (Before 6 AM)
├─ Tokens still valid from yesterday
└─ Can continue trading

6:00 AM - Automatic Expiry
├─ All tokens expire
└─ Status shows 🔴 Expired

After 6 AM - Re-authenticate
├─ Click "Authenticate" button
├─ Login to Kite
└─ New token generated (valid until tomorrow 6 AM)

Throughout the Day
├─ Use "Copy Token" to get access token
├─ Use token in your trading scripts
└─ Monitor status on dashboard

Before 6 AM Next Day
└─ Tokens show 🟡 Expiring Soon (< 1 hour left)

Repeat Daily
```

---

## 🆘 Support Resources

- [Full README](README.md)
- [Setup Guide](SETUP.md)
- [Kite Connect Docs](https://kite.trade/docs/connect/v3/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Vue 3 Docs](https://vuejs.org/)

---

## 📞 Quick Commands Summary

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart backend
docker-compose restart backend

# Generate encryption key
cd backend && npm run generate-key

# Check health
curl http://localhost:3000/health

# Get token
curl http://localhost:3000/api/tokens/{id}/access

# Force expire all
curl -X POST http://localhost:3000/api/tokens/admin/expire-all
```

---

**Keep this handy for quick reference! 📌**
