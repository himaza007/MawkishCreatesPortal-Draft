const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Maps Supabase snake_case row to camelCase + renames id → _id
function toClient(row) {
  if (!row) return null;
  const { id, due_date, start_date, added_at, added_by, created_at, created_by, assigned_team, ...rest } = row;
  return {
    _id: id,
    ...rest,
    ...(assigned_team !== undefined && { assignedTeam: assigned_team }),
    ...(due_date    !== undefined && { dueDate:    due_date }),
    ...(start_date  !== undefined && { startDate:  start_date }),
    ...(added_at    !== undefined && { addedAt:    added_at }),
    ...(added_by    !== undefined && { addedBy:    added_by }),
    ...(created_at  !== undefined && { createdAt:  created_at }),
    ...(created_by  !== undefined && { createdBy:  created_by }),
  };
}

let seeded = false;

async function ensureSeeded() {
  if (seeded) return;
  seeded = true;

  const members = [
    { name: 'Admin User',  email: 'admin@mawkish.com',            password: 'mawkish2026',  role: 'admin', department: 'Management',           avatar: 'AU' },
    { name: 'Booso',       email: 'booso@mawkishcreates.com',      password: 'booso2026',    role: 'admin', department: 'Management',           avatar: 'BO' },
    { name: 'Harish',      email: 'harish@mawkishcreates.com',     password: 'harish2026',   role: 'staff', department: 'Digital Solution Team', avatar: 'HA' },
    { name: 'Aathif',      email: 'aathif@mawkishcreates.com',     password: 'aathif2026',   role: 'staff', department: 'Social Media Team',     avatar: 'AA' },
    { name: 'Himaza',      email: 'himaza@mawkishcreates.com',     password: 'himaza2026',   role: 'staff', department: 'Digital Solution Team', avatar: 'HI' },
    { name: 'Hakam',       email: 'hakam@mawkishcreates.com',      password: 'hakam2026',    role: 'staff', department: 'Social Media Team',     avatar: 'HK' },
    { name: 'Krish',       email: 'krish@mawkishcreates.com',      password: 'krish2026',    role: 'staff', department: 'Social Media Team',     avatar: 'KR' },
    { name: 'Bianca',      email: 'bianca@mawkishcreates.com',     password: 'bianca2026',   role: 'staff', department: 'Social Media Team',     avatar: 'BI' },
    { name: 'Faraz',       email: 'faraz@mawkishcreates.com',      password: 'faraz2026',    role: 'staff', department: 'Event Management Team', avatar: 'FA' },
    { name: 'Wazeem',      email: 'wazeem@mawkishcreates.com',     password: 'wazeem2026',   role: 'staff', department: 'Event Management Team', avatar: 'WA' },
    { name: 'Adithya',     email: 'adithya@mawkishcreates.com',    password: 'adithya2026',  role: 'staff', department: 'Event Management Team', avatar: 'AD' },
  ];
  for (const m of members) {
    const { data: existing } = await supabase.from('users').select('id').eq('email', m.email).single();
    if (!existing) {
      await supabase.from('users').insert({
        name: m.name, email: m.email, role: m.role,
        department: m.department, avatar: m.avatar,
        password: bcrypt.hashSync(m.password, 10),
      });
    }
  }

  const { count: annCount } = await supabase
    .from('announcements').select('*', { count: 'exact', head: true });
  if (annCount === 0) {
    await supabase.from('announcements').insert([
      { title: 'Welcome to the Mawkish Creates Portal', content: 'This is your central hub for tasks, resources, and team updates. Explore the sidebar to navigate between sections.', priority: 'high', author: 'Admin User', pinned: true },
      { title: 'Brand Guidelines V1 Released', content: 'The first version of our brand and communication guidelines is now live. All client-facing communication must follow the updated standards from this point forward.', priority: 'medium', author: 'Admin User', pinned: false },
    ]);
  }

  const { count: taskCount } = await supabase
    .from('tasks').select('*', { count: 'exact', head: true });
  if (taskCount === 0) {
    await supabase.from('tasks').insert([
      { title: 'Finalise Q3 Social Media Calendar', description: 'Complete scheduling for all client accounts', status: 'pending', priority: 'high', assignee: 'Design Team', due_date: '2026-06-15', tags: ['social', 'content'] },
      { title: 'Update Charles Place Office Signage', description: 'Coordinate with vendor for new branding signage', status: 'in-progress', priority: 'medium', assignee: 'Admin User', due_date: '2026-06-20', tags: ['branding'] },
      { title: 'Client Brand Audit – Horizon Group', description: 'Complete visual audit and submit report', status: 'completed', priority: 'high', assignee: 'Creative Lead', due_date: '2026-05-30', tags: ['client', 'audit'] },
      { title: 'Website Refresh – Internal', description: 'Update mawkishcreates.com with new portfolio pieces', status: 'pending', priority: 'low', assignee: 'Web Team', due_date: '2026-07-01', tags: ['web'] },
    ]);
  }

  const { count: eventCount } = await supabase
    .from('events').select('*', { count: 'exact', head: true });
  if (eventCount === 0) {
    await supabase.from('events').insert([
      { title: 'Team Weekly Sync', date: '2026-06-02', time: '09:30', type: 'internal', description: 'Weekly team check-in and task review', location: 'Charles Place Office' },
      { title: 'Client Onboarding – NovaCo', date: '2026-06-05', time: '14:00', type: 'client', description: 'Onboarding call for new retainer client', location: 'One Galle Face Tower – Level 12' },
      { title: 'Brand Guidelines Presentation', date: '2026-06-10', time: '11:00', type: 'client', description: 'Present V1 guidelines to the Horizon Group', location: 'Virtual' },
      { title: 'Q3 Strategy Planning', date: '2026-06-18', time: '10:00', type: 'internal', description: 'Plan creative strategy and resource allocation for Q3', location: 'Charles Place Office' },
    ]);
  }

  const { count: pipelineCount } = await supabase
    .from('pipelines').select('*', { count: 'exact', head: true });
  if (pipelineCount === 0) {
    await supabase.from('pipelines').insert([
      { client: 'Horizon Group', stage: 'Active',     service: 'Brand Identity + Social', value: 'LKR 480,000', start_date: '2026-05-01', pm: 'Creative Lead', status: 'on-track' },
      { client: 'NovaCo',        stage: 'Onboarding', service: 'Content Strategy',        value: 'LKR 220,000', start_date: '2026-06-05', pm: 'Admin User',    status: 'new' },
      { client: 'UrbanLux',      stage: 'Proposal',   service: 'Campaign Design',         value: 'LKR 150,000', start_date: '',           pm: 'Design Team',   status: 'pending' },
      { client: 'SkyBridge',     stage: 'Completed',  service: 'Website Redesign',        value: 'LKR 380,000', start_date: '2026-03-01', pm: 'Web Team',      status: 'completed' },
    ]);
  }

  const { count: resourceCount } = await supabase
    .from('resources').select('*', { count: 'exact', head: true });
  if (resourceCount === 0) {
    await supabase.from('resources').insert([
      { title: 'Brand Guidelines V1',          category: 'Brand',      description: 'Official Mawkish Creates brand and communication guidelines', url: '#', type: 'document' },
      { title: 'Canva Brand Kit',              category: 'Design',     description: 'Templates, colours, and fonts for all social media formats',   url: '#', type: 'tool' },
      { title: 'Client Onboarding Checklist',  category: 'Operations', description: 'Step-by-step checklist for bringing new clients on board',     url: '#', type: 'document' },
      { title: 'Notion Workspace',             category: 'Operations', description: 'Internal project and process documentation hub',               url: '#', type: 'tool' },
      { title: 'Stock Photo Library',          category: 'Design',     description: 'Curated library of approved stock images for client work',     url: '#', type: 'media' },
      { title: 'Email Signature Template',     category: 'Brand',      description: 'Standard email signature format with brand guidelines',        url: '#', type: 'template' },
    ]);
  }
}

module.exports = { supabase, toClient, ensureSeeded };
