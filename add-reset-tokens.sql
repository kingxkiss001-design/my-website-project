-- Task: Add password reset token columns to users table (ISMS-25)

ALTER TABLE users 
ADD COLUMN password_reset_token VARCHAR(255) DEFAULT NULL,
ADD COLUMN token_expires_at TIMESTAMP DEFAULT NULL;

-- Verification Query to double-check columns are present
SELECT id, username, email, password_reset_token, token_expires_at 
FROM users 
LIMIT 5;