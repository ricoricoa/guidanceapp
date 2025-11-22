# 🚀 Counselor & Student Messaging System - Testing Guide

## Quick Start

### Test Accounts Created ✅
```
COUNSELOR:
Email: counselor1@example.com
Password: password123
Role: guidance (counselor)

STUDENTS:
Email: juan@example.com | Password: password123
Email: maria.student@example.com | Password: password123  
Email: pedro@example.com | Password: password123
Email: rosa@example.com | Password: password123
```

---

## Testing the System

### 1️⃣ Test Student Messaging (Juan's Account)

**URL:** http://localhost:5173/

1. Click "Get Started" button
2. Click "Login"
3. Enter:
   - Email: `juan@example.com`
   - Password: `password123`
4. Click "Login"
5. You'll be redirected to Student Dashboard
6. In the sidebar, click **"💬 Messages"** tab
7. You'll see all available counselors
8. Click on "Maria Santos" (the counselor)
9. Type a message and send it
10. The message will be saved locally

---

### 2️⃣ Test Counselor Messaging (Maria's Account)

**URL:** http://localhost:5173/

1. Click "Get Started" button
2. Click "Login"
3. Enter:
   - Email: `counselor1@example.com`
   - Password: `password123`
4. Click "Login"
5. You'll be redirected to **Counselor Dashboard** ✅
6. In the sidebar, click **"💬 Messages"** button
7. **All 4 students should appear** on the left side:
   - Juan Dela Cruz
   - Maria Student  
   - Pedro Reyes
   - Rosa Garcia
8. Click on any student name
9. The chat area appears on the right
10. Type a message and send it
11. The message will be saved locally

---

### 3️⃣ Test Multi-Way Messaging

**Scenario:** Student sends message → Counselor replies → Student sees reply

1. Login as **juan@example.com**
2. Go to Messages → Click Maria Santos
3. Send message: "Hello, I need help with my assignment"
4. Logout (go to home page, refresh)
5. Login as **counselor1@example.com**
6. Go to Messages → Click "Juan Dela Cruz"
7. You should see the message from Juan
8. Reply: "Of course! What specific topic?"
9. Send message
10. Logout and login back as Juan
11. Go to Messages → Click Maria
12. **You should see both messages** ✅

---

## Features Working ✅

✅ **Students Tab:** Shows all available counselors
✅ **Counselors Tab:** Shows all students in the system
✅ **Real-time Messaging:** Send/receive messages locally
✅ **Message Persistence:** Messages saved in browser localStorage
✅ **Message Storage Key:** `chat_student_{studentId}_counselor_{counselorId}`
✅ **Timestamps:** Each message shows when it was sent
✅ **Two-Way Chat:** Students and counselors can both send/receive
✅ **No Assignment Needed:** Any student can message any counselor

---

## Troubleshooting

### Issue: Page shows blank/white on Counselor Dashboard
**Solution:** Make sure you're logged in as a counselor account (counselor1@example.com)

### Issue: Messages not appearing
**Solution:** 
- Check browser DevTools Console (F12) for errors
- Make sure both accounts are using the same browser
- Check localStorage key: `chat_student_X_counselor_Y`

### Issue: Students not appearing in counselor's message list
**Solution:**
- Refresh the page
- Make sure students are created (they should be from the test script)
- Check if API endpoint is accessible: `/api/v1/admin/students`

---

## Database Verification

To check test accounts were created:

```bash
cd backend-laravel
php artisan tinker
```

Then run:
```php
App\Models\User::where('role', 'student')->get();
App\Models\User::where('role', 'guidance')->get();
```

---

## API Endpoints Used

### Counselor Dashboard
- `GET /api/v1/guidance/dashboard` - Get counselor dashboard data
- `GET /api/v1/appointments` - Get all appointments
- `GET /api/v1/admin/students` - Get all students (for messages tab)
- `GET /api/v1/admin/counselors` - Get all counselors

### Student Dashboard  
- `GET /api/v1/student/dashboard` - Get student dashboard data
- `GET /api/v1/admin/counselors` - Get all counselors (for messages tab)
- `GET /api/v1/appointments` - Get student's appointments

### Messaging (Frontend Only - localStorage)
- Messages stored with key: `chat_student_{id}_counselor_{id}`
- No backend endpoint needed - all client-side

---

## Next Steps (Future Development)

- [ ] Add database storage for messages (instead of localStorage)
- [ ] Add real-time WebSocket notifications
- [ ] Add message search and filtering
- [ ] Add read receipts
- [ ] Add message media/attachments
- [ ] Add message history export

---

Generated: November 22, 2025
