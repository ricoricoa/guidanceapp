# Counselor Dashboard - Enhanced Student Management Feature

## Overview
The Counselor (Guidance) Dashboard has been updated with three main navigation tabs to help counselors manage student requests, messages, and appointments more efficiently.

---

## Features

### 1. Dashboard Tab (Main Overview)

#### Statistics Cards
- **Total Students**: Count of all assigned students
- **Appointments**: Total scheduled appointments
- **Pending Requests**: Count of pending student requests (Good Moral, Certificate, Referral)
- **Unread Messages**: Count of unread student messages

#### Upcoming Appointments Section
- Lists all scheduled appointments for the counselor
- Shows:
  - Student name
  - Appointment topic/subject
  - Date and time scheduled
  - Current status (Pending/Scheduled)
- Action buttons:
  - **Note**: Add session notes for the appointment
  - **Approve**: Approve pending appointments to change status to "Scheduled"

#### My Students Table
- Displays all students assigned to the counselor
- Shows:
  - Student name and email
  - Number of completed sessions
  - Current status (Active/Inactive)
  - Quick access to view full student profile

#### My Profile Card (Sticky sidebar)
- Displays counselor's information:
  - Name
  - Email
  - Address
- **Edit Profile** button to update information
- Validates and saves changes to the database

---

### 2. Student Requests Tab

#### Request Management Interface
Shows all document requests from students with filtering capabilities.

#### Request Types
- **Good Moral Certificate**: For scholarships, applications, travel
- **Certificate of Referral**: For school support and guidance
- **Certificates**: General certificates of completion

#### Request Status Indicators
- **Pending** (Yellow): Awaiting counselor review and approval
- **Approved** (Green): Request approved and ready for processing
- **Rejected** (Red): Request rejected with reason

#### Filter Options
- **All**: View all requests regardless of status
- **Pending**: View only pending requests
- **Approved**: View approved requests
- **Rejected**: View rejected requests

#### Request Details Display
For each request, displays:
- Student name and email
- Request type
- Purpose/reason for request
- Submission date
- Rejection reason (if applicable)

#### Request Actions
For pending requests, counselors can:
- **Approve**: Click to approve the request (changes status to "approved")
- **Reject**: Click to reject the request (changes status to "rejected")

These actions immediately update the request status and display a success message.

---

### 3. Messages Tab

#### Two-Column Layout
1. **Left Column - Message List**
   - Shows all students who have messaged the counselor
   - Displays:
     - Student name
     - Time of last message
     - Preview of last message
     - Unread count (if any)
     - Blue dot indicator for unread messages
   - Scrollable list for many conversations

2. **Right Column - Message View**
   - Currently shows placeholder
   - Future implementation: Full conversation thread
   - Will allow counselor to reply to messages

#### Message Indicators
- **Unread Badge**: Shows number of new/unread messages (e.g., "2 new")
- **Blue Dot**: Visual indicator of unread messages
- **Last Message Time**: Relative time display (e.g., "2h ago", "1d ago")

---

## Data Structure

### Student Request Object
```javascript
{
  id: 1,
  student_name: "Juan Dela Cruz",
  student_email: "juan@example.com",
  request_type: "Good Moral",  // Good Moral | Certificate | Referral
  status: "pending",            // pending | approved | rejected
  submitted_at: "2025-12-05",
  purpose: "For scholarship application",
  reason: "Incomplete information"  // Only for rejected requests
}
```

### Student Message Object
```javascript
{
  id: 1,
  student_name: "Juan Dela Cruz",
  student_id: 1,
  last_message: "Thank you for the guidance session yesterday!",
  last_message_time: Date object,
  unread: 2  // Number of unread messages
}
```

### Appointment Object
```javascript
{
  id: 1,
  student_name: "Juan Dela Cruz",
  topic: "Career Planning",
  date: "2025-12-10",
  time: "2:00 PM",
  status: "pending"  // pending | scheduled | completed
}
```

---

## Color Coding System

### Request Status Colors
| Status | Background | Text | Meaning |
|--------|-----------|------|---------|
| Pending | Yellow-100 | Yellow-800 | Awaiting review |
| Approved | Green-100 | Green-800 | Ready for processing |
| Rejected | Red-100 | Red-800 | Not approved |

### Appointment Status Colors
| Status | Background | Text | Meaning |
|--------|-----------|------|---------|
| Pending | Yellow-100 | Yellow-800 | Awaiting approval |
| Scheduled | Green-100 | Green-800 | Confirmed |

---

## Tab Navigation

Each tab shows:
- **Tab Name**: Clear label for the section
- **Badge Count**: Number of pending items (requests/messages)
  - Red badge for pending requests
  - Blue badge for unread messages
- **Active Indicator**: Blue underline shows current tab

Clicking a tab switches the main content area to display that section.

---

## Mock Data Structure

The dashboard currently uses mock data for demonstration purposes. When connecting to the backend API, replace with actual data from:

- `GET /api/v1/guidance/dashboard` - Main dashboard data
- `GET /api/v1/guidance/requests` - Student requests
- `GET /api/v1/guidance/messages` - Student messages  
- `PUT /api/v1/guidance/requests/{id}` - Update request status
- `GET /api/v1/user/profile` - Counselor profile
- `PUT /api/v1/user/profile` - Update counselor profile

---

## Backend Integration Requirements

### Endpoints Needed

**1. Get Student Requests**
```
GET /api/v1/guidance/requests
Query Parameters:
  - status: 'pending|approved|rejected|all' (optional)
  - page: pagination (optional)

Response:
  [
    { id, student_name, student_email, request_type, status, submitted_at, purpose }
  ]
```

**2. Update Request Status**
```
PUT /api/v1/guidance/requests/{id}
Request Body:
  { status: 'approved|rejected', reason?: string }

Response:
  { success: true, message: "Request updated" }
```

**3. Get Student Messages**
```
GET /api/v1/guidance/messages
Response:
  [
    { id, student_name, student_id, last_message, last_message_time, unread }
  ]
```

---

## Features Implemented

✅ Dashboard overview with statistics  
✅ Appointment management with notes  
✅ Student list table  
✅ Profile management with edit functionality  
✅ Student requests with filtering  
✅ Request approve/reject functionality  
✅ Messages list with unread indicators  
✅ Dark mode support  
✅ Responsive design (mobile, tablet, desktop)  
✅ Tab navigation system  
✅ Success/error message display  

---

## Future Enhancements

- Full message thread view and reply functionality
- Export requests to PDF/CSV
- Advanced search and filtering
- Appointment calendar view
- Student profile detailed view
- Bulk request actions
- Email notifications for new requests
- Request template system
- Analytics dashboard
- Student performance tracking

---

## Testing Checklist

- [ ] Dashboard tab displays all stats correctly
- [ ] Tabs switch content appropriately
- [ ] Request filtering works (all, pending, approved, rejected)
- [ ] Approve/reject buttons change request status
- [ ] Success messages appear on actions
- [ ] Messages tab shows unread count badges
- [ ] Messages list displays correctly
- [ ] Profile can be edited and saved
- [ ] Dark mode renders correctly
- [ ] Mobile responsive (< 640px)
- [ ] Tablet responsive (640px - 1024px)
- [ ] Desktop layout works (> 1024px)
- [ ] All action buttons are functional
- [ ] No console errors

---

Generated: December 2024  
Last Updated: Current Session
