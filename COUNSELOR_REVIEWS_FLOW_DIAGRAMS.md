# Counselor Reviews - System Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          COUNSELOR REVIEWS SYSTEM                    │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                         STUDENT DASHBOARD                            │
│                                                                       │
│  Sidebar Menu:                                                        │
│  ├─ Overview                                                         │
│  ├─ Appointments                                                     │
│  ├─ Messages                                                         │
│  ├─ ⭐ Counselor Reviews ← NEW                                      │
│  ├─ Certificates                                                     │
│  └─ Profile                                                          │
│                                                                       │
│  When "Counselor Reviews" clicked:                                   │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │         COUNSELOR REVIEWS FORM (CounselorReviewsForm.jsx)      │ │
│  │                                                                │ │
│  │  ┌──────────────────┐    ┌──────────────────────────────────┐ │ │
│  │  │ SELECT COUNSELOR │    │     RATE & WRITE FEEDBACK        │ │ │
│  │  │                  │    │                                  │ │ │
│  │  │ □ Mrs. Johnson   │    │ Mrs. Johnson                     │ │ │
│  │  │  ⭐⭐⭐⭐ (4.5)  │    │                                  │ │ │
│  │  │  (12 reviews)    │    │ Rating: ⭐⭐⭐⭐⭐ (5 stars)    │ │ │
│  │  │                  │    │                                  │ │ │
│  │  │ □ Mr. Santos     │    │ Your Feedback:                   │ │ │
│  │  │  ⭐⭐⭐ (3.2)    │    │ [Very helpful counselor...     ] │ │ │
│  │  │  (8 reviews)     │    │ [Character count: 45/1000      ] │ │ │
│  │  │                  │    │                                  │ │ │
│  │  └──────────────────┘    │ [Submit Review] [Cancel]         │ │ │
│  │                          └──────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                  ↓
                     POST /api/v1/reviews/store
                                  ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         BACKEND API LAYER                            │
│                                                                       │
│  ReviewController.php                                                │
│  ├─ getCounselors()           → GET /api/v1/reviews/counselors      │
│  ├─ storeReview()             → POST /api/v1/reviews/store          │
│  ├─ getStudentReview()        → GET /api/v1/reviews/counselor/{id}  │
│  ├─ getCounselorReviews()     → [Internal use]                      │
│  └─ getAllReviews()           → GET /api/v1/admin/reviews           │
│                                                                       │
│  Validation:                                                         │
│  ├─ Only students can submit (role check)                           │
│  ├─ counselor_id must exist                                         │
│  ├─ rating must be 1-5                                              │
│  ├─ comment max 1000 chars                                          │
│  └─ unique (student_id, counselor_id)                               │
└──────────────────────────────────────────────────────────────────────┘
                                  ↓
┌──────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                               │
│                                                                       │
│  Table: counselor_reviews                                            │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ id | student_id | counselor_id | rating | comment | ts     │    │
│  ├─────────────────────────────────────────────────────────────┤    │
│  │ 1  │ 3          │ 2            │ 5      │ "Great" │ 2025... │    │
│  │ 2  │ 4          │ 2            │ 4      │ NULL    │ 2025... │    │
│  │ 3  │ 5          │ 3            │ 3      │ "Good"  │ 2025... │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  Relationships:                                                      │
│  ├─ counselor_reviews.student_id → users.id (FK)                    │
│  ├─ counselor_reviews.counselor_id → users.id (FK)                  │
│  └─ Constraint: UNIQUE(student_id, counselor_id)                    │
└──────────────────────────────────────────────────────────────────────┘
                                  ↓
                    GET /api/v1/admin/reviews
                                  ↓
┌──────────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                                 │
│                                                                       │
│  Sidebar Menu:                                                        │
│  ├─ Dashboard                                                        │
│  ├─ All Users                                                        │
│  ├─ Counselors                                                       │
│  ├─ Students                                                         │
│  ├─ Login History                                                    │
│  ├─ ⭐ Counselor Reviews ← NEW                                      │
│  └─ Reports                                                          │
│                                                                       │
│  Counselor Reviews Tab Content:                                      │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    ALL COUNSELOR REVIEWS                       │ │
│  │                                                                │ │
│  │  ⭐⭐⭐⭐⭐ Mrs. Johnson                                    │ │
│  │  5/5 stars                                                     │ │
│  │  By: Juan Dela Cruz (juan@example.com)                         │ │
│  │  "Very helpful and supportive counselor!"                      │ │
│  │  Submitted: Nov 24, 2025 at 10:30 AM                           │ │
│  │  ─────────────────────────────────────────────────────────     │ │
│  │                                                                │ │
│  │  ⭐⭐⭐ Mr. Santos                                         │ │
│  │  3/5 stars                                                     │ │
│  │  By: Maria Santos (maria@example.com)                          │ │
│  │  "Good, but could be more available"                           │ │
│  │  Submitted: Nov 23, 2025 at 2:15 PM                            │ │
│  │  ─────────────────────────────────────────────────────────     │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## User Flow Diagram - Student Perspective

```
┌─────────────────┐
│ Student Login   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Student Dashboard           │
│ [See Counselor Reviews]     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Click Reviews Button        │
│ (Star Icon)                 │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ CounselorReviewsForm Loads                      │
│ API: GET /reviews/counselors                    │
│ ✓ Fetches all counselors from database          │
│ ✓ Shows average rating for each counselor       │
│ ✓ Shows count of reviews                        │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Student Selects Counselor                       │
│ API: GET /reviews/counselor/{counselorId}       │
│ ✓ Checks if student already reviewed this one   │
│ ✓ Pre-fills rating if existing review           │
│ ✓ Pre-fills comment if existing review          │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Student Rates Counselor                         │
│ ✓ Selects 1-5 stars with hover preview          │
│ ✓ Display shows "You rated: X/5 stars"          │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Student Writes Feedback (Optional)              │
│ ✓ Text area with max 1000 chars                 │
│ ✓ Character counter shows current/max           │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Student Clicks Submit Button                    │
│ API: POST /reviews/store                        │
│                                                 │
│ Request Data:                                   │
│ {                                               │
│   counselor_id: 2,                              │
│   rating: 5,                                    │
│   comment: "Very helpful..."                    │
│ }                                               │
└────────┬────────────────────────────────────────┘
         │
         ▼
    Validation
    ✓ counselor_id exists?
    ✓ rating between 1-5?
    ✓ comment < 1000 chars?
    ✓ Is user a student?
         │
         ▼ (Success)
┌─────────────────────────────────────────────────┐
│ Insert/Update in Database                       │
│ ✓ New review: INSERT                            │
│ ✓ Update: UPDATE (upsert via unique constraint) │
└────────┬────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│ Success Message Displayed                       │
│ ✓ "Review submitted successfully!"              │
│ ✓ Form resets                                   │
│ ✓ Counselor list updates with new average      │
└─────────────────────────────────────────────────┘
```

## User Flow Diagram - Admin Perspective

```
┌──────────────┐
│ Admin Login  │
└─────┬────────┘
      │
      ▼
┌─────────────────────────────┐
│ Admin Dashboard             │
│ [See Counselor Reviews]     │
└─────┬───────────────────────┘
      │
      ▼
┌─────────────────────────────────┐
│ Click Counselor Reviews Tab     │
│ (Star Icon in Sidebar)          │
└─────┬───────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────────────┐
│ ReviewsTab Content Loads                              │
│ API: GET /api/v1/admin/reviews                        │
│                                                       │
│ Returns all reviews with:                             │
│ ✓ Student name & email                               │
│ ✓ Counselor name & email                             │
│ ✓ Rating (1-5)                                       │
│ ✓ Comment (if provided)                              │
│ ✓ Submission timestamp                               │
└─────┬───────────────────────────────────────────────┘
      │
      ▼
┌───────────────────────────────────────────────────────┐
│ All Reviews Displayed in List Format                  │
│                                                       │
│ Each Review Shows:                                    │
│ ├─ Counselor Name with Star Rating                   │
│ ├─ X/5 rating number                                 │
│ ├─ "By: Student Name (email)"                        │
│ ├─ Review comment in styled box                      │
│ └─ Submission date & time                            │
│                                                       │
│ Empty State: If no reviews                           │
│ "No reviews yet"                                      │
└───────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
STUDENT                    FRONTEND                BACKEND              DATABASE
  │                           │                        │                   │
  │ Click Reviews             │                        │                   │
  ├──────────────────────────>│                        │                   │
  │                           │ GET /reviews/counselors
  │                           ├───────────────────────>│                   │
  │                           │                        │ Query users       │
  │                           │                        │ WHERE role IN (...) ├─>
  │                           │                        │                   │
  │                           │<───────────────────────┤ Return counselors  <─┤
  │<──────────────────────────┤ (with avg rating)      │                   │
  │ [See counselor list]      │                        │                   │
  │                           │                        │                   │
  │ Select & Rate             │                        │                   │
  ├──────────────────────────>│                        │                   │
  │ (Click star + comment)    │ GET /reviews/           │                   │
  │                           │ counselor/{id}         │                   │
  │                           ├───────────────────────>│                   │
  │                           │                        │ SELECT from       │
  │                           │                        │ counselor_reviews <─>
  │                           │                        │ WHERE student_id  │
  │<──────────────────────────┤ [Return existing review]│ AND counselor_id   │
  │                           │                        │                   │
  │ Click Submit              │                        │                   │
  ├──────────────────────────>│                        │                   │
  │ {counselor_id, rating,    │ POST /reviews/store    │                   │
  │  comment}                 ├───────────────────────>│                   │
  │                           │                        │ Validate request  │
  │                           │                        │ - Check role      │
  │                           │                        │ - Validate rating │
  │                           │                        │ - Check counselor │
  │                           │                        │                   │
  │                           │                        │ INSERT/UPDATE     │
  │                           │                        │ counselor_reviews ├─>
  │                           │                        │ (upsert)          │
  │<──────────────────────────┤<───────────────────────┤ Success response   <─┤
  │ [Success message]         │                        │                   │
  └                           └────────────────────────┘                   └


ADMIN                      FRONTEND                BACKEND              DATABASE
  │                           │                        │                   │
  │ View Reviews              │                        │                   │
  ├──────────────────────────>│                        │                   │
  │                           │ GET /admin/reviews     │                   │
  │                           ├───────────────────────>│                   │
  │                           │                        │ SELECT * FROM     │
  │                           │                        │ counselor_reviews │
  │                           │                        │ JOIN users        │
  │                           │                        │ (student & ...    ├─>
  │                           │                        │ counselor info)   │
  │                           │<───────────────────────┤ All reviews+meta   <─┤
  │<──────────────────────────┤ [Return all reviews]   │                   │
  │ [Display reviews list]    │                        │                   │
  └                           └────────────────────────┘                   └
```

## State Machine - Review Status

```
                    ┌─────────────────────────┐
                    │   NO REVIEW EXISTS      │
                    │ (form shows empty)      │
                    └────────────┬────────────┘
                                 │
                      [Student submits]
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   REVIEW EXISTS         │
                    │ (form pre-filled)       │
                    └────────────┬────────────┘
                                 │
                      [Student updates]
                                 │
                                 ▼
                  ┌──────────────────────────┐
                  │  DATABASE UPDATED        │
                  │  (same record)           │
                  │  avg_rating recalculated │
                  └──────────────────────────┘

Unique constraint ensures one review per student per counselor
```

## Response Examples

### Student submits review:
```
REQUEST:
POST /api/v1/reviews/store
{
  "counselor_id": 2,
  "rating": 5,
  "comment": "Very helpful!"
}

RESPONSE:
{
  "data": {
    "id": 5,
    "student_id": 3,
    "counselor_id": 2,
    "rating": 5,
    "comment": "Very helpful!",
    "created_at": "2025-11-24T10:30:00Z",
    "updated_at": "2025-11-24T10:30:00Z"
  },
  "message": "Review submitted successfully",
  "status": 200
}
```

### Admin gets all reviews:
```
REQUEST:
GET /api/v1/admin/reviews

RESPONSE:
{
  "data": [
    {
      "id": 1,
      "student_name": "Juan Dela Cruz",
      "student_email": "juan@example.com",
      "counselor_name": "Mrs. Johnson",
      "counselor_email": "alice@msu.edu",
      "rating": 5,
      "comment": "Excellent!",
      "submitted_at": "2025-11-24T09:15:00Z",
      "updated_at": "2025-11-24T09:15:00Z"
    },
    ...
  ],
  "message": "All reviews retrieved successfully",
  "status": 200
}
```

---

**Complete System Flow - Ready to Use! ✅**
