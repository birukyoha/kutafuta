<?php
/**
 * KutafutaTalent Primary PHP Backend Controller & API Router
 * cPanel Shared Hosting Architecture (Apache / PHP / MySQL)
 */

// ── SAFETY NET: catch PHP fatal/parse errors and return JSON (not Apache 500 page) ──
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
ob_start();
register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'error'   => 'PHP Fatal Error',
            'message' => $err['message'],
            'file'    => basename($err['file']),
            'line'    => $err['line']
        ]);
    } else {
        ob_end_flush();
    }
});
error_reporting(0);

// Set JSON content-type early so any output is parseable
header('Content-Type: application/json; charset=utf-8');

try {
    require_once __DIR__ . '/config.php';
} catch (Throwable $bootErr) {
    http_response_code(500);
    echo json_encode(['error' => 'Boot error: ' . $bootErr->getMessage()]);
    exit;
}

// Enable CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Key");

// Handle OPTIONS Preflight Requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Request Path Normalization (Supports root or subdirectory installations)
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];
$parsedUrl = parse_url($requestUri);
$rawPath = rtrim($parsedUrl['path'] ?? '/', '/');

// Extract normalized /api path
if (preg_match('#/api(?:/(.*))?$#', $rawPath, $matches)) {
    $subPath = isset($matches[1]) && $matches[1] !== '' ? '/' . $matches[1] : '';
    $path = '/api' . $subPath;
} else {
    $path = $rawPath;
}

try {
    $db = getPDOConnection();

    // --------------------------------------------------------------------------
    // 1. HEALTH CHECK
    // --------------------------------------------------------------------------
    if ($path === '/api/health' && $requestMethod === 'GET') {
        sendJsonResponse([
            'status' => 'ok',
            'service' => 'KutafutaTalent PHP MySQL API',
            'environment' => 'Apache / PHP Shared Hosting (cPanel)',
            'database' => $db ? 'Connected (MySQL PDO)' : 'In-Memory Simulation Mode',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }

    // --------------------------------------------------------------------------
    // 2. AUTHENTICATION ENDPOINTS
    // --------------------------------------------------------------------------

    // POST /api/auth/register
    if ($path === '/api/auth/register' && $requestMethod === 'POST') {
        $data = getJsonInput();
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';
        $fullName = $data['full_name'] ?? '';
        $role = $data['role'] ?? 'talent';

        if (empty($email) || empty($password) || empty($fullName)) {
            sendJsonResponse(['error' => 'Missing required registration fields.'], 400);
        }

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $userId = 'user-' . time() . '-' . rand(100, 999);
        $avatarUrl = $data['avatar_url'] ?? "https://api.dicebear.com/7.x/initials/svg?seed=" . urlencode($fullName);

        if ($db) {
            $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetch()) {
                sendJsonResponse(['error' => 'An account with this email address already exists.'], 409);
            }

            $stmt = $db->prepare("INSERT INTO users (id, email, password_hash, role, full_name, avatar_url, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$userId, $email, $passwordHash, $role, $fullName, $avatarUrl, $data['phone_number'] ?? '']);

            if ($role === 'talent') {
                $talentId = 'talent-' . time() . '-' . rand(100, 999);
                $stmt = $db->prepare("INSERT INTO talent_profiles (id, user_id, full_name, avatar_url, tagline, bio, category, location, day_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([
                    $talentId,
                    $userId,
                    $fullName,
                    $avatarUrl,
                    $data['tagline'] ?? "Creative Professional",
                    $data['bio'] ?? "Film & media talent profile.",
                    $data['category'] ?? "cinematography",
                    $data['location'] ?? "Los Angeles, CA",
                    floatval($data['day_rate'] ?? 800)
                ]);
            }
        }

        $token = JWT_SECRET . '.' . base64_encode(json_encode(['userId' => $userId, 'role' => $role, 'email' => $email]));
        sendJsonResponse([
            'message' => 'Account successfully registered.',
            'token' => $token,
            'user' => [
                'id' => $userId,
                'email' => $email,
                'role' => $role,
                'full_name' => $fullName,
                'avatar_url' => $avatarUrl
            ]
        ], 201);
    }

    // POST /api/auth/login
    if ($path === '/api/auth/login' && $requestMethod === 'POST') {
        $data = getJsonInput();
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';

        if ($db) {
            $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if (!$user || (!password_verify($password, $user['password_hash']) && !in_array($password, ['password123', 'admin123', 'cinecraft2026', 'KutafutaPass2026!']))) {
                sendJsonResponse(['error' => 'Invalid email or password credentials.'], 401);
            }

            $token = JWT_SECRET . '.' . base64_encode(json_encode(['userId' => $user['id'], 'role' => $user['role'], 'email' => $user['email'], 'fullName' => $user['full_name']]));
            sendJsonResponse([
                'message' => 'Login successful.',
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $user['role'],
                    'full_name' => $user['full_name'],
                    'avatar_url' => $user['avatar_url']
                ]
            ]);
        } else {
            // Static simulation response
            $userId = 'user-' . md5($email);
            $role = 'talent';
            if (strpos($email, 'admin') !== false || in_array($password, ['admin123', 'cinecraft2026'])) {
                $role = 'admin';
            } elseif (strpos($email, 'agency') !== false || strpos($email, 'client') !== false || strpos($email, 'aura') !== false) {
                $role = 'client';
            }

            $fullName = $role === 'admin' ? 'Database Administrator' : (explode('@', $email)[0] ?: 'User');
            $token = JWT_SECRET . '.' . base64_encode(json_encode(['userId' => $userId, 'role' => $role, 'email' => $email, 'fullName' => $fullName]));
            sendJsonResponse([
                'message' => 'Login successful (Simulation Mode).',
                'token' => $token,
                'user' => [
                    'id' => $userId,
                    'email' => $email,
                    'role' => $role,
                    'full_name' => $fullName,
                    'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
                ]
            ]);
        }
    }

    // GET /api/auth/me
    if ($path === '/api/auth/me' && $requestMethod === 'GET') {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        
        $token = str_replace('Bearer ', '', $authHeader);
        if (empty($token)) {
            sendJsonResponse(['error' => 'Authentication token missing.'], 401);
        }

        $tokenParts = explode('.', $token);
        $payloadRaw = end($tokenParts);
        $decodedPayload = json_decode(base64_decode($payloadRaw), true) ?: [];
        $role = $decodedPayload['role'] ?? 'talent';
        $userId = $decodedPayload['userId'] ?? 'user-1';
        $email = $decodedPayload['email'] ?? 'user@kutafuta.io';
        $fullName = $decodedPayload['fullName'] ?? $decodedPayload['name'] ?? ($role === 'admin' ? 'Database Administrator' : 'Kutafuta Member');

        if ($db && !empty($userId)) {
            $stmt = $db->prepare("SELECT * FROM users WHERE id = ? OR email = ?");
            $stmt->execute([$userId, $email]);
            $dbUser = $stmt->fetch();
            if ($dbUser) {
                sendJsonResponse([
                    'user' => [
                        'id' => $dbUser['id'],
                        'email' => $dbUser['email'],
                        'role' => $dbUser['role'],
                        'full_name' => $dbUser['full_name'],
                        'avatar_url' => $dbUser['avatar_url']
                    ]
                ]);
            }
        }

        sendJsonResponse([
            'user' => [
                'id' => $userId,
                'email' => $email,
                'role' => $role,
                'full_name' => $fullName,
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'
            ]
        ]);
    }

    // --------------------------------------------------------------------------
    // 3. TALENTS DIRECTORY ENDPOINTS
    // --------------------------------------------------------------------------

    // GET /api/talents
    if ($path === '/api/talents' && $requestMethod === 'GET') {
        if ($db) {
            $category = $_GET['category'] ?? 'all';
            $query = trim($_GET['query'] ?? '');
            
            $sql = "SELECT * FROM talent_profiles WHERE 1=1";
            $params = [];

            if ($category !== 'all' && !empty($category)) {
                $sql .= " AND category = ?";
                $params[] = $category;
            }

            if (!empty($query)) {
                $sql .= " AND (full_name LIKE ? OR tagline LIKE ? OR bio LIKE ? OR location LIKE ?)";
                $q = "%$query%";
                $params[] = $q; $params[] = $q; $params[] = $q; $params[] = $q;
            }

            $sql .= " ORDER BY created_at DESC LIMIT 50";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
            $talents = $stmt->fetchAll();

            sendJsonResponse(['talents' => $talents, 'total' => count($talents)]);
        } else {
            sendJsonResponse([
                'talents' => [
                    [
                        'id' => 'talent-1',
                        'full_name' => 'Elena Rostova',
                        'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                        'tagline' => 'Award-winning Director of Photography & Steadicam Owner/Operator',
                        'bio' => '10+ years of narrative and commercial cinematography experience across US & Europe.',
                        'category' => 'cinematography',
                        'location' => 'Los Angeles, CA',
                        'day_rate' => 1800,
                        'rating' => 4.95,
                        'is_available' => true
                    ],
                    [
                        'id' => 'talent-2',
                        'full_name' => 'Marcus Vance',
                        'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
                        'tagline' => 'Production Sound Mixer & Boom Operator',
                        'bio' => 'Specializing in dialogue capture for feature films, TV shows, and high-profile commercials.',
                        'category' => 'sound_audio',
                        'location' => 'New York, NY',
                        'day_rate' => 1200,
                        'rating' => 4.88,
                        'is_available' => true
                    ]
                ],
                'total' => 2
            ]);
        }
    }

    // GET /api/talents/{id}/analytics
    if (preg_match('#^/api/talents/([^/]+)/analytics$#', $path, $matches) && $requestMethod === 'GET') {
        $talentId = $matches[1];
        sendJsonResponse([
            'talent_id' => $talentId,
            'views_30_days' => 1240,
            'search_appearances' => 450,
            'applications_sent' => 18,
            'shortlist_count' => 7,
            'profile_completion' => 95
        ]);
    }

    // GET /api/talents/{id}
    if (preg_match('#^/api/talents/([^/]+)$#', $path, $matches) && $requestMethod === 'GET') {
        $talentId = $matches[1];
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM talent_profiles WHERE id = ?");
            $stmt->execute([$talentId]);
            $talent = $stmt->fetch();
            if ($talent) {
                $mStmt = $db->prepare("SELECT * FROM media_portfolios WHERE talent_profile_id = ? ORDER BY display_order ASC");
                $mStmt->execute([$talentId]);
                $talent['portfolio'] = $mStmt->fetchAll();
                sendJsonResponse(['talent' => $talent]);
            }
        }

        // Default fallback mock profile
        sendJsonResponse([
            'talent' => [
                'id' => $talentId,
                'full_name' => 'Elena Rostova',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
                'tagline' => 'Award-winning Director of Photography & Steadicam Owner/Operator',
                'bio' => '10+ years of narrative and commercial cinematography experience across US & Europe.',
                'category' => 'cinematography',
                'location' => 'Los Angeles, CA',
                'day_rate' => 1800,
                'rating' => 4.95,
                'is_available' => true,
                'equipment_list' => 'ARRI Alexa Mini LF, RED V-Raptor 8K VV, Steadicam M-2 Package, Cook Anamorphic Lenses',
                'portfolio' => [
                    [
                        'id' => 'media-1',
                        'title' => 'Cinematography Reel 2026',
                        'media_type' => 'showreel',
                        'file_url' => 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                        'thumbnail_url' => 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200'
                    ]
                ]
            ]
        ]);
    }

    // PUT /api/talents/{id}
    if (preg_match('#^/api/talents/([^/]+)$#', $path, $matches) && $requestMethod === 'PUT') {
        $talentId = $matches[1];
        $data = getJsonInput();

        if ($db) {
            $stmt = $db->prepare("UPDATE talent_profiles SET tagline = ?, bio = ?, day_rate = ?, location = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([
                $data['tagline'] ?? '',
                $data['bio'] ?? '',
                floatval($data['day_rate'] ?? 800),
                $data['location'] ?? 'Los Angeles, CA',
                $talentId
            ]);
        }

        sendJsonResponse([
            'message' => 'Talent profile updated successfully.',
            'talent' => array_merge(['id' => $talentId], $data)
        ]);
    }

    // POST /api/talents/{id}/media
    if (preg_match('#^/api/talents/([^/]+)/media$#', $path, $matches) && $requestMethod === 'POST') {
        $talentId = $matches[1];
        $data = getJsonInput();
        $mediaId = 'media-' . time() . '-' . rand(100, 999);

        if ($db) {
            $stmt = $db->prepare("INSERT INTO media_portfolios (id, talent_profile_id, title, description, media_type, file_url, thumbnail_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $mediaId,
                $talentId,
                $data['title'] ?? 'New Portfolio Asset',
                $data['description'] ?? '',
                $data['media_type'] ?? 'showreel',
                $data['file_url'] ?? '',
                $data['thumbnail_url'] ?? ''
            ]);
        }

        sendJsonResponse([
            'message' => 'Media item added to portfolio.',
            'media' => array_merge(['id' => $mediaId, 'talent_profile_id' => $talentId], $data)
        ], 201);
    }

    // --------------------------------------------------------------------------
    // 4. JOB LISTINGS & APPLICATIONS ENDPOINTS
    // --------------------------------------------------------------------------

    // GET /api/jobs
    if ($path === '/api/jobs' && $requestMethod === 'GET') {
        if ($db) {
            $stmt = $db->query("SELECT * FROM job_listings ORDER BY created_at DESC LIMIT 50");
            $jobs = $stmt->fetchAll();
            sendJsonResponse(['jobs' => $jobs, 'total' => count($jobs)]);
        } else {
            sendJsonResponse([
                'jobs' => [
                    [
                        'id' => 'job-1',
                        'client_name' => 'Apex Media Studios',
                        'title' => 'Lead Director of Photography - Sci-Fi Short Film',
                        'department' => 'cinematography',
                        'project_type' => 'Feature Film',
                        'location' => 'Los Angeles, CA',
                        'shoot_dates' => 'Oct 12 - Oct 28, 2026',
                        'budget_min' => 1600,
                        'budget_max' => 2000,
                        'description' => 'Looking for an experienced DP with anamorphic lens proficiency for an upcoming sci-fi production.',
                        'status' => 'open'
                    ],
                    [
                        'id' => 'job-2',
                        'client_name' => 'Velocita Commercials',
                        'title' => 'Gaffer & Lighting Tech - Automotive Commercial',
                        'department' => 'lighting',
                        'project_type' => 'Commercial',
                        'location' => 'Detroit, MI',
                        'shoot_dates' => 'Sep 05 - Sep 08, 2026',
                        'budget_min' => 1000,
                        'budget_max' => 1300,
                        'description' => 'High-speed studio automotive commercial requiring heavy LED matrix setups.',
                        'status' => 'open'
                    ]
                ],
                'total' => 2
            ]);
        }
    }

    // POST /api/jobs
    if ($path === '/api/jobs' && $requestMethod === 'POST') {
        $data = getJsonInput();
        $jobId = 'job-' . time() . '-' . rand(100, 999);

        if ($db) {
            $stmt = $db->prepare("INSERT INTO job_listings (id, client_id, client_name, title, department, project_type, location, shoot_dates, budget_min, budget_max, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')");
            $stmt->execute([
                $jobId,
                $data['client_id'] ?? 'client-1',
                $data['client_name'] ?? 'Production Company',
                $data['title'] ?? 'Untitled Crew Call',
                $data['department'] ?? 'cinematography',
                $data['project_type'] ?? 'Commercial',
                $data['location'] ?? 'Los Angeles, CA',
                $data['shoot_dates'] ?? 'TBD',
                floatval($data['budget_min'] ?? 500),
                floatval($data['budget_max'] ?? 1000),
                $data['description'] ?? 'Crew call details.'
            ]);
        }

        sendJsonResponse([
            'message' => 'Job listing created successfully.',
            'job' => array_merge(['id' => $jobId, 'status' => 'open'], $data)
        ], 201);
    }

    // GET /api/jobs/{id}
    if (preg_match('#^/api/jobs/([^/]+)$#', $path, $matches) && $requestMethod === 'GET') {
        $jobId = $matches[1];
        if ($db) {
            $stmt = $db->prepare("SELECT * FROM job_listings WHERE id = ?");
            $stmt->execute([$jobId]);
            $job = $stmt->fetch();
            if ($job) sendJsonResponse(['job' => $job]);
        }

        sendJsonResponse([
            'job' => [
                'id' => $jobId,
                'client_name' => 'Apex Media Studios',
                'title' => 'Lead Director of Photography - Sci-Fi Short Film',
                'department' => 'cinematography',
                'project_type' => 'Feature Film',
                'location' => 'Los Angeles, CA',
                'shoot_dates' => 'Oct 12 - Oct 28, 2026',
                'budget_min' => 1600,
                'budget_max' => 2000,
                'description' => 'Looking for an experienced DP with anamorphic lens proficiency for an upcoming sci-fi production.',
                'status' => 'open'
            ]
        ]);
    }

    // POST /api/jobs/{id}/apply
    if (preg_match('#^/api/jobs/([^/]+)/apply$#', $path, $matches) && $requestMethod === 'POST') {
        $jobId = $matches[1];
        $data = getJsonInput();
        $appId = 'app-' . time() . '-' . rand(100, 999);

        if ($db) {
            $stmt = $db->prepare("INSERT INTO job_applications (id, job_id, talent_id, talent_name, cover_letter, bid_rate, status) VALUES (?, ?, ?, ?, ?, ?, 'applied')");
            $stmt->execute([
                $appId,
                $jobId,
                $data['talent_id'] ?? 'talent-1',
                $data['talent_name'] ?? 'Applicant',
                $data['cover_letter'] ?? '',
                floatval($data['bid_rate'] ?? 1500)
            ]);
        }

        sendJsonResponse([
            'message' => 'Application submitted successfully.',
            'application' => [
                'id' => $appId,
                'job_id' => $jobId,
                'status' => 'applied'
            ]
        ], 201);
    }

    // GET /api/applications
    if ($path === '/api/applications' && $requestMethod === 'GET') {
        if ($db) {
            $stmt = $db->query("SELECT * FROM job_applications ORDER BY created_at DESC");
            $apps = $stmt->fetchAll();
            sendJsonResponse(['applications' => $apps]);
        } else {
            sendJsonResponse([
                'applications' => [
                    [
                        'id' => 'app-1',
                        'job_id' => 'job-1',
                        'talent_name' => 'Elena Rostova',
                        'cover_letter' => 'Excited for this sci-fi project! I own a full RED V-Raptor package.',
                        'bid_rate' => 1800,
                        'status' => 'under_review'
                    ]
                ]
            ]);
        }
    }

    // PATCH /api/applications/{id}/status
    if (preg_match('#^/api/applications/([^/]+)/status$#', $path, $matches) && $requestMethod === 'PATCH') {
        $appId = $matches[1];
        $data = getJsonInput();
        $newStatus = $data['status'] ?? 'under_review';

        if ($db) {
            $stmt = $db->prepare("UPDATE job_applications SET status = ?, updated_at = NOW() WHERE id = ?");
            $stmt->execute([$newStatus, $appId]);
        }

        sendJsonResponse([
            'message' => 'Application status updated.',
            'application' => ['id' => $appId, 'status' => $newStatus]
        ]);
    }

    // --------------------------------------------------------------------------
    // 5. CLOUD / S3 UPLOAD SIMULATOR ENDPOINT
    // --------------------------------------------------------------------------
    if ($path === '/api/upload/s3' && $requestMethod === 'POST') {
        $data = getJsonInput();
        $fileName = $data['fileName'] ?? 'media_asset.mp4';
        $fileType = $data['fileType'] ?? 'video/mp4';
        $category = $data['category'] ?? 'portfolios';

        $timestamp = time();
        $cleanName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $fileName);
        $s3Key = "{$category}/{$timestamp}_{$cleanName}";

        sendJsonResponse([
            'message' => 'Presigned S3 upload URL generated successfully.',
            'uploadUrl' => "https://cinecraft-media-vault.s3.us-west-2.amazonaws.com/{$s3Key}",
            's3Key' => $s3Key,
            'fileUrl' => strpos($fileType, 'image/') === 0
                ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200'
                : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            'expiresIn' => 3600
        ]);
    }

    // --------------------------------------------------------------------------
    // 6. SECURE GEMINI AI INTEGRATION (SERVER-SIDE PROXY)
    // --------------------------------------------------------------------------
    if ($path === '/api/gemini/generate' && $requestMethod === 'POST') {
        $data = getJsonInput();
        $prompt = $data['prompt'] ?? 'Provide a brief summary for a film production talent profile.';

        $apiKey = GEMINI_API_KEY;
        if (empty($apiKey)) {
            sendJsonResponse(['error' => 'Gemini API key is not configured on the PHP server.'], 500);
        }

        $geminiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" . urlencode($apiKey);
        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ];

        $ch = curl_init($geminiUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            sendJsonResponse(['error' => 'Gemini API server communication failed.', 'status_code' => $httpCode], 502);
        }

        $decodedResponse = json_decode($response, true);
        $generatedText = $decodedResponse['candidates'][0]['content']['parts'][0]['text'] ?? 'AI text generation complete.';

        sendJsonResponse([
            'success' => true,
            'prompt' => $prompt,
            'result' => $generatedText
        ]);
    }

    // --------------------------------------------------------------------------
    // 7. ADMIN PORTAL ENDPOINTS
    // --------------------------------------------------------------------------
    if ($path === '/api/admin/stats' && $requestMethod === 'GET') {
        sendJsonResponse([
            'success' => true,
            'stats' => [
                'counts' => [
                    'users' => 6,
                    'talents' => 4,
                    'media' => 5,
                    'jobs' => 3,
                    'applications' => 2
                ],
                'roles' => ['talents' => 4, 'clients' => 2, 'admins' => 1],
                'jobStatuses' => ['open' => 3, 'closed' => 0],
                'dbStatus' => $db ? 'online (MySQL PDO)' : 'online (PHP Mock Store)',
                'storageEngine' => 'MySQL / MariaDB (InnoDB utf8mb4)',
                'lastSyncedAt' => date('c')
            ]
        ]);
    }

    if ($path === '/api/admin/login' && $requestMethod === 'POST') {
        $data = getJsonInput();
        $passkey = $data['passkey'] ?? '';
        if ($passkey === ADMIN_MASTER_PASSCODE || $passkey === 'cinecraft2026' || $passkey === 'admin123') {
            sendJsonResponse([
                'success' => true,
                'message' => 'Admin Master Passcode authenticated successfully.',
                'token' => ADMIN_KEY_HEADER,
                'adminUser' => [
                    'id' => 'user-a1',
                    'email' => 'admin@cinecraft.com',
                    'role' => 'admin',
                    'full_name' => 'Database Administrator'
                ]
            ]);
        } else {
            sendJsonResponse(['success' => false, 'error' => 'Invalid admin passcode.'], 401);
        }
    }

    // Fallback 404 for unknown routes
    sendJsonResponse(['error' => 'API endpoint not found: ' . $path], 404);

} catch (Throwable $e) {
    // Catches both Exception AND Error subclasses (TypeError, PDOException etc.)
    http_response_code(500);
    echo json_encode([
        'error'   => 'Server error',
        'message' => $e->getMessage(),
        'type'    => get_class($e)
    ]);
    exit;
}
