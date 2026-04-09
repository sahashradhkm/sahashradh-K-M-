-- =====================================================
-- Exercise 09 - Database Setup Script
-- Run this script in phpMyAdmin or MySQL command line
-- =====================================================



-- Create Submissions Table
CREATE TABLE IF NOT EXISTS `submissions` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `fullname` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `position` VARCHAR(50) NOT NULL,
  `skills` VARCHAR(255),
  `experience` VARCHAR(50),
  `notes` LONGTEXT,
  `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_submitted_at` (`submitted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: Show table structure (for verification)
-- DESCRIBE submissions;

-- Optional: View all records
-- SELECT * FROM submissions;
