<?php
/**
 * KutafutaTalent PHP Backend Configuration & Database Connection
 * cPanel / Shared Hosting Environment Compatible (MySQL PDO)
 */

// Global Configuration — Bluehost cPanel MySQL Credentials
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'xpbvymmy_Kutafutatalent');
define('DB_USER', getenv('DB_USER') ?: 'xpbvymmy_dbuser');
define('DB_PASS', getenv('DB_PASS') ?: 'Proton@kutafuta2026');
define('DB_CHARSET', 'utf8mb4');

define('JWT_SECRET', getenv('JWT_SECRET') ?: 'cinecraft_jwt_secret_key_2026');
define('ADMIN_MASTER_PASSCODE', getenv('ADMIN_PASSCODE') ?: 'admin123');
define('ADMIN_KEY_HEADER', 'cinecraft_admin_secret_key_2026');

// Google Gemini API Key (Server-Side Only - Hidden from Client)
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');

/**
 * Get MySQL PDO Connection — with auto table creation on first connect
 */
function getPDOConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            // Auto-create tables on first connection
            initializeDatabase($pdo);
        } catch (PDOException $e) {
            // Fallback for environment without live MySQL
            $pdo = null;
        }
    }
    return $pdo;
}

/**
 * Auto-create all tables and seed initial data if empty
 */
function initializeDatabase(PDO $db) {
    // Create tables if not exist
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role ENUM('talent','client','admin') NOT NULL DEFAULT 'talent',
            full_name VARCHAR(255) NOT NULL,
            avatar_url TEXT NULL,
            phone_number VARCHAR(50) NULL,
            city_country VARCHAR(255) NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS talent_profiles (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            avatar_url TEXT NULL,
            tagline VARCHAR(512) NULL,
            bio TEXT NULL,
            category VARCHAR(100) NOT NULL DEFAULT 'cinematography',
            location VARCHAR(255) NOT NULL DEFAULT 'Los Angeles, CA',
            years_experience INT DEFAULT 0,
            union_status VARCHAR(50) DEFAULT 'non_union',
            hourly_rate DECIMAL(10,2) DEFAULT 0.00,
            day_rate DECIMAL(10,2) NOT NULL DEFAULT 500.00,
            equipment_list TEXT NULL,
            is_available TINYINT(1) DEFAULT 1,
            rating DECIMAL(3,2) DEFAULT 5.00,
            review_count INT DEFAULT 0,
            featured TINYINT(1) DEFAULT 0,
            stage_name VARCHAR(255) NULL,
            primary_department VARCHAR(100) NULL,
            profile_type VARCHAR(50) DEFAULT 'crew',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS client_profiles (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL UNIQUE,
            company_name VARCHAR(255) NOT NULL,
            company_type VARCHAR(100) NULL,
            website TEXT NULL,
            bio TEXT NULL,
            location VARCHAR(255) NULL,
            verified TINYINT(1) DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS job_listings (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            client_id VARCHAR(64) NOT NULL,
            client_name VARCHAR(255) NULL,
            title VARCHAR(512) NOT NULL,
            department VARCHAR(100) NOT NULL,
            project_type VARCHAR(100) NOT NULL,
            location VARCHAR(255) NOT NULL,
            budget_min DECIMAL(10,2) NOT NULL DEFAULT 0,
            budget_max DECIMAL(10,2) NOT NULL DEFAULT 0,
            description TEXT NOT NULL,
            status ENUM('open','in_review','filled','closed') DEFAULT 'open',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS job_applications (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            job_id VARCHAR(64) NOT NULL,
            talent_id VARCHAR(64) NOT NULL,
            talent_name VARCHAR(255) NULL,
            cover_letter TEXT,
            bid_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
            status ENUM('applied','under_review','shortlisted','interviewing','hired','rejected') DEFAULT 'applied',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS media_portfolios (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            talent_profile_id VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            media_type VARCHAR(64) DEFAULT 'showreel',
            file_url TEXT NOT NULL,
            thumbnail_url TEXT NULL,
            display_order INT DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS crew_calls (
            id VARCHAR(64) NOT NULL PRIMARY KEY,
            job_id VARCHAR(64) NOT NULL,
            client_id VARCHAR(64) NOT NULL,
            producer_name VARCHAR(255) NULL,
            call_title VARCHAR(512) NULL,
            department VARCHAR(100) NULL,
            project_type VARCHAR(100) NULL,
            crew_positions_needed INT DEFAULT 1,
            budget_range VARCHAR(255) NULL,
            location VARCHAR(255) NULL,
            shoot_dates VARCHAR(255) NULL,
            status VARCHAR(50) DEFAULT 'active',
            call_sheet_notes TEXT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Seed default data only if users table is empty
    $count = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    if ($count === 0) {
        $hash = password_hash('cinecraft2026', PASSWORD_BCRYPT);
        $adminHash = password_hash('admin123', PASSWORD_BCRYPT);
        $db->exec("INSERT IGNORE INTO users (id,email,password_hash,role,full_name,avatar_url,phone_number,created_at) VALUES
            ('user-t1','elena.rostova@cinema.io','$hash','talent','Elena Rostova','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800','+1 (310) 555-0192','2025-01-10'),
            ('user-t2','marcus.vance@soundworks.com','$hash','talent','Marcus Vance','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800','+1 (212) 555-0144','2025-01-15'),
            ('user-t3','sora.takahashi@postvfx.io','$hash','talent','Sora Takahashi','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800','+1 (415) 555-0188','2025-02-01'),
            ('user-t4','chloe.dupont@vfxvision.com','$hash','talent','Chloe Dupont','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800','+1 (323) 555-0811','2025-02-10'),
            ('user-c1','producer@apexmedia.com','$hash','client','Apex Media Studios','https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800','+1 (310) 555-9000','2025-01-05'),
            ('user-c2','creatives@luminaryagency.com','$hash','client','Luminary Ad Agency','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800','+1 (212) 555-4422','2025-01-08'),
            ('user-a1','admin@cinecraft.com','$adminHash','admin','Database Administrator','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800','+1 (800) 555-ADMIN','2025-01-01');");

        $db->exec("INSERT IGNORE INTO talent_profiles (id,user_id,full_name,avatar_url,category,tagline,bio,location,day_rate,hourly_rate,is_available,rating,featured,created_at) VALUES
            ('talent-1','user-t1','Elena Rostova','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800','cinematography','Award-winning Director of Photography & Steadicam Owner/Operator','10+ years of narrative and commercial cinematography across US & Europe.','Los Angeles, CA',1800,220,1,4.95,1,'2025-01-10'),
            ('talent-2','user-t2','Marcus Vance','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800','sound','Senior Location Sound Recordist & Boom Operator','Specializing in dialogue capture for feature films and commercials.','New York, NY',1400,180,1,4.88,0,'2025-01-15'),
            ('talent-3','user-t3','Sora Takahashi','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800','editing','Lead Film Editor & DaVinci Certified Colorist','Expert in offline edit through DI and color grading for narrative features.','San Francisco, CA',1600,200,1,4.92,1,'2025-02-01'),
            ('talent-4','user-t4','Chloe Dupont','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800','vfx','VFX Supervisor & 3D CG Artist','Houdini & Nuke specialist with credits on 20+ feature film VFX projects.','Los Angeles, CA',2000,250,1,4.97,1,'2025-02-10');");

        $db->exec("INSERT IGNORE INTO client_profiles (id,user_id,company_name,company_type,location,website,bio,verified,created_at) VALUES
            ('client-1','user-c1','Apex Media Studios','Production Company','Los Angeles, CA','https://apexmedia.com','High-end commercial & feature studio.',1,'2025-01-05'),
            ('client-2','user-c2','Luminary Ad Agency','Advertising Agency','New York, NY','https://luminaryagency.com','Global creative agency.',1,'2025-01-08');");
    }
}


/**
 * Output JSON Response and Exit
 */
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    exit;
}

/**
 * Get Decoded JSON Request Body
 */
function getJsonInput() {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Helper to generate simple token / hash
 */
function generateUuid() {
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
