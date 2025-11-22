# Request Feature Implementation - Student Dashboard

## Overview
Added a new **Request** feature to the student dashboard sidebar that allows students to request documents including Good Moral Certificates, Referral Letters, and Certificates of Attendance.

## Changes Made

### 1. Created New Component: `RequestTypeSelector.jsx`
- **Location**: `frontend-react/src/components/RequestTypeSelector.jsx`
- **Features**:
  - Displays 3 request type cards:
    - 🏆 Good Moral Certificate (blue theme)
    - 📄 Referral Letter (green theme)
    - 📖 Certificate of Attendance (purple theme)
  - Each card shows:
    - Descriptive icon
    - Request type title
    - Brief description
    - "Request Now" button
  - Responsive grid layout (1 column mobile, 3 columns desktop)
  - Smooth hover effects with scale animation

### 2. Updated `RequestsTab.jsx`
- **Changes**:
  - Added import for `RequestTypeSelector` component
  - Added state management for `showTypeSelector` and updated `showForm`
  - Updated `formData` state to include `requestTypeLabel`
  - Added new handlers:
    - `handleSelectRequestType()` - Triggered when user taps a request type
    - `handleCloseTypeSelector()` - Close type selector
  - Updated form submission to use the selected type label
  - Reorganized UI flow:
    1. "New Request" button → Shows request type selector
    2. User clicks a type → Selector closes, form opens
    3. Form pre-populated with selected request type
    4. User fills purpose and notes, then submits

### 3. Enhanced Workflow
- **Before**: Form showed all document types as radio buttons
- **After**: 
  1. Click "New Request" button
  2. Visual cards appear showing available request types
  3. Tap desired type (Good Moral, Referral, or Certificate)
  4. Form appears pre-filled with selected type
  5. Fill in purpose and additional notes
  6. Submit request

## User Interface Flow

```
Requests Tab
    ↓
[+ New Request] Button
    ↓
Request Type Selector (3 Cards)
├── 🏆 Good Moral Certificate
├── 📄 Referral Letter
└── 📖 Certificate of Attendance
    ↓
User Taps Type
    ↓
Form Opens (Pre-filled with selected type)
├── Purpose Field
├── Additional Notes Field
└── Submit & Cancel Buttons
    ↓
Request Added to List
```

## Features

✅ **Visual Request Selection**
- Cards with icons and descriptions
- Color-coded by request type
- Hover animations for better UX

✅ **Seamless Form Flow**
- Type selector closes when type selected
- Form automatically opens with selection
- Form can be cancelled to restart selection

✅ **Request Tracking**
- Submitted requests appear in "My Requests" list
- Shows:
  - Request type
  - Status (Pending, Approved, Rejected)
  - Submitted date
  - Remarks
  - Purpose and notes (when provided)

✅ **Success/Error Feedback**
- Success message on submission
- Error handling for validation

## Responsive Design

- **Mobile**: Single column layout, bottom sheets
- **Tablet/Desktop**: Multi-column grid, side panels
- All Tailwind CSS classes for dark mode support

## Future Backend Integration

The current implementation uses local state. To connect with backend:

1. Update `handleSelectRequestType()` to call API
2. Update `handleSubmitRequest()` to POST to `/api/v1/student/requests`
3. Add request polling/fetching in useEffect
4. Integrate with actual counselor request endpoints

## Files Modified

1. ✅ `frontend-react/src/components/RequestTypeSelector.jsx` (NEW)
2. ✅ `frontend-react/src/components/RequestsTab.jsx` (UPDATED)

## Testing

The feature is ready to test in the React app:
1. Navigate to Student Dashboard
2. Click "Requests" in sidebar
3. Click "+ New Request" button
4. Select a request type from the cards
5. Fill in the form and submit
