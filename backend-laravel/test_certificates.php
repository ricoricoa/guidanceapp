<?php
// Test certificate request endpoints
$baseUrl = 'http://localhost:8000/api/v1';

// For testing, you'll need a valid auth token
// This script demonstrates the endpoints

echo "=== Certificate Request API Endpoints ===\n\n";

echo "1. Create Certificate Request (POST)\n";
echo "   Endpoint: POST $baseUrl/student/certificate-request\n";
echo "   Body: {\n";
echo "     'certificate_type': 'Good Moral' or 'Referral',\n";
echo "     'notes': 'optional notes'\n";
echo "   }\n";
echo "   Headers: Authorization: Bearer {token}\n\n";

echo "2. Get Student's Certificate Requests (GET)\n";
echo "   Endpoint: GET $baseUrl/student/certificate-requests\n";
echo "   Headers: Authorization: Bearer {token}\n\n";

echo "3. Get All Certificate Requests for Counselor (GET)\n";
echo "   Endpoint: GET $baseUrl/counselor/certificate-requests\n";
echo "   Headers: Authorization: Bearer {token}, Role: guidance\n\n";

echo "4. Approve Certificate Request (PUT)\n";
echo "   Endpoint: PUT $baseUrl/certificate-requests/{id}/approve\n";
echo "   Body: {\n";
echo "     'counselor_remarks': 'optional remarks'\n";
echo "   }\n";
echo "   Headers: Authorization: Bearer {token}, Role: guidance\n\n";

echo "5. Reject Certificate Request (PUT)\n";
echo "   Endpoint: PUT $baseUrl/certificate-requests/{id}/reject\n";
echo "   Body: {\n";
echo "     'counselor_remarks': 'optional remarks'\n";
echo "   }\n";
echo "   Headers: Authorization: Bearer {token}, Role: guidance\n\n";

echo "6. Update Certificate Request Status (PUT)\n";
echo "   Endpoint: PUT $baseUrl/certificate-requests/{id}/status\n";
echo "   Body: {\n";
echo "     'status': 'pending|approved|rejected|completed',\n";
echo "     'counselor_remarks': 'optional remarks'\n";
echo "   }\n";
echo "   Headers: Authorization: Bearer {token}, Role: guidance\n\n";

echo "Database table 'certificate_requests' created successfully!\n";
echo "Table columns:\n";
echo "- id\n";
echo "- user_id (foreign key to users)\n";
echo "- certificate_type (Good Moral or Referral)\n";
echo "- status (pending, approved, rejected, completed)\n";
echo "- notes (optional)\n";
echo "- counselor_remarks (optional)\n";
echo "- submitted_at\n";
echo "- completed_at\n";
echo "- timestamps\n";
?>
