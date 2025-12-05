<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Reset Your Password</h2>
        
        <p>You are receiving this email because we received a password reset request for your account.</p>
        
        <div style="margin: 30px 0;">
            <a href="{{ $resetLink }}" style="display: inline-block; background-color: #2d3748; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                Reset Password
            </a>
        </div>
        
        <p style="color: #666;">This password reset link will expire in 60 minutes.</p>
        
        <p style="color: #666;">If you did not request a password reset, no further action is required.</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px;">
            If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
        </p>
        <p style="color: #2d3748; word-break: break-all; font-size: 12px;">
            <a href="{{ $resetLink }}" style="color: #3869d4;">{{ $resetLink }}</a>
        </p>
        
        <p style="color: #666;">Thanks,<br>{{ config('app.name') }}</p>
    </div>
</body>
</html>
