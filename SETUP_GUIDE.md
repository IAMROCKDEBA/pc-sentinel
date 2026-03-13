# 🛡 PC Sentinel — Complete Setup Guide

> A private, high-end PC monitoring system with real-time Telegram alerts.
> Estimated setup time: **30–45 minutes**

---

## 📁 Directory Structure

```
pc-sentinel/
├── backend/                    ← Node.js/Express API server
│   ├── server.js               ← Main server (heartbeat, auth, Telegram bot)
│   ├── package.json
│   ├── .env.example            ← Copy to .env and fill in your values
│   └── .gitignore
│
├── frontend/                   ← React + Tailwind dashboard
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   ├── useStatus.js
│   │   │   └── useCountdown.js
│   │   └── components/
│   │       ├── LoginPage.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Navbar.jsx
│   │       ├── StatusCard.jsx
│   │       ├── StatsGrid.jsx
│   │       └── ActivityLog.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
├── scripts/
│   ├── SentinelAgent.ps1       ← PowerShell heartbeat agent (runs on your PC)
│   └── SentinelTask.xml        ← Windows Task Scheduler import file
│
└── SETUP_GUIDE.md              ← You are here
```

---

## STEP 1 — Create Your Telegram Bot

### 1.1 — Talk to BotFather
1. Open Telegram and search for **@BotFather**
2. Start a chat and send `/newbot`
3. Follow the prompts:
   - **Name:** `PC Sentinel`
   - **Username:** `pc_sentinel_yourname_bot` (must be unique, end in `bot`)
4. BotFather gives you a token like:
   ```
   123456789:ABCDefGhIJKlmNoPQRsTUVwXyZ
   ```
   **Save this — it's your `TELEGRAM_BOT_TOKEN`.**

### 1.2 — Get Your Chat ID
1. Send any message to your new bot (e.g. `/start`)
2. Open this URL in your browser (replace `YOUR_TOKEN`):
   ```
   https://api.telegram.org/botYOUR_TOKEN/getUpdates
   ```
3. Find the `"chat"` object in the JSON response:
   ```json
   "chat": { "id": 987654321, "type": "private" }
   ```
4. The number `987654321` is your **`TELEGRAM_CHAT_ID`**.

### 1.3 — Test the bot
Send `/help` to your bot — it should respond once the backend is running.

---

## STEP 2 — Generate Security Keys

Run this in any terminal (Node.js required) to generate strong secrets:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run it **twice** — use one for `JWT_SECRET`, another for `HEARTBEAT_API_KEY`.

---

## STEP 3 — Configure Backend `.env`

Copy `backend/.env.example` → `backend/.env` and fill in all values:

```env
PORT=3001
NODE_ENV=production

JWT_SECRET=<64-char random hex from Step 2>
HEARTBEAT_API_KEY=<another 64-char random hex>

DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=<your strong dashboard password>

TELEGRAM_BOT_TOKEN=123456789:ABCDefGhIJKlmNoPQRsTUVwXyZ
TELEGRAM_CHAT_ID=987654321

OFFLINE_THRESHOLD_SECONDS=180
```

---

## STEP 4 — Deploy Backend to Render (Free)

### 4.1 — Prepare your repository
1. Create a **new GitHub repository** (e.g. `pc-sentinel-backend`)
2. Push only the `backend/` folder contents to the root of that repo:
   ```
   server.js
   package.json
   .gitignore
   ```
   ⚠️ **Do NOT push `.env`** — it contains your secrets.

### 4.2 — Deploy on Render
1. Go to [render.com](https://render.com) and sign up/log in with GitHub
2. Click **New → Web Service**
3. Connect your `pc-sentinel-backend` repository
4. Configure:
   | Field           | Value                  |
   |-----------------|------------------------|
   | **Name**        | `pc-sentinel`          |
   | **Region**      | Singapore (closest)    |
   | **Branch**      | `main`                 |
   | **Build Cmd**   | `npm install`          |
   | **Start Cmd**   | `npm start`            |
   | **Plan**        | Free                   |
5. Scroll to **Environment Variables** and add all values from your `.env`
6. Click **Create Web Service**

> ⏳ First deploy takes ~2 minutes. Your URL will be:
> `https://pc-sentinel-XXXX.onrender.com`

### 4.3 — Keep Render Free Tier Alive
Render's free tier spins down after 15 minutes of inactivity.
The PowerShell script pinging every 60s will prevent this automatically once running.

Alternatively, use [UptimeRobot](https://uptimerobot.com) (free) to ping `/health` every 5 minutes.

---

## STEP 5 — Deploy Frontend to Vercel (Free)

### 5.1 — Prepare
1. Create another GitHub repo (e.g. `pc-sentinel-frontend`)
2. Push the `frontend/` folder contents to its root

### 5.2 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your `pc-sentinel-frontend` repository
3. Configure:
   | Field                | Value         |
   |----------------------|---------------|
   | **Framework Preset** | Vite          |
   | **Root Directory**   | `.` (default) |
   | **Build Command**    | `npm run build` |
   | **Output Directory** | `dist`        |
4. Add **Environment Variables**:
   ```
   VITE_API_URL = https://pc-sentinel-XXXX.onrender.com
   ```
5. Click **Deploy**

Your dashboard URL: `https://pc-sentinel-frontend.vercel.app`

---

## STEP 6 — Configure the PowerShell Agent

### 6.1 — Edit the script
Open `scripts/SentinelAgent.ps1` and update these two lines:

```powershell
$SERVER_URL = "https://pc-sentinel-XXXX.onrender.com/heartbeat"
$API_KEY    = "your_heartbeat_api_key_from_env"
```

### 6.2 — Place the script on your PC
Create the folder and copy the script:
```
C:\Users\YourUsername\PCsentinel\SentinelAgent.ps1
```

### 6.3 — Test it manually first
Open **PowerShell** (not hidden) and run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
& "C:\Users\YourUsername\PCsentinel\SentinelAgent.ps1"
```
You should see log output and your dashboard should show **ONLINE** 🟢

---

## STEP 7 — Windows Task Scheduler (Silent Boot Autostart)

This makes the agent start **silently and automatically** on every login.

### Method A — Import XML (Easiest)

1. Edit `scripts/SentinelTask.xml`:
   - Replace `DESKTOP\YourUsername` with your actual Windows username
   - Replace the script path in `<Arguments>` to match where you saved the `.ps1`

2. Open **Task Scheduler** (`Win + R` → `taskschd.msc`)

3. In the right panel: **Action → Import Task…**

4. Select `SentinelTask.xml` → Click **OK**

5. You'll be prompted for your Windows password (required for secure task registration)

### Method B — PowerShell One-Liner

Open PowerShell **as Administrator** and run:

```powershell
$action  = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument '-WindowStyle Hidden -ExecutionPolicy Bypass -NonInteractive -File "C:\Users\YourUsername\PCsentinel\SentinelAgent.ps1"'

$trigger = New-ScheduledTaskTrigger -AtLogOn

$settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit 0 `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1) `
    -MultipleInstances IgnoreNew

Register-ScheduledTask `
    -TaskName "PCSentinel" `
    -Action   $action `
    -Trigger  $trigger `
    -Settings $settings `
    -RunLevel Highest `
    -Force
```

### 7.3 — Verify
1. Restart your PC (or log off/on)
2. Open **Task Manager → Details** tab
3. Look for `powershell.exe` — it should be running
4. Check the log: `%APPDATA%\PCsentinel\sentinel.log`
5. Your Telegram should receive a 🟢 **"Back Online"** message

---

## STEP 8 — Telegram Bot Commands Reference

Once running, send these commands to your bot:

| Command   | Response                                      |
|-----------|-----------------------------------------------|
| `/start`  | Welcome message + command list                |
| `/help`   | Help message                                  |
| `/status` | Current PC status with last heartbeat time    |

---

## STEP 9 — Final Checklist

- [ ] Telegram bot created, token saved
- [ ] Chat ID retrieved
- [ ] `JWT_SECRET` and `HEARTBEAT_API_KEY` generated (different values!)
- [ ] Backend deployed to Render, env vars set
- [ ] Frontend deployed to Vercel, `VITE_API_URL` set
- [ ] Dashboard login works (`/api/auth/login`)
- [ ] `SentinelAgent.ps1` edited with correct URL + key
- [ ] Script tested manually — dashboard shows ONLINE
- [ ] Task Scheduler task created and verified
- [ ] Reboot test: PC restarts → Telegram receives 🔴 offline then 🟢 online

---

## Troubleshooting

### Dashboard shows "Cannot reach server"
- Check `VITE_API_URL` is set correctly in Vercel (no trailing slash)
- Check Render backend logs for errors
- Ensure CORS is allowing your Vercel domain

### No Telegram messages
- Verify `TELEGRAM_BOT_TOKEN` is correct (no spaces)
- Verify `TELEGRAM_CHAT_ID` is correct (can be negative for groups)
- Send `/start` to your bot first — bots can't message users who haven't started them

### PowerShell script not sending heartbeats
- Check `%APPDATA%\PCsentinel\sentinel.log` for errors
- Try running the script manually in a visible PowerShell window
- Verify `HEARTBEAT_API_KEY` matches exactly between `.env` and `.ps1`

### Render spins down / cold start delay
- Use [UptimeRobot](https://uptimerobot.com) to ping `https://your-backend.onrender.com/health` every 5 minutes (free, no account needed for basic monitors)
- Or upgrade to Render's $7/month "Starter" plan for always-on

---

## Security Notes

- 🔐 `HEARTBEAT_API_KEY` — used only by the PowerShell script. Never expose in frontend code.
- 🔑 `JWT_SECRET` — signs dashboard session tokens. Rotate if compromised.
- 🚫 Never commit `.env` to GitHub. It's in `.gitignore` by default.
- 🌐 The `/heartbeat` endpoint only accepts POST with valid `x-api-key` header.
- 📊 The `/api/status` endpoint requires a valid JWT (7-day expiry).

---

*Built with Node.js · React · Telegram Bot API · Deployed on Render + Vercel*
