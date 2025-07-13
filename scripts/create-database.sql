-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name VARCHAR(255) NOT NULL,
    program VARCHAR(255) NOT NULL,
    completion_date DATE NOT NULL,
    verification_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on verification_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code 
ON certificates(verification_code);

-- Create index on student_name for search functionality
CREATE INDEX IF NOT EXISTS idx_certificates_student_name 
ON certificates(student_name);

-- Create users table (without password_hash since we use Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email 
ON users(email);

-- Create programs table for dynamic program management
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial programs
INSERT INTO programs (name, description, is_active) VALUES
('Smart Contract Training (Lisk)', 'Comprehensive blockchain development course sponsored by Lisk', true),
('Future Program 1', 'Advanced DeFi protocols and strategies', false),
('Future Program 2', 'NFT development and marketplace creation', false)
ON CONFLICT (name) DO NOTHING;

-- Insert initial admin user (without password_hash)
INSERT INTO users (email, display_name, phone, role)
VALUES ('admin@example.com', 'Admin User', '+1234567890', 'admin')
ON CONFLICT (email) DO NOTHING;
