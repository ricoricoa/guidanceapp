# 🚀 QUICK START - Registration Testing

## Status: ✅ READY

| Service | URL | Status |
|---------|-----|--------|
| React App | http://localhost:5181 | ✅ Running |
| Laravel API | http://127.0.0.1:8001 | ✅ Running |
| Database | MySQL (web_system) | ✅ Ready |

---

## Test Registration NOW

### 1. Go to App
```
http://localhost:5181
```

### 2. Create Account
- Fill in form with unique email
- Password 8+ chars
- Confirm password matches
- Select Student or Counselor
- Click "Create Account"

### 3. Expected: Success ✅
- See "Registration successful!"
- Redirected to login
- Can login with new account

### 4. If Error: Check Console
- Press F12
- Go to Console tab
- Look for error messages
- Common: "Email already exists" or validation errors

---

## Ports in Use

- **5173-5180**: Previous runs (can ignore)
- **5181**: Current React app ← USE THIS
- **8001**: Laravel backend
- **3306**: MySQL

---

## If Servers Stop

### Restart Backend
```bash
cd C:\Users\Charles Kevin\minsuguidanceapp\backend-laravel
php artisan serve --port=8001
```

### Restart Frontend
```bash
cd C:\Users\Charles Kevin\minsuguidanceapp\frontend-react
npm run dev
```

---

## Common Issues

| Error | Fix |
|-------|-----|
| "Network Error" | Open DevTools (F12) to see real error |
| "Email already exists" | Use different email |
| "Passwords don't match" | Confirm password matches exactly |
| "Port already in use" | Other port will be used automatically |
| Connection refused on 8001 | Restart Laravel backend |

---

## Debug

### See requests in console
Press F12 → Network tab → Try registration

### See backend logs
```bash
cd backend-laravel && php artisan tail
```

### Test database
```bash
cd backend-laravel && php artisan tinker
DB::table('users')->count()
```

---

## ✅ All Set!

**Try it now →** http://localhost:5181
