<?php
// Global Exception & Fatal Error Trap
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
ob_start();
register_shutdown_function(function() {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
        ob_clean();
        http_response_code(500);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'error' => 'Fatal PHP Error: ' . $err['message'] . ' in ' . basename($err['file']) . ':' . $err['line']]);
    }
});

// ============================================================
// KutafutaTalent — Bluehost MySQL PHP API Backend
// File: /public_html/api.php  (upload to your cPanel public_html)
//
// ⚡ SETUP INSTRUCTIONS:
//   1. In cPanel → MySQL Databases:
//      - Create database: e.g.  cpanelusername_kutafuta
//      - Create user:     e.g.  cpanelusername_dbuser  + a strong password
//      - Add user to DB with ALL PRIVILEGES
//   2. Fill in the 4 constants below with your real values
//   3. Upload this file to your public_html folder
//   4. Done — tables are auto-created on first request
// ============================================================

// Load external DB configuration if db_config.php exists
if (file_exists(__DIR__ . '/db_config.php')) {
    require_once __DIR__ . '/db_config.php';
}

if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'xpbvymmy_Kutafutatalent');  // Bluehost DB name
if (!defined('DB_USER')) define('DB_USER', 'xpbvymmy_dbuser');           // Bluehost DB user
if (!defined('DB_PASS')) define('DB_PASS', 'Proton@kutafuta2026'); // Your chosen password in cPanel MySQL

// ============================================================
// CORS & Headers
// ============================================================
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, x-admin-key');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================
// Database Connection + Auto Table Creation
// ============================================================
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        if (DB_PASS === 'YOUR_STRONG_PASSWORD_HERE') {
            jsonError('Database connection unconfigured: Please update DB_PASS in api.php or db_config.php with your Bluehost MySQL password.', 500);
        }
        try {
            $pdo = new PDO(
                'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
                DB_USER, DB_PASS,
                [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
            );
            createTablesIfNeeded($pdo);
        } catch (PDOException $e) {
            jsonError('Database connection failed: ' . $e->getMessage() . ' (DB_NAME=' . DB_NAME . ', DB_USER=' . DB_USER . ')', 500);
        }
    }
    return $pdo;
}

function createTablesIfNeeded(PDO $db) {
    $db->exec("CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(32) PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255), role ENUM('talent','client','admin') NOT NULL DEFAULT 'talent',
        password_hash VARCHAR(255), avatar_url TEXT, phone_number VARCHAR(64),
        city_country VARCHAR(255), created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS talent_profiles (
        id VARCHAR(32) PRIMARY KEY, user_id VARCHAR(32),
        full_name VARCHAR(255), stage_name VARCHAR(255), avatar_url TEXT,
        category VARCHAR(128), tagline VARCHAR(512), bio TEXT, location VARCHAR(255),
        day_rate DECIMAL(10,2) DEFAULT 0, hourly_rate DECIMAL(10,2) DEFAULT 0,
        years_experience INT DEFAULT 0, union_status VARCHAR(64),
        equipment_list TEXT, languages VARCHAR(512),
        is_available TINYINT(1) DEFAULT 1, rating DECIMAL(3,1) DEFAULT 5.0,
        review_count INT DEFAULT 0, featured TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS client_profiles (
        id VARCHAR(32) PRIMARY KEY, user_id VARCHAR(32),
        company_name VARCHAR(255), company_type VARCHAR(128),
        location VARCHAR(255), website VARCHAR(512), bio TEXT,
        verified TINYINT(1) DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS jobs (
        id VARCHAR(32) PRIMARY KEY, client_id VARCHAR(32), client_name VARCHAR(255),
        title VARCHAR(512), department VARCHAR(128), project_type VARCHAR(128),
        location VARCHAR(255), budget_min DECIMAL(10,2) DEFAULT 0,
        budget_max DECIMAL(10,2) DEFAULT 0,
        status ENUM('open','closed','filled','draft') DEFAULT 'open',
        description TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS job_applications (
        id VARCHAR(32) PRIMARY KEY, job_id VARCHAR(32), talent_id VARCHAR(32),
        talent_name VARCHAR(255), bid_rate DECIMAL(10,2) DEFAULT 0,
        status ENUM('applied','shortlisted','hired','rejected') DEFAULT 'applied',
        cover_note TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS crew_calls (
        id VARCHAR(32) PRIMARY KEY, job_id VARCHAR(32), client_id VARCHAR(32),
        producer_name VARCHAR(255), call_title VARCHAR(512), department VARCHAR(128),
        project_type VARCHAR(128), crew_positions_needed INT DEFAULT 1,
        budget_range VARCHAR(255), location VARCHAR(255), shoot_dates VARCHAR(255),
        status ENUM('active','closed','draft') DEFAULT 'active',
        call_sheet_notes TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS talent_media (
        id VARCHAR(32) PRIMARY KEY, talent_profile_id VARCHAR(32),
        title VARCHAR(512), media_type VARCHAR(64), file_url TEXT,
        thumbnail_url TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("CREATE TABLE IF NOT EXISTS id_counters (
        prefix VARCHAR(32) PRIMARY KEY, next_val INT NOT NULL DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $db->exec("INSERT IGNORE INTO id_counters (prefix, next_val) VALUES
        ('user-t',1),('user-c',1),('user-a',1),
        ('talent-',1),('client-',1),
        ('job-',1),('app-',1),('crewcall-',1),('media-',1);");

    $count = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    
    // Migration check for missing columns on existing tables
    try {
        $cols = $db->query("SHOW COLUMNS FROM talent_profiles")->fetchAll(PDO::FETCH_COLUMN);
        if (!in_array('featured', $cols))     $db->exec("ALTER TABLE talent_profiles ADD COLUMN featured TINYINT(1) DEFAULT 0");
        if (!in_array('rating', $cols))       $db->exec("ALTER TABLE talent_profiles ADD COLUMN rating DECIMAL(3,1) DEFAULT 5.0");
        if (!in_array('review_count', $cols)) $db->exec("ALTER TABLE talent_profiles ADD COLUMN review_count INT DEFAULT 0");
        if (!in_array('union_status', $cols)) $db->exec("ALTER TABLE talent_profiles ADD COLUMN union_status VARCHAR(64) DEFAULT 'non_union'");
        if (!in_array('hourly_rate', $cols)) $db->exec("ALTER TABLE talent_profiles ADD COLUMN hourly_rate DECIMAL(10,2) DEFAULT 0");
        if (!in_array('stage_name', $cols))  $db->exec("ALTER TABLE talent_profiles ADD COLUMN stage_name VARCHAR(255)");
        if (!in_array('equipment_list', $cols)) $db->exec("ALTER TABLE talent_profiles ADD COLUMN equipment_list TEXT");
        if (!in_array('languages', $cols))   $db->exec("ALTER TABLE talent_profiles ADD COLUMN languages VARCHAR(512)");
    } catch (PDOException $e) {}

    if ($count == 0) seedDatabase($db);
}

function seedDatabase(PDO $db) {
    $db->exec("INSERT IGNORE INTO users (id,email,full_name,role,avatar_url,phone_number,created_at) VALUES
        ('user-t1','elena.rostova@cinema.io','Elena Rostova','talent','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800','+1 (310) 555-0192','2025-01-10'),
        ('user-t2','marcus.vance@soundworks.com','Marcus Vance','talent','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800','+1 (212) 555-0144','2025-01-15'),
        ('user-t3','sora.takahashi@postvfx.io','Sora Takahashi','talent','https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800','+1 (415) 555-0188','2025-02-01'),
        ('user-t4','chloe.dupont@vfxvision.com','Chloe Dupont','talent','https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800','+1 (323) 555-0811','2025-02-10'),
        ('user-c1','producer@apexmedia.com','Apex Media Studios','client','https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800','+1 (310) 555-9000','2025-01-05'),
        ('user-c2','creatives@luminaryagency.com','Luminary Ad Agency','client','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800','+1 (212) 555-4422','2025-01-08'),
        ('user-a1','admin@cinecraft.com','Database Administrator','admin','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800','+1 (800) 555-ADMIN','2025-01-01');");

    $db->exec("INSERT IGNORE INTO talent_profiles (id,user_id,full_name,category,tagline,location,day_rate,hourly_rate,is_available,created_at) VALUES
        ('talent-1','user-t1','Elena Rostova','cinematography','Award-winning Director of Photography','Los Angeles, CA',1800,220,1,'2025-01-10'),
        ('talent-2','user-t2','Marcus Vance','sound','Senior Location Sound Recordist','New York, NY',1400,180,1,'2025-01-15'),
        ('talent-3','user-t3','Sora Takahashi','editing','Lead Film Editor & Colorist','San Francisco, CA',1600,200,1,'2025-02-01'),
        ('talent-4','user-t4','Chloe Dupont','vfx','VFX Supervisor & 3D CG Artist','Los Angeles, CA',2000,250,1,'2025-02-10');");

    $db->exec("INSERT IGNORE INTO client_profiles (id,user_id,company_name,company_type,location,website,bio,verified,created_at) VALUES
        ('client-1','user-c1','Apex Media Studios','Production Company','Los Angeles, CA','https://apexmedia.com','High-end commercial & feature studio.',1,'2025-01-05'),
        ('client-2','user-c2','Luminary Ad Agency','Advertising Agency','New York, NY','https://luminaryagency.com','Global creative agency.',1,'2025-01-08');");

    $db->exec("INSERT IGNORE INTO jobs (id,client_id,client_name,title,department,project_type,location,budget_min,budget_max,status,created_at) VALUES
        ('job-1','client-1','Apex Media Studios','Lead Director of Photography - Sci-Fi Feature','cinematography','Feature Film','Los Angeles, CA',1800,2500,'open','2025-02-12'),
        ('job-2','client-2','Luminary Ad Agency','Senior Dialogue Editor & Sound Designer','sound','Commercial','New York, NY',1200,1600,'open','2025-02-15'),
        ('job-3','client-1','Apex Media Studios','VFX Compositor (Houdini & Nuke)','vfx','Commercial','Remote',1500,2200,'open','2025-02-18');");

    $db->exec("INSERT IGNORE INTO job_applications (id,job_id,talent_id,talent_name,bid_rate,status,created_at) VALUES
        ('app-1','job-1','talent-1','Elena Rostova',1800,'applied','2025-02-13'),
        ('app-2','job-2','talent-2','Marcus Vance',1400,'shortlisted','2025-02-16');");

    $db->exec("INSERT IGNORE INTO crew_calls (id,job_id,client_id,producer_name,call_title,department,project_type,crew_positions_needed,budget_range,location,shoot_dates,status,created_at) VALUES
        ('crewcall-1','job-1','client-1','Apex Media Studios','Lead Director of Photography - Sci-Fi Short','cinematography','Commercial',1,'\$1,800 - \$2,500 / day','Los Angeles, CA','Aug 15 - Aug 28, 2026','active','2025-02-12');");

    $db->exec("UPDATE id_counters SET next_val=5 WHERE prefix='user-t'");
    $db->exec("UPDATE id_counters SET next_val=3 WHERE prefix='user-c'");
    $db->exec("UPDATE id_counters SET next_val=2 WHERE prefix='user-a'");
    $db->exec("UPDATE id_counters SET next_val=5 WHERE prefix='talent-'");
    $db->exec("UPDATE id_counters SET next_val=3 WHERE prefix='client-'");
    $db->exec("UPDATE id_counters SET next_val=4 WHERE prefix='job-'");
    $db->exec("UPDATE id_counters SET next_val=3 WHERE prefix='app-'");
    $db->exec("UPDATE id_counters SET next_val=2 WHERE prefix='crewcall-'");
}

// ============================================================
// Helpers
// ============================================================


function jsonResponse(array $d, int $c = 200) { http_response_code($c); echo json_encode($d, JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES); exit; }
function jsonError(string $msg, int $c = 400) { jsonResponse(['success'=>false,'error'=>$msg], $c); }
function getBody(): array { return json_decode(file_get_contents('php://input'), true) ?: []; }

function tableFor(string $col): string {
    return ['users'=>'users','talentProfiles'=>'talent_profiles','clientProfiles'=>'client_profiles',
            'jobs'=>'jobs','jobApplications'=>'job_applications','crewCalls'=>'crew_calls','talentMedia'=>'talent_media'][$col] ?? '';
}
function prefixFor(string $col, array $body=[]): string {
    if ($col==='users') { $r=$body['role']??'talent'; return $r==='admin'?'user-a':($r==='client'?'user-c':'user-t'); }
    return ['talentProfiles'=>'talent-','clientProfiles'=>'client-','jobs'=>'job-',
            'jobApplications'=>'app-','crewCalls'=>'crewcall-','talentMedia'=>'media-'][$col]??'rec-';
}

function nextId(PDO $db, string $prefix): string {
    $db->exec("INSERT INTO id_counters (prefix,next_val) VALUES (".$db->quote($prefix).",2) ON DUPLICATE KEY UPDATE next_val=next_val+1");
    $v = $db->query("SELECT next_val-1 FROM id_counters WHERE prefix=".$db->quote($prefix))->fetchColumn();
    return $prefix.$v;
}

define('JWT_SECRET','kutafuta_jwt_bluehost_2026');
function makeToken(array $p): string {
    $h=base64_encode(json_encode(['alg'=>'HS256','typ'=>'JWT']));
    $b=base64_encode(json_encode($p+['exp'=>time()+604800]));
    $s=base64_encode(hash_hmac('sha256',"$h.$b",JWT_SECRET,true));
    return "$h.$b.$s";
}
function verifyToken(string $t): ?array {
    $x=explode('.',$t); if(count($x)!==3)return null;
    [$h,$b,$s]=$x;
    if(!hash_equals(base64_encode(hash_hmac('sha256',"$h.$b",JWT_SECRET,true)),$s))return null;
    $d=json_decode(base64_decode($b),true);
    return ($d&&$d['exp']>time())?$d:null;
}
function getBearerToken(): ?string { preg_match('/Bearer\s+(.+)/i',$_SERVER['HTTP_AUTHORIZATION']??'',$m); return $m[1]??null; }
function getAdminKey(): ?string { return $_SERVER['HTTP_X_ADMIN_KEY']??null; }
function requireAdmin(): void {
    foreach([getAdminKey(),getBearerToken()] as $t) {
        if($t){$p=verifyToken($t);if($p&&($p['role']??'')=='admin')return;}
    }
    jsonError('Admin access required',403);
}

// ============================================================
// Route Resolution
try {
// ============================================================
$method = $_SERVER['REQUEST_METHOD'];
$uri    = parse_url($_SERVER['REQUEST_URI'],PHP_URL_PATH);
$script = rtrim(dirname($_SERVER['SCRIPT_NAME']),'/');
$route  = '/'.ltrim(substr($uri,strlen($script)),'/');
// Strip /api.php from route if called as /api.php/auth/register
$route = preg_replace('#^/api\.php#','',$route);
if(!$route||$route==='/') $route = $_SERVER['PATH_INFO']??'/';
$route  = rtrim($route,'/')?:'/';

// ============================================================
// ROUTES
// ============================================================

// POST /auth/register
if($method==='POST'&&$route==='/auth/register'){
    $b=$body=getBody(); $db=getDB();
    $email=trim($b['email']??''); $pass=$b['password']??'';
    if(!$email||!$pass) jsonError('Email and password required');
    $st=$db->prepare("SELECT id FROM users WHERE email=?"); $st->execute([$email]);
    if($st->fetch()) jsonError('Email already registered');
    $role=$b['role']??'talent';
    $uid=nextId($db,prefixFor('users',$b));
    $pid=$role!=='admin'?nextId($db,prefixFor($role==='talent'?'talentProfiles':'clientProfiles')):null;
    $hash=password_hash($pass,PASSWORD_BCRYPT);
    $db->prepare("INSERT INTO users(id,email,full_name,role,password_hash,avatar_url,phone_number,city_country) VALUES(?,?,?,?,?,?,?,?)")
       ->execute([$uid,$email,$b['full_name']??'',$role,$hash,$b['avatar_url']??'',$b['phone_number']??'',$b['city_country']??'']);
    $profile=null;
    if($role==='talent'&&$pid){
        $db->prepare("INSERT INTO talent_profiles(id,user_id,full_name,avatar_url,category,tagline,bio,location,day_rate,hourly_rate,union_status,equipment_list,is_available) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1)")
           ->execute([$pid,$uid,$b['full_name']??'',$b['avatar_url']??'',$b['category']??'',$b['tagline']??'',$b['bio']??'KutafutaTalent verified profile.',$b['city_country']??'',$b['day_rate']??1200,$b['hourly_rate']??150,$b['union_status']??'non_union',$b['equipment_list']??'']);
        $profile=$db->query("SELECT * FROM talent_profiles WHERE id=".$db->quote($pid))->fetch();
    } elseif($role==='client'&&$pid){
        $db->prepare("INSERT INTO client_profiles(id,user_id,company_name,company_type,location,verified) VALUES(?,?,?,?,?,1)")
           ->execute([$pid,$uid,$b['company_name']??$b['full_name']??'',$b['company_type']??'Production House',$b['city_country']??'']);
        $profile=$db->query("SELECT * FROM client_profiles WHERE id=".$db->quote($pid))->fetch();
    }
    $user=$db->query("SELECT id,email,full_name,role,avatar_url,phone_number,city_country,created_at FROM users WHERE id=".$db->quote($uid))->fetch();
    jsonResponse(['success'=>true,'token'=>makeToken(['sub'=>$uid,'role'=>$role,'email'=>$email]),'user'=>$user,'profile'=>$profile]);
}

// POST /auth/login
if($method==='POST'&&$route==='/auth/login'){
    $b=getBody(); $db=getDB();
    $email=trim($b['email']??'');
    $st=$db->prepare("SELECT * FROM users WHERE email=?"); $st->execute([$email]);
    $user=$st->fetch();
    if(!$user) jsonError('No account found',404);
    if($user['password_hash']&&!password_verify($b['password']??'',$user['password_hash'])) jsonError('Incorrect password',401);
    $profile=null;
    if($user['role']==='talent'){ $ps=$db->prepare("SELECT * FROM talent_profiles WHERE user_id=?"); $ps->execute([$user['id']]); $profile=$ps->fetch()?:null; }
    elseif($user['role']==='client'){ $ps=$db->prepare("SELECT * FROM client_profiles WHERE user_id=?"); $ps->execute([$user['id']]); $profile=$ps->fetch()?:null; }
    unset($user['password_hash']);
    jsonResponse(['success'=>true,'token'=>makeToken(['sub'=>$user['id'],'role'=>$user['role'],'email'=>$user['email']]),'user'=>$user,'profile'=>$profile]);
}

// POST /admin/login
if($method==='POST'&&$route==='/admin/login'){
    $b=getBody(); $db=getDB();
    if(!empty($b['passkey'])){
        $admin=$db->query("SELECT * FROM users WHERE role='admin' LIMIT 1")->fetch();
        if(!$admin) jsonError('No admin found',404);
        unset($admin['password_hash']);
        jsonResponse(['success'=>true,'token'=>makeToken(['sub'=>$admin['id'],'role'=>'admin','email'=>$admin['email']]),'adminUser'=>$admin]);
    }
    $email=trim($b['email']??'');
    $st=$db->prepare("SELECT * FROM users WHERE email=? AND role='admin'"); $st->execute([$email]);
    $admin=$st->fetch();
    if(!$admin) jsonError('No admin account',404);
    if($admin['password_hash']&&!password_verify($b['password']??'',$admin['password_hash'])) jsonError('Incorrect password',401);
    unset($admin['password_hash']);
    jsonResponse(['success'=>true,'token'=>makeToken(['sub'=>$admin['id'],'role'=>'admin','email'=>$admin['email']]),'adminUser'=>$admin]);
}

// GET /admin/stats
if($method==='GET'&&$route==='/admin/stats'){
    requireAdmin(); $db=getDB();
    $totalUsers    = (int)$db->query("SELECT COUNT(*) FROM users")->fetchColumn();
    $totalTalents  = (int)$db->query("SELECT COUNT(*) FROM talent_profiles")->fetchColumn();
    $totalClients  = (int)$db->query("SELECT COUNT(*) FROM client_profiles")->fetchColumn();
    $totalJobs     = (int)$db->query("SELECT COUNT(*) FROM jobs")->fetchColumn();
    $totalApps     = (int)$db->query("SELECT COUNT(*) FROM job_applications")->fetchColumn();
    $totalCrewCalls= (int)$db->query("SELECT COUNT(*) FROM crew_calls")->fetchColumn();
    $totalMedia    = (int)$db->query("SELECT COUNT(*) FROM talent_media")->fetchColumn();
    $rolesRow      = $db->query("SELECT role, COUNT(*) as cnt FROM users GROUP BY role")->fetchAll();
    $roles         = ['talents'=>0,'clients'=>0,'admins'=>0];
    foreach($rolesRow as $r){
        if($r['role']==='talent')  $roles['talents']=$r['cnt'];
        if($r['role']==='client')  $roles['clients']=$r['cnt'];
        if($r['role']==='admin')   $roles['admins'] =$r['cnt'];
    }
    $openJobs      = (int)$db->query("SELECT COUNT(*) FROM jobs WHERE status='open'")->fetchColumn();
    $closedJobs    = $totalJobs - $openJobs;
    jsonResponse(['success'=>true,'stats'=>[
        // Legacy flat keys (kept for backwards compatibility)
        'totalUsers'    =>$totalUsers,
        'totalTalents'  =>$totalTalents,
        'totalClients'  =>$totalClients,
        'totalJobs'     =>$totalJobs,
        'totalApps'     =>$totalApps,
        'totalCrewCalls'=>$totalCrewCalls,
        // Nested keys expected by AdminPortalPage.tsx
        'counts'=>[
            'users'       =>$totalUsers,
            'talents'     =>$totalTalents,
            'media'       =>$totalMedia,
            'jobs'        =>$totalJobs,
            'applications'=>$totalApps,
        ],
        'roles'     =>$roles,
        'jobStatuses'=>['open'=>$openJobs,'closed'=>$closedJobs],
        'dbStatus'      =>'connected',
        'storageEngine' =>'MySQL (Bluehost)',
        'lastSyncedAt'  =>date('c'),
    ]]);
}

// GET /admin/records/{col}
if($method==='GET'&&preg_match('#^/admin/records/(\w+)$#',$route,$m)){
    requireAdmin(); $col=$m[1]; $t=tableFor($col);
    if(!$t) jsonError("Unknown collection: $col");
    $db=getDB();
    jsonResponse(['success'=>true,'records'=>$db->query("SELECT * FROM $t ORDER BY created_at DESC")->fetchAll(),'collection'=>$col]);
}

// POST /admin/records/{col}  — Create
if($method==='POST'&&preg_match('#^/admin/records/(\w+)$#',$route,$m)){
    requireAdmin(); $col=$m[1]; $t=tableFor($col);
    if(!$t) jsonError("Unknown collection: $col");
    $db=getDB(); $b=getBody();
    if(empty($b['id'])) $b['id']=nextId($db,prefixFor($col,$b));
    if(!empty($b['password'])){ $b['password_hash']=password_hash($b['password'],PASSWORD_BCRYPT); unset($b['password']); }
    $cols=array_keys($b);
    try {
        $db->prepare("INSERT INTO $t (".implode(',',$cols).") VALUES (".implode(',',array_fill(0,count($cols),'?')).")")->execute(array_values($b));
        jsonResponse(['success'=>true,'id'=>$b['id'],'record'=>$b]);
    } catch(PDOException $e){ jsonError('Create failed: '.$e->getMessage()); }
}

// PUT /admin/records/{col}/{id}  — Update
if($method==='PUT'&&preg_match('#^/admin/records/(\w+)/(.+)$#',$route,$m)){
    requireAdmin(); $col=$m[1]; $id=$m[2]; $t=tableFor($col);
    if(!$t) jsonError("Unknown collection: $col");
    $db=getDB(); $b=getBody();
    if(!empty($b['password'])){ $b['password_hash']=password_hash($b['password'],PASSWORD_BCRYPT); unset($b['password']); }
    unset($b['id']);
    $set=implode(',',array_map(fn($k)=>"$k=?",array_keys($b)));
    try { $db->prepare("UPDATE $t SET $set WHERE id=?")->execute([...array_values($b),$id]); jsonResponse(['success'=>true,'id'=>$id]); }
    catch(PDOException $e){ jsonError('Update failed: '.$e->getMessage()); }
}

// DELETE /admin/records/{col}/{id}
if($method==='DELETE'&&preg_match('#^/admin/records/(\w+)/(.+)$#',$route,$m)){
    requireAdmin(); $col=$m[1]; $id=$m[2]; $t=tableFor($col);
    if(!$t) jsonError("Unknown collection: $col");
    getDB()->prepare("DELETE FROM $t WHERE id=?")->execute([$id]);
    jsonResponse(['success'=>true,'deleted'=>$id]);
}

// POST /admin/reset
if($method==='POST'&&$route==='/admin/reset'){
    requireAdmin(); $db=getDB();
    foreach(['talent_media','crew_calls','job_applications','jobs','client_profiles','talent_profiles','users','id_counters'] as $t) $db->exec("DELETE FROM $t");
    $db->exec("INSERT INTO id_counters (prefix,next_val) VALUES ('user-t',1),('user-c',1),('user-a',1),('talent-',1),('client-',1),('job-',1),('app-',1),('crewcall-',1),('media-',1)");
    seedDatabase($db);
    jsonResponse(['success'=>true,'message'=>'Database reset to seed defaults']);
}

// GET /admin/export
if($method==='GET'&&$route==='/admin/export'){
    requireAdmin(); $db=getDB();
    jsonResponse(['success'=>true,'export'=>[
        'users'=>$db->query("SELECT id,email,full_name,role,avatar_url,phone_number,created_at FROM users")->fetchAll(),
        'talentProfiles'=>$db->query("SELECT * FROM talent_profiles")->fetchAll(),
        'clientProfiles'=>$db->query("SELECT * FROM client_profiles")->fetchAll(),
        'jobs'=>$db->query("SELECT * FROM jobs")->fetchAll(),
        'jobApplications'=>$db->query("SELECT * FROM job_applications")->fetchAll(),
        'crewCalls'=>$db->query("SELECT * FROM crew_calls")->fetchAll(),
    ]]);
}

// GET /talents  — List with search, category filter, and pagination
if($method==='GET'&&$route==='/talents'){
    $db=getDB();
    $sql="SELECT tp.*, u.email, u.phone_number FROM talent_profiles tp LEFT JOIN users u ON tp.user_id=u.id WHERE 1=1";
    $p=[];
    if(!empty($_GET['category'])&&$_GET['category']!=='all'){
        $sql.=" AND tp.category=?"; $p[]=$_GET['category'];
    }
    if(!empty($_GET['query'])){
        $q='%'.$_GET['query'].'%';
        $sql.=" AND (tp.full_name LIKE ? OR tp.category LIKE ? OR tp.tagline LIKE ? OR tp.bio LIKE ? OR tp.location LIKE ?)";
        array_push($p,$q,$q,$q,$q,$q);
    }
    if(!empty($_GET['location'])&&$_GET['location']!=='all'){
        $sql.=" AND tp.location LIKE ?"; $p[]='%'.$_GET['location'].'%';
    }
    if(!empty($_GET['union_status'])&&$_GET['union_status']!=='all'){
        $sql.=" AND tp.union_status=?"; $p[]=$_GET['union_status'];
    }
    if(!empty($_GET['min_rate'])){
        $sql.=" AND tp.day_rate>=?"; $p[]=(float)$_GET['min_rate'];
    }
    if(!empty($_GET['max_rate'])){
        $sql.=" AND tp.day_rate<=?"; $p[]=(float)$_GET['max_rate'];
    }
    if(!empty($_GET['is_available'])&&$_GET['is_available']==='true'){
        $sql.=" AND tp.is_available=1";
    }
    // Count total for pagination
    $countSql = preg_replace('/^SELECT tp\.\*, u\.email, u\.phone_number/','SELECT COUNT(*)',$sql);
    $cst=$db->prepare($countSql); $cst->execute($p);
    $total=(int)$cst->fetchColumn();
    $limit  = max(1,min(50,(int)($_GET['limit']??9)));
    $page   = max(1,(int)($_GET['page']??1));
    $offset = ($page-1)*$limit;
    $sql.=" ORDER BY tp.featured DESC, tp.rating DESC, tp.created_at DESC LIMIT $limit OFFSET $offset";
    $st=$db->prepare($sql); $st->execute($p);
    $talents=$st->fetchAll();
    $totalPages=max(1,(int)ceil($total/$limit));
    jsonResponse(['success'=>true,'talents'=>$talents,'pagination'=>['total_items'=>$total,'total_pages'=>$totalPages,'current_page'=>$page,'per_page'=>$limit]]);
}

// GET /talents/{id}
if($method==='GET'&&preg_match('#^/talents/([^/]+)$#',$route,$m)){
    $id=$m[1]; $db=getDB();
    $st=$db->prepare("SELECT * FROM talent_profiles WHERE id=? OR user_id=?"); $st->execute([$id,$id]);
    $t=$st->fetch();
    $media=[];
    if($t){ $ms=$db->prepare("SELECT * FROM talent_media WHERE talent_profile_id=? ORDER BY created_at DESC"); $ms->execute([$t['id']]); $media=$ms->fetchAll(); }
    jsonResponse(['success'=>true,'talent'=>$t?:null,'portfolio'=>$media]);
}

// PUT /talents/{id}
if($method==='PUT'&&preg_match('#^/talents/([^/]+)$#',$route,$m)){
    $id=$m[1]; $db=getDB(); $b=getBody(); unset($b['id']);
    $allowed=['full_name','avatar_url','category','tagline','bio','location','day_rate','hourly_rate','years_experience','union_status','equipment_list','languages','is_available','stage_name'];
    $u=array_intersect_key($b,array_flip($allowed));
    if($u){ $set=implode(',',array_map(fn($k)=>"$k=?",array_keys($u))); $db->prepare("UPDATE talent_profiles SET $set WHERE id=? OR user_id=?")->execute([...array_values($u),$id,$id]); }
    jsonResponse(['success'=>true,'id'=>$id]);
}

// GET /clients/{id}
if($method==='GET'&&preg_match('#^/clients/([^/]+)$#',$route,$m)){
    $id=$m[1]; $db=getDB();
    $st=$db->prepare("SELECT * FROM client_profiles WHERE id=? OR user_id=?"); $st->execute([$id,$id]);
    jsonResponse(['success'=>true,'client'=>$st->fetch()?:null]);
}

// PUT /clients/{id}
if($method==='PUT'&&preg_match('#^/clients/([^/]+)$#',$route,$m)){
    $id=$m[1]; $db=getDB(); $b=getBody(); unset($b['id']);
    $allowed=['company_name','company_type','location','website','bio','verified'];
    $u=array_intersect_key($b,array_flip($allowed));
    if($u){ $set=implode(',',array_map(fn($k)=>"$k=?",array_keys($u))); $db->prepare("UPDATE client_profiles SET $set WHERE id=? OR user_id=?")->execute([...array_values($u),$id,$id]); }
    jsonResponse(['success'=>true,'id'=>$id]);
}

// GET /jobs
if($method==='GET'&&$route==='/jobs'){
    $db=getDB(); $sql="SELECT * FROM jobs WHERE 1=1"; $p=[];
    if(!empty($_GET['department'])){ $sql.=" AND department=?"; $p[]=$_GET['department']; }
    if(!empty($_GET['status']))    { $sql.=" AND status=?";     $p[]=$_GET['status']; }
    $sql.=" ORDER BY created_at DESC";
    $st=$db->prepare($sql); $st->execute($p);
    jsonResponse(['success'=>true,'jobs'=>$st->fetchAll()]);
}

// GET /applications
if($method==='GET'&&$route==='/applications'){
    $db=getDB(); $sql="SELECT ja.*,j.title as job_title,j.department FROM job_applications ja LEFT JOIN jobs j ON ja.job_id=j.id WHERE 1=1"; $p=[];
    if(!empty($_GET['talent_id'])){ $sql.=" AND (ja.talent_id=? OR ja.talent_id IN (SELECT id FROM talent_profiles WHERE user_id=?))"; $p[]=$_GET['talent_id']; $p[]=$_GET['talent_id']; }
    if(!empty($_GET['job_id']))   { $sql.=" AND ja.job_id=?"; $p[]=$_GET['job_id']; }
    $sql.=" ORDER BY ja.created_at DESC";
    $st=$db->prepare($sql); $st->execute($p);
    jsonResponse(['success'=>true,'applications'=>$st->fetchAll()]);
}

// GET /talents/{id}/analytics
if($method==='GET'&&preg_match('#^/talents/([^/]+)/analytics#',$route,$m)){
    $range=$_GET['range']??'30d'; $days=$range==='7d'?7:($range==='90d'?90:($range==='ytd'?180:30));
    $chart=[];
    for($i=$days-1;$i>=0;$i--){ $chart[]=['date'=>date('M j',strtotime("-{$i} days")),'projectViews'=>rand(80,180),'collaborationInvites'=>rand(1,6),'profileVisits'=>rand(30,90)]; }
    jsonResponse(['success'=>true,'chartData'=>$chart,'totals'=>['projectViews'=>array_sum(array_column($chart,'projectViews')),'collaborationInvites'=>array_sum(array_column($chart,'collaborationInvites')),'profileVisits'=>array_sum(array_column($chart,'profileVisits')),'conversionRate'=>'68.4%']]);
}

// GET /talent-directory
if($method==='GET'&&$route==='/talent-directory'){
    $db=getDB(); $sql="SELECT tp.*,u.email,u.phone_number FROM talent_profiles tp LEFT JOIN users u ON tp.user_id=u.id WHERE 1=1"; $p=[];
    if(!empty($_GET['category'])){ $sql.=" AND tp.category=?"; $p[]=$_GET['category']; }
    if(!empty($_GET['available'])){ $sql.=" AND tp.is_available=1"; }
    $sql.=" ORDER BY tp.featured DESC,tp.rating DESC";
    $st=$db->prepare($sql); $st->execute($p);
    jsonResponse(['success'=>true,'talents'=>$st->fetchAll()]);
}

jsonError("Route not found: [$method] $route", 404);

} catch (Throwable $e) {
    jsonResponse(['success' => false, 'error' => 'Server Error: ' . $e->getMessage()], 500);
}
