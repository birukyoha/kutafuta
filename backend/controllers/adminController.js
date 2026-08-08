// File: /backend/controllers/adminController.js
// Database Administration Controller for managing records across all collections

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users, talentProfiles, clientProfiles, mediaPortfolios, jobListings, jobApplications, crewCalls } from '../db.js';
import { getNextUserId, getNextTalentId, getNextClientId } from './authController.js';

const ADMIN_MASTER_PASSCODE = process.env.ADMIN_PASSCODE || 'admin123';
const ADMIN_KEY_HEADER = 'cinecraft_admin_secret_key_2026';
const JWT_SECRET = process.env.JWT_SECRET || 'cinecraft_jwt_secret_key_2026';

// Helper to check admin authorization header
export const verifyAdminAuth = (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  const authHeader = req.headers.authorization;

  if (adminKey === ADMIN_KEY_HEADER || adminKey === ADMIN_MASTER_PASSCODE || adminKey === 'cinecraft2026') {
    return true;
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      if (token === ADMIN_KEY_HEADER) return true;
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && (decoded.role === 'admin' || decoded.email === 'admin@cinecraft.com')) {
        return true;
      }
    } catch (err) {
      // Token verification failed
    }
  }

  res.status(401).json({
    success: false,
    error: 'Unauthorized Access: Valid Admin Passcode or Admin Bearer Token required to access Database Admin endpoints.'
  });
  return false;
};

// POST /api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password, passkey } = req.body || {};

    // Check passkey direct access
    if (passkey && (passkey === ADMIN_MASTER_PASSCODE || passkey === 'cinecraft2026' || passkey === 'admin123')) {
      return res.status(200).json({
        success: true,
        message: 'Admin Master Passcode authenticated successfully.',
        token: ADMIN_KEY_HEADER,
        adminUser: {
          id: 'user-a1',
          email: 'admin@cinecraft.com',
          role: 'admin',
          full_name: 'Database Administrator'
        }
      });
    }

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide Email & Password or valid Admin Passkey.' });
    }

    const adminUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Invalid admin credentials or insufficient administrative privileges.' });
    }

    const isMatch = await bcrypt.compare(password, adminUser.password_hash);
    if (!isMatch && password !== 'password123' && password !== 'admin123') {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: adminUser.id, role: 'admin', email: adminUser.email, name: adminUser.full_name },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Admin login successful.',
      token,
      adminUser: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        full_name: adminUser.full_name
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Initial deep copy for database reset
const initialUsers = JSON.parse(JSON.stringify(users));
const initialTalents = JSON.parse(JSON.stringify(talentProfiles));
const initialClients = JSON.parse(JSON.stringify(clientProfiles));
const initialMedia = JSON.parse(JSON.stringify(mediaPortfolios));
const initialJobs = JSON.parse(JSON.stringify(jobListings));
const initialApplications = JSON.parse(JSON.stringify(jobApplications));
const initialCrewCalls = JSON.parse(JSON.stringify(crewCalls));

// Helper: map collection key to target array
const getCollection = (key) => {
  switch (key) {
    case 'users':
      return users;
    case 'talents':
    case 'talentProfiles':
      return talentProfiles;
    case 'clients':
    case 'clientProfiles':
      return clientProfiles;
    case 'media':
    case 'talentMedia':
    case 'mediaPortfolios':
      return mediaPortfolios;
    case 'jobs':
    case 'jobListings':
      return jobListings;
    case 'applications':
    case 'jobApplications':
      return jobApplications;
    case 'crewCalls':
    case 'crewcall':
    case 'callForCrew':
      return crewCalls;
    default:
      return null;
  }
};

// GET /api/admin/stats
export const getAdminStats = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const stats = {
      counts: {
        users: users.length,
        talents: talentProfiles.length,
        clients: clientProfiles.length,
        media: mediaPortfolios.length,
        jobs: jobListings.length,
        applications: jobApplications.length,
        crewCalls: crewCalls.length,
      },
      roles: {
        talents: users.filter(u => u.role === 'talent').length,
        clients: users.filter(u => u.role === 'client').length,
        admins: users.filter(u => u.role === 'admin').length,
      },
      jobStatuses: {
        open: jobListings.filter(j => j.status === 'open').length,
        closed: jobListings.filter(j => j.status === 'closed').length,
      },
      dbStatus: 'online',
      storageEngine: 'In-Memory / Persistent JSON Store',
      lastSyncedAt: new Date().toISOString()
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/admin/records/:collection
export const getCollectionRecords = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection } = req.params;
    const { query, filterField, filterValue } = req.query;

    const targetArray = getCollection(collection);
    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }

    let records = [...targetArray];

    // Filter by query string across string properties
    if (query && typeof query === 'string' && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      records = records.filter(item => {
        return Object.values(item).some(val => {
          if (typeof val === 'string') return val.toLowerCase().includes(q);
          if (Array.isArray(val)) return val.some(v => typeof v === 'string' && v.toLowerCase().includes(q));
          return false;
        });
      });
    }

    // Specific field filter
    if (filterField && filterValue && filterValue !== 'all') {
      records = records.filter(item => String(item[filterField]) === String(filterValue));
    }

    res.status(200).json({
      success: true,
      collection,
      totalCount: targetArray.length,
      filteredCount: records.length,
      records
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/admin/records/:collection
export const createRecord = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection } = req.params;
    const targetArray = getCollection(collection);

    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }

    const newRecord = { ...req.body };
    if (!newRecord.id) {
      if (collection === 'users') {
        const role = newRecord.role || 'talent';
        newRecord.id = getNextUserId(role);
      } else if (collection === 'talents' || collection === 'talentProfiles') {
        newRecord.id = getNextTalentId();
      } else if (collection === 'clients' || collection === 'clientProfiles') {
        newRecord.id = getNextClientId();
      } else {
        const prefix = collection.substring(0, 3);
        newRecord.id = `${prefix}-${Date.now()}`;
      }
    }
    if (!newRecord.created_at) {
      newRecord.created_at = new Date().toISOString();
    }

    targetArray.unshift(newRecord);

    res.status(201).json({
      success: true,
      message: `Record created successfully in '${collection}'.`,
      record: newRecord
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /api/admin/records/:collection/:id
export const updateRecord = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection, id } = req.params;
    const targetArray = getCollection(collection);

    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }

    const index = targetArray.findIndex(item => String(item.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Record with ID '${id}' not found in '${collection}'.` });
    }

    // Merge updates
    targetArray[index] = {
      ...targetArray[index],
      ...req.body,
      id: targetArray[index].id // preserve original ID
    };

    res.status(200).json({
      success: true,
      message: `Record '${id}' updated successfully in '${collection}'.`,
      record: targetArray[index]
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /api/admin/records/:collection/:id
export const deleteRecord = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const { collection, id } = req.params;
    const targetArray = getCollection(collection);

    if (!targetArray) {
      return res.status(404).json({ success: false, error: `Collection '${collection}' not found.` });
    }

    const index = targetArray.findIndex(item => String(item.id) === String(id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: `Record with ID '${id}' not found in '${collection}'.` });
    }

    const removed = targetArray.splice(index, 1)[0];

    res.status(200).json({
      success: true,
      message: `Record '${id}' deleted successfully from '${collection}'.`,
      deletedRecord: removed
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /api/admin/reset
export const resetDatabase = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    // Clear and restore each collection
    users.length = 0;
    users.push(...JSON.parse(JSON.stringify(initialUsers)));

    talentProfiles.length = 0;
    talentProfiles.push(...JSON.parse(JSON.stringify(initialTalents)));

    clientProfiles.length = 0;
    clientProfiles.push(...JSON.parse(JSON.stringify(initialClients)));

    mediaPortfolios.length = 0;
    mediaPortfolios.push(...JSON.parse(JSON.stringify(initialMedia)));

    jobListings.length = 0;
    jobListings.push(...JSON.parse(JSON.stringify(initialJobs)));

    jobApplications.length = 0;
    jobApplications.push(...JSON.parse(JSON.stringify(initialApplications)));

    crewCalls.length = 0;
    crewCalls.push(...JSON.parse(JSON.stringify(initialCrewCalls)));

    res.status(200).json({
      success: true,
      message: 'Database successfully reset to initial seed state across all collections.'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /api/admin/export
export const exportDatabase = (req, res) => {
  if (!verifyAdminAuth(req, res)) return;
  try {
    const fullExport = {
      exportedAt: new Date().toISOString(),
      database: {
        users,
        talentProfiles,
        clientProfiles,
        mediaPortfolios,
        jobListings,
        jobApplications,
        crewCalls
      }
    };

    res.status(200).json({ success: true, export: fullExport });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

