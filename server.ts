// File: /server.ts
// Express Full-Stack Server for Film & Media Talent Marketplace

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

import { register, login, me } from './backend/controllers/authController.js';
import { getTalents, getTalentById, updateTalentProfile, addTalentMedia, getTalentAnalytics } from './backend/controllers/talentController.js';
import { getJobs, getJobById, createJob, applyForJob, getJobApplications, updateApplicationStatus } from './backend/controllers/jobController.js';
import { getAdminStats, getCollectionRecords, createRecord, updateRecord, deleteRecord, resetDatabase, exportDatabase, adminLogin } from './backend/controllers/adminController.js';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- API ROUTES ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CineCraft Talent Marketplace API', timestamp: new Date() });
});

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', me);

// Talent Directory Routes
app.get('/api/talents', getTalents);
app.get('/api/talents/:id/analytics', getTalentAnalytics);
app.get('/api/talents/:id', getTalentById);
app.put('/api/talents/:id', updateTalentProfile);
app.post('/api/talents/:id/media', addTalentMedia);

// Job Listings & Applications Routes
app.get('/api/jobs', getJobs);
app.get('/api/jobs/:id', getJobById);
app.post('/api/jobs', createJob);
app.post('/api/jobs/:id/apply', applyForJob);

// Application Management Routes
app.get('/api/applications', getJobApplications);
app.patch('/api/applications/:id/status', updateApplicationStatus);

// Database Administration Routes
app.post('/api/admin/login', adminLogin);
app.get('/api/admin/stats', getAdminStats);
app.get('/api/admin/records/:collection', getCollectionRecords);
app.post('/api/admin/records/:collection', createRecord);
app.put('/api/admin/records/:collection/:id', updateRecord);
app.delete('/api/admin/records/:collection/:id', deleteRecord);
app.post('/api/admin/reset', resetDatabase);
app.get('/api/admin/export', exportDatabase);

// Cloud / AWS S3 Upload Simulator Endpoint
app.post('/api/upload/s3', (req, res) => {
  const { fileName, fileType, category = 'portfolios' } = req.body;
  const timestamp = Date.now();
  const cleanName = (fileName || 'media_asset.mp4').replace(/[^a-zA-Z0-9._-]/g, '_');
  const s3Key = `${category}/${timestamp}_${cleanName}`;
  const mockS3Url = `https://cinecraft-media-vault.s3.us-west-2.amazonaws.com/${s3Key}`;

  // Simulated presigned URL signature
  res.status(200).json({
    message: 'Presigned S3 upload URL generated successfully.',
    uploadUrl: mockS3Url,
    s3Key,
    fileUrl: fileType && fileType.startsWith('image/')
      ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=1200'
      : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    expiresIn: 3600
  });
});

// --- VITE DEVELOPMENT / PRODUCTION MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎬 CineCraft Film & Media Marketplace Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
