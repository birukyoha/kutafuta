// File: /src/pages/AdminPortalPage.tsx
// Comprehensive & Secure Database Administration Portal UI for CineCraft Marketplace

import React, { useState, useEffect } from 'react';
import { getApiEndpoint } from '../services/api';
import { 
  Database, Users, Film, Briefcase, FileText, RefreshCw, Plus, 
  Trash2, Edit3, Download, RotateCcw, Search, CheckCircle2, 
  AlertCircle, Code, Copy, Check, Eye, HardDrive, Cpu, ShieldCheck,
  Lock, Key, LogIn, LogOut, ShieldAlert, Table, FileSpreadsheet, Printer, ChevronDown, FileType
} from 'lucide-react';

interface AdminPortalProps {
  isDaylight?: boolean;
}

type CollectionKey = 'users' | 'talentProfiles' | 'clientProfiles' | 'talentMedia' | 'jobs' | 'jobApplications' | 'crewCalls';

interface AdminStats {
  counts: {
    users: number;
    talents: number;
    media: number;
    jobs: number;
    applications: number;
  };
  roles: { talents: number; clients: number; admins: number };
  jobStatuses: { open: number; closed: number };
  dbStatus: string;
  storageEngine: string;
  lastSyncedAt: string;
}

const FALLBACK_DATA: Record<CollectionKey, any[]> = {
  users: [
    { id: 'user-t1', email: 'elena.rostova@cinema.io', role: 'talent', full_name: 'Elena Rostova', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (310) 555-0192', created_at: '2025-01-10T00:00:00.000Z' },
    { id: 'user-t2', email: 'marcus.vance@soundworks.com', role: 'talent', full_name: 'Marcus Vance', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (212) 555-0144', created_at: '2025-01-15T00:00:00.000Z' },
    { id: 'user-t3', email: 'sora.takahashi@postvfx.io', role: 'talent', full_name: 'Sora Takahashi', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (415) 555-0188', created_at: '2025-02-01T00:00:00.000Z' },
    { id: 'user-t4', email: 'chloe.dupont@vfxvision.com', role: 'talent', full_name: 'Chloe Dupont', avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (323) 555-0811', created_at: '2025-02-10T00:00:00.000Z' },
    { id: 'user-c1', email: 'producer@apexmedia.com', role: 'client', full_name: 'Apex Media Studios', avatar_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (310) 555-9000', created_at: '2025-01-05T00:00:00.000Z' },
    { id: 'user-c2', email: 'creatives@luminaryagency.com', role: 'client', full_name: 'Luminary Ad Agency', avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (212) 555-4422', created_at: '2025-01-08T00:00:00.000Z' },
    { id: 'user-a1', email: 'admin@cinecraft.com', role: 'admin', full_name: 'Database Administrator', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', phone_number: '+1 (800) 555-ADMIN', created_at: '2025-01-01T00:00:00.000Z' }
  ],
  talentProfiles: [
    { id: 'talent-1', user_id: 'user-t1', full_name: 'Elena Rostova', category: 'cinematography', tagline: 'Award-winning Director of Photography & Steadicam Owner/Operator', location: 'Los Angeles, CA', day_rate: 1800, hourly_rate: 220, is_available: true, created_at: '2025-01-10T00:00:00.000Z' },
    { id: 'talent-2', user_id: 'user-t2', full_name: 'Marcus Vance', category: 'sound', tagline: 'Senior Location Sound Recordist & Boom Operator', location: 'New York, NY', day_rate: 1400, hourly_rate: 180, is_available: true, created_at: '2025-01-15T00:00:00.000Z' },
    { id: 'talent-3', user_id: 'user-t3', full_name: 'Sora Takahashi', category: 'editing', tagline: 'Lead Film Editor & DaVinci Certified Colorist', location: 'San Francisco, CA', day_rate: 1600, hourly_rate: 200, is_available: true, created_at: '2025-02-01T00:00:00.000Z' },
    { id: 'talent-4', user_id: 'user-t4', full_name: 'Chloe Dupont', category: 'vfx', tagline: 'VFX Supervisor & 3D CG Artist', location: 'Los Angeles, CA', day_rate: 2000, hourly_rate: 250, is_available: true, created_at: '2025-02-10T00:00:00.000Z' }
  ],
  clientProfiles: [
    { id: 'client-1', user_id: 'user-c1', company_name: 'Apex Media Studios', company_type: 'Production Company', location: 'Los Angeles, CA', website: 'https://apexmedia.com', bio: 'High-end commercial & feature studio.', verified: true, created_at: '2025-01-05T00:00:00.000Z' },
    { id: 'client-2', user_id: 'user-c2', company_name: 'Luminary Ad Agency', company_type: 'Advertising Agency', location: 'New York, NY', website: 'https://luminaryagency.com', bio: 'Global creative agency producing broadcast & digital spots.', verified: true, created_at: '2025-01-08T00:00:00.000Z' }
  ],
  jobs: [
    { id: 'job-1', client_id: 'client-1', client_name: 'Apex Media Studios', title: 'Lead Director of Photography - Sci-Fi Feature', department: 'cinematography', project_type: 'Feature Film', location: 'Los Angeles, CA', budget_min: 1800, budget_max: 2500, status: 'open', created_at: '2025-02-12T00:00:00.000Z' },
    { id: 'job-2', client_id: 'client-2', client_name: 'Luminary Ad Agency', title: 'Senior Dialogue Editor & Sound Designer', department: 'sound', project_type: 'Commercial', location: 'New York, NY', budget_min: 1200, budget_max: 1600, status: 'open', created_at: '2025-02-15T00:00:00.000Z' },
    { id: 'job-3', client_id: 'client-1', client_name: 'Apex Media Studios', title: 'VFX Compositor (Houdini & Nuke)', department: 'vfx', project_type: 'Commercial', location: 'Remote', budget_min: 1500, budget_max: 2200, status: 'open', created_at: '2025-02-18T00:00:00.000Z' }
  ],
  jobApplications: [
    { id: 'app-1', job_id: 'job-1', talent_id: 'talent-1', talent_name: 'Elena Rostova', bid_rate: 1800, status: 'applied', created_at: '2025-02-13T00:00:00.000Z' },
    { id: 'app-2', job_id: 'job-2', talent_id: 'talent-2', talent_name: 'Marcus Vance', bid_rate: 1400, status: 'shortlisted', created_at: '2025-02-16T00:00:00.000Z' }
  ],
  crewCalls: [
    { id: 'crewcall-1', job_id: 'job-1', client_id: 'client-1', producer_name: 'Apex Media Studios', call_title: 'Lead Director of Photography - Sci-Fi Short', department: 'cinematography', project_type: 'Commercial', crew_positions_needed: 1, budget_range: '$1,800 - $2,500 / day', location: 'Los Angeles, CA', shoot_dates: 'Aug 15 - Aug 28, 2026', status: 'active', created_at: '2025-02-12T00:00:00.000Z' }
  ],
  talentMedia: [
    { id: 'media-1', talent_profile_id: 'talent-1', title: '2026 Commercial DP Showreel (4K)', media_type: 'showreel', file_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', created_at: '2025-01-10T00:00:00.000Z' }
  ]
};

export const AdminPortalPage: React.FC<AdminPortalProps> = ({ isDaylight = false }) => {
  // Authentication & Security State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return sessionStorage.getItem('cinecraft_admin_token') || null;
  });
  const [adminUser, setAdminUser] = useState<any | null>(() => {
    const saved = sessionStorage.getItem('cinecraft_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form States
  const [loginMode, setLoginMode] = useState<'passkey' | 'credentials'>('passkey');
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('admin@cinecraft.com');
  const [passwordInput, setPasswordInput] = useState<string>('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSubmitting, setLoginSubmitting] = useState<boolean>(false);

  // Portal Main States
  const [activeCollection, setActiveCollection] = useState<CollectionKey>('users');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [dbEngineLabel, setDbEngineLabel] = useState<string>('Memory / JSON Store');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');
  const [editorMode, setEditorMode] = useState<'gui' | 'json'>('gui');
  const [editFormData, setEditFormData] = useState<any>({});
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; details: string; timestamp: string }>>([]);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [jsonText, setJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const [isRawModalOpen, setIsRawModalOpen] = useState<boolean>(false);
  const [rawViewRecord, setRawViewRecord] = useState<any | null>(null);
  const [modalViewFormat, setModalViewFormat] = useState<'table' | 'json'>('table');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  // Helper for authenticated requests
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminToken) {
      headers['x-admin-key'] = adminToken;
      headers['Authorization'] = `Bearer ${adminToken}`;
    }
    return headers;
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('cinecraft_admin_token');
    sessionStorage.removeItem('cinecraft_admin_user');
    setAdminToken(null);
    setAdminUser(null);
    showToast('success', 'Admin security session locked.');
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSubmitting(true);

    try {
      const payload = loginMode === 'passkey' 
        ? { passkey: passkeyInput }
        : { email: emailInput, password: passwordInput };

      const res = await fetch(getApiEndpoint('/admin/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem('cinecraft_admin_token', data.token);
        sessionStorage.setItem('cinecraft_admin_user', JSON.stringify(data.adminUser));
        setAdminToken(data.token);
        setAdminUser(data.adminUser);
        showToast('success', 'Admin session authenticated successfully!');
        addAuditLog('ADMIN_AUTH', `Authenticated as ${data.adminUser?.email || 'Admin'}`);
      } else {
        setLoginError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError(`Authentication server error: ${err.message}`);
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Fetch Stats & Active Collection
  const fetchStats = async () => {
    if (!adminToken) return;
    try {
      const res = await fetch(getApiEndpoint('/admin/stats'), { headers: getAuthHeaders() });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    }
  };

  // localStorage persistence key helper
  const lsKey = (col: CollectionKey) => `cinecraft_db_${col}`;

  // Persist a collection's records to localStorage
  const persistToLocalStorage = (col: CollectionKey, data: any[]) => {
    try {
      localStorage.setItem(lsKey(col), JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage persist failed:', e);
    }
  };

  // Load a collection from localStorage, or fallback to seed data
  const loadFromLocalStorage = (col: CollectionKey): any[] | null => {
    try {
      const raw = localStorage.getItem(lsKey(col));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return null;
  };

  const fetchRecords = async (collectionKey: CollectionKey) => {
    if (!adminToken) return;
    setLoading(true);
    try {
      const res = await fetch(getApiEndpoint(`/admin/records/${collectionKey}`), { headers: getAuthHeaders() });
      if (res.status === 401) {
        handleAdminLogout();
        return;
      }
      const data = await res.json();
      if (data && data.success && Array.isArray(data.records)) {
        // Server has live MySQL data
        setDbEngineLabel('MySQL (Bluehost)');
        persistToLocalStorage(collectionKey, data.records);
        setRecords(data.records);
      } else {
        // Server returned invalid structure — fallback to localStorage or seeds
        setDbEngineLabel('Browser Storage (Offline)');
        const local = loadFromLocalStorage(collectionKey);
        if (local) {
          setRecords(local);
        } else {
          const seeds = FALLBACK_DATA[collectionKey] || [];
          persistToLocalStorage(collectionKey, seeds);
          setRecords(seeds);
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch ${collectionKey} API records, loading from localStorage:`, err);
      setDbEngineLabel('Browser Storage (Offline)');
      const local = loadFromLocalStorage(collectionKey);
      if (local) {
        setRecords(local);
      } else {
        const seeds = FALLBACK_DATA[collectionKey] || [];
        persistToLocalStorage(collectionKey, seeds);
        setRecords(seeds);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      setSearchQuery('');
      setStatusFilter('all');
      fetchStats();
      fetchRecords(activeCollection);
    }
  }, [activeCollection, adminToken]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const addAuditLog = (action: string, details: string) => {
    const newLog = {
      id: `log-${Date.now()}`,
      action,
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setAuditLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  const handleFormFieldChange = (field: string, value: any) => {
    const updated = { ...editFormData, [field]: value };
    setEditFormData(updated);
    setJsonText(JSON.stringify(updated, null, 2));
  };

  const handleJsonTextChange = (text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setEditFormData(parsed);
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  // Record CRUD Operations
  const handleSaveRecord = async () => {
    setJsonError(null);
    let recordToSave = editorMode === 'gui' ? editFormData : null;
    if (!recordToSave || editorMode === 'json') {
      try {
        recordToSave = JSON.parse(jsonText);
      } catch (e: any) {
        setJsonError(`Invalid JSON syntax: ${e.message}`);
        return;
      }
    }

    try {
      let res;
      if (isCreatingNew) {
        res = await fetch(getApiEndpoint(`/admin/records/${activeCollection}`), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(recordToSave)
        });
      } else {
        const targetRecordId = selectedRecord?.id || recordToSave?.id;
        if (!targetRecordId) {
          showToast('error', 'Record ID is missing');
          return;
        }
        res = await fetch(getApiEndpoint(`/admin/records/${activeCollection}/${targetRecordId}`), {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(recordToSave)
        });
      }

      showToast('success', isCreatingNew ? 'New record created successfully!' : `Record '${recordToSave.id}' updated!`);
      addAuditLog(isCreatingNew ? 'CREATE' : 'UPDATE', `Collection: ${activeCollection} | ID: ${recordToSave.id}`);
      
      setRecords(prev => {
        const idx = prev.findIndex(r => String(r.id) === String(recordToSave.id));
        let next: any[];
        if (idx !== -1) {
          next = [...prev];
          next[idx] = recordToSave;
        } else {
          next = [recordToSave, ...prev];
        }
        persistToLocalStorage(activeCollection, next);
        return next;
      });

      setIsEditModalOpen(false);
      fetchStats();
    } catch (err: any) {
      // API failed — save to localStorage only
      setRecords(prev => {
        const idx = prev.findIndex(r => String(r.id) === String(recordToSave.id));
        let next: any[];
        if (idx !== -1) {
          next = [...prev];
          next[idx] = recordToSave;
        } else {
          next = [recordToSave, ...prev];
        }
        persistToLocalStorage(activeCollection, next);
        return next;
      });
      showToast('success', isCreatingNew ? '✅ Record saved locally (offline mode)!' : '✅ Record updated locally (offline mode)!');
      addAuditLog(isCreatingNew ? 'CREATE' : 'UPDATE', `Collection: ${activeCollection} | ID: ${recordToSave.id}`);
      setIsEditModalOpen(false);
    }
  };

  const handleDeleteRecord = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Record Deletion',
      message: `Are you sure you want to permanently delete record '${id}' from '${activeCollection}'?`,
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(getApiEndpoint(`/admin/records/${activeCollection}/${id}`), {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          const data = await res.json();
          if (data.success) {
            showToast('success', `Record '${id}' deleted.`);
            addAuditLog('DELETE', `Collection: ${activeCollection} | ID: ${id}`);
            fetchRecords(activeCollection);
            fetchStats();
          } else {
            showToast('error', data.error || 'Failed to delete record.');
          }
        } catch (err: any) {
          // API failed — remove from localStorage only
          setRecords(prev => {
            const next = prev.filter(r => String(r.id) !== String(id));
            persistToLocalStorage(activeCollection, next);
            return next;
          });
          showToast('success', `✅ Record '${id}' removed locally (offline mode).`);
          addAuditLog('DELETE', `Collection: ${activeCollection} | ID: ${id}`);
          fetchStats();
        }
      }
    });
  };

  const handleResetDatabase = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Confirm Database Reset',
      message: '⚠️ WARNING: This will reset all database tables back to the initial seed dataset. Continue?',
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          const res = await fetch(getApiEndpoint('/admin/reset'), { method: 'POST', headers: getAuthHeaders() });
          const data = await res.json();
          if (data.success) {
            showToast('success', 'Database re-seeded successfully!');
            addAuditLog('RESET_DB', 'All collections restored to seed defaults');
            // Clear localStorage so seeds are reloaded fresh
            (['users','talentProfiles','clientProfiles','jobs','jobApplications','crewCalls','talentMedia'] as CollectionKey[]).forEach(col => {
              localStorage.removeItem(`cinecraft_db_${col}`);
            });
            fetchRecords(activeCollection);
            fetchStats();
          } else {
            showToast('error', 'Database reset failed.');
          }
        } catch (err: any) {
          // API offline — reset localStorage to seeds
          (['users','talentProfiles','clientProfiles','jobs','jobApplications','crewCalls','talentMedia'] as CollectionKey[]).forEach(col => {
            localStorage.removeItem(`cinecraft_db_${col}`);
          });
          setRecords(FALLBACK_DATA[activeCollection] || []);
          showToast('success', '✅ Database reset to seed defaults (offline mode).');
          addAuditLog('RESET_DB', 'All collections restored to seed defaults (offline)');
        }
      }
    });
  };

  const handleExportJSON = async () => {
    try {
      const res = await fetch(getApiEndpoint('/admin/export'), { headers: getAuthHeaders() });
      const data = await res.json();
      if (data.success) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(data.export, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `cinecraft_database_backup_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('success', 'Database exported as JSON file!');
        addAuditLog('EXPORT_DB', 'Full database JSON backup downloaded');
      }
    } catch (err: any) {
      showToast('error', `Export failed: ${err.message}`);
    }
  };

  // Helper for export headers and cell formatting
  const getExportHeaders = (items: any[]) => {
    if (!items || items.length === 0) return ['id'];
    const keysSet = new Set<string>();
    items.forEach(item => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach(k => keysSet.add(k));
      }
    });
    return Array.from(keysSet);
  };

  const formatExportCell = (val: any): string => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  // 1. EXCEL TABLE EXPORT (.csv with UTF-8 BOM)
  const handleExportExcel = (itemsToExport = filteredRecords, name = activeCollection) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      showToast('error', 'No records available to export.');
      return;
    }
    const headers = getExportHeaders(itemsToExport);
    const csvRows: string[] = [];

    // Header row
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

    // Data rows
    itemsToExport.forEach(item => {
      const row = headers.map(h => {
        const val = formatExportCell(item[h]);
        return `"${val.replace(/"/g, '""')}"`;
      });
      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `CineCraft_${name}_Excel_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('success', `Exported ${itemsToExport.length} records to Excel table (.csv)!`);
    addAuditLog('EXPORT_EXCEL', `Exported ${name} collection (${itemsToExport.length} rows)`);
  };

  // 2. WORD TABLE EXPORT (.doc)
  const handleExportWord = (itemsToExport = filteredRecords, name = activeCollection) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      showToast('error', 'No records available to export.');
      return;
    }
    const headers = getExportHeaders(itemsToExport);
    
    const tableHeaderHtml = headers.map(h => 
      `<th style="background-color: #0f172a; color: #ffffff; padding: 10px; border: 1px solid #cbd5e1; text-align: left; text-transform: uppercase; font-size: 11px;">${h.replace(/_/g, ' ')}</th>`
    ).join('');

    const tableRowsHtml = itemsToExport.map((item, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = headers.map(h => {
        const val = formatExportCell(item[h]);
        return `<td style="padding: 8px 10px; border: 1px solid #e2e8f0; font-size: 12px; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; word-break: break-word;">${val.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
      }).join('');
      return `<tr style="background-color: ${bg};">${cells}</tr>`;
    }).join('');

    const wordDocumentHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>CineCraft Database Export - ${name}</title>
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; padding: 20px; color: #0f172a; }
          h1 { color: #ff3e00; font-size: 22px; margin-bottom: 4px; font-weight: bold; }
          .meta { font-size: 12px; color: #64748b; margin-bottom: 20px; border-bottom: 2px solid #ff3e00; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        </style>
      </head>
      <body>
        <h1>CineCraft Production Database — ${name.toUpperCase()} TABLE</h1>
        <div class="meta">
          <strong>Generated:</strong> ${new Date().toLocaleString()} | 
          <strong>Collection:</strong> ${name} | 
          <strong>Total Records:</strong> ${itemsToExport.length}
        </div>
        <table>
          <thead>
            <tr>${tableHeaderHtml}</tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordDocumentHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineCraft_${name}_WordTable_${Date.now()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('success', `Exported ${itemsToExport.length} records to Word table document (.doc)!`);
    addAuditLog('EXPORT_WORD', `Exported ${name} collection as Word table`);
  };

  // 3. PDF TABLE EXPORT (.pdf)
  const handleExportPDF = (itemsToExport = filteredRecords, name = activeCollection) => {
    if (!itemsToExport || itemsToExport.length === 0) {
      showToast('error', 'No records available to export.');
      return;
    }
    const headers = getExportHeaders(itemsToExport);

    const printWin = window.open('', '_blank');
    if (!printWin) {
      showToast('error', 'Pop-up blocked. Please allow pop-ups to generate PDF.');
      return;
    }

    const tableHeaders = headers.map(h => `<th style="border: 1px solid #cbd5e1; padding: 8px; background: #0f172a; color: white; text-align: left; font-size: 10px; text-transform: uppercase;">${h.replace(/_/g, ' ')}</th>`).join('');
    const tableRows = itemsToExport.map((item, idx) => {
      const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
      const cells = headers.map(h => {
        const val = formatExportCell(item[h]);
        return `<td style="border: 1px solid #e2e8f0; padding: 6px 8px; font-size: 10px; word-break: break-all;">${val.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
      }).join('');
      return `<tr style="background: ${bg};">${cells}</tr>`;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>CineCraft DB Export - ${name}</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 20px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff3e00; padding-bottom: 12px; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: 800; color: #ff3e00; text-transform: uppercase; letter-spacing: 1px; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; table-layout: auto; }
          .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
          @media print {
            button { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">CineCraft Database Report</div>
            <div class="subtitle">Collection: <strong>${name.toUpperCase()}</strong> | Records: <strong>${itemsToExport.length}</strong> | Date: ${new Date().toLocaleString()}</div>
          </div>
          <button onclick="window.print()" style="background: #ff3e00; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">Print / Save as PDF</button>
        </div>

        <table>
          <thead>
            <tr>${tableHeaders}</tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          CineCraft Film & Media Marketplace — Confidential Database Export
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlContent);
    printWin.document.close();

    showToast('success', `PDF printable table document created!`);
    addAuditLog('EXPORT_PDF', `Exported ${name} table as PDF`);
  };

  const generateNextId = (colKey: CollectionKey, role?: string) => {
    const list = (records && records.length > 0) ? records : (FALLBACK_DATA[colKey] || []);
    if (colKey === 'users') {
      const prefix = role === 'admin' ? 'user-a' : role === 'client' ? 'user-c' : 'user-t';
      let max = 0;
      list.forEach(r => {
        if (r.id && r.id.startsWith(prefix)) {
          const num = parseInt(r.id.replace(prefix, ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      return `${prefix}${max + 1}`;
    } else if (colKey === 'talentProfiles') {
      let max = 0;
      list.forEach(r => {
        if (r.id && r.id.startsWith('talent-')) {
          const num = parseInt(r.id.replace('talent-', ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      return `talent-${max + 1}`;
    } else if (colKey === 'clientProfiles') {
      let max = 0;
      list.forEach(r => {
        if (r.id && r.id.startsWith('client-')) {
          const num = parseInt(r.id.replace('client-', ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      return `client-${max + 1}`;
    } else if (colKey === 'jobs') {
      let max = 0;
      list.forEach(r => {
        if (r.id && r.id.startsWith('job-')) {
          const num = parseInt(r.id.replace('job-', ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      return `job-${max + 1}`;
    } else if (colKey === 'jobApplications') {
      let max = 0;
      list.forEach(r => {
        if (r.id && r.id.startsWith('app-')) {
          const num = parseInt(r.id.replace('app-', ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      return `app-${max + 1}`;
    } else if (colKey === 'crewCalls') {
      let max = 0;
      list.forEach(r => {
        if (r.id && r.id.startsWith('crewcall-')) {
          const num = parseInt(r.id.replace('crewcall-', ''), 10);
          if (!isNaN(num) && num > max) max = num;
        }
      });
      return `crewcall-${max + 1}`;
    }
    return `${colKey.slice(0, 3)}-1`;
  };

  const openCreateModal = () => {
    setIsCreatingNew(true);
    let sampleTemplate: any = { id: generateNextId(activeCollection) };
    if (activeCollection === 'users') {
      const nextId = generateNextId('users', 'talent');
      sampleTemplate = {
        id: nextId,
        email: `new.${nextId}@cinema.com`,
        full_name: 'New Talent User',
        role: 'talent',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
        phone_number: '+1 (555) 019-2831',
        created_at: new Date().toISOString()
      };
    } else if (activeCollection === 'talentProfiles') {
      const nextId = generateNextId('talentProfiles');
      sampleTemplate = {
        id: nextId,
        user_id: generateNextId('users', 'talent'),
        full_name: 'New Cinematographer',
        category: 'cinematography',
        tagline: 'Director of Photography & Camera Operator',
        hourly_rate: 150.00,
        day_rate: 1200.00,
        location: 'Los Angeles, CA',
        is_available: true,
        created_at: new Date().toISOString()
      };
    } else if (activeCollection === 'clientProfiles') {
      const nextId = generateNextId('clientProfiles');
      sampleTemplate = {
        id: nextId,
        user_id: generateNextId('users', 'client'),
        company_name: 'New Studio Client',
        company_type: 'Production Company',
        location: 'Los Angeles, CA',
        website: 'https://newstudio.com',
        bio: 'High-end commercial & feature studio.',
        verified: true,
        created_at: new Date().toISOString()
      };
    } else if (activeCollection === 'jobs') {
      const nextId = generateNextId('jobs');
      sampleTemplate = {
        id: nextId,
        client_name: 'Apex Studios',
        title: 'Lead Gaffer & Lighting Director',
        department: 'lighting_grip',
        location: 'Atlanta, GA',
        budget_min: 5000,
        budget_max: 8000,
        status: 'open',
        created_at: new Date().toISOString()
      };
    } else if (activeCollection === 'jobApplications') {
      const nextId = generateNextId('jobApplications');
      sampleTemplate = {
        id: nextId,
        job_id: 'job-1',
        talent_name: 'Applicant Name',
        bid_rate: 1500,
        status: 'applied',
        created_at: new Date().toISOString()
      };
    } else if (activeCollection === 'crewCalls') {
      const nextId = generateNextId('crewCalls');
      sampleTemplate = {
        id: nextId,
        job_id: 'job-1',
        client_id: 'client-1',
        producer_name: 'Apex Media Studios',
        call_title: 'Lead Director of Photography - Sci-Fi Short',
        department: 'cinematography',
        project_type: 'Commercial',
        crew_positions_needed: 1,
        budget_range: '$1,500 - $2,000 / day',
        location: 'Los Angeles, CA',
        shoot_dates: 'Aug 15 - Aug 28, 2026',
        status: 'active',
        call_sheet_notes: 'Must bring ARRI Alexa camera package.',
        created_at: new Date().toISOString()
      };
    }

    setSelectedRecord(sampleTemplate);
    setEditFormData(sampleTemplate);
    setEditorMode('gui');
    setJsonText(JSON.stringify(sampleTemplate, null, 2));
    setIsEditModalOpen(true);
  };

  const openCreateAdminModal = () => {
    setIsCreatingNew(true);
    const nextAdminId = generateNextId('users', 'admin');
    const sampleAdmin = {
      id: nextAdminId,
      email: `it.admin${nextAdminId.replace('user-a', '')}@cinecraft.com`,
      full_name: 'Backend IT Systems Admin',
      role: 'admin',
      password_hash: '$2a$10$wT2.k0z/m/S.g3c1h902/eN4S8.93z8u8/r0yK8iJ.z4y.k6.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
      phone_number: '+1 (800) 555-IT-ADMIN',
      created_at: new Date().toISOString()
    };
    setSelectedRecord(sampleAdmin);
    setEditFormData(sampleAdmin);
    setEditorMode('gui');
    setJsonText(JSON.stringify(sampleAdmin, null, 2));
    setIsEditModalOpen(true);
  };

  const openEditModal = (record: any) => {
    setIsCreatingNew(false);
    setSelectedRecord(record);
    setEditFormData(record);
    setEditorMode('gui');
    setJsonText(JSON.stringify(record, null, 2));
    setIsEditModalOpen(true);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtering records
  const filteredRecords = records.filter(rec => {
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const match = Object.values(rec).some(val => {
        if (typeof val === 'string') return val.toLowerCase().includes(q);
        if (typeof val === 'number') return val.toString().includes(q);
        return false;
      });
      if (!match) return false;
    }
    if (statusFilter !== 'all') {
      if (activeCollection === 'users' && rec.role && rec.role !== statusFilter) return false;
      if (activeCollection !== 'users' && rec.status && rec.status !== statusFilter) return false;
    }
    return true;
  });

  const collectionTabs: { key: CollectionKey; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'users', label: 'Users', icon: <Users className="w-4 h-4" />, count: stats?.counts.users || 0 },
    { key: 'talentProfiles', label: 'Talents', icon: <Film className="w-4 h-4" />, count: stats?.counts.talents || 0 },
    { key: 'clientProfiles', label: 'Clients', icon: <Briefcase className="w-4 h-4" />, count: (stats?.counts as any)?.clients || stats?.roles?.clients || 0 },
    { key: 'crewCalls', label: 'Crew Calls DB', icon: <Film className="w-4 h-4" />, count: (stats?.counts as any)?.crewCalls || 0 },
    { key: 'jobs', label: 'Jobs', icon: <Briefcase className="w-4 h-4" />, count: stats?.counts.jobs || 0 },
    { key: 'jobApplications', label: 'Applications', icon: <FileText className="w-4 h-4" />, count: stats?.counts.applications || 0 },
    { key: 'talentMedia', label: 'Media Vault', icon: <HardDrive className="w-4 h-4" />, count: stats?.counts.media || 0 },
  ];

  /* ---------------------------------------------------------------------------------- */
  /* UNAUTHENTICATED: ENCRYPTED ADMIN LOGIN GATEWAY SCREEN                              */
  /* ---------------------------------------------------------------------------------- */
  if (!adminToken) {
    return (
      <div className={`min-h-screen ${isDaylight ? 'bg-[#f0f3f8] text-[#0f172a]' : 'bg-[#12141a] text-[#f8f7f4]'} flex items-center justify-center p-4 font-sans transition-colors duration-300`}>
        <div className={`w-full max-w-md p-8 rounded-3xl border ${isDaylight ? 'bg-white border-[#cbd5e1] shadow-xl' : 'bg-[#1a1d26] border-[#f8f7f4]/10 shadow-2xl'} space-y-6 animate-fade-in relative`}>
          
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 rounded-2xl bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-syne text-xl font-bold uppercase tracking-tight">Admin Security Gateway</h2>
              <p className={`text-xs ${isDaylight ? 'text-slate-600' : 'text-[#f8f7f4]/60'} font-mono-code mt-1`}>
                Authentication required for Database Administration
              </p>
            </div>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-code flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* AUTHENTICATION METHOD SWITCHER */}
          <div className="flex rounded-xl p-1 bg-black/20 border border-slate-500/15 text-xs font-mono-code font-bold uppercase">
            <button
              type="button"
              onClick={() => { setLoginMode('passkey'); setLoginError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                loginMode === 'passkey' ? 'bg-[#ff3e00] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Master Passcode
            </button>
            <button
              type="button"
              onClick={() => { setLoginMode('credentials'); setLoginError(null); }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                loginMode === 'credentials' ? 'bg-[#ff3e00] text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Admin Account
            </button>
          </div>

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            {loginMode === 'passkey' ? (
              <div>
                <label className="block text-[0.7rem] font-mono-code font-bold uppercase text-slate-400 mb-1.5">
                  Security Passkey / Secret Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter admin passcode (e.g. admin123)"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-xs font-mono-code border outline-none transition-all ${
                      isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#ff3e00]' : 'bg-[#12141a] border-[#f8f7f4]/15 text-[#f8f7f4] focus:border-[#ff3e00]'
                    }`}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-[0.7rem] font-mono-code font-bold uppercase text-slate-400 mb-1.5">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl text-xs font-mono-code border outline-none transition-all ${
                      isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#ff3e00]' : 'bg-[#12141a] border-[#f8f7f4]/15 text-[#f8f7f4] focus:border-[#ff3e00]'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[0.7rem] font-mono-code font-bold uppercase text-slate-400 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl text-xs font-mono-code border outline-none transition-all ${
                      isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#ff3e00]' : 'bg-[#12141a] border-[#f8f7f4]/15 text-[#f8f7f4] focus:border-[#ff3e00]'
                    }`}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#ff3e00] text-white font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-[#d93800] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loginSubmitting ? 'Authenticating...' : 'Authenticate Admin Session'}</span>
            </button>
          </form>

          {/* DEMO QUICK ACCESSIBLE KEYS CHIP */}
          <div className="pt-2 border-t border-slate-500/15 space-y-2 text-center">
            <span className="text-[0.65rem] font-mono-code text-slate-400 uppercase tracking-widest block">
              Quick Admin Test Credentials:
            </span>
            <div className="flex flex-wrap justify-center gap-2 text-[0.65rem] font-mono-code">
              <button
                type="button"
                onClick={() => { setLoginMode('passkey'); setPasskeyInput('admin123'); }}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
              >
                Passkey: admin123
              </button>
              <button
                type="button"
                onClick={() => { setLoginMode('passkey'); setPasskeyInput('cinecraft2026'); }}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 cursor-pointer"
              >
                Passkey: cinecraft2026
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------------------------- */
  /* AUTHENTICATED ADMIN PORTAL DASHBOARD                                               */
  /* ---------------------------------------------------------------------------------- */
  return (
    <div className={`min-h-screen ${isDaylight ? 'bg-[#f0f3f8] text-[#0f172a]' : 'bg-[#181a20] text-[#f8f7f4]'} transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* TOAST NOTIFICATION */}
        {notification && (
          <div className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs font-mono-code font-bold uppercase tracking-wider border animate-fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            {notification.message}
          </div>
        )}

        {/* HEADER & DATABASE HEALTH METRICS */}
        <div className={`p-6 rounded-2xl border ${isDaylight ? 'bg-white border-[#cbd5e1] shadow-sm' : 'bg-[#20232c] border-[#f8f7f4]/10'} space-y-6`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-syne text-2xl font-bold uppercase tracking-tight">Database Administration Portal</h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[0.65rem] font-mono-code font-bold uppercase flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secured Session
                    </span>
                  </div>
                  <p className={`text-xs ${isDaylight ? 'text-slate-600' : 'text-[#f8f7f4]/60'} font-mono-code mt-0.5`}>
                    Logged in as: <span className="text-[#ff3e00] font-bold">{adminUser?.email || 'Administrator'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => { fetchStats(); fetchRecords(activeCollection); showToast('success', 'Refreshed database state'); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-mono-code text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isDaylight ? 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800' : 'bg-[#282c37] border-[#f8f7f4]/15 hover:bg-[#323745] text-[#f8f7f4]'
                }`}
                title="Refresh Records"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#ff3e00]" />
                <span>Refresh</span>
              </button>

              {/* EXPORT OPTIONS DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono-code text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    isExportMenuOpen
                      ? 'bg-[#ff3e00] text-white border-[#ff3e00]'
                      : isDaylight ? 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-800' : 'bg-[#282c37] border-[#f8f7f4]/15 hover:bg-[#323745] text-[#f8f7f4]'
                  }`}
                  title="Export Database Table Options"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Export Options</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {isExportMenuOpen && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl z-50 p-2 space-y-1 ${
                    isDaylight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#1e222b] border-[#f8f7f4]/15 text-[#f8f7f4]'
                  }`}>
                    <div className="px-3 py-1.5 text-[0.65rem] font-mono-code font-bold uppercase tracking-wider text-slate-400 border-b border-slate-500/20 flex justify-between">
                      <span>Export Table ({activeCollection})</span>
                      <span className="text-[#ff3e00] font-bold">{filteredRecords.length} rows</span>
                    </div>

                    <button
                      onClick={() => { handleExportExcel(); setIsExportMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div>Excel Table (.csv / .xlsx)</div>
                        <div className="text-[0.6rem] font-normal text-slate-400 lowercase">Spreadsheet with UTF-8 BOM</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleExportPDF(); setIsExportMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      <Printer className="w-4 h-4 text-rose-500" />
                      <div>
                        <div>PDF Table (.pdf)</div>
                        <div className="text-[0.6rem] font-normal text-slate-400 lowercase">Printable document grid</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { handleExportWord(); setIsExportMenuOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-500/10 hover:text-blue-500 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer text-left"
                    >
                      <FileType className="w-4 h-4 text-blue-500" />
                      <div>
                        <div>Word Table (.doc)</div>
                        <div className="text-[0.6rem] font-normal text-slate-400 lowercase">Microsoft Word table doc</div>
                      </div>
                    </button>

                    <div className="border-t border-slate-500/20 pt-1">
                      <button
                        onClick={() => { handleExportJSON(); setIsExportMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-500/10 hover:text-amber-500 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer text-left"
                      >
                        <Code className="w-4 h-4 text-amber-500" />
                        <div>
                          <div>Full DB Backup (.json)</div>
                          <div className="text-[0.6rem] font-normal text-slate-400 lowercase">Raw database backup payload</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleResetDatabase}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-all cursor-pointer"
                title="Reset Database to Seed State"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Seed DB</span>
              </button>

              {activeCollection === 'users' && (
                <button
                  onClick={openCreateAdminModal}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/40 font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-purple-600/30 transition-all cursor-pointer"
                  title="Add New IT Systems / Admin User Account"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>+ Add IT / Admin User</span>
                </button>
              )}

              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff3e00] text-white font-mono-code text-xs font-bold uppercase tracking-wider hover:bg-[#d93800] transition-all cursor-pointer shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Record</span>
              </button>

              <button
                onClick={handleAdminLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono-code text-xs font-bold uppercase hover:bg-rose-500/20 transition-all cursor-pointer"
                title="Lock Session & Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock Portal</span>
              </button>
            </div>
          </div>

          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-[#cbd5e1]/40 border-dashed">
            <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a20] border-[#f8f7f4]/10'}`}>
              <div className="flex items-center gap-1.5 text-[0.65rem] font-mono-code uppercase text-[#ff3e00] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Security
              </div>
              <div className="text-sm font-bold font-mono-code mt-0.5 text-emerald-500">AUTHENTICATED</div>
            </div>

            <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a20] border-[#f8f7f4]/10'}`}>
              <div className="flex items-center gap-1.5 text-[0.65rem] font-mono-code uppercase text-slate-400 font-bold">
                <Cpu className="w-3.5 h-3.5" /> DB Engine
              </div>
              <div className={`text-xs font-bold font-mono-code mt-0.5 truncate ${dbEngineLabel.includes('MySQL') ? 'text-emerald-400' : 'text-amber-400'}`}>
                {dbEngineLabel}
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a20] border-[#f8f7f4]/10'}`}>
              <div className="text-[0.65rem] font-mono-code uppercase text-slate-400 font-bold">Total Users</div>
              <div className="text-lg font-extrabold font-mono-code mt-0.5 text-[#ff3e00]">{stats?.counts.users || 0}</div>
            </div>

            <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a20] border-[#f8f7f4]/10'}`}>
              <div className="text-[0.65rem] font-mono-code uppercase text-slate-400 font-bold">Talent Profiles</div>
              <div className="text-lg font-extrabold font-mono-code mt-0.5 text-blue-400">{stats?.counts.talents || 0}</div>
            </div>

            <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a20] border-[#f8f7f4]/10'}`}>
              <div className="text-[0.65rem] font-mono-code uppercase text-slate-400 font-bold">Job Listings</div>
              <div className="text-lg font-extrabold font-mono-code mt-0.5 text-purple-400">{stats?.counts.jobs || 0}</div>
            </div>

            <div className={`p-3 rounded-xl border ${isDaylight ? 'bg-slate-50 border-slate-200' : 'bg-[#181a20] border-[#f8f7f4]/10'}`}>
              <div className="text-[0.65rem] font-mono-code uppercase text-slate-400 font-bold">Job Applications</div>
              <div className="text-lg font-extrabold font-mono-code mt-0.5 text-emerald-400">{stats?.counts.applications || 0}</div>
            </div>
          </div>
        </div>

        {/* COLLECTION TABS */}
        <div className="flex flex-wrap gap-2 border-b border-[#cbd5e1]/40 pb-2">
          {collectionTabs.map((tab) => {
            const isActive = activeCollection === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveCollection(tab.key); setSearchQuery(''); setStatusFilter('all'); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-code text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#ff3e00] text-white border-[#ff3e00] shadow-md'
                    : isDaylight
                    ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                    : 'bg-[#20232c] border-[#f8f7f4]/10 text-[#f8f7f4]/70 hover:bg-[#282c37] hover:text-[#f8f7f4]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[0.65rem] ${
                  isActive ? 'bg-black/20 text-white' : isDaylight ? 'bg-slate-200 text-slate-800' : 'bg-[#181a20] text-[#f8f7f4]/60'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* SEARCH & CONTROLS TOOLBAR */}
        <div className={`p-4 rounded-2xl border ${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#20232c] border-[#f8f7f4]/10'} flex flex-col md:flex-row md:items-center justify-between gap-4`}>
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder={`Search ${activeCollection}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-mono-code border outline-none transition-all ${
                  isDaylight
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#ff3e00]'
                    : 'bg-[#181a20] border-[#f8f7f4]/15 text-[#f8f7f4] focus:border-[#ff3e00]'
                }`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs font-mono-code border outline-none transition-all ${
                isDaylight
                  ? 'bg-slate-50 border-slate-300 text-slate-900'
                  : 'bg-[#181a20] border-[#f8f7f4]/15 text-[#f8f7f4]'
              }`}
            >
              <option value="all">Filter: All Statuses / Roles</option>
              {activeCollection === 'users' && (
                <>
                  <option value="talent">Role: Talent</option>
                  <option value="client">Role: Client / Agency</option>
                  <option value="admin">Role: Administrator</option>
                </>
              )}
              {activeCollection === 'jobs' && (
                <>
                  <option value="open">Status: Open</option>
                  <option value="closed">Status: Closed</option>
                </>
              )}
              {activeCollection === 'jobApplications' && (
                <>
                  <option value="applied">Status: Applied</option>
                  <option value="shortlisted">Status: Shortlisted</option>
                  <option value="rejected">Status: Rejected</option>
                </>
              )}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Export Shortcuts */}
            <div className="flex items-center gap-1 border-r border-slate-500/20 pr-2">
              <span className="text-[0.65rem] font-mono-code text-slate-400 font-bold uppercase mr-1 hidden lg:inline">Export:</span>
              <button
                onClick={() => handleExportExcel()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer"
                title="Export Filtered Table to Excel (.csv)"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
              <button
                onClick={() => handleExportPDF()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer"
                title="Print or Save Filtered Table to PDF"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => handleExportWord()}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-xs font-mono-code font-bold uppercase transition-all cursor-pointer"
                title="Export Filtered Table to Word Document (.doc)"
              >
                <FileType className="w-3.5 h-3.5" />
                <span>Word</span>
              </button>
            </div>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#ff3e00] text-white border-[#ff3e00]'
                  : isDaylight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#181a20] border-[#f8f7f4]/15 text-slate-400'
              }`}
              title="Table Grid View"
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('json')}
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                viewMode === 'json'
                  ? 'bg-[#ff3e00] text-white border-[#ff3e00]'
                  : isDaylight ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-[#181a20] border-[#f8f7f4]/15 text-slate-400'
              }`}
              title="Raw JSON View"
            >
              <Code className="w-3.5 h-3.5 inline mr-1" />
              Raw JSON
            </button>
          </div>
        </div>

        {/* DATA RECORDS VIEW */}
        {loading ? (
          <div className="p-12 text-center font-mono-code text-xs uppercase tracking-wider text-[#ff3e00] animate-pulse">
            Loading Records from Database API...
          </div>
        ) : viewMode === 'json' ? (
          /* JSON RAW VIEW MODE */
          <div className={`p-6 rounded-2xl border ${isDaylight ? 'bg-slate-900 text-emerald-400 border-slate-800' : 'bg-[#0d0e12] text-emerald-400 border-[#f8f7f4]/10'} font-mono-code text-xs relative overflow-x-auto max-h-[600px]`}>
            <button
              onClick={() => copyToClipboard(JSON.stringify(filteredRecords, null, 2), 'raw-json')}
              className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-lg border border-emerald-500/30 flex items-center gap-1.5 hover:bg-emerald-500/30 cursor-pointer"
            >
              {copiedId === 'raw-json' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedId === 'raw-json' ? 'Copied' : 'Copy JSON'}
            </button>
            <pre>{JSON.stringify(filteredRecords, null, 2)}</pre>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${isDaylight ? 'bg-white border-slate-300' : 'bg-[#20232c] border-[#f8f7f4]/10'}`}>
            <p className="font-mono-code text-xs text-slate-400 uppercase tracking-widest">No matching records found in '{activeCollection}'.</p>
          </div>
        ) : (
          /* TABLE GRID VIEW MODE */
          <div className={`rounded-2xl border ${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#20232c] border-[#f8f7f4]/10'} overflow-x-auto shadow-sm`}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDaylight ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#181a20] border-[#f8f7f4]/10 text-[#f8f7f4]/60'} font-mono-code text-[0.68rem] uppercase tracking-wider`}>
                  <th className="p-4">Record ID</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">Category / Role</th>
                  <th className="p-4">Status / Meta</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cbd5e1]/30 font-mono-code text-xs">
                {filteredRecords.map((record) => (
                  <tr 
                    key={record.id}
                    className={`transition-colors ${isDaylight ? 'hover:bg-slate-50' : 'hover:bg-[#282c37]/50'}`}
                  >
                    {/* RECORD ID */}
                    <td className="p-4 font-bold text-[#ff3e00] whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{record.id}</span>
                        <button
                          onClick={() => copyToClipboard(record.id, record.id)}
                          className="p-1 hover:text-white transition-colors cursor-pointer"
                          title="Copy ID"
                        >
                          {copiedId === record.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                        </button>
                      </div>
                    </td>

                    {/* DETAILS / NAME */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {(record.avatar_url || record.talent_avatar || record.client_logo) && (
                          <img
                            src={record.avatar_url || record.talent_avatar || record.client_logo}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-[#ff3e00]/30"
                          />
                        )}
                        <div>
                          <div className={`font-bold ${isDaylight ? 'text-slate-900' : 'text-[#f8f7f4]'}`}>
                            {record.full_name || record.title || record.talent_name || record.email || record.id}
                          </div>
                          {record.email && <div className="text-[0.65rem] text-slate-400">{record.email}</div>}
                          {record.tagline && <div className="text-[0.65rem] text-slate-400 line-clamp-1 max-w-xs">{record.tagline}</div>}
                          {record.client_name && <div className="text-[0.65rem] text-slate-400">By {record.client_name}</div>}
                        </div>
                      </div>
                    </td>

                    {/* CATEGORY / ROLE */}
                    <td className="p-4 whitespace-nowrap">
                      {record.role && (
                        <span className={`px-2.5 py-1 rounded-full text-[0.65rem] uppercase font-bold ${
                          record.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                          record.role === 'talent' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' : 'bg-purple-500/10 text-purple-500 border border-purple-500/30'
                        }`}>
                          {record.role}
                        </span>
                      )}
                      {record.category && (
                        <span className="px-2.5 py-1 rounded-full text-[0.65rem] uppercase font-bold bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/30">
                          {record.category}
                        </span>
                      )}
                      {record.department && (
                        <span className="px-2.5 py-1 rounded-full text-[0.65rem] uppercase font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                          {record.department}
                        </span>
                      )}
                    </td>

                    {/* STATUS / RATES */}
                    <td className="p-4 whitespace-nowrap">
                      {record.status && (
                        <span className={`px-2.5 py-1 rounded-full text-[0.65rem] uppercase font-bold ${
                          record.status === 'open' || record.status === 'applied' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' :
                          record.status === 'shortlisted' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/30' :
                          'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                        }`}>
                          {record.status}
                        </span>
                      )}
                      {record.day_rate && (
                        <div className="text-[0.68rem] text-emerald-500 font-bold">${record.day_rate}/day</div>
                      )}
                      {record.budget_max && (
                        <div className="text-[0.68rem] text-emerald-500 font-bold">${record.budget_min} - ${record.budget_max}</div>
                      )}
                    </td>

                    {/* CREATED DATE */}
                    <td className="p-4 text-[0.68rem] text-slate-400 whitespace-nowrap">
                      {record.created_at ? new Date(record.created_at).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setRawViewRecord(record); setIsRawModalOpen(true); }}
                          className="p-1.5 rounded-lg border border-slate-500/20 hover:bg-slate-500/10 text-slate-400 hover:text-white cursor-pointer transition-colors"
                          title="View Raw JSON"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditModal(record)}
                          className="p-1.5 rounded-lg border border-blue-500/20 hover:bg-blue-500/10 text-blue-400 cursor-pointer transition-colors"
                          title="Edit Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteRecord(record.id)}
                          className="p-1.5 rounded-lg border border-rose-500/20 hover:bg-rose-500/10 text-rose-400 cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* AUDIT LOG PANEL */}
        {auditLogs.length > 0 && (
          <div className={`p-5 rounded-2xl border ${isDaylight ? 'bg-white border-[#cbd5e1]' : 'bg-[#20232c] border-[#f8f7f4]/10'} space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="font-syne text-xs font-bold uppercase tracking-wider text-[#ff3e00]">Session Database Transaction Audit Trail</h3>
              <span className="text-[0.65rem] font-mono-code text-slate-400">{auditLogs.length} Actions Logged</span>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono-code text-[0.68rem]">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 py-1 border-b border-slate-500/10">
                  <span className="text-slate-400">{log.timestamp}</span>
                  <span className={`px-2 py-0.5 rounded text-[0.6rem] font-bold ${
                    log.action === 'CREATE' ? 'bg-emerald-500/20 text-emerald-400' :
                    log.action === 'DELETE' ? 'bg-rose-500/20 text-rose-400' :
                    log.action === 'UPDATE' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>{log.action}</span>
                  <span className="truncate">{log.details}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CREATE / EDIT RECORD MODAL (GUI FORM + RAW JSON TOGGLE) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-2xl rounded-2xl border ${isDaylight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#20232c] border-[#f8f7f4]/15 text-[#f8f7f4]'} p-6 space-y-4 shadow-2xl`}>
            <div className="flex items-center justify-between border-b border-slate-500/20 pb-3 font-mono-code">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#ff3e00]" />
                <h3 className="font-syne text-lg font-bold uppercase tracking-wide">
                  {isCreatingNew ? `Create New Record in '${activeCollection}'` : `Edit Record '${selectedRecord?.id}'`}
                </h3>
              </div>

              {/* EDITOR MODE TOGGLE: GUI FORM vs RAW JSON */}
              <div className={`flex items-center p-1 rounded-xl border ${isDaylight ? 'bg-slate-100 border-slate-300' : 'bg-[#181a20] border-[#f8f7f4]/15'}`}>
                <button
                  type="button"
                  onClick={() => setEditorMode('gui')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                    editorMode === 'gui' ? 'bg-[#ff3e00] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📋 Form GUI
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('json')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                    editorMode === 'json' ? 'bg-[#ff3e00] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Code className="w-3.5 h-3.5 inline mr-1" />
                  Raw JSON
                </button>
              </div>

              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>

            {jsonError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono-code text-xs">
                ⚠️ {jsonError}
              </div>
            )}

            {editorMode === 'gui' ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar font-mono-code text-xs">
                {/* GUI FORM INPUTS FOR USERS */}
                {activeCollection === 'users' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={editFormData.full_name || ''}
                        onChange={(e) => handleFormFieldChange('full_name', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => handleFormFieldChange('email', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Account Role *</label>
                      <select
                        value={editFormData.role || 'talent'}
                        onChange={(e) => handleFormFieldChange('role', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff3e00]`}
                      >
                        <option value="talent">Talent (Crew / Cast)</option>
                        <option value="client">Client / Agency</option>
                        <option value="admin">Administrator (IT / Systems)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editFormData.phone_number || ''}
                        onChange={(e) => handleFormFieldChange('phone_number', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Avatar Photo URL</label>
                      <input
                        type="text"
                        value={editFormData.avatar_url || ''}
                        onChange={(e) => handleFormFieldChange('avatar_url', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#ff3e00]`}
                      />
                    </div>
                  </div>
                )}

                {/* GUI FORM INPUTS FOR TALENT PROFILES */}
                {activeCollection === 'talentProfiles' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={editFormData.full_name || ''}
                        onChange={(e) => handleFormFieldChange('full_name', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Category *</label>
                      <select
                        value={editFormData.category || 'cinematography'}
                        onChange={(e) => handleFormFieldChange('category', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      >
                        <option value="cinematography">Cinematography</option>
                        <option value="directing">Directing</option>
                        <option value="sound">Sound</option>
                        <option value="editing">Editing</option>
                        <option value="vfx">VFX & Animation</option>
                        <option value="acting_performance">Acting & Performance</option>
                        <option value="production">Production</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Professional Tagline</label>
                      <input
                        type="text"
                        value={editFormData.tagline || ''}
                        onChange={(e) => handleFormFieldChange('tagline', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Location</label>
                      <input
                        type="text"
                        value={editFormData.location || ''}
                        onChange={(e) => handleFormFieldChange('location', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Day Rate ($)</label>
                      <input
                        type="number"
                        value={editFormData.day_rate || 0}
                        onChange={(e) => handleFormFieldChange('day_rate', Number(e.target.value))}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                  </div>
                )}

                {/* GUI FORM INPUTS FOR CLIENT PROFILES */}
                {activeCollection === 'clientProfiles' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={editFormData.company_name || ''}
                        onChange={(e) => handleFormFieldChange('company_name', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Company Type</label>
                      <input
                        type="text"
                        value={editFormData.company_type || ''}
                        onChange={(e) => handleFormFieldChange('company_type', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Location</label>
                      <input
                        type="text"
                        value={editFormData.location || ''}
                        onChange={(e) => handleFormFieldChange('location', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Website URL</label>
                      <input
                        type="text"
                        value={editFormData.website || ''}
                        onChange={(e) => handleFormFieldChange('website', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Studio Bio</label>
                      <textarea
                        rows={2}
                        value={editFormData.bio || ''}
                        onChange={(e) => handleFormFieldChange('bio', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                  </div>
                )}

                {/* GUI FORM INPUTS FOR JOBS */}
                {activeCollection === 'jobs' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Job Title *</label>
                      <input
                        type="text"
                        value={editFormData.title || ''}
                        onChange={(e) => handleFormFieldChange('title', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editFormData.client_name || ''}
                        onChange={(e) => handleFormFieldChange('client_name', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Department</label>
                      <input
                        type="text"
                        value={editFormData.department || ''}
                        onChange={(e) => handleFormFieldChange('department', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Project Type</label>
                      <input
                        type="text"
                        value={editFormData.project_type || ''}
                        onChange={(e) => handleFormFieldChange('project_type', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Location</label>
                      <input
                        type="text"
                        value={editFormData.location || ''}
                        onChange={(e) => handleFormFieldChange('location', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Status</label>
                      <select
                        value={editFormData.status || 'open'}
                        onChange={(e) => handleFormFieldChange('status', e.target.value)}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      >
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Min Budget ($)</label>
                      <input
                        type="number"
                        value={editFormData.budget_min || 0}
                        onChange={(e) => handleFormFieldChange('budget_min', Number(e.target.value))}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">Max Budget ($)</label>
                      <input
                        type="number"
                        value={editFormData.budget_max || 0}
                        onChange={(e) => handleFormFieldChange('budget_max', Number(e.target.value))}
                        className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                      />
                    </div>
                  </div>
                )}

                {/* GENERIC GUI FORM FOR OTHER COLLECTIONS */}
                {!['users', 'talentProfiles', 'clientProfiles', 'jobs'].includes(activeCollection) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {Object.keys(editFormData).filter(k => k !== 'id' && k !== 'created_at').map(key => (
                      <div key={key}>
                        <label className="block uppercase text-[0.62rem] text-slate-400 font-bold mb-1">{key.replace(/_/g, ' ')}</label>
                        <input
                          type="text"
                          value={typeof editFormData[key] === 'object' ? JSON.stringify(editFormData[key]) : String(editFormData[key] ?? '')}
                          onChange={(e) => handleFormFieldChange(key, e.target.value)}
                          className={`w-full ${isDaylight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#12141a] text-white border-[#f8f7f4]/20'} rounded-lg px-3 py-2 text-xs`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* RAW JSON EDITOR MODE */
              <div>
                <label className="block font-mono-code text-xs font-bold uppercase text-slate-400 mb-2">
                  Edit Record JSON Document:
                </label>
                <textarea
                  value={jsonText}
                  onChange={(e) => handleJsonTextChange(e.target.value)}
                  rows={14}
                  className={`w-full p-4 font-mono-code text-xs rounded-xl border outline-none transition-all ${
                    isDaylight ? 'bg-slate-900 text-emerald-400 border-slate-700' : 'bg-[#181a20] text-emerald-400 border-[#f8f7f4]/15'
                  }`}
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className={`px-4 py-2 rounded-xl font-mono-code text-xs font-bold uppercase ${
                  isDaylight ? 'bg-slate-200 text-slate-800' : 'bg-[#282c37] text-slate-300'
                } hover:opacity-80 cursor-pointer`}
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRecord}
                className="px-5 py-2 rounded-xl bg-[#ff3e00] text-white font-mono-code text-xs font-bold uppercase hover:bg-[#d93800] transition-all cursor-pointer shadow-md"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD VIEW MODAL */}
      {isRawModalOpen && rawViewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-3xl rounded-2xl border ${isDaylight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#20232c] border-[#f8f7f4]/15 text-[#f8f7f4]'} p-6 space-y-4 shadow-2xl`}>
            <div className="flex flex-wrap items-center justify-between border-b border-slate-500/20 pb-3 gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-lg font-bold uppercase tracking-wide">
                    Record Details: <span className="text-[#ff3e00]">{rawViewRecord.id || 'N/A'}</span>
                  </h3>
                  <span className="text-[0.65rem] font-mono-code text-slate-400 uppercase">Collection: {activeCollection}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Format Switcher */}
                <div className={`flex items-center p-1 rounded-xl border ${isDaylight ? 'bg-slate-100 border-slate-300' : 'bg-[#181a20] border-[#f8f7f4]/15'}`}>
                  <button
                    onClick={() => setModalViewFormat('table')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                      modalViewFormat === 'table'
                        ? 'bg-[#ff3e00] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Table className="w-3.5 h-3.5" />
                    Formatted Table
                  </button>
                  <button
                    onClick={() => setModalViewFormat('json')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-code font-bold uppercase transition-all cursor-pointer ${
                      modalViewFormat === 'json'
                        ? 'bg-[#ff3e00] text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    Raw JSON
                  </button>
                </div>

                <button
                  onClick={() => setIsRawModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white font-bold text-lg cursor-pointer transition-colors"
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {modalViewFormat === 'table' ? (
              <div className="max-h-[480px] overflow-y-auto rounded-xl border border-slate-500/20 divide-y divide-slate-500/15">
                <table className="w-full text-left text-xs font-mono-code border-collapse">
                  <thead>
                    <tr className={isDaylight ? 'bg-slate-100 text-slate-700' : 'bg-[#181a20] text-slate-300'}>
                      <th className="py-2.5 px-4 font-bold uppercase tracking-wider w-1/3 border-b border-slate-500/20">Field Property</th>
                      <th className="py-2.5 px-4 font-bold uppercase tracking-wider border-b border-slate-500/20">Value / Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-500/10">
                    {Object.entries(rawViewRecord).map(([key, val]) => {
                      const isUrl = typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'));
                      const isImage = isUrl && (val.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || key.includes('avatar') || key.includes('url') || key.includes('thumbnail'));

                      return (
                        <tr key={key} className={`hover:bg-slate-500/5 transition-colors ${isDaylight ? 'text-slate-900' : 'text-[#f8f7f4]'}`}>
                          <td className="py-3 px-4 font-bold text-emerald-500/90 capitalize align-top whitespace-nowrap">
                            {key.replace(/_/g, ' ')}
                            <span className="block text-[0.6rem] font-normal text-slate-500 lowercase font-mono-code">{key}</span>
                          </td>
                          <td className="py-3 px-4 align-top">
                            {val === null || val === undefined ? (
                              <span className="text-slate-500 italic">null</span>
                            ) : typeof val === 'boolean' ? (
                              <span className={`px-2 py-0.5 rounded-md text-[0.65rem] font-bold uppercase ${val ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                {val ? 'TRUE' : 'FALSE'}
                              </span>
                            ) : typeof val === 'object' ? (
                              <pre className="p-2 rounded bg-slate-900/80 text-emerald-300 text-[0.65rem] overflow-x-auto max-h-32">
                                {JSON.stringify(val, null, 2)}
                              </pre>
                            ) : isImage ? (
                              <div className="flex items-center gap-3">
                                <img src={val as string} alt={key} className="w-12 h-12 object-cover rounded-lg border border-slate-500/30 shadow-sm" />
                                <div className="space-y-1">
                                  <a href={val as string} target="_blank" rel="noreferrer" className="text-[#ff3e00] underline hover:opacity-80 break-all text-[0.7rem] block">
                                    {val as string}
                                  </a>
                                  <span className="text-[0.6rem] text-slate-400">Media Preview</span>
                                </div>
                              </div>
                            ) : isUrl ? (
                              <a href={val as string} target="_blank" rel="noreferrer" className="text-[#ff3e00] underline hover:opacity-80 break-all">
                                {val as string}
                              </a>
                            ) : (
                              <div className="flex items-center justify-between gap-2 group">
                                <span className="break-all leading-relaxed">{String(val)}</span>
                                <button
                                  onClick={() => copyToClipboard(String(val), `${rawViewRecord.id}-${key}`)}
                                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-emerald-400 transition-opacity cursor-pointer flex-shrink-0"
                                  title="Copy field value"
                                >
                                  {copiedId === `${rawViewRecord.id}-${key}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono-code text-xs max-h-[450px] overflow-y-auto">
                <pre>{JSON.stringify(rawViewRecord, null, 2)}</pre>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-500/20">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleExportExcel([rawViewRecord], `Record_${rawViewRecord.id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-code text-xs font-bold uppercase hover:bg-emerald-500/20 cursor-pointer"
                  title="Export single record to Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
                <button
                  onClick={() => handleExportPDF([rawViewRecord], `Record_${rawViewRecord.id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono-code text-xs font-bold uppercase hover:bg-rose-500/20 cursor-pointer"
                  title="Print / Save single record to PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleExportWord([rawViewRecord], `Record_${rawViewRecord.id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono-code text-xs font-bold uppercase hover:bg-blue-500/20 cursor-pointer"
                  title="Export single record to Word"
                >
                  <FileType className="w-3.5 h-3.5" />
                  <span>Word</span>
                </button>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(rawViewRecord, null, 2), rawViewRecord.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-mono-code text-xs font-bold uppercase hover:bg-slate-700 cursor-pointer"
                >
                  {copiedId === rawViewRecord.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === rawViewRecord.id ? 'Copied' : 'JSON'}
                </button>
              </div>

              <button
                onClick={() => setIsRawModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#282c37] text-slate-200 font-mono-code text-xs font-bold uppercase hover:opacity-80 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmDialog && confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border ${isDaylight ? 'bg-white border-slate-300 text-slate-900' : 'bg-[#20232c] border-[#f8f7f4]/15 text-[#f8f7f4]'} p-6 space-y-4 shadow-2xl`}>
            <div className="flex items-center gap-3 border-b border-slate-500/20 pb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-syne text-base font-bold uppercase">{confirmDialog.title}</h3>
            </div>
            <p className="font-mono-code text-xs text-slate-400 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDialog(null)}
                className={`px-4 py-2 rounded-xl font-mono-code text-xs font-bold uppercase ${
                  isDaylight ? 'bg-slate-200 text-slate-800' : 'bg-[#282c37] text-slate-300'
                } hover:opacity-80 cursor-pointer`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white font-mono-code text-xs font-bold uppercase hover:bg-rose-700 transition-all cursor-pointer shadow-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
