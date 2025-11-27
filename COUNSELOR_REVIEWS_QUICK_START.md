# Counselor Reviews Feature - Quick Start Guide

## What Was Added?

### 1. **Student Dashboard - New "Counselor Reviews" Tab**
Located in the sidebar next to other menu items (Appointments, Messages, Certificates, etc.)

**When clicked, students see:**
- Left side: List of all counselors with their average rating and number of reviews
- Right side: Review form where they can:
  - Rate the selected counselor (1-5 stars with hover effect)
  - Write optional feedback (up to 1000 characters)
  - Update existing review (if they already reviewed this counselor)

### 2. **Admin Dashboard - New "Counselor Reviews" Tab**
New menu option in admin sidebar

**Shows:**
- All reviews submitted by students in chronological order
- For each review displays:
  - Counselor name and 5-star rating
  - Student who submitted it
  - Review comment (if provided)
  - Submission date and time
- Empty state if no reviews exist

## How It Works

### Flow for Students:
1. Go to Student Dashboard
2. Click "Counselor Reviews" in sidebar
3. Choose a counselor from the list
4. Click stars to rate (1-5 stars)
5. Optionally write feedback in the comment box
6. Click "Submit Review" button
7. Get instant feedback confirmation
8. Can update the review anytime or review another counselor

### Flow for Admins:
1. Go to Admin Dashboard
2. Click "Counselor Reviews" tab
3. View all reviews from all students
4. See student names, ratings, and comments
5. Monitor counselor performance through student feedback

## Database Structure

A new `counselor_reviews` table was created with:
- Student who submitted review
- Counselor being reviewed
- Star rating (1-5)
- Optional comment text
- Timestamps for when submitted/updated

**Important:** Each student can only have ONE review per counselor. If they update it, the previous review is replaced.

## API Endpoints Created

### For Students:
- `GET /api/v1/reviews/counselors` → Get all counselors with ratings
- `POST /api/v1/reviews/store` → Submit or update a review
- `GET /api/v1/reviews/counselor/{counselorId}` → Get student's existing review

### For Admins:
- `GET /api/v1/admin/reviews` → Get all reviews from all students

## Design Features

✨ **Modern UI:**
- Star rating selector with hover effects
- Counselor cards showing current ratings
- Color-coded feedback messages
- Responsive design (works on mobile, tablet, desktop)
- Dark mode support

📱 **Responsive:**
- Desktop: 2-column layout (counselors + form)
- Mobile: Stacked layout for easy access

🎨 **Color Scheme:**
- Green gradient theme matching the MSU Bongabong branding
- Yellow stars for ratings
- Clear success/error feedback

## Example Review Flow

**Student sees:**
```
┌─────────────────────────────────────┐
│ Counselor Reviews                   │
│                                     │
│ SELECT A COUNSELOR    │ RATE & REVIEW│
│                       │             │
│ □ Mrs. Alice Johnson  │ ⭐⭐⭐⭐⭐    │
│   ⭐⭐⭐⭐ (4.5)      │ 5/5 stars  │
│   (12 reviews)        │             │
│                       │ Your feedback:│
│ □ Mr. Bob Santos      │ [text area]  │
│   ⭐⭐⭐ (3.2)        │             │
│   (8 reviews)         │ [Submit]     │
│                       │             │
└─────────────────────────────────────┘
```

**Admin sees:**
```
COUNSELOR REVIEWS

⭐⭐⭐⭐⭐ Mrs. Alice Johnson
  5/5 stars
  By: Juan Dela Cruz (juan@example.com)
  "Very helpful and supportive counselor!"
  Submitted: Nov 24, 2025

⭐⭐⭐ Mr. Bob Santos
  3/5 stars
  By: Maria Santos (maria@example.com)
  "Good, but could be more available"
  Submitted: Nov 23, 2025
```

## Technical Details

**Backend Technologies:**
- Laravel with Sanctum authentication
- Eloquent ORM for database relationships
- Role-based access control

**Frontend Technologies:**
- React with hooks
- Lucide React for icons
- Tailwind CSS for styling

**Database:**
- MySQL/MariaDB table with proper constraints
- Unique constraint to prevent duplicate reviews
- Foreign keys for data integrity

## Testing Instructions

1. **As a Student:**
   - Log in with student account
   - Navigate to Counselor Reviews tab
   - Select a counselor
   - Rate them and add feedback
   - Click Submit
   - Return to see the confirmation

2. **As an Admin:**
   - Log in with admin account
   - Go to Counselor Reviews tab
   - View all submitted reviews
   - See student names and ratings

## Files Modified/Created

### Created:
- `CounselorReviewsForm.jsx` - Student review component
- `ReviewController.php` - Backend logic
- `CounselorReview.php` - Database model
- Migration file for counselor_reviews table

### Modified:
- `StudentDashboard.jsx` - Added Counselor Reviews tab
- `AdminDashboard.jsx` - Added Counselor Reviews section
- `api_v1.php` - Added review routes

## Status

✅ **Complete and Ready to Use!**

All components are implemented and tested. The system is fully functional for:
- Students to submit and update reviews
- Admins to view all reviews
- Database to store reviews securely
- API endpoints to handle all operations
