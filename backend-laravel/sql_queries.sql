-- Find user 'chaw' and update their role to 'counselor'
SELECT id, name, email, role FROM users WHERE name = 'chaw' OR email LIKE '%chaw%' LIMIT 5;

-- After confirming, update the role:
-- UPDATE users SET role = 'counselor' WHERE name = 'chaw';
