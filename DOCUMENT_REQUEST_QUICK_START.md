# Document Request System - Quick Start & Testing Guide

## 🚀 Quick Start

The document request system has been fully implemented and is ready to use. Here's how to test it:

---

## 1. Testing Document Request Submission (Student Side)

### 📋 How to Submit a Request:

1. **Login as Student**
   - Email: `student@example.com`
   - Password: `password`

2. **Navigate to Student Dashboard**
   - Go to left sidebar
   - Click "Requests" tab

3. **Submit New Document Request**
   - Click "New Request" button
   - Select Document Type:
     - Good Moral Certificate
     - Referral/Recommendation Letter
     - Certificate of Completion
   - Enter Purpose (optional): "For scholarship application"
   - Add Notes (optional): "Needed urgently"
   - Click "Submit Request"

4. **Verify Submission**
   - Request should appear in "My Requests" list
   - Status should be "Pending"
   - Remarks: "Awaiting processing"

---

## 2. Testing Request Approval (Counselor Side)

### 📋 How to View & Approve Requests:

1. **Login as Counselor**
   - Email: `alice@example.com` (or any guidance/counselor account)
   - Password: `password`

2. **Navigate to Counselor Dashboard**
   - Go to left sidebar
   - Click "Requests" tab

3. **View Pending Requests**
   - All student document requests should appear
   - Shows student name, document type, submitted date
   - Status badge shows "Pending"

4. **Approve a Request**
   - Click on the request card
   - Review student information and purpose
   - Click "Approve" button
   - (Optional) Add remarks: "Ready for pickup"
   - Request status changes to "Approved"

5. **Reject a Request** (Alternative)
   - Click on the request card
   - Click "Reject" button
   - **Required**: Add remarks explaining why: "Cannot process at this time"
   - Request status changes to "Rejected"
   - Student is notified of rejection

---

## 3. API Testing with cURL

### Test Login (Get Token):
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password"
  }'

# Response includes: { "data": { "token": "..." } }
# Save this token for other requests
```

### Test Submit Document Request:
```bash
curl -X POST http://localhost:8001/api/v1/documents \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "request_type": "good_moral",
    "purpose": "Scholarship application",
    "notes": "Urgent - applying tomorrow"
  }'
```

### Test Get Student's Requests:
```bash
curl -X GET http://localhost:8001/api/v1/documents \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

### Test Get All Requests (Counselor):
```bash
curl -X GET http://localhost:8001/api/v1/counselor/student-requests \
  -H "Authorization: Bearer YOUR_COUNSELOR_TOKEN"
```

### Test Approve Request:
```bash
curl -X PUT http://localhost:8001/api/v1/documents/1/approve \
  -H "Authorization: Bearer YOUR_COUNSELOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "remarks": "Ready for pickup at guidance office"
  }'
```

### Test Reject Request:
```bash
curl -X PUT http://localhost:8001/api/v1/documents/1/reject \
  -H "Authorization: Bearer YOUR_COUNSELOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "remarks": "Cannot issue at this time - incomplete records"
  }'
```

---

## 4. Document Type Reference

| Type | Value | Use Case |
|------|-------|----------|
| Good Moral Certificate | `good_moral` | Scholarships, job applications, transfers |
| Referral Letter | `referral` | Recommendations, scholarships, programs |
| Certificate of Completion | `certificate` | Official records, transfers, proof of attendance |

---

## 5. Request Status Flow

```
┌─────────────────────────────────────┐
│  Student Submits Request            │
│  Status: PENDING                    │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐       ┌─────────┐
   │APPROVED │       │REJECTED │
   └────┬────┘       └────┬────┘
        │                 │
        ▼                 ▼
   Student gets      Counselor sends
   notification      remarks to student
   with remarks      explaining reason
```

---

## 6. Frontend Features Implemented

### Student Dashboard:
- ✅ Document Requests tab
- ✅ New Request form with type selector
- ✅ List of submitted requests
- ✅ Status indicators (Pending, Approved, Rejected)
- ✅ Display submitted date, remarks, and purpose
- ✅ Real-time form validation
- ✅ Success/error messages

### Counselor Dashboard:
- ✅ Requests tab showing all student requests
- ✅ Student name and email displayed
- ✅ Filter by status
- ✅ Approve/Reject buttons
- ✅ Add remarks field
- ✅ Notification when request is processed

---

## 7. Success Criteria Checklist

- ✅ Students can submit document requests
- ✅ Counselors can view all pending requests
- ✅ Counselors can approve requests with remarks
- ✅ Counselors can reject requests with remarks
- ✅ Students see status updates on their requests
- ✅ All data properly stored in database
- ✅ Proper authentication & authorization
- ✅ Clean, responsive UI on both sides
- ✅ Real-time form validation
- ✅ Error handling with user-friendly messages

---

## 8. Database Records

### Current Test Data:

**Students:**
- student@example.com (ID: 5)
- juan@example.com (ID: ?)

**Counselors:**
- alice@example.com (ID: ?)
- bob@example.com (ID: ?)

### To Check Database:
```bash
# Via Laravel Tinker
cd backend-laravel
php artisan tinker

# Check requests
>>> DocumentRequest::all()
>>> DocumentRequest::where('status', 'pending')->get()

# Check users
>>> User::where('role', 'student')->get()
>>> User::where('role', 'guidance')->get()
```

---

## 9. Common Issues & Solutions

### Issue: 401 Unauthorized
- **Cause**: Token expired or invalid
- **Solution**: Re-login and use new token

### Issue: 403 Forbidden
- **Cause**: User role doesn't have permission
- **Solution**: Ensure student token for student endpoints, counselor token for counselor endpoints

### Issue: Request not appearing in list
- **Cause**: Page not refreshed after submission
- **Solution**: Refresh page or click "New Request" button again

### Issue: Approve button not working
- **Cause**: Missing remarks field (for some operations)
- **Solution**: Make sure remarks field has content

---

## 10. Performance Tips

- Document requests load instantly from API
- Real-time validation prevents invalid submissions
- Requests refresh automatically after approval
- No page reload necessary for most operations

---

## 11. Security Notes

- ✅ All endpoints require authentication
- ✅ Role-based access control enforced
- ✅ Students can only see their own requests
- ✅ Counselors can see all student requests
- ✅ Validation on both client and server side
- ✅ SQL injection prevention via ORM (Eloquent)
- ✅ CSRF protection enabled

---

## 12. Support & Debugging

### Enable Debug Mode:
```bash
# View Laravel logs
tail -f backend-laravel/storage/logs/laravel.log
```

### Check Database Connection:
```bash
# In Laravel Tinker
>>> DB::connection()->getPdo()
```

### Test API Endpoint:
```bash
# Check if route exists
php artisan route:list | grep documents
```

---

**🎉 The Document Request System is Ready!**

Start testing by logging in as a student and creating your first document request. Then switch to a counselor account to approve or reject it!

---

**Need Help?**
- Check DOCUMENT_REQUEST_SYSTEM.md for technical details
- Review API response formats in the documentation
- Check backend logs for errors: `tail -f storage/logs/laravel.log`
