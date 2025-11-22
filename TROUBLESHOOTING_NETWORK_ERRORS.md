# Quick Troubleshooting Guide - Network Errors

## If You Get a "Network Error" on Registration/Login

### Step 1: Check Server Status
```powershell
# Check if Laravel is running on port 8001
netstat -ano | findstr :8001

# Check if React is running (any port)
netstat -ano | findstr :518

# Check if MySQL is running
netstat -ano | findstr :3306
```

### Step 2: Start the Servers (if not running)

**Terminal 1 - Start Laravel Backend**:
```powershell
cd C:\Users\Charles Kevin\minsuguidanceapp\backend-laravel
php artisan serve --port=8001
```

**Terminal 2 - Start React Frontend**:
```powershell
cd C:\Users\Charles Kevin\minsuguidanceapp\frontend-react
npm run dev
```

### Step 3: Verify CORS Configuration

The backend should allow localhost origins. Check `backend-laravel/app/Http/Middleware/CorsMiddleware.php`:

```php
// Should contain this logic:
$isLocalhost = strpos($origin, 'localhost') !== false || 
              strpos($origin, '127.0.0.1') !== false;

if ($isLocalhost) {
    return $next($request)
        ->header('Access-Control-Allow-Origin', $origin)
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        ->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With, X-CSRF-TOKEN');
}
```

### Step 4: Verify API Configuration

Check `frontend-react/src/api/axios.jsx`:

```jsx
const api = axios.create({
  baseURL: 'http://localhost:8001',  // Should match Laravel port
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});
```

### Step 5: Check Browser Console

Open browser DevTools (F12) → Console tab and look for:
- ✅ "API Request: POST /api/register" - Request was sent
- ✅ "API Response: 200" or "201" - Request succeeded
- ❌ "Network Error" - CORS or connection issue
- ❌ "ECONNREFUSED" - Backend not running

### Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Net::ERR_NAME_NOT_RESOLVED` | Backend URL is wrong | Check axios baseURL |
| `CORS policy: No 'Access-Control-Allow-Origin'` | CORS not configured | Check CorsMiddleware.php |
| `POST http://localhost:8001/api/register 0` | Backend not responding | Start Laravel server |
| `Cannot POST /api/register` | Route doesn't exist | Check routes/api.php |
| `ECONNREFUSED 127.0.0.1:8001` | Laravel not running | Run `php artisan serve` |

## Database Connection Issues

If you get "SQLSTATE" errors:

```powershell
# Check MySQL is running
Get-Service MySQL80  # or your MySQL version

# Check .env file has correct DB credentials
cat backend-laravel\.env | grep DB_

# Run migrations if not done
cd backend-laravel
php artisan migrate
```

## Port Conflicts

If ports are already in use:

```powershell
# Find what's using a port
Get-Process -Id (Get-NetTCPConnection -LocalPort 8001).OwningProcess

# Kill the process
Stop-Process -Id <PID> -Force

# Or run Laravel on different port
php artisan serve --port=8002
# Then update axios.jsx baseURL to http://localhost:8002
```

## Clear Cache & Restart

If issues persist:

```powershell
# Clear Laravel cache
cd backend-laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Clear browser cache
# Press Ctrl+Shift+Delete in browser

# Restart both servers
```

## API Testing with cURL

```powershell
# Test backend is running
curl -X GET http://localhost:8001/api

# Test CORS preflight
curl -X OPTIONS http://localhost:8001/api/register `
  -H "Origin: http://localhost:5180" `
  -H "Access-Control-Request-Method: POST"

# Test registration
curl -X POST http://localhost:8001/api/register `
  -H "Content-Type: application/json" `
  -H "Origin: http://localhost:5180" `
  -d @- << EOF
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!",
  "role": "student"
}
EOF
```

## Enable Debug Mode

Edit `backend-laravel/.env`:
```
APP_DEBUG=true  # Already enabled
LOG_LEVEL=debug  # Already enabled
```

Then check logs:
```powershell
tail -f backend-laravel/storage/logs/laravel.log
```

## Still Having Issues?

1. Check the network error message exactly
2. Open browser DevTools → Network tab
3. Try the failing request again
4. Look at the response details
5. Check backend logs at `backend-laravel/storage/logs/laravel.log`
6. Run `php artisan tinker` to test database connection
