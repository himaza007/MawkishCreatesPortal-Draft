const Datastore = require('@seald-io/nedb');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dbPath = path.join(__dirname, 'data');
fs.mkdirSync(dbPath, { recursive: true });

const db = {
  users: new Datastore({ filename: path.join(dbPath, 'users.db'), autoload: true }),
  tasks: new Datastore({ filename: path.join(dbPath, 'tasks.db'), autoload: true }),
  announcements: new Datastore({ filename: path.join(dbPath, 'announcements.db'), autoload: true }),
  events: new Datastore({ filename: path.join(dbPath, 'events.db'), autoload: true }),
  pipelines: new Datastore({ filename: path.join(dbPath, 'pipelines.db'), autoload: true }),
  resources: new Datastore({ filename: path.join(dbPath, 'resources.db'), autoload: true }),
};

db.users.findOne({ email: 'admin@mawkish.com' }, (err, doc) => {
  if (!doc) {
    const hash = bcrypt.hashSync('mawkish2026', 10);
    db.users.insert({ name: 'Admin User', email: 'admin@mawkish.com', password: hash, role: 'admin', department: 'Management', avatar: 'AU', createdAt: new Date() });
    console.log('Default admin: admin@mawkish.com / mawkish2026');
  }
});

const teamMembers = [
  { name: 'Booso',  email: 'booso@mawkishcreates.com',  password: 'booso2026',  role: 'admin', department: 'Management',           avatar: 'BO' },
  { name: 'Harish', email: 'harish@mawkishcreates.com', password: 'harish2026', role: 'staff', department: 'Digital Solution Team', avatar: 'HA' },
  { name: 'Aathif', email: 'aathif@mawkishcreates.com', password: 'aathif2026', role: 'staff', department: 'Social Media Team',     avatar: 'AA' },
  { name: 'Himaza', email: 'himaza@mawkishcreates.com', password: 'himaza2026', role: 'staff', department: 'Digital Solution Team', avatar: 'HI' },
  { name: 'Hakam',  email: 'hakam@mawkishcreates.com',  password: 'hakam2026',  role: 'staff', department: 'Social Media Team',     avatar: 'HK' },
  { name: 'Krish',  email: 'krish@mawkishcreates.com',  password: 'krish2026',  role: 'staff', department: 'Social Media Team',     avatar: 'KR' },
  { name: 'Bianca', email: 'bianca@mawkishcreates.com', password: 'bianca2026', role: 'staff', department: 'Social Media Team',     avatar: 'BI' },
  { name: 'Faraz',  email: 'faraz@mawkishcreates.com',  password: 'faraz2026',  role: 'staff', department: 'Event Management Team', avatar: 'FA' },
];

teamMembers.forEach(member => {
  db.users.findOne({ email: member.email }, (err, doc) => {
    if (!doc) {
      const hash = bcrypt.hashSync(member.password, 10);
      db.users.insert({ name: member.name, email: member.email, password: hash, role: member.role, department: member.department, avatar: member.avatar, createdAt: new Date() });
      console.log(`Created user: ${member.email} / ${member.password}`);
    }
  });
});

db.announcements.count({}, (err, count) => {
  if (count === 0) {
    db.announcements.insert([
      { title: 'Welcome to the Mawkish Creates Portal', content: 'This is your central hub for tasks, resources, and team updates. Explore the sidebar to navigate between sections.', priority: 'high', author: 'Admin User', createdAt: new Date(), pinned: true },
      { title: 'Brand Guidelines V1 Released', content: 'The first version of our brand and communication guidelines is now live. All client-facing communication must follow the updated standards from this point forward.', priority: 'medium', author: 'Admin User', createdAt: new Date(Date.now() - 86400000 * 2), pinned: false }
    ]);
  }
});

db.tasks.count({}, (err, count) => {
  if (count === 0) {
    db.tasks.insert([
      { title: 'Finalise Q3 Social Media Calendar', description: 'Complete scheduling for all client accounts', status: 'pending', priority: 'high', assignee: 'Design Team', dueDate: '2026-06-15', createdAt: new Date(), tags: ['social', 'content'] },
      { title: 'Update Charles Place Office Signage', description: 'Coordinate with vendor for new branding signage', status: 'in-progress', priority: 'medium', assignee: 'Admin User', dueDate: '2026-06-20', createdAt: new Date(), tags: ['branding'] },
      { title: 'Client Brand Audit – Horizon Group', description: 'Complete visual audit and submit report', status: 'completed', priority: 'high', assignee: 'Creative Lead', dueDate: '2026-05-30', createdAt: new Date(), tags: ['client', 'audit'] },
      { title: 'Website Refresh – Internal', description: 'Update mawkishcreates.com with new portfolio pieces', status: 'pending', priority: 'low', assignee: 'Web Team', dueDate: '2026-07-01', createdAt: new Date(), tags: ['web'] }
    ]);
  }
});

db.events.count({}, (err, count) => {
  if (count === 0) {
    db.events.insert([
      { title: 'Team Weekly Sync', date: '2026-06-02', time: '09:30', type: 'internal', description: 'Weekly team check-in and task review', location: 'Charles Place Office' },
      { title: 'Client Onboarding – NovaCo', date: '2026-06-05', time: '14:00', type: 'client', description: 'Onboarding call for new retainer client', location: 'One Galle Face Tower – Level 12' },
      { title: 'Brand Guidelines Presentation', date: '2026-06-10', time: '11:00', type: 'client', description: 'Present V1 guidelines to the Horizon Group', location: 'Virtual' },
      { title: 'Q3 Strategy Planning', date: '2026-06-18', time: '10:00', type: 'internal', description: 'Plan creative strategy and resource allocation for Q3', location: 'Charles Place Office' }
    ]);
  }
});

db.pipelines.count({}, (err, count) => {
  if (count === 0) {
    db.pipelines.insert([
      { client: 'Horizon Group', stage: 'Active', service: 'Brand Identity + Social', value: 'LKR 480,000', startDate: '2026-05-01', pm: 'Creative Lead', status: 'on-track' },
      { client: 'NovaCo', stage: 'Onboarding', service: 'Content Strategy', value: 'LKR 220,000', startDate: '2026-06-05', pm: 'Admin User', status: 'new' },
      { client: 'UrbanLux', stage: 'Proposal', service: 'Campaign Design', value: 'LKR 150,000', startDate: '', pm: 'Design Team', status: 'pending' },
      { client: 'SkyBridge', stage: 'Completed', service: 'Website Redesign', value: 'LKR 380,000', startDate: '2026-03-01', pm: 'Web Team', status: 'completed' }
    ]);
  }
});

db.resources.count({}, (err, count) => {
  if (count === 0) {
    db.resources.insert([
      { title: 'Brand Guidelines V1', category: 'Brand', description: 'Official Mawkish Creates brand and communication guidelines', url: '#', type: 'document', addedAt: new Date() },
      { title: 'Canva Brand Kit', category: 'Design', description: 'Templates, colours, and fonts for all social media formats', url: '#', type: 'tool', addedAt: new Date() },
      { title: 'Client Onboarding Checklist', category: 'Operations', description: 'Step-by-step checklist for bringing new clients on board', url: '#', type: 'document', addedAt: new Date() },
      { title: 'Notion Workspace', category: 'Operations', description: 'Internal project and process documentation hub', url: '#', type: 'tool', addedAt: new Date() },
      { title: 'Stock Photo Library', category: 'Design', description: 'Curated library of approved stock images for client work', url: '#', type: 'media', addedAt: new Date() },
      { title: 'Email Signature Template', category: 'Brand', description: 'Standard email signature format with brand guidelines', url: '#', type: 'template', addedAt: new Date() }
    ]);
  }
});

module.exports = db;
