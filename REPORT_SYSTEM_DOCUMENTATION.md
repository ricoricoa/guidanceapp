# Student Report System - Complete Implementation Guide

## Overview
The report system allows students to submit feedback, bug reports, suggestions, and general feedback to the admin. Admins can then view, manage, and update the status of these reports.

## System Architecture

### Backend Components

#### 1. Report Model (`backend-laravel/app/Models/Report.php`)
```php
- user_id (Foreign Key) - Links to the user who submitted the report
- report_type (string) - Type of report: 'bug', 'suggestion', 'feedback', 'other'
- title (string, max 100) - Brief title of the report
- description (text, max 500) - Detailed description
- status (string, default: 'pending') - Current status: 'pending', 'reviewed', 'resolved', 'closed'
- created_at, updated_at (timestamps)
```

#### 2. Report Migration (`backend-laravel/database/migrations/2025_11_28_create_reports_table.php`)
- Creates `reports` table with proper schema
- Foreign key constraint on `user_id` with cascade delete
- Status: ✅ APPLIED (Migration run successfully)

#### 3. Report Controller (`backend-laravel/app/Http/Controllers/Api/V1/ReportController.php`)

**Three API Methods:**

##### a) `store()` - Student Report Submission
- **Route:** `POST /api/v1/reports`
- **Authentication:** Required (Sanctum)
- **Validation:**
  - `report_type`: Required, must be one of ['bug', 'suggestion', 'feedback', 'other']
  - `title`: Required, max 100 characters
  - `description`: Required, max 500 characters
- **Response:** 201 Created with report object including user relationship

**Example Request:**
```json
POST /api/v1/reports
{
  "report_type": "bug",
  "title": "Chat feature not loading",
  "description": "When I click messages, the counselor list does not appear"
}
```

**Example Response:**
```json
{
  "id": 1,
  "user_id": 5,
  "report_type": "bug",
  "title": "Chat feature not loading",
  "description": "When I click messages, the counselor list does not appear",
  "status": "pending",
  "created_at": "2025-11-28T10:30:00Z",
  "updated_at": "2025-11-28T10:30:00Z",
  "user": {
    "id": 5,
    "name": "Juan Dela Cruz",
    "email": "juan@example.com"
  }
}
```

##### b) `index()` - Admin View All Reports
- **Route:** `GET /api/v1/reports`
- **Authentication:** Required (Sanctum)
- **Authorization:** Admin role only (returns 403 if not admin)
- **Response:** Paginated list (20 per page) ordered by creation date (newest first)
- **Includes:** User information with each report

**Query Parameters:**
- `page`: Page number (default: 1)

**Example Request:**
```
GET /api/v1/reports?page=1
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 5,
      "report_type": "bug",
      "title": "Chat feature not loading",
      "description": "...",
      "status": "pending",
      "created_at": "2025-11-28T10:30:00Z",
      "updated_at": "2025-11-28T10:30:00Z",
      "user": {
        "id": 5,
        "name": "Juan Dela Cruz",
        "email": "juan@example.com"
      }
    }
  ],
  "links": {...},
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 1
  }
}
```

##### c) `updateStatus()` - Admin Update Report Status
- **Route:** `PUT /api/v1/reports/{id}/status`
- **Authentication:** Required (Sanctum)
- **Authorization:** Admin role only
- **Request Body:**
  ```json
  {
    "status": "reviewed" // or "pending", "resolved", "closed"
  }
  ```
- **Response:** Updated report object

### Frontend Components

#### 1. StudentReportForm (`frontend-react/src/components/StudentReportForm.jsx`)
**Purpose:** Modal form for students to submit reports

**Features:**
- Report type selection (Bug, Suggestion, Feedback, Other)
- Title input (max 100 characters with counter)
- Description textarea (max 500 characters with counter)
- Real-time error display with alert icon
- Loading state during submission
- Success confirmation with CheckCircle icon
- Dark mode support

**Props:**
- `onClose`: Callback when form is closed
- `onReportSent`: Callback after successful submission

**Usage in StudentDashboard:**
```jsx
const [showReportForm, setShowReportForm] = useState(false);

// Button to trigger form
<button onClick={() => setShowReportForm(true)}>
  Send Report
</button>

// Form Modal
{showReportForm && (
  <StudentReportForm 
    onClose={() => setShowReportForm(false)}
    onReportSent={() => setShowReportForm(false)}
  />
)}
```

#### 2. AdminDashboard Reports Tab (`frontend-react/src/pages/AdminDashboard.jsx`)
**Purpose:** Admin interface to view, manage, and update report status

**Features:**
- Fetches reports from `/api/v1/reports` on dashboard load
- Displays reports in card format with:
  - Student name and email
  - Report type badge (colored)
  - Title and description
  - Submission date
  - Current status badge with color coding
- Status dropdown to change report status
  - Options: Pending, Reviewed, Resolved, Closed
  - Updates immediately on selection via PUT request
- Empty state message when no reports exist
- Dark mode support throughout

**Status Colors:**
- **Pending** (Yellow): `bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
- **Reviewed** (Blue): `bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`
- **Resolved** (Green): `bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
- **Closed** (Gray): `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`

**Sidebar Navigation:**
- "Reports" tab added to admin sidebar with BarChart3 icon
- Integrated into main admin dashboard layout

## Data Flow

### Student Submitting a Report
```
1. Student clicks "Send Report" button in StudentDashboard
2. StudentReportForm modal opens
3. Student selects report type and fills in title/description
4. Form validates:
   - Checks title and description are not empty
   - Validates title length (max 100)
   - Validates description length (max 500)
5. Form submits POST to /api/v1/reports with auth token
6. Backend validates fields again and creates report
7. Report status set to "pending" automatically
8. Success message displayed (2 second delay, then closes)
9. Admin can view report in Reports tab of AdminDashboard
```

### Admin Viewing and Managing Reports
```
1. Admin logs in and navigates to AdminDashboard
2. Admin clicks on "Reports" tab in sidebar
3. Dashboard fetches all reports via GET /api/v1/reports
   - Authorization check: only admins can access
   - Reports returned with pagination (20 per page)
   - Ordered by newest first
4. Reports displayed in list format with student info
5. Admin can click status dropdown to change report status
6. Status change sends PUT request to /api/v1/reports/{id}/status
7. Report updates immediately in the UI
8. Auto-refresh every 5 seconds keeps data current
```

## Error Handling

### Frontend
- **ValidationError:** "Please fill in all fields" - shown inline
- **SubmissionError:** Extracts error message from API response
  - If API returns error message, displays it
  - Falls back to generic "Failed to submit report. Please try again."
- **Network Error:** Caught and logged to console
- Error messages displayed in red alert box with AlertCircle icon

### Backend
- **Unauthorized:** 401 if auth token missing/invalid
- **Forbidden:** 403 if non-admin tries to access admin endpoints
- **Validation:** 422 with field-specific error messages
- **Server Error:** 500 if unexpected error occurs

## API Security

All report endpoints require:
1. **Authentication:** Valid Sanctum auth token in Bearer header
2. **Authorization:**
   - `POST /api/v1/reports`: Any authenticated user (students, counselors, admins)
   - `GET /api/v1/reports`: Admin role only
   - `PUT /api/v1/reports/{id}/status`: Admin role only

## Database Schema

```sql
CREATE TABLE reports (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  report_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  status VARCHAR(255) DEFAULT 'pending',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Testing the Report System

### Step 1: Create a Report (Student)
1. Log in as a student
2. Navigate to Student Dashboard
3. Scroll to find "Send Report" button
4. Click to open StudentReportForm
5. Select report type (e.g., "Bug Report")
6. Enter title: "Test report title"
7. Enter description: "This is a test report description"
8. Click "Send Report"
9. Verify success message appears
10. Check database: `SELECT * FROM reports;` should show new entry

### Step 2: View Reports (Admin)
1. Log out from student account
2. Log in as admin user
3. Navigate to Admin Dashboard
4. Click "Reports" tab in left sidebar
5. Verify report appears in list with student info
6. Verify all fields display correctly

### Step 3: Update Report Status (Admin)
1. In Reports tab, find a report
2. Click on status dropdown (should show "Pending")
3. Select different status (e.g., "Reviewed")
4. Verify status updates immediately
5. Check database: Status should be updated in reports table
6. Refresh page - status should persist

## Future Enhancements

1. **Filtering & Search**
   - Filter by report type
   - Filter by status
   - Search by student name or title
   - Date range filtering

2. **Export & Analytics**
   - Export reports to CSV
   - Chart showing report types distribution
   - Response time analytics

3. **Notifications**
   - Email notification when new report submitted
   - Email to student when report status changes
   - In-app notifications for admin

4. **Attachments**
   - Allow students to attach screenshots
   - File upload validation and storage

5. **Comments & Discussion**
   - Admin can add comments to reports
   - Student can reply to admin comments
   - Discussion thread on each report

## Troubleshooting

### Reports Not Appearing
- **Check:** Admin user has `role = 'admin'` in database
- **Check:** Migration has been run: `php artisan migrate`
- **Check:** Reports table exists: `SHOW TABLES;`
- **Check:** API response in browser DevTools Network tab

### Status Update Not Working
- **Check:** User is logged in as admin
- **Check:** Status value is one of: pending, reviewed, resolved, closed
- **Check:** Report ID exists in database
- **Check:** Auth token is valid in localStorage

### Form Not Submitting
- **Check:** All fields are filled (title and description)
- **Check:** Character limits not exceeded (title: 100, description: 500)
- **Check:** API server is running and accessible
- **Check:** Auth token is valid in localStorage

## File Locations Summary

```
Backend:
- Model: backend-laravel/app/Models/Report.php
- Migration: backend-laravel/database/migrations/2025_11_28_create_reports_table.php
- Controller: backend-laravel/app/Http/Controllers/Api/V1/ReportController.php
- Routes: backend-laravel/routes/api_v1.php (lines 205-209)

Frontend:
- Form Component: frontend-react/src/components/StudentReportForm.jsx
- Admin Dashboard: frontend-react/src/pages/AdminDashboard.jsx (reports tab)
- Student Dashboard: frontend-react/src/pages/StudentDashboard.jsx (report button)
```

## Implementation Status

✅ **COMPLETED:**
- Report model created with proper relationships
- Database migration created and applied
- ReportController with all 3 methods implemented
- API routes configured with auth and role middleware
- StudentReportForm component with validation and error handling
- AdminDashboard reports tab integrated
- Status management dropdown implemented
- Dark mode support throughout
- Error messages improved with better UX

✅ **TESTED:**
- Database migration runs successfully
- API endpoints created and properly secured
- Component integration verified in existing admin/student dashboards

🎯 **READY FOR USE**
The report system is fully functional and ready for production use.
