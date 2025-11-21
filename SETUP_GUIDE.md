# Student Counselor Request Feature - Setup Guide

## Quick Start

### 1. Run Database Migration

```bash
cd backend-laravel
php artisan migrate
```

This will create the `counselor_requests` table with all necessary fields.

### 2. Create Test Users

Create users with different roles:
- Student user (for testing student dashboard)
- Counselor/Guidance user (to show in dropdown)

You can use:
```bash
php artisan tinker
```

Then in tinker:
```php
User::create([
    'name' => 'John Student',
    'email' => 'student@example.com',
    'password' => Hash::make('password'),
    'role' => 'student',
    'address' => '123 Main St'
]);

User::create([
    'name' => 'Ms. Sarah Johnson',
    'email' => 'sarah@example.com',
    'password' => Hash::make('password'),
    'role' => 'guidance',
    'address' => 'School Office'
]);

User::create([
    'name' => 'Mr. Michael Chen',
    'email' => 'michael@example.com',
    'password' => Hash::make('password'),
    'role' => 'guidance',
    'address' => 'School Office'
]);
```

### 3. Start the Application

Frontend:
```bash
cd frontend-react
npm run dev
```

Backend:
```bash
cd backend-laravel
php artisan serve
```

### 4. Test the Feature

1. Log in as a student user
2. Navigate to student dashboard
3. Click "Request" button in the Appointments section
4. Fill in the form:
   - Select a counselor
   - Choose a date
   - Select a time
   - Enter the topic/reason
5. Click "Send Request"
6. You should see the appointment appear in your list with "pending" status

## API Endpoints

### Student Endpoints (Require: auth:sanctum, role:student)

**Create Appointment Request**
```
POST /api/v1/student/appointments
Content-Type: application/json

{
  "date": "2025-11-25",
  "time": "10:00",
  "topic": "I need help with my exam preparation",
  "counselor_id": 1
}
```

**Get All Appointments**
```
GET /api/v1/student/appointments
```

**Get Single Appointment**
```
GET /api/v1/student/appointments/:id
```

**Update Appointment (pending only)**
```
PUT /api/v1/student/appointments/:id
Content-Type: application/json

{
  "date": "2025-11-26",
  "time": "14:00",
  "topic": "Updated topic",
  "counselor_id": 2
}
```

**Delete Appointment (pending only)**
```
DELETE /api/v1/student/appointments/:id
```

**Get Available Counselors**
```
GET /api/v1/counselors
```

Response:
```json
{
  "message": "Counselors retrieved",
  "counselors": [
    {
      "id": 1,
      "name": "Ms. Sarah Johnson",
      "email": "sarah@example.com"
    }
  ]
}
```

## Features Implemented

✅ **Student Dashboard**
- Request counselor appointments
- View appointment history
- Update/cancel pending requests
- See appointment status

✅ **Counselor Dropdown**
- Dynamically fetches from backend
- Shows available counselors
- Fallback to sample data if API fails

✅ **Appointment Details**
- Date selection (future dates only)
- Time selection
- Detailed topic/reason field
- Status tracking (pending, approved, rejected, completed)

✅ **Error Handling**
- Form validation
- API error handling
- Graceful fallbacks
- User-friendly messages

✅ **Security**
- Role-based access control
- Ownership validation
- Input validation
- CSRF protection via Sanctum

## Troubleshooting

### Counselors dropdown shows sample data
- The `/api/v1/counselors` endpoint may not be working
- Check that users with role 'guidance' exist in database
- Check Laravel logs: `tail -f backend-laravel/storage/logs/laravel.log`

### Appointments not saving
- Check that migration ran successfully: `php artisan migrate:status`
- Verify student is authenticated
- Check API response in browser DevTools Network tab

### "Access Denied" message
- Ensure logged-in user has 'student' role
- Check that token is being sent with request
- Verify `auth:sanctum` middleware is configured

### Date/Time validation errors
- Date must be today or in future
- Time format must be HH:MM (24-hour)
- Check browser console for validation errors

## Next Steps

1. **Add Counselor Dashboard** - View and manage student requests
2. **Email Notifications** - Notify students of status changes
3. **Availability Calendar** - Show counselor availability
4. **Session Notes** - Add notes after completing sessions
5. **Analytics** - Track request trends and response times

## Contact

For issues or questions about this feature, refer to:
- `STUDENT_DASHBOARD_IMPLEMENTATION.md` - Detailed technical documentation
- Laravel logs: `backend-laravel/storage/logs/laravel.log`
- Browser console for frontend errors
