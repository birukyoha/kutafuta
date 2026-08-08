// File: /backend/controllers/jobController.js
// Jobs & Applications Controller for Film & Media Talent Marketplace

import { jobListings, jobApplications, clientProfiles, talentProfiles, crewCalls } from '../db.js';

/**
 * Get Open Job Listings
 * GET /api/jobs
 * Query parameters: department, location, project_type, is_remote, query
 */
export const getJobs = async (req, res) => {
  try {
    const { department, location, project_type, is_remote, query } = req.query;

    let results = [...jobListings];

    if (department && department !== 'all') {
      results = results.filter(j => j.department === department);
    }

    if (location && location !== 'all') {
      const loc = location.toLowerCase();
      results = results.filter(j => j.location.toLowerCase().includes(loc));
    }

    if (project_type && project_type !== 'all') {
      results = results.filter(j => j.project_type.toLowerCase() === project_type.toLowerCase());
    }

    if (is_remote === 'true') {
      results = results.filter(j => j.is_remote === true);
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      results = results.filter(j => 
        j.title.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.client_name.toLowerCase().includes(q) ||
        (j.required_skills && j.required_skills.some(skill => skill.toLowerCase().includes(q)))
      );
    }

    return res.status(200).json({
      jobs: results,
      total: results.length
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return res.status(500).json({ error: 'Failed to retrieve job listings.' });
  }
};

/**
 * Get Specific Job Listing Details
 * GET /api/jobs/:id
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = jobListings.find(j => j.id === id);

    if (!job) {
      return res.status(404).json({ error: 'Job opportunity not found.' });
    }

    const applicationsCount = jobApplications.filter(a => a.job_id === id).length;

    return res.status(200).json({
      job: {
        ...job,
        applications_count: applicationsCount
      }
    });
  } catch (error) {
    console.error('Error fetching job details:', error);
    return res.status(500).json({ error: 'Failed to retrieve job details.' });
  }
};

/**
 * Create New Job Listing (Clients / Agencies)
 * POST /api/jobs
 */
export const createJob = async (req, res) => {
  try {
    const {
      client_id,
      title,
      department,
      project_type,
      location,
      is_remote,
      shoot_dates,
      budget_type,
      budget_min,
      budget_max,
      required_skills,
      union_requirement,
      description
    } = req.body;

    if (!title || !department || !budget_min || !description) {
      return res.status(400).json({ error: 'Missing required job fields: title, department, budget_min, and description.' });
    }

    const client = clientProfiles.find(c => c.id === client_id || c.user_id === client_id) || clientProfiles[0];

    const newJob = {
      id: `job-${Date.now()}`,
      client_id: client.id,
      client_name: client.company_name,
      client_logo: client.logo_url,
      title,
      department: department || 'cinematography',
      project_type: project_type || 'Commercial',
      location: location || 'Los Angeles, CA',
      is_remote: Boolean(is_remote),
      shoot_dates: shoot_dates || 'Dates TBD',
      budget_type: budget_type || 'Day Rate',
      budget_min: Number(budget_min) || 500,
      budget_max: Number(budget_max) || Number(budget_min) * 1.5,
      required_skills: Array.isArray(required_skills) ? required_skills : (required_skills ? required_skills.split(',') : []),
      union_requirement: union_requirement || 'non_union',
      description,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    jobListings.unshift(newJob);

    const newCrewCall = {
      id: `crewcall-${Date.now()}`,
      job_id: newJob.id,
      client_id: client.id,
      producer_name: client.company_name,
      call_title: title,
      department: department || 'cinematography',
      project_type: project_type || 'Commercial',
      crew_positions_needed: Number(req.body.crew_positions_needed) || 1,
      budget_range: `$${newJob.budget_min} - $${newJob.budget_max} (${newJob.budget_type})`,
      location: location || 'Los Angeles, CA',
      shoot_dates: shoot_dates || 'Dates TBD',
      status: 'active',
      call_sheet_notes: description,
      created_at: new Date().toISOString()
    };

    crewCalls.unshift(newCrewCall);

    return res.status(201).json({
      message: 'Job opportunity and Call for Crew published successfully.',
      job: newJob,
      crewCall: newCrewCall
    });
  } catch (error) {
    console.error('Error posting job:', error);
    return res.status(500).json({ error: 'Failed to post new job listing.' });
  }
};

/**
 * Apply to Job Listing (Talents)
 * POST /api/jobs/:id/apply
 */
export const applyForJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { talent_id, cover_letter, bid_rate, portfolio_links } = req.body;

    const job = jobListings.find(j => j.id === id);
    if (!job) {
      return res.status(404).json({ error: 'Job listing not found.' });
    }

    const talent = talentProfiles.find(t => t.id === talent_id || t.user_id === talent_id) || talentProfiles[0];

    // Check if already applied
    const existing = jobApplications.find(a => a.job_id === id && a.talent_id === talent.id);
    if (existing) {
      return res.status(409).json({ error: 'You have already submitted an application for this job.' });
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      job_id: id,
      talent_id: talent.id,
      talent_name: talent.full_name,
      talent_avatar: talent.avatar_url,
      talent_category: talent.category,
      cover_letter: cover_letter || 'Interested in this production opportunity.',
      bid_rate: Number(bid_rate) || talent.day_rate,
      portfolio_links: Array.isArray(portfolio_links) ? portfolio_links : [talent.website_url, talent.vimeo_url].filter(Boolean),
      status: 'applied',
      notes: '',
      created_at: new Date().toISOString()
    };

    jobApplications.push(newApplication);

    return res.status(201).json({
      message: 'Job application submitted successfully.',
      application: newApplication
    });
  } catch (error) {
    console.error('Error applying for job:', error);
    return res.status(500).json({ error: 'Failed to submit job application.' });
  }
};

/**
 * Get Applications for Client's Job or Talent's Dashboard
 * GET /api/applications
 */
export const getJobApplications = async (req, res) => {
  try {
    const { job_id, talent_id, client_id } = req.query;

    let results = [...jobApplications];

    if (job_id) {
      results = results.filter(a => a.job_id === job_id);
    }

    if (talent_id) {
      results = results.filter(a => a.talent_id === talent_id);
    }

    if (client_id) {
      // Find all job IDs belonging to client
      const clientJobs = jobListings.filter(j => j.client_id === client_id).map(j => j.id);
      results = results.filter(a => clientJobs.includes(a.job_id));
    }

    // Enrich with Job Title details
    const enriched = results.map(app => {
      const job = jobListings.find(j => j.id === app.job_id);
      return {
        ...app,
        job_title: job ? job.title : 'Film Opportunity',
        job_department: job ? job.department : '',
        job_location: job ? job.location : ''
      };
    });

    return res.status(200).json({
      applications: enriched,
      total: enriched.length
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return res.status(500).json({ error: 'Failed to retrieve applications.' });
  }
};

/**
 * Update Application Status (Shortlisted, Hired, Rejected)
 * PATCH /api/applications/:id/status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const appIndex = jobApplications.findIndex(a => a.id === id);
    if (appIndex === -1) {
      return res.status(404).json({ error: 'Job application not found.' });
    }

    if (!['applied', 'under_review', 'shortlisted', 'interviewing', 'hired', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid application status.' });
    }

    jobApplications[appIndex].status = status;
    if (notes !== undefined) {
      jobApplications[appIndex].notes = notes;
    }
    jobApplications[appIndex].updated_at = new Date().toISOString();

    return res.status(200).json({
      message: `Application status updated to ${status}.`,
      application: jobApplications[appIndex]
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    return res.status(500).json({ error: 'Failed to update application status.' });
  }
};
