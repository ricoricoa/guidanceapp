# Student Counselor Request Feature - Implementation Summary

## Overview
A complete student dashboard feature has been created that allows students to request counseling sessions from available counselors. This includes both frontend and backend components.

## Frontend Changes

### Enhanced StudentDashboard (frontend-react/src/pages/StudentDashboard.jsx)

#### New Features:
1. **Counselor Request Modal** - Beautiful modal form with:
   - Counselor selection dropdown (fetches from backend)
   - Date picker for preferred appointment date
   - Time picker for preferred appointment time
   - Textarea for detailed topic/reason description
   - Tips section to guide students on making requests
   - Loading state indicators

2. **Enhanced State Management**:
   - `messageType` - distinguishes between success and error messages
   - `appointmentSubmitting` - tracks form submission state
   - `counselors` - dynamically populated from backend

3. **Improved Data Flow**:
   - Fetches counselors from `/api/v1/counselors` endpoint
   - Loads student's existing appointment requests on mount
   - Handles API failures gracefully with fallback data
   - Displays success/error messages with appropriate styling

4. **Request Handling**:
   - Validates all form fields before submission
   - Sends appointment requests to `/api/v1/student/appointments`
   - Displays appointment status: pending, approved, rejected, completed
   - Shows counselor name once assigned

5. **UI Improvements**:
   - Added `AlertCircle` icon for error messages
   - Color-coded messages (green for success, red for errors)
   - Better error display in the modal
   - Loading spinner during submission

## Backend Changes

### 1. Database Migration
**File**: `database/migrations/2025_11_20_120000_create_counselor_requests_table.php`

Creates `counselor_requests` table with:
- `id` - Primary key
- `student_id` - Foreign key to users table
- `counselor_id` - Foreign key to users table (nullable)
- `requested_date` - Preferred appointment date
- `requested_time` - Preferred appointment time
- `topic` - Detailed topic/reason for counseling
- `status` - Enum: pending, approved, rejected, completed (default: pending)
- `notes` - Optional notes from counselor
- `timestamps` - created_at, updated_at

### 2. CounselorRequest Model
**File**: `app/Models/CounselorRequest.php`

Features:
- Relationships to User model (student and counselor)
- Date casting for requested_date
- Mass assignable fields
- Properly configured with HasFactory

### 3. StudentController
**File**: `app/Http/Controllers/Api/V1/StudentController.php`

Provides the following methods:

#### `createAppointmentRequest()`
- POST `/api/v1/student/appointments`
- Validates: date, time, topic, counselor_id
- Creates new CounselorRequest record
- Returns created appointment with full relationships

#### `getAppointmentRequests()`
- GET `/api/v1/student/appointments`
- Returns all requests for logged-in student
- Ordered by date (newest first)

#### `getAppointmentRequest(id)`
- GET `/api/v1/student/appointments/{id}`
- Returns specific appointment request
- Ensures student can only view their own requests

#### `updateAppointmentRequest(id)`
- PUT `/api/v1/student/appointments/{id}`
- Allows students to update pending requests only
- Can modify: date, time, topic, counselor_id
- Prevents modification of approved/rejected/completed requests

#### `deleteAppointmentRequest(id)`
- DELETE `/api/v1/student/appointments/{id}`
- Allows students to delete pending requests only
- Prevents deletion of approved/completed requests

#### `getCounselors()`
- GET `/api/v1/counselors`
- Returns list of available counselors
- Filters users with role: guidance or counselor
- Returns: id, name, email
- Ordered by name

### 4. API Routes
**File**: `routes/api_v1.php`

Added StudentController import and new authenticated routes:
```php
Route::middleware(['auth:sanctum', 'role:student'])->group(function () {
    Route::post('/student/appointments', [StudentController::class, 'createAppointmentRequest']);
    Route::get('/student/appointments', [StudentController::class, 'getAppointmentRequests']);
    Route::get('/student/appointments/{id}', [StudentController::class, 'getAppointmentRequest']);
    Route::put('/student/appointments/{id}', [StudentController::class, 'updateAppointmentRequest']);
    Route::delete('/student/appointments/{id}', [StudentController::class, 'deleteAppointmentRequest']);
    Route::get('/counselors', [StudentController::class, 'getCounselors']);
});
```

## Security Features

1. **Authentication**: All endpoints require `auth:sanctum` middleware
2. **Authorization**: Student endpoints require `role:student`
3. **Ownership Validation**: Students can only access/modify their own requests
4. **Validation**: Comprehensive validation on all input fields
5. **Counselor Verification**: Validates that selected counselor has guidance/counselor role

## Database Setup

Run the migration:
```bash
cd backend-laravel
php artisan migrate
```

## Usage Flow

### For Students:

1. Student logs in and navigates to student dashboard
2. Dashboard loads:
   - User profile information
   - List of existing appointment requests
   - Stats: number of appointments, messages, resources, progress
3. Student clicks "Request" button to open modal
4. Student fills form:
   - Selects counselor from dropdown
   - Chooses preferred date and time
   - Enters reason/topic
5. Click "Send Request" button
6. Request sent to backend and displayed in appointments list with "pending" status
7. Counselor reviews request and updates status to approved/rejected/completed

### For Counselors (Future):

The GuidanceDashboard would need enhancement to:
- View pending requests from all students
- Approve/reject requests
- Add notes
- Mark sessions as completed

## Error Handling

Frontend gracefully handles:
- Network errors - shows user-friendly message
- API endpoint not found - falls back to local state
- Validation errors - displays field-specific errors
- Form submission failures - shows error message with details

Backend provides:
- 422 validation errors with details
- 403 unauthorized (wrong role)
- 404 not found (invalid request ID)
- Proper error messages in JSON responses

## Future Enhancements

1. **Counselor Dashboard**:
   - View pending requests
   - Approve/reject/complete sessions
   - Add notes and follow-up

2. **Notifications**:
   - Email notifications for new requests
   - Status change notifications
   - Appointment reminders

3. **Scheduling**:
   - View counselor availability
   - Automatic conflict detection
   - Calendar integration

4. **Analytics**:
   - Request success rate
   - Average response time
   - Student engagement metrics

## Testing

Test the feature by:

1. Running migrations: `php artisan migrate`
2. Creating test users with different roles (student, guidance)
3. Logging in as a student
4. Requesting appointment with counselor
5. Verifying appointment appears in dashboard
6. Checking database: `counselor_requests` table populated correctly

## Files Modified/Created

### Created:
- `database/migrations/2025_11_20_120000_create_counselor_requests_table.php`
- `app/Models/CounselorRequest.php`
- `app/Http/Controllers/Api/V1/StudentController.php`

### Modified:
- `frontend-react/src/pages/StudentDashboard.jsx`
- `routes/api_v1.php`
