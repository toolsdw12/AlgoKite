# 🚀 Setup Guide - Kite Token Manager

Complete step-by-step guide to get your Kite Token Manager up and running.

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed ([Download](https://nodejs.org/))
- [ ] MongoDB 7+ installed ([Download](https://www.mongodb.com/try/download/community)) OR Docker installed
- [ ] Kite Connect API credentials ([Get here](https://kite.trade/connect))
- [ ] Git installed (optional)

## 🎯 Step 1: Get Kite API Credentials

### 1.1 Create Kite Connect App

1. Go to [Kite Connect](https://developers.kite.trade/)
2. Log in with your Zerodha credentials
3. Click **"Create new app"**
4. Fill in details:
   - **App name**: Kite Token Manager
   - **Redirect URL**: `http://localhost:3000/api/auth/callback`
   - **Type**: Connect
5. Click **"Create"**

### 1.2 Note Your Credentials

You'll receive:
- **API Key**: e.g., `abc123xyz456`
- **API Secret**: e.g., `def789ghi012`

⚠️ **Keep API Secret secure - never share it!**

---

## 🛠️ Step 2: Install the Application

### Option A: With Docker (Easiest)

```bash
# 1. Clone repository
git clone <repository-url>
cd kite-token-manager

# 2. Generate encryption key
cd backend
npm install
npm run generate-key
# Copy the output (ENCRYPTION_KEY=...)

# 3. Create .env in project root
cd ..
echo "ENCRYPTION_KEY=your_generated_key_here" > .env

# 4. Start all services
docker-compose up -d

# 5. Check services are running
docker-compose ps

# 6. View logs
docker-compose logs -f
```

✅ **Done!** Skip to Step 4.

### Option B: Manual Installation

#### 2.1 Install Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Generate encryption key
npm run generate-key
# Output: ENCRYPTION_KEY=abc123...

# Create .env file
cp .env.example .env

# Edit .env with your favorite editor
# Add the ENCRYPTION_KEY from above
nano .env  # or code .env or notepad .env
```

**.env Configuration:**
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/kite-token-manager
ENCRYPTION_KEY=paste_your_generated_key_here
```

#### 2.2 Install Frontend

```bash
# Navigate to frontend
cd ../froentend

# Install dependencies
npm install
```

---

## 🗄️ Step 3: Start MongoDB

### Option A: Docker (If using Docker Compose)

```bash
docker-compose up -d mongodb
```

### Option B: Local MongoDB

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
# OR run mongod.exe from installation directory

# Verify MongoDB is running
mongosh
# You should see MongoDB shell prompt
```

---

## 🚀 Step 4: Start Services

### Option A: Using Docker Compose

```bash
# Start all services
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost:5173
# - Backend: http://localhost:3000
# - MongoDB: localhost:27017
```

### Option B: Manual Start

#### Terminal 1 - Backend
```bash
cd backend
npm run dev

# You should see:
# ✅ MongoDB connected successfully
# 🕐 Starting scheduler service...
# 🚀 Server running on port 3000
```

#### Terminal 2 - Frontend
```bash
cd froentend
npm run dev

# You should see:
# VITE ready in XXX ms
# ➜ Local: http://localhost:5173/
```

---

## 🎨 Step 5: Access Dashboard

1. Open browser and go to: **http://localhost:5173**
2. You should see the Kite Token Manager dashboard

---

## 🪁 Step 6: Add Your First Account

### 6.1 Click "Add Account"

A modal will appear.

### 6.2 Fill in Details

- **Account Name**: "My Trading Account" (or any name you like)
- **API Key**: Paste your Kite API key from Step 1.2
- **API Secret**: Paste your Kite API secret from Step 1.2

### 6.3 Click "Create Account"

Account card will appear with status: ⚫ **Never Authenticated**

---

## 🔑 Step 7: Authenticate

### 7.1 Click "Authenticate"

A popup window will open with Kite login page.

### 7.2 Login to Kite

- Enter your Zerodha **Client ID** (e.g., AB1234)
- Enter your Zerodha **Password**
- Complete 2FA if enabled

### 7.3 Authorize App

Click **"Authorize"** to grant access to the app.

### 7.4 Success!

- Popup closes automatically
- You'll see: ✅ "Authentication successful!"
- Account status changes to: 🟢 **Active**
- Token info shows: "Expires in Xh Ym (Tomorrow 6:00 AM)"

---

## 📋 Step 8: Use Your Token

### Option A: Copy Token

1. Click **"Copy Token"** button on account card
2. Token is copied to clipboard
3. Paste into your trading script

**Example Usage:**
```python
from kiteconnect import KiteConnect

# Use the copied token
kite = KiteConnect(api_key="your_api_key")
kite.set_access_token("your_copied_token")

# Now you can trade
positions = kite.positions()
print(positions)
```

### Option B: API Call

```bash
# Get token via API
curl http://localhost:3000/api/tokens/<account-id>/access

# Response:
# {
#   "success": true,
#   "accessToken": "your_access_token_here"
# }
```

---

## 🎯 Quick Test

### Test 1: Check Backend Health

```bash
curl http://localhost:3000/health

# Expected:
# {"status":"ok","timestamp":"...","uptime":...}
```

### Test 2: List Accounts

```bash
curl http://localhost:3000/api/accounts

# Expected:
# {"success":true,"count":1,"data":[...]}
```

### Test 3: Get Token Info

```bash
curl http://localhost:3000/api/tokens/<account-id>

# Expected:
# {"success":true,"data":{"exists":true,"isValid":true,...}}
```

---

## 🔧 Troubleshooting

### Issue: "Connection refused" error

**Backend:**
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not, check backend logs
cd backend
npm run dev
```

**MongoDB:**
```bash
# Check if MongoDB is running
mongosh

# If not, start it (see Step 3)
```

### Issue: "Failed to fetch accounts"

**Check CORS:**
```javascript
// backend/src/server.js
app.use(cors({
  origin: 'http://localhost:5173',  // Make sure this matches frontend URL
  credentials: true
}));
```

### Issue: Authentication popup blocked

**Allow popups:**
1. Click popup blocker icon in browser address bar
2. Allow popups from localhost:5173
3. Try authentication again

### Issue: "Token expired" immediately

**Check system time:**
```bash
# Ensure system time is correct
date

# Token expiry calculation depends on correct system time
```

---

## 🎓 Next Steps

### 1. Add More Accounts

Repeat Step 6 & 7 for additional Kite API accounts.

### 2. Set Up Daily Re-authentication

Create a script to re-authenticate daily:

```python
# auto_reauth.py
import webbrowser
import requests
from datetime import datetime

def check_token_status(account_id):
    url = f"http://localhost:3000/api/tokens/{account_id}"
    response = requests.get(url)
    data = response.json()
    return data['data']['isValid']

def open_kite_login(account_id):
    url = f"http://localhost:3000/api/auth/login/{account_id}"
    response = requests.get(url)
    login_url = response.json()['loginURL']
    webbrowser.open(login_url)

# Check token at script start
account_id = "your_account_id_here"

if not check_token_status(account_id):
    print("Token expired. Opening Kite login...")
    open_kite_login(account_id)
    print("Please complete authentication in browser")
else:
    print("Token is still valid")
```

### 3. Monitor Token Status

Set up notifications when tokens are about to expire.

### 4. Backup Your Data

```bash
# Backup MongoDB
mongodump --db kite-token-manager --out ./backup

# Backup .env (keep secure!)
cp backend/.env backend/.env.backup
```

---

## 📊 Understanding Token Lifecycle

```
8:00 AM Today - User Authenticates
└─ Token Generated
   └─ isValid: true
   └─ expiresAt: Tomorrow 6:00 AM
   └─ Status: 🟢 Active
   └─ Can be used for trading

5:00 AM Next Day - Token Still Valid
└─ Status: 🟡 Expiring Soon (< 1 hour)
└─ Can still be used

6:00 AM Next Day - Automatic Expiry
└─ Cron job runs at 6:01 AM
   └─ isValid: false
   └─ Status: 🔴 Expired
   └─ Cannot be used for trading
   └─ Must re-authenticate

8:00 AM Next Day - User Re-authenticates
└─ Old token deleted
└─ New token generated
└─ Cycle repeats
```

---

## 🚀 Production Deployment

For production deployment, see the main [README.md](README.md) section on "Production Deployment".

Key changes needed:
- Use production MongoDB (MongoDB Atlas, etc.)
- Set `NODE_ENV=production`
- Use strong, unique `ENCRYPTION_KEY`
- Enable HTTPS
- Add authentication to API endpoints
- Configure proper CORS origins

---

## 💡 Tips & Best Practices

1. **Daily Routine**: Re-authenticate every morning before trading
2. **Multiple Accounts**: Use different account names to distinguish them
3. **Secure Secrets**: Never share API secrets or encryption keys
4. **Backup Tokens**: Keep a backup authentication method
5. **Monitor Logs**: Check backend logs for any errors
6. **Update Regularly**: Keep dependencies up to date

---

## 📚 Additional Resources

- [Kite Connect Documentation](https://kite.trade/docs/connect/v3/)
- [Kite Connect Python Client](https://github.com/zerodhatech/pykiteconnect)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vue 3 Documentation](https://vuejs.org/)

---

## ✅ Setup Complete!

You now have a fully functional Kite Token Manager! 🎉

For questions or issues:
- Check the [README.md](README.md)
- Review backend logs
- Create an issue on GitHub

Happy Trading! 📈
