-- ============================================
-- LIBRARY VISITOR MANAGEMENT SYSTEM
-- MySQL Database Schema
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS library_management;
USE library_management;

-- ============================================
-- Table: members
-- Stores registered library members
-- ============================================
CREATE TABLE members (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    member_id VARCHAR(50) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    tipe_keanggotaan VARCHAR(100) NOT NULL,
    jurusan VARCHAR(255),
    no_telepon VARCHAR(20),
    email VARCHAR(255),
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_member_id (member_id),
    INDEX idx_nama (nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: check_ins
-- Stores visitor check-in records
-- ============================================
CREATE TABLE check_ins (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    member_id VARCHAR(50),
    nama VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL COMMENT 'anggota, non-anggota, rombongan',
    tipe_keanggotaan VARCHAR(100),
    jurusan VARCHAR(255),
    no_telepon VARCHAR(20),
    alamat TEXT,
    tujuan_kunjungan TEXT COMMENT 'Purpose of visit',
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_date (date),
    INDEX idx_member_id (member_id),
    INDEX idx_type (type),
    INDEX idx_nama (nama)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: thesis_attendance
-- Stores thesis/dissertation student attendance
-- ============================================
CREATE TABLE thesis_attendance (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(255) NOT NULL,
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_student_id (student_id),
    INDEX idx_date (date),
    INDEX idx_student_name (student_name),
    UNIQUE KEY unique_student_date (student_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: settings
-- Stores library configuration and settings
-- ============================================
CREATE TABLE settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    library_name VARCHAR(255) NOT NULL DEFAULT 'Perpustakaan STTRI',
    footer_text TEXT,
    header_image_url TEXT,
    footer_image_url TEXT,
    header_height INT DEFAULT 50,
    footer_height INT DEFAULT 50,
    header_margin_top INT DEFAULT 15,
    admin_username VARCHAR(100) NOT NULL DEFAULT 'Admin',
    admin_password VARCHAR(255) NOT NULL DEFAULT 'admin123',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO settings (library_name, footer_text, admin_username, admin_password)
VALUES ('Perpustakaan STTRI', 'Powered by INLISLite Perpusnas', 'Admin', 'admin123');

-- ============================================
-- Sample Data (Optional - for testing)
-- ============================================

-- Sample Members
INSERT INTO members (member_id, nama, tipe_keanggotaan, jurusan, no_telepon, email, alamat) VALUES
('M001', 'Ahmad Fauzi', 'Mahasiswa', 'Teknik Informatika', '081234567890', 'ahmad@example.com', 'Jakarta Selatan'),
('M002', 'Siti Nurhaliza', 'Dosen', 'Manajemen', '082345678901', 'siti@example.com', 'Jakarta Timur'),
('M003', 'Budi Santoso', 'Staff', 'Administrasi', '083456789012', 'budi@example.com', 'Jakarta Barat');

-- Sample Check-ins
INSERT INTO check_ins (member_id, nama, type, tipe_keanggotaan, jurusan, no_telepon, alamat, tujuan_kunjungan, date) VALUES
('M001', 'Ahmad Fauzi', 'anggota', 'Mahasiswa', 'Teknik Informatika', '081234567890', 'Jakarta Selatan', 'Meminjam buku referensi', CURDATE()),
(NULL, 'Dewi Kartika', 'non-anggota', 'Pegawai Swasta', NULL, '085678901234', 'Bogor', 'Membaca di tempat', CURDATE()),
(NULL, 'Rombongan SMA Nusantara', 'rombongan', NULL, NULL, '087890123456', 'Depok', 'Kunjungan edukasi', CURDATE());

-- Sample Thesis Attendance
INSERT INTO thesis_attendance (student_id, student_name, check_in_time, date) VALUES
('2021001', 'Andi Pratama', NOW(), CURDATE()),
('2021002', 'Lisa Permata', NOW(), CURDATE()),
('2021003', 'Ricky Hakim', NOW(), CURDATE());

-- ============================================
-- Useful Queries
-- ============================================

-- Get today's visitors
-- SELECT * FROM check_ins WHERE date = CURDATE() ORDER BY check_in_time DESC;

-- Get monthly statistics
-- SELECT DATE_FORMAT(date, '%Y-%m') as month, COUNT(*) as total_visitors
-- FROM check_ins 
-- GROUP BY month 
-- ORDER BY month DESC;

-- Get visitor count by type
-- SELECT type, COUNT(*) as count FROM check_ins GROUP BY type;

-- Get thesis attendance for today
-- SELECT * FROM thesis_attendance WHERE date = CURDATE() ORDER BY check_in_time DESC;

-- Calculate total hours for thesis students
-- SELECT student_id, student_name, 
--        TIMESTAMPDIFF(HOUR, check_in_time, check_out_time) as hours_spent
-- FROM thesis_attendance 
-- WHERE check_out_time IS NOT NULL 
-- ORDER BY date DESC;
