# DevPilot Quickstart (Group 3)

Run DevPilot on a fresh Windows machine that only has VS Code installed. These scripts handle everything else.

## What you'll end up with

- 3 frontend dev servers on ports 3000, 3001, 3002
- 4 backend GraphQL services on ports 4000, 4001, 4002, 4003
- Local MongoDB on 27017
- Browser open to http://localhost:3000 with the app running

## Prerequisites

- Windows 10 (version 1809 or later) or Windows 11
- VS Code installed
- About 5 GB of free disk space
- Admin rights on your machine (needed once, for installing Node + MongoDB)

Everything else (Node.js, Git, MongoDB) gets installed by the setup script.

## First-time setup

1. **Download the project**
   - Go to the GitHub repo page in your browser
   - Click the green **Code** button → **Download ZIP**
   - Extract the ZIP anywhere you like (e.g. `C:\DevPilot\Group3DevPilotCOMP308Project`)

2. **Get the .env file**
   
   - Open the extracted project folder in File Explorer
   - Create a new file at the root called exactly `.env` (no extension, starts with a dot)
   - Paste the contents Jordan sends you and save
   - See `env-template.txt` in this folder for the expected shape

3. **Run setup**
   - Open this `Quickstart` folder in File Explorer
   - Double-click **`setup.bat`**
   - A User Account Control prompt will ask for admin — click Yes
   - A PowerShell window will open and walk through:
     - Checking/installing Node.js LTS
     - Checking/installing MongoDB Community (this one takes a while)
     - Checking/installing Git
     - Starting the MongoDB service
     - Running `npm install` across all 7 subprojects
   - When you see `=== Setup complete! ===` you're done
   - Close the PowerShell window

Setup only needs to run once. If you re-pull the repo later and new dependencies were added, re-run it to pick them up.

## Running the app

1. Open this `Quickstart` folder
2. Double-click **`launch.bat`**
3. A terminal window opens showing color-coded logs from all 7 processes
4. Wait about 15 seconds for everything to come up — you'll see lines like:
   ```
   [auth] running on http://localhost:4001/graphql
   [projects] running on http://localhost:4002/graphql
   [airev] running on http://localhost:4003/graphql
   [gateway] running on http://localhost:4000/graphql
   [shell] Local: http://localhost:3000/
   ```
5. Open http://localhost:3000 in your browser

To stop the app: click the launch terminal window and press `Ctrl+C`. If it hangs, open Task Manager and end all `Node.js` processes.

## Troubleshooting

**"winget is not recognized"**
Your Windows version is too old or App Installer is missing. Open the Microsoft Store, search for "App Installer", and install it. Then re-run setup.bat.

**Setup fails on MongoDB install**
MongoDB Community is a large download (~400 MB) and sometimes the winget install times out. Just re-run setup.bat — it will skip everything already installed and retry MongoDB.

**Browser shows "Failed to fetch" on localhost:3000**
The backend gateway isn't up yet. Wait 10 more seconds and refresh. If it's still failing after 30 seconds, check the launch terminal for red errors and post a screenshot in team chat.

**"not authenticated" when trying to see projects**
Your session cookie is tied to `localhost`, not `127.0.0.1`. Make sure the URL bar says `http://localhost:3000/` exactly.

**MongoDB service won't start**
Open an admin PowerShell and run `Start-Service MongoDB`. If that fails, MongoDB wasn't installed as a service — reinstall with `winget install MongoDB.Server`.

**Port already in use**
Something else is on port 3000-3002 or 4000-4003. Find and kill it with:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

## What's in this folder

| File | Purpose |
|---|---|
| `README.md` | This file |
| `env-template.txt` | Shape of the `.env` file (real values come from Jordan via team chat) |
| `setup.bat` | Double-click to install prereqs + project deps (one-time) |
| `setup.ps1` | The actual setup logic (batch file just elevates to admin and calls this) |
| `launch.bat` | Double-click to start the app |
| `launch.ps1` | The actual launch logic |
