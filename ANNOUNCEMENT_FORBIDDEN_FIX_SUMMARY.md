# Announcement "Forbidden" Error Fix

## Problem
Counselors were getting a 403 Forbidden error when trying to create announcements, even though they were authenticated.

## Root Cause
There was a role inconsistency in the system:
1. The test seeder (`DatabaseSeeder.php`) was creating counselor users with role `'guidance'` instead of `'counselor'`
2. The `AnnouncementController` was only checking for the role `'counselor'`, not `'guidance'`
3. Other parts of the system (routes with middleware) were accepting both `'counselor'` and `'guidance'` roles

## Solution
Made two changes to fix the issue:

### 1. Updated `database/seeders/DatabaseSeeder.php`
**Line 30**: Changed the test counselor's role from `'guidance'` to `'counselor'`
```php
// Before
'role' => 'guidance',

// After
'role' => 'counselor',
```

### 2. Updated `app/Http/Controllers/Api/V1/AnnouncementController.php`
Updated all role checks in the following methods to accept both roles:
- `create()` - Line 53
- `getCounselorAnnouncements()` - Line 104
- `update()` - Line 134
- `delete()` - Line 200

Changed from:
```php
if ($user->role !== 'counselor') {
```

To:
```php
if ($user->role !== 'counselor' && $user->role !== 'guidance') {
```

This makes the announcement controller consistent with other parts of the system that already support both roles.

## Testing Steps
1. Run database migrations and seeding:
```bash
php artisan migrate:refresh --seed
```

2. Login as the counselor (counselor@example.com / password)

3. Try creating a new announcement

## Result
Counselors should now be able to create announcements without receiving the Forbidden error.

## Additional Notes
- The system uses both `'counselor'` and `'guidance'` role names inconsistently across different seeders and middleware
- Consider standardizing on a single role name in the future (either `'counselor'` or `'guidance'`, not both)
- Other controllers may also need similar fixes if they have the same issue
