import { Hono } from 'hono';
import type { Env } from '../lib/types';
import { verifyToken } from '../lib/auth';

const settings = new Hono<{ Bindings: Env }>();

// Middleware to verify authentication
settings.use('/*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyToken(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  c.set('userId', payload.userId);
  await next();
});

// ============================================
// PERSONAL INFORMATION
// ============================================

// Get personal information
settings.get('/personal', async (c) => {
  try {
    const userId = c.get('userId');

    const user = await c.env.DB.prepare(`
      SELECT 
        full_name, date_of_birth, gender, profile_photo_url,
        phone, phone_country_code, phone_verified,
        address_line1, address_line2, city, state, postal_code, country,
        bio, language_preference
      FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ personal: user });
  } catch (error) {
    console.error('Get personal info error:', error);
    return c.json({ error: 'Failed to retrieve personal information' }, 500);
  }
});

// Update personal information
settings.put('/personal', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();

    const {
      full_name, date_of_birth, gender, profile_photo_url,
      phone, phone_country_code,
      address_line1, address_line2, city, state, postal_code, country,
      bio, language_preference
    } = data;

    await c.env.DB.prepare(`
      UPDATE users SET
        full_name = COALESCE(?, full_name),
        date_of_birth = COALESCE(?, date_of_birth),
        gender = COALESCE(?, gender),
        profile_photo_url = COALESCE(?, profile_photo_url),
        phone = COALESCE(?, phone),
        phone_country_code = COALESCE(?, phone_country_code),
        address_line1 = COALESCE(?, address_line1),
        address_line2 = COALESCE(?, address_line2),
        city = COALESCE(?, city),
        state = COALESCE(?, state),
        postal_code = COALESCE(?, postal_code),
        country = COALESCE(?, country),
        bio = COALESCE(?, bio),
        language_preference = COALESCE(?, language_preference),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      full_name, date_of_birth, gender, profile_photo_url,
      phone, phone_country_code,
      address_line1, address_line2, city, state, postal_code, country,
      bio, language_preference,
      userId
    ).run();

    return c.json({ message: 'Personal information updated successfully' });
  } catch (error) {
    console.error('Update personal info error:', error);
    return c.json({ error: 'Failed to update personal information' }, 500);
  }
});

// ============================================
// PROFESSIONAL INFORMATION
// ============================================

// Get professional information
settings.get('/professional', async (c) => {
  try {
    const userId = c.get('userId');

    const user = await c.env.DB.prepare(`
      SELECT 
        current_title, current_company, industry, experience_years,
        linkedin_url, github_url, portfolio_url, resume_url,
        role, calcom_username, interest_tags, availability, mentorship_areas
      FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ professional: user });
  } catch (error) {
    console.error('Get professional info error:', error);
    return c.json({ error: 'Failed to retrieve professional information' }, 500);
  }
});

// Update professional information
settings.put('/professional', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();

    const {
      current_title, current_company, industry, experience_years,
      linkedin_url, github_url, portfolio_url, resume_url,
      role, calcom_username, interest_tags, availability, mentorship_areas
    } = data;

    await c.env.DB.prepare(`
      UPDATE users SET
        current_title = COALESCE(?, current_title),
        current_company = COALESCE(?, current_company),
        industry = COALESCE(?, industry),
        experience_years = COALESCE(?, experience_years),
        linkedin_url = COALESCE(?, linkedin_url),
        github_url = COALESCE(?, github_url),
        portfolio_url = COALESCE(?, portfolio_url),
        resume_url = COALESCE(?, resume_url),
        role = COALESCE(?, role),
        calcom_username = COALESCE(?, calcom_username),
        interest_tags = COALESCE(?, interest_tags),
        availability = COALESCE(?, availability),
        mentorship_areas = COALESCE(?, mentorship_areas),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      current_title, current_company, industry, experience_years,
      linkedin_url, github_url, portfolio_url, resume_url,
      role, calcom_username,
      interest_tags ? JSON.stringify(interest_tags) : null,
      availability ? JSON.stringify(availability) : null,
      mentorship_areas ? JSON.stringify(mentorship_areas) : null,
      userId
    ).run();

    return c.json({ message: 'Professional information updated successfully' });
  } catch (error) {
    console.error('Update professional info error:', error);
    return c.json({ error: 'Failed to update professional information' }, 500);
  }
});

// ============================================
// SKILLS CRUD
// ============================================

// Get all skills
settings.get('/skills', async (c) => {
  try {
    const userId = c.get('userId');

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM user_skills 
      WHERE user_id = ? 
      ORDER BY display_order ASC, created_at DESC
    `).bind(userId).all();

    return c.json({ skills: results || [] });
  } catch (error) {
    console.error('Get skills error:', error);
    return c.json({ error: 'Failed to retrieve skills' }, 500);
  }
});

// Add skill
settings.post('/skills', async (c) => {
  try {
    const userId = c.get('userId');
    const { skill_name, proficiency_level, years_experience, display_order } = await c.req.json();

    if (!skill_name) {
      return c.json({ error: 'Skill name is required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO user_skills 
      (user_id, skill_name, proficiency_level, years_experience, display_order)
      VALUES (?, ?, ?, ?, ?)
      RETURNING *
    `).bind(userId, skill_name, proficiency_level || 'intermediate', years_experience || 0, display_order || 0).first();

    return c.json({ message: 'Skill added successfully', skill: result }, 201);
  } catch (error) {
    console.error('Add skill error:', error);
    return c.json({ error: 'Failed to add skill' }, 500);
  }
});

// Update skill
settings.put('/skills/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const skillId = c.req.param('id');
    const { skill_name, proficiency_level, years_experience, display_order } = await c.req.json();

    await c.env.DB.prepare(`
      UPDATE user_skills SET
        skill_name = COALESCE(?, skill_name),
        proficiency_level = COALESCE(?, proficiency_level),
        years_experience = COALESCE(?, years_experience),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).bind(skill_name, proficiency_level, years_experience, display_order, skillId, userId).run();

    return c.json({ message: 'Skill updated successfully' });
  } catch (error) {
    console.error('Update skill error:', error);
    return c.json({ error: 'Failed to update skill' }, 500);
  }
});

// Delete skill
settings.delete('/skills/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const skillId = c.req.param('id');

    await c.env.DB.prepare(`
      DELETE FROM user_skills WHERE id = ? AND user_id = ?
    `).bind(skillId, userId).run();

    return c.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    return c.json({ error: 'Failed to delete skill' }, 500);
  }
});

// ============================================
// CERTIFICATIONS CRUD
// ============================================

// Get all certifications
settings.get('/certifications', async (c) => {
  try {
    const userId = c.get('userId');

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM user_certifications 
      WHERE user_id = ? 
      ORDER BY issue_date DESC, display_order ASC
    `).bind(userId).all();

    return c.json({ certifications: results || [] });
  } catch (error) {
    console.error('Get certifications error:', error);
    return c.json({ error: 'Failed to retrieve certifications' }, 500);
  }
});

// Add certification
settings.post('/certifications', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();
    const { 
      certification_name, issuing_organization, issue_date, expiry_date,
      credential_id, credential_url, description, display_order 
    } = data;

    if (!certification_name || !issuing_organization) {
      return c.json({ error: 'Certification name and issuing organization are required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO user_certifications 
      (user_id, certification_name, issuing_organization, issue_date, expiry_date,
       credential_id, credential_url, description, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      userId, certification_name, issuing_organization, issue_date, expiry_date,
      credential_id, credential_url, description, display_order || 0
    ).first();

    return c.json({ message: 'Certification added successfully', certification: result }, 201);
  } catch (error) {
    console.error('Add certification error:', error);
    return c.json({ error: 'Failed to add certification' }, 500);
  }
});

// Update certification
settings.put('/certifications/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const certId = c.req.param('id');
    const data = await c.req.json();

    const { 
      certification_name, issuing_organization, issue_date, expiry_date,
      credential_id, credential_url, description, display_order 
    } = data;

    await c.env.DB.prepare(`
      UPDATE user_certifications SET
        certification_name = COALESCE(?, certification_name),
        issuing_organization = COALESCE(?, issuing_organization),
        issue_date = COALESCE(?, issue_date),
        expiry_date = COALESCE(?, expiry_date),
        credential_id = COALESCE(?, credential_id),
        credential_url = COALESCE(?, credential_url),
        description = COALESCE(?, description),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).bind(
      certification_name, issuing_organization, issue_date, expiry_date,
      credential_id, credential_url, description, display_order,
      certId, userId
    ).run();

    return c.json({ message: 'Certification updated successfully' });
  } catch (error) {
    console.error('Update certification error:', error);
    return c.json({ error: 'Failed to update certification' }, 500);
  }
});

// Delete certification
settings.delete('/certifications/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const certId = c.req.param('id');

    await c.env.DB.prepare(`
      DELETE FROM user_certifications WHERE id = ? AND user_id = ?
    `).bind(certId, userId).run();

    return c.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    console.error('Delete certification error:', error);
    return c.json({ error: 'Failed to delete certification' }, 500);
  }
});

// ============================================
// PROJECTS CRUD
// ============================================

// Get all projects
settings.get('/projects', async (c) => {
  try {
    const userId = c.get('userId');

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM user_projects 
      WHERE user_id = ? 
      ORDER BY is_current DESC, start_date DESC, display_order ASC
    `).bind(userId).all();

    // Parse technologies_used from JSON
    const projects = results?.map(project => ({
      ...project,
      technologies_used: project.technologies_used ? JSON.parse(project.technologies_used as string) : []
    }));

    return c.json({ projects: projects || [] });
  } catch (error) {
    console.error('Get projects error:', error);
    return c.json({ error: 'Failed to retrieve projects' }, 500);
  }
});

// Add project
settings.post('/projects', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();
    
    const {
      project_name, description, role, start_date, end_date, is_current,
      project_url, github_url, technologies_used, achievements, display_order
    } = data;

    if (!project_name) {
      return c.json({ error: 'Project name is required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO user_projects 
      (user_id, project_name, description, role, start_date, end_date, is_current,
       project_url, github_url, technologies_used, achievements, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      userId, project_name, description, role, start_date, end_date, is_current ? 1 : 0,
      project_url, github_url,
      technologies_used ? JSON.stringify(technologies_used) : null,
      achievements, display_order || 0
    ).first();

    return c.json({ message: 'Project added successfully', project: result }, 201);
  } catch (error) {
    console.error('Add project error:', error);
    return c.json({ error: 'Failed to add project' }, 500);
  }
});

// Update project
settings.put('/projects/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const projectId = c.req.param('id');
    const data = await c.req.json();

    const {
      project_name, description, role, start_date, end_date, is_current,
      project_url, github_url, technologies_used, achievements, display_order
    } = data;

    await c.env.DB.prepare(`
      UPDATE user_projects SET
        project_name = COALESCE(?, project_name),
        description = COALESCE(?, description),
        role = COALESCE(?, role),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        is_current = COALESCE(?, is_current),
        project_url = COALESCE(?, project_url),
        github_url = COALESCE(?, github_url),
        technologies_used = COALESCE(?, technologies_used),
        achievements = COALESCE(?, achievements),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).bind(
      project_name, description, role, start_date, end_date, is_current,
      project_url, github_url,
      technologies_used ? JSON.stringify(technologies_used) : null,
      achievements, display_order,
      projectId, userId
    ).run();

    return c.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project
settings.delete('/projects/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const projectId = c.req.param('id');

    await c.env.DB.prepare(`
      DELETE FROM user_projects WHERE id = ? AND user_id = ?
    `).bind(projectId, userId).run();

    return c.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// ============================================
// EXPERIENCE CRUD
// ============================================

// Get all experience
settings.get('/experience', async (c) => {
  try {
    const userId = c.get('userId');

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM user_experience 
      WHERE user_id = ? 
      ORDER BY is_current DESC, start_date DESC, display_order ASC
    `).bind(userId).all();

    return c.json({ experience: results || [] });
  } catch (error) {
    console.error('Get experience error:', error);
    return c.json({ error: 'Failed to retrieve experience' }, 500);
  }
});

// Add experience
settings.post('/experience', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();
    
    const {
      company_name, job_title, employment_type, location, is_remote,
      start_date, end_date, is_current, description, achievements, display_order
    } = data;

    if (!company_name || !job_title || !start_date) {
      return c.json({ error: 'Company name, job title, and start date are required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO user_experience 
      (user_id, company_name, job_title, employment_type, location, is_remote,
       start_date, end_date, is_current, description, achievements, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      userId, company_name, job_title, employment_type || 'full-time', location, is_remote ? 1 : 0,
      start_date, end_date, is_current ? 1 : 0, description, achievements, display_order || 0
    ).first();

    return c.json({ message: 'Experience added successfully', experience: result }, 201);
  } catch (error) {
    console.error('Add experience error:', error);
    return c.json({ error: 'Failed to add experience' }, 500);
  }
});

// Update experience
settings.put('/experience/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const expId = c.req.param('id');
    const data = await c.req.json();

    const {
      company_name, job_title, employment_type, location, is_remote,
      start_date, end_date, is_current, description, achievements, display_order
    } = data;

    await c.env.DB.prepare(`
      UPDATE user_experience SET
        company_name = COALESCE(?, company_name),
        job_title = COALESCE(?, job_title),
        employment_type = COALESCE(?, employment_type),
        location = COALESCE(?, location),
        is_remote = COALESCE(?, is_remote),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        is_current = COALESCE(?, is_current),
        description = COALESCE(?, description),
        achievements = COALESCE(?, achievements),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).bind(
      company_name, job_title, employment_type, location, is_remote,
      start_date, end_date, is_current, description, achievements, display_order,
      expId, userId
    ).run();

    return c.json({ message: 'Experience updated successfully' });
  } catch (error) {
    console.error('Update experience error:', error);
    return c.json({ error: 'Failed to update experience' }, 500);
  }
});

// Delete experience
settings.delete('/experience/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const expId = c.req.param('id');

    await c.env.DB.prepare(`
      DELETE FROM user_experience WHERE id = ? AND user_id = ?
    `).bind(expId, userId).run();

    return c.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    return c.json({ error: 'Failed to delete experience' }, 500);
  }
});

// ============================================
// EDUCATION CRUD
// ============================================

// Get all education
settings.get('/education', async (c) => {
  try {
    const userId = c.get('userId');

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM user_education 
      WHERE user_id = ? 
      ORDER BY is_current DESC, start_date DESC, display_order ASC
    `).bind(userId).all();

    return c.json({ education: results || [] });
  } catch (error) {
    console.error('Get education error:', error);
    return c.json({ error: 'Failed to retrieve education' }, 500);
  }
});

// Add education
settings.post('/education', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();
    
    const {
      institution_name, degree, field_of_study, start_date, end_date,
      is_current, grade, activities, description, display_order
    } = data;

    if (!institution_name || !degree) {
      return c.json({ error: 'Institution name and degree are required' }, 400);
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO user_education 
      (user_id, institution_name, degree, field_of_study, start_date, end_date,
       is_current, grade, activities, description, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      userId, institution_name, degree, field_of_study, start_date, end_date,
      is_current ? 1 : 0, grade, activities, description, display_order || 0
    ).first();

    return c.json({ message: 'Education added successfully', education: result }, 201);
  } catch (error) {
    console.error('Add education error:', error);
    return c.json({ error: 'Failed to add education' }, 500);
  }
});

// Update education
settings.put('/education/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const eduId = c.req.param('id');
    const data = await c.req.json();

    const {
      institution_name, degree, field_of_study, start_date, end_date,
      is_current, grade, activities, description, display_order
    } = data;

    await c.env.DB.prepare(`
      UPDATE user_education SET
        institution_name = COALESCE(?, institution_name),
        degree = COALESCE(?, degree),
        field_of_study = COALESCE(?, field_of_study),
        start_date = COALESCE(?, start_date),
        end_date = COALESCE(?, end_date),
        is_current = COALESCE(?, is_current),
        grade = COALESCE(?, grade),
        activities = COALESCE(?, activities),
        description = COALESCE(?, description),
        display_order = COALESCE(?, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `).bind(
      institution_name, degree, field_of_study, start_date, end_date,
      is_current, grade, activities, description, display_order,
      eduId, userId
    ).run();

    return c.json({ message: 'Education updated successfully' });
  } catch (error) {
    console.error('Update education error:', error);
    return c.json({ error: 'Failed to update education' }, 500);
  }
});

// Delete education
settings.delete('/education/:id', async (c) => {
  try {
    const userId = c.get('userId');
    const eduId = c.req.param('id');

    await c.env.DB.prepare(`
      DELETE FROM user_education WHERE id = ? AND user_id = ?
    `).bind(eduId, userId).run();

    return c.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    return c.json({ error: 'Failed to delete education' }, 500);
  }
});

// ============================================
// PRIVACY & PREFERENCES
// ============================================

// Get user settings and privacy preferences
settings.get('/preferences', async (c) => {
  try {
    const userId = c.get('userId');

    // Get user privacy settings
    const user = await c.env.DB.prepare(`
      SELECT 
        profile_visibility, show_email, show_phone,
        allow_messages, allow_connection_requests,
        education_level, languages_spoken, timezone, preferred_contact_method
      FROM users WHERE id = ?
    `).bind(userId).first();

    // Get user notification preferences
    const userSettings = await c.env.DB.prepare(`
      SELECT * FROM user_settings WHERE user_id = ?
    `).bind(userId).first();

    // Create default settings if not exists
    if (!userSettings) {
      await c.env.DB.prepare(`
        INSERT INTO user_settings (user_id) VALUES (?)
      `).bind(userId).run();
    }

    return c.json({ 
      privacy: user || {},
      settings: userSettings || {
        email_notifications: 1,
        push_notifications: 1,
        sms_notifications: 0,
        marketing_emails: 1,
        weekly_digest: 1,
        connection_request_notifications: 1,
        message_notifications: 1,
        theme: 'light',
        language: 'en'
      }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    return c.json({ error: 'Failed to retrieve preferences' }, 500);
  }
});

// Update preferences
settings.put('/preferences', async (c) => {
  try {
    const userId = c.get('userId');
    const data = await c.req.json();

    const {
      // Privacy settings
      profile_visibility, show_email, show_phone,
      allow_messages, allow_connection_requests,
      education_level, languages_spoken, timezone, preferred_contact_method,
      
      // Notification settings
      email_notifications, push_notifications, sms_notifications,
      marketing_emails, weekly_digest,
      connection_request_notifications, message_notifications,
      theme, language
    } = data;

    // Update user privacy settings
    await c.env.DB.prepare(`
      UPDATE users SET
        profile_visibility = COALESCE(?, profile_visibility),
        show_email = COALESCE(?, show_email),
        show_phone = COALESCE(?, show_phone),
        allow_messages = COALESCE(?, allow_messages),
        allow_connection_requests = COALESCE(?, allow_connection_requests),
        education_level = COALESCE(?, education_level),
        languages_spoken = COALESCE(?, languages_spoken),
        timezone = COALESCE(?, timezone),
        preferred_contact_method = COALESCE(?, preferred_contact_method),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      profile_visibility, show_email, show_phone,
      allow_messages, allow_connection_requests,
      education_level, 
      languages_spoken ? JSON.stringify(languages_spoken) : null,
      timezone, preferred_contact_method,
      userId
    ).run();

    // Update user notification settings
    await c.env.DB.prepare(`
      INSERT INTO user_settings (
        user_id, email_notifications, push_notifications, sms_notifications,
        marketing_emails, weekly_digest,
        connection_request_notifications, message_notifications,
        theme, language, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        email_notifications = COALESCE(?, email_notifications),
        push_notifications = COALESCE(?, push_notifications),
        sms_notifications = COALESCE(?, sms_notifications),
        marketing_emails = COALESCE(?, marketing_emails),
        weekly_digest = COALESCE(?, weekly_digest),
        connection_request_notifications = COALESCE(?, connection_request_notifications),
        message_notifications = COALESCE(?, message_notifications),
        theme = COALESCE(?, theme),
        language = COALESCE(?, language),
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      userId, email_notifications, push_notifications, sms_notifications,
      marketing_emails, weekly_digest,
      connection_request_notifications, message_notifications,
      theme, language,
      // For ON CONFLICT clause
      email_notifications, push_notifications, sms_notifications,
      marketing_emails, weekly_digest,
      connection_request_notifications, message_notifications,
      theme, language
    ).run();

    return c.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update preferences error:', error);
    return c.json({ error: 'Failed to update preferences' }, 500);
  }
});

// ============================================
// DATA DELETION
// ============================================

// Request account deletion
settings.post('/delete-account', async (c) => {
  try {
    const userId = c.get('userId');
    const { reason, delete_immediately } = await c.req.json();

    // Get user info for logging
    const user = await c.env.DB.prepare(`
      SELECT email, name FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (delete_immediately) {
      // Immediate deletion - log first
      await c.env.DB.prepare(`
        INSERT INTO data_deletion_log 
        (user_id, user_email, user_name, deletion_type, deletion_reason, requested_at, ip_address)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
      `).bind(
        userId,
        user.email,
        user.name,
        'all_data',
        reason || 'User requested immediate deletion',
        c.req.header('CF-Connecting-IP') || 'unknown'
      ).run();

      // Delete all user data (CASCADE will handle related tables)
      await c.env.DB.prepare(`
        DELETE FROM users WHERE id = ?
      `).bind(userId).run();

      return c.json({ 
        message: 'Account deleted successfully',
        deleted: true
      });
    } else {
      // Schedule deletion for 30 days from now
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + 30);

      await c.env.DB.prepare(`
        UPDATE users SET
          deletion_requested_at = CURRENT_TIMESTAMP,
          deletion_reason = ?,
          deletion_scheduled_for = ?,
          status = 'pending_deletion',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        reason || 'User requested account deletion',
        scheduledDate.toISOString(),
        userId
      ).run();

      return c.json({ 
        message: 'Account deletion scheduled',
        scheduled_for: scheduledDate.toISOString(),
        deleted: false,
        can_cancel: true
      });
    }
  } catch (error) {
    console.error('Delete account error:', error);
    return c.json({ error: 'Failed to process deletion request' }, 500);
  }
});

// Cancel account deletion
settings.post('/cancel-deletion', async (c) => {
  try {
    const userId = c.get('userId');

    await c.env.DB.prepare(`
      UPDATE users SET
        deletion_requested_at = NULL,
        deletion_reason = NULL,
        deletion_scheduled_for = NULL,
        status = 'active',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(userId).run();

    return c.json({ message: 'Account deletion cancelled successfully' });
  } catch (error) {
    console.error('Cancel deletion error:', error);
    return c.json({ error: 'Failed to cancel deletion' }, 500);
  }
});

// Export user data (GDPR compliance)
settings.get('/export-data', async (c) => {
  try {
    const userId = c.get('userId');

    // Get all user data
    const user = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(userId).first();
    const skills = await c.env.DB.prepare(`SELECT * FROM user_skills WHERE user_id = ?`).bind(userId).all();
    const certifications = await c.env.DB.prepare(`SELECT * FROM user_certifications WHERE user_id = ?`).bind(userId).all();
    const projects = await c.env.DB.prepare(`SELECT * FROM user_projects WHERE user_id = ?`).bind(userId).all();
    const experience = await c.env.DB.prepare(`SELECT * FROM user_experience WHERE user_id = ?`).bind(userId).all();
    const education = await c.env.DB.prepare(`SELECT * FROM user_education WHERE user_id = ?`).bind(userId).all();
    const settings = await c.env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`).bind(userId).first();

    const exportData = {
      user,
      skills: skills.results,
      certifications: certifications.results,
      projects: projects.results,
      experience: experience.results,
      education: education.results,
      settings,
      exported_at: new Date().toISOString()
    };

    return c.json(exportData);
  } catch (error) {
    console.error('Export data error:', error);
    return c.json({ error: 'Failed to export data' }, 500);
  }
});

export default settings;
