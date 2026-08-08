<?php
/**
 * KutafutaTalent PHP Backend Configuration & Database Connection
 * cPanel / Shared Hosting Environment Compatible (MySQL PDO)
 */

// Global Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'kutafuta_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_CHARSET', 'utf8mb4');

define('JWT_SECRET', getenv('JWT_SECRET') ?: 'cinecraft_jwt_secret_key_2026');
define('ADMIN_MASTER_PASSCODE', getenv('ADMIN_PASSCODE') ?: 'admin123');
define('ADMIN_KEY_HEADER', 'cinecraft_admin_secret_key_2026');

// Google Gemini API Key (Server-Side Only - Hidden from Client)
define('GEMINI_API_KEY', getenv('GEMINI_API_KEY') ?: '');

/**
 * Get MySQL PDO Connection
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
        } catch (PDOException $e) {
            // Fallback for environment without live MySQL running during build testing
            $pdo = null;
        }
    }
    return $pdo;
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
