# Admin Dashboard & Student Reports Feature Documentation

## Overview
This document describes the newly implemented Admin Dashboard and Student Reporting system for the Minsu Guidance App.

---

## 1. Admin Dashboard (`AdminDashboard.jsx`)

### Features

#### 1.1 Dashboard Overview
- **Total Users Count**: Displays overall number of users in the system
- **Counselors Count**: Shows number of registered counselors
- **Students Count**: Shows number of registered students
- **Open Reports Count**: Displays number of unresolved reports/feedback

### 1.2 User Management

#### All Users Tab
- **Search Functionality**: Search by name or email in real-time
- **Filter by Role**: Filter users by "All", "Students", or "Counselors"
- **User Information Display**:
  - Name
  - Email
  - Role (Student/Counselor)
  - Account Created Date
  - Status (Active/Inactive)
  - Quick Action Buttons (View, Edit, Delete)

#### Counselors Tab
- **Counselor Cards**: Display each counselor with:
  - Name and specialization
  - Email address
  - Number of students assigned
  - Current status (Active/Inactive)
  - View and Edit buttons
- **Add Counselor Button**: Future capability to add new counselors to the system

#### Students Tab
- **Student List**: Table view of all students showing:
  - Name and email
  - Grade/Class level
  - Assigned counselor
  - Account status
  - Quick action buttons

### 1.3 Login History Tracking

The Login History tab displays:
- **User Information**:
  - Full name
  - Email address
  - Role (Student/Counselor)
- **Login/Logout Times**: Precise timestamps for when users logged in and out
- **Session Duration**: Automatically calculated time spent in the system
- **Current Status**: Shows "Still online" for active sessions

**Data Points Tracked**:
- Login timestamp
- Logout timestamp (null if still online)
- User role
- Session duration calculation

### 1.4 Reports & Feedback Management

The Reports tab displays all student feedback and reports with:
- **Report Information**:
  - Title and description
  - Report type (Bug, Suggestion, Feedback, Other)
  - Submitting student's name
  - Date submitted
- **Status Indicators**:
  - Open (Red)
  - In Progress (Blue)
  - Resolved (Green)
- **Priority Level**:
  - High Priority (Red)
  - Medium Priority (Yellow)
  - Low Priority (Green)
- **Admin Actions**:
  - View Details button
  - Mark as Resolved button
  - Change Priority button

---

## 2. Student Report Form (`StudentReportForm.jsx`)

### Features

#### 2.1 Report Types
Students can submit reports in four categories:
1. **Bug Report**: System issues and errors
2. **Suggestion**: Feature requests and improvement ideas
3. **General Feedback**: Overall experience and comments
4. **Other**: Miscellaneous feedback

#### 2.2 Form Fields

1. **Report Type Selector**
   - Visual card-based selection
   - Four options with icons and descriptions
   - Required field

2. **Title Field**
   - Text input with 100 character limit
   - Character counter displayed
   - Required field
   - Placeholder: "Brief title of your report"

3. **Description Field**
   - Textarea with 500 character limit
   - Character counter displayed
   - Required field
   - Placeholder: "Detailed description of your report, feedback, or suggestion"
   - 4 rows minimum height

#### 2.3 Form Behavior

**Submission Process**:
1. User selects report type
2. Fills in title (up to 100 characters)
3. Enters description (up to 500 characters)
4. Clicks "Send Report" button
5. Form validates all fields are filled
6. Sends POST request to `/api/v1/reports`
7. Shows success confirmation after 2 seconds
8. Modal closes automatically

**Loading State**:
- Button shows spinner during submission
- Button is disabled while loading
- Clear user feedback on submission progress

**Success State**:
- Displays success modal with checkmark icon
- Confirmation message: "Thank you for your feedback. Our admin team will review it shortly."
- Auto-closes after 2 seconds

### 2.4 Error Handling
- Shows alert if any required fields are empty
- Gracefully handles API errors
- Displays error message and allows retry

### 2.5 Design

**Dark Mode Support**:
- Modal background adapts to dark theme
- All text properly contrasted
- Form inputs styled for dark mode

**Responsive Design**:
- Works on mobile, tablet, and desktop
- Touch-friendly button sizes
- Proper scrolling for content overflow

---

## 3. Student Dashboard Integration

### Send Report Button

**Location**: Top navigation bar (near notifications)

**Button Details**:
- Icon: Flag icon (lucide-react)
- Label: "Send Report" (hidden on small screens)
- Color: Orange (#EA580C)
- Behavior: Opens StudentReportForm modal on click

**Accessibility**:
- Tooltip shows "Send Report or Feedback"
- Responsive - shows icon only on mobile devices
- Clear visual indicator with orange color for attention-grabbing

---

## 4. API Endpoints (Required Backend)

### For Admin Dashboard:
- `GET /api/v1/admin/dashboard` - Fetch dashboard overview data
  - Returns: User data, stats, initial dashboard information
  - Response should include user object

### For Login History:
- `GET /api/v1/admin/login-history` - Fetch login history records
  - Optional query parameters: pagination, date filters
  - Response: Array of login history objects

### For Reports:
- `GET /api/v1/admin/reports` - Fetch all submitted reports
  - Optional query parameters: status, priority filters
  - Response: Array of report objects

- `PUT /api/v1/admin/reports/{id}` - Update report status/priority
  - Request body: { status: 'resolved'|'in-progress'|'open', priority: 'high'|'medium'|'low' }

- `POST /api/v1/reports` - Submit new student report
  - Request body: { report_type, title, description }
  - Response: Created report object
  - Authentication: Required (student user)

---

## 5. Data Models

### User Object
```json
{
  "id": 1,
  "name": "Maria Santos",
  "email": "maria@example.com",
  "role": "counselor|student",
  "created_at": "2025-11-01",
  "status": "active|inactive"
}
```

### Login History Object
```json
{
  "id": 1,
  "user_id": 1,
  "user_name": "Maria Santos",
  "email": "maria@example.com",
  "role": "counselor",
  "login_time": "2025-12-07T09:30:00Z",
  "logout_time": "2025-12-07T11:00:00Z",
  "duration_minutes": 90
}
```

### Report Object
```json
{
  "id": 1,
  "user_id": 4,
  "user_name": "Juan Dela Cruz",
  "report_type": "bug|suggestion|feedback|other",
  "title": "Chat feature not loading",
  "description": "When I click messages, the counselor list does not appear",
  "status": "open|in-progress|resolved",
  "priority": "high|medium|low",
  "created_at": "2025-12-06T15:30:00Z",
  "admin_response": null,
  "resolved_at": null
}
```

### Counselor Object
```json
{
  "id": 1,
  "name": "Maria Santos",
  "email": "maria@example.com",
  "specialization": "Academic Guidance",
  "students": 15,
  "status": "active"
}
```

---

## 6. Current Implementation Status

### ✅ Completed
- Admin Dashboard component with full layout
- User management (All Users, Counselors, Students tabs)
- Login history tracking UI
- Reports management UI
- Student Report Form with all validations
- Integration with StudentDashboard
- Dark mode support throughout
- Responsive design for all screen sizes
- Mock data for testing and demonstration

### 📋 Pending Backend Implementation
- Database migrations for login_history table
- Database migrations for reports table
- API endpoint implementations
- Real data integration
- Permission/role checking for admin access
- Report email notifications to admin
- Login activity logging middleware

### 🔄 Future Enhancements
- Export reports to CSV/PDF
- Advanced filtering and sorting options
- Bulk user actions
- User analytics dashboard
- Report response/comment system
- Automated report distribution
- Email notifications for new reports
- Admin notes on reports

---

## 7. Usage Instructions

### For Students

**To Send Report/Feedback**:
1. Click "Send Report" button in the top navigation bar
2. Select report type (Bug, Suggestion, Feedback, Other)
3. Enter a brief title (max 100 characters)
4. Write detailed description (max 500 characters)
5. Click "Send Report" button
6. Wait for success confirmation
7. Modal automatically closes

### For Admin

**To Access Admin Dashboard**:
1. Login with admin/guidance counselor account
2. Navigate to Admin Dashboard (route: `/admin`)

**To View All Users**:
1. Click "All Users" tab on sidebar
2. Use search box to find specific users
3. Filter by role if needed
4. Click action buttons for View/Edit/Delete

**To Check Login History**:
1. Click "Login History" tab
2. View all user login and logout times
3. See session duration automatically calculated

**To Manage Reports**:
1. Click "Reports" tab
2. Review all submitted reports
3. Check report status and priority
4. Click buttons to view details, mark resolved, or change priority

---

## 8. File Structure

```
src/
├── pages/
│   ├── AdminDashboard.jsx (NEW)
│   └── StudentDashboard.jsx (UPDATED)
├── components/
│   └── StudentReportForm.jsx (NEW)
└── api/
    └── axios.js (unchanged)
```

---

## 9. Styling & Theme

All components follow the existing design system:
- **Colors**: Indigo primary (#4F46E5), with supporting colors
- **Dark Mode**: Full dark mode support with dark: prefix
- **Icons**: Lucide React icon library
- **Spacing**: Tailwind CSS spacing scale
- **Typography**: Consistent font sizing and weights
- **Responsive**: Mobile-first responsive design

---

## 10. Security Considerations

### Current Implementation Notes
- Mock data used for demonstration
- Real implementation should include:
  - Permission checks (only admin can access admin dashboard)
  - User role validation
  - CSRF token validation
  - Input sanitization
  - Rate limiting on report submissions
  - Proper error handling without data leakage

### Recommended Implementation
- Middleware to check `role === 'admin'` or `role === 'guidance'`
- Validate user ownership of reports
- Sanitize all text input
- Log all admin actions
- Implement audit trail for report status changes

---

## 11. Testing Checklist

- [ ] Admin can access AdminDashboard
- [ ] User search works correctly
- [ ] Role filter functions properly
- [ ] Login history displays correctly
- [ ] Report list shows all submissions
- [ ] Student can open report form
- [ ] Form validation works (empty fields)
- [ ] Character limits enforced
- [ ] Report submission successful
- [ ] Success message displays
- [ ] Modal closes after submission
- [ ] Dark mode renders correctly
- [ ] Responsive on mobile (< 640px)
- [ ] Responsive on tablet (640px - 1024px)
- [ ] All buttons functional
- [ ] Action buttons trigger appropriate functions

---

## 12. Next Steps for Backend Developer

1. Create `LoginHistory` migration and model
2. Create `Report` migration and model
3. Implement admin API endpoints
4. Add login logging middleware
5. Add report submission endpoint
6. Implement permission middleware
7. Add email notifications
8. Test all endpoints with frontend
9. Add data validation
10. Implement error handling

---

Generated: December 2024
Last Updated: Current Session
