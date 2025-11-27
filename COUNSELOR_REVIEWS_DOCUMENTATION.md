# Counselor Reviews Feature Implementation

## Overview
A complete counselor reviews system has been implemented allowing students to rate and review counselors, with all reviews visible to administrators on the admin dashboard.

## Backend Implementation

### 1. Database Migration
**File:** `database/migrations/2025_11_24_create_counselor_reviews_table.php`

Creates the `counselor_reviews` table with:
- `id` - Primary key
- `student_id` - Foreign key to users table
- `counselor_id` - Foreign key to users table
- `rating` - Integer 1-5 star rating
- `comment` - Optional text feedback (up to 1000 characters)
- `timestamps` - created_at and updated_at
- Unique constraint on (student_id, counselor_id) to prevent duplicate reviews

### 2. Model
**File:** `app/Models/CounselorReview.php`

Eloquent model with relationships:
- `student()` - Belongs to User model
- `counselor()` - Belongs to User model
- Mass assignable fields: student_id, counselor_id, rating, comment

### 3. Controller
**File:** `app/Http/Controllers/Api/V1/ReviewController.php`

Methods:
- **getCounselors()** - Get all counselors with average rating and review count
- **storeReview()** - Submit or update a review (authenticated students only)
- **getAllReviews()** - Get all reviews with full details (admin only)
- **getCounselorReviews($id)** - Get reviews for specific counselor
- **getStudentReview($counselorId)** - Get student's review for a counselor

### 4. API Routes
**File:** `routes/api_v1.php`

Student routes (auth:sanctum, role:student):
```
GET    /api/v1/reviews/counselors
POST   /api/v1/reviews/store
GET    /api/v1/reviews/counselor/{counselorId}
```

Admin routes (auth:sanctum, role:admin):
```
GET    /api/v1/admin/reviews
```

## Frontend Implementation

### 1. Counselor Reviews Form Component
**File:** `src/components/CounselorReviewsForm.jsx`

Features:
- Displays all counselors from database in a scrollable list
- Shows current average rating and review count for each counselor
- Star rating selector (1-5 stars with hover preview)
- Text area for optional feedback (max 1000 characters)
- Support for updating existing reviews
- Success/error message feedback
- Responsive design for mobile and desktop
- Dark mode support

UI Elements:
- Left panel: Counselor selection with ratings display
- Right panel: Review form with star rating and comment input
- Submit button that changes text based on new/update action

### 2. Student Dashboard Updates
**File:** `src/pages/StudentDashboard.jsx`

Changes:
- Added `Star` icon import from lucide-react
- Imported `CounselorReviewsForm` component
- Added new sidebar menu item: "Counselor Reviews" with Star icon
- Added conditional rendering for reviews tab
- Tab ID: `reviews`

### 3. Admin Dashboard Updates
**File:** `src/pages/AdminDashboard.jsx`

Changes:
- Added `Star` icon import
- Added reviews state management
- Added reviews fetch in useEffect from `/api/v1/admin/reviews`
- Added "Counselor Reviews" sidebar menu item with Star icon
- Added reviews tab content showing:
  - All submitted reviews with student and counselor names
  - Star rating display (1-5)
  - Review comments in styled containers
  - Submission timestamps
  - Empty state message when no reviews exist

## User Flow

### Student Perspective
1. Login to student dashboard
2. Click "Counselor Reviews" in sidebar
3. Select a counselor from the left panel
4. See counselor info (name, bio) and average rating
5. Click on stars to rate (1-5)
6. Optionally add feedback comment
7. Click "Submit Review" or "Update Review" button
8. Receive success confirmation
9. Can switch to another counselor and repeat

### Admin Perspective
1. Login to admin dashboard
2. Click "Counselor Reviews" in sidebar
3. View all reviews submitted by students
4. See:
   - Counselor being reviewed
   - Star rating with visual indicators
   - Student who submitted the review
   - Review comment (if provided)
   - Submission timestamp

## Database Schema

```sql
CREATE TABLE counselor_reviews (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT UNSIGNED NOT NULL,
  counselor_id BIGINT UNSIGNED NOT NULL,
  rating INT UNSIGNED NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE KEY unique_student_counselor (student_id, counselor_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (counselor_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Validation Rules

### Store Review Endpoint
- `counselor_id` - Required, must exist in users table
- `rating` - Required, integer between 1-5
- `comment` - Optional, max 1000 characters
- Only students can submit reviews (role validation)
- Counselor must have role 'guidance' or 'counselor'

## Key Features

✅ Students can rate counselors 1-5 stars
✅ Optional text feedback for each review
✅ Update existing reviews (upsert functionality)
✅ View all counselors with their ratings
✅ Prevent duplicate reviews (one per student per counselor)
✅ Admin dashboard displays all reviews
✅ Timestamps for each review
✅ Responsive design
✅ Dark mode support
✅ Success/error feedback messages
✅ Empty states handled gracefully

## Files Created/Modified

### Created:
- `backend-laravel/database/migrations/2025_11_24_create_counselor_reviews_table.php`
- `backend-laravel/app/Models/CounselorReview.php`
- `backend-laravel/app/Http/Controllers/Api/V1/ReviewController.php`
- `frontend-react/src/components/CounselorReviewsForm.jsx`
- `test_reviews_api.php`

### Modified:
- `backend-laravel/routes/api_v1.php` - Added review routes
- `frontend-react/src/pages/StudentDashboard.jsx` - Added sidebar item and tab
- `frontend-react/src/pages/AdminDashboard.jsx` - Added review management

## Installation Instructions

1. The migration has been run automatically
2. Restart your Laravel development server (if running)
3. The React components are ready to use
4. Test by:
   - Logging in as a student
   - Going to Counselor Reviews tab
   - Selecting a counselor and submitting a review
   - Logging in as admin
   - Going to Counselor Reviews tab to see all reviews

## Future Enhancements

Possible improvements:
- Add filtering/sorting by rating
- Add search for counselor names
- Display average rating statistics
- Add pagination for large review lists
- Email notifications to counselors of new reviews
- Ability for counselors to respond to reviews
- Flagging inappropriate reviews
- Review moderation by admin
