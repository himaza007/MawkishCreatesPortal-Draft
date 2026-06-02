/* data.js — Mock Data Store for Mawkish Creates Portal */

const MC_DATA = {

  // ── Tasks ──
  tasks: [
    { id: "t1",  title: "Design new client onboarding deck",    status: "todo",       priority: "high",   dueDate: "2026-06-08", assignees: ["SP","AW"], tags: ["Design"],      client: "Internal" },
    { id: "t2",  title: "Write Q3 social media strategy report",status: "todo",       priority: "high",   dueDate: "2026-06-10", assignees: ["NJ"],      tags: ["Strategy"],    client: "Internal" },
    { id: "t3",  title: "Revise brand guidelines for VitaBlend", status: "in-progress",priority: "medium", dueDate: "2026-06-06", assignees: ["SP"],      tags: ["Branding"],    client: "VitaBlend" },
    { id: "t4",  title: "Instagram content calendar — June",     status: "in-progress",priority: "medium", dueDate: "2026-06-07", assignees: ["KF","NJ"], tags: ["Content"],     client: "CeylonTech" },
    { id: "t5",  title: "Create proposal for Amara Hotels",      status: "in-progress",priority: "high",   dueDate: "2026-06-05", assignees: ["AW"],      tags: ["Proposal"],    client: "Amara Hotels" },
    { id: "t6",  title: "Shoot product photos — Mocha Roasters", status: "done",       priority: "low",    dueDate: "2026-06-01", assignees: ["SP"],      tags: ["Photography"], client: "Mocha Roasters" },
    { id: "t7",  title: "Monthly analytics report — May 2026",   status: "done",       priority: "medium", dueDate: "2026-06-01", assignees: ["KF"],      tags: ["Reports"],     client: "Internal" },
    { id: "t8",  title: "Finalise motion graphics for reel",     status: "todo",       priority: "low",    dueDate: "2026-06-15", assignees: ["SP","KF"], tags: ["Video"],       client: "SurgeWear" },
    { id: "t9",  title: "Update website portfolio section",      status: "todo",       priority: "low",    dueDate: "2026-06-20", assignees: ["AW"],      tags: ["Website"],     client: "Internal" },
    { id: "t10", title: "Client kick-off prep — Neon Kitchens",  status: "in-progress",priority: "high",   dueDate: "2026-06-04", assignees: ["NJ","AW"], tags: ["Client"],      client: "Neon Kitchens" },
  ],

  // ── Announcements ──
  announcements: [
    {
      id: "a1",
      title: "Welcome to the Mawkish Creates Internal Portal",
      body: "This portal is your central hub for tasks, timelines, resources, and team communications. Please review the pinned guidelines and ensure your profile is up to date. Reach out to Ashan if you have any questions or feedback.",
      author: "Ashan Wijeratne",
      authorAvatar: "AW",
      role: "Creative Director",
      date: "2026-05-30",
      pinned: true,
      category: "general"
    },
    {
      id: "a2",
      title: "New Client Onboarded: Neon Kitchens",
      body: "We're excited to welcome Neon Kitchens to the Mawkish Creates family. They are a premium home kitchen brand launching in Colombo this August. Nisha and Ashan will be leading the strategy and brand identity work. Kick-off meeting is scheduled for 5 June.",
      author: "Ashan Wijeratne",
      authorAvatar: "AW",
      role: "Creative Director",
      date: "2026-06-01",
      pinned: false,
      category: "client"
    },
    {
      id: "a3",
      title: "Reminder: Monthly Reporting Due 7 June",
      body: "All team members are required to submit their monthly task summaries and time logs by end of day on 7 June. Please use the standard template in the Resources section. Late submissions will impact client billing cycles.",
      author: "Sarah Perera",
      authorAvatar: "SP",
      role: "Senior Designer",
      date: "2026-05-28",
      pinned: false,
      category: "admin"
    },
    {
      id: "a4",
      title: "Office Location Reminder: One Galle Face Meetings",
      body: "For all external client meetings from 9 June onwards, please default to our One Galle Face Tower (Level 12) space unless agreed otherwise. This reflects our positioning and the space is better equipped for presentations. Book the boardroom via the shared calendar.",
      author: "Kamal Fernando",
      authorAvatar: "KF",
      role: "Social Media Lead",
      date: "2026-05-25",
      pinned: false,
      category: "operations"
    },
  ],

  // ── Calendar Events ──
  events: [
    { id: "e1",  title: "Neon Kitchens Kick-off",       date: "2026-06-05", time: "10:00 AM", duration: 60,  color: "#7b2ff7", type: "client",   location: "One Galle Face" },
    { id: "e2",  title: "VitaBlend Brand Review",        date: "2026-06-06", time: "2:00 PM",  duration: 90,  color: "#c9a84c", type: "client",   location: "Charles Place" },
    { id: "e3",  title: "Monthly Reporting Deadline",    date: "2026-06-07", time: "6:00 PM",  duration: 0,   color: "#e879b0", type: "deadline", location: "" },
    { id: "e4",  title: "Team Strategy Meeting",         date: "2026-06-09", time: "9:30 AM",  duration: 60,  color: "#5eead4", type: "internal", location: "Charles Place" },
    { id: "e5",  title: "Amara Hotels Proposal Pres.",   date: "2026-06-11", time: "11:00 AM", duration: 120, color: "#7b2ff7", type: "client",   location: "One Galle Face" },
    { id: "e6",  title: "Content Shoot — SurgeWear",     date: "2026-06-14", time: "8:00 AM",  duration: 180, color: "#c9a84c", type: "shoot",    location: "TBC" },
    { id: "e7",  title: "Mid-Year Review — All Team",    date: "2026-06-20", time: "10:00 AM", duration: 120, color: "#420f8a", type: "internal", location: "One Galle Face" },
    { id: "e8",  title: "CeylonTech Content Approval",   date: "2026-06-23", time: "3:00 PM",  duration: 45,  color: "#7b2ff7", type: "client",   location: "Virtual" },
    { id: "e9",  title: "Mocha Roasters — Deliverables", date: "2026-06-27", time: "5:00 PM",  duration: 0,   color: "#e879b0", type: "deadline", location: "" },
    { id: "e10", title: "Q3 Planning Session",           date: "2026-06-30", time: "9:00 AM",  duration: 150, color: "#420f8a", type: "internal", location: "Charles Place" },
  ],

  // ── Pipelines ──
  pipelines: [
    { id: "p1", name: "Website Redesign",     client: "Amara Hotels",    stage: "proposal",    value: 420000, startDate: "2026-05-20", pm: "AW" },
    { id: "p2", name: "Brand Identity",        client: "Neon Kitchens",   stage: "active",      value: 185000, startDate: "2026-06-05", pm: "NJ" },
    { id: "p3", name: "Social Media Retainer", client: "CeylonTech",      stage: "active",      value: 95000,  startDate: "2026-04-01", pm: "KF" },
    { id: "p4", name: "Campaign Shoot",        client: "SurgeWear",       stage: "production",  value: 130000, startDate: "2026-06-10", pm: "SP" },
    { id: "p5", name: "Brand Refresh",         client: "VitaBlend",       stage: "review",      value: 210000, startDate: "2026-05-15", pm: "SP" },
    { id: "p6", name: "Annual Report Design",  client: "Harbour Finance",  stage: "completed",   value: 88000,  startDate: "2026-04-10", pm: "AW" },
    { id: "p7", name: "SMM Package",           client: "Mocha Roasters",  stage: "completed",   value: 72000,  startDate: "2026-03-01", pm: "KF" },
    { id: "p8", name: "E-comm Content",        client: "Ceylon Coco",     stage: "proposal",    value: 56000,  startDate: "2026-06-02", pm: "NJ" },
  ],

  pipelineStages: [
    { key: "proposal",   label: "Proposal",   color: "#c9a84c" },
    { key: "active",     label: "Active",     color: "#7b2ff7" },
    { key: "production", label: "Production", color: "#5eead4" },
    { key: "review",     label: "Review",     color: "#e879b0" },
    { key: "completed",  label: "Completed",  color: "#166534" },
  ],

  // ── Resources ──
  resources: [
    { id: "r1",  name: "Brand Guidelines v1.0",   desc: "Colours, typography, tone of voice and email standards",      icon: "🎨", category: "brand",     link: "#", updated: "2026-06-01" },
    { id: "r2",  name: "Email Signature Template", desc: "Standard email signature — copy and configure in your client",icon: "✉️", category: "templates", link: "#", updated: "2026-05-28" },
    { id: "r3",  name: "Proposal Template",        desc: "Client-ready proposal deck in brand colours",                 icon: "📋", category: "templates", link: "#", updated: "2026-05-20" },
    { id: "r4",  name: "Social Media SOP",         desc: "Scheduling, approval process and captioning guidelines",      icon: "📱", category: "sop",       link: "#", updated: "2026-05-15" },
    { id: "r5",  name: "Content Intake Form",      desc: "Use for all new client content briefs",                       icon: "📝", category: "templates", link: "#", updated: "2026-05-10" },
    { id: "r6",  name: "Photography Brief Guide",  desc: "Standard brief format for shoots and art direction notes",    icon: "📷", category: "sop",       link: "#", updated: "2026-04-30" },
    { id: "r7",  name: "Meeting Follow-up Template",desc: "Post-meeting summary email template",                        icon: "📌", category: "templates", link: "#", updated: "2026-04-20" },
    { id: "r8",  name: "Client Onboarding Deck",   desc: "Welcome deck to share with new clients at kick-off",          icon: "🤝", category: "brand",     link: "#", updated: "2026-04-15" },
    { id: "r9",  name: "Monthly Report Template",  desc: "Task summary and time log template for monthly billing",      icon: "📊", category: "templates", link: "#", updated: "2026-03-01" },
  ],

  // ── Important Dates ──
  importantDates: [
    { label: "Monthly Reports Due",     date: "2026-06-07", type: "deadline" },
    { label: "Neon Kitchens Kick-off",  date: "2026-06-05", type: "client"   },
    { label: "VitaBlend Brand Review",  date: "2026-06-06", type: "client"   },
    { label: "Mid-Year Team Review",    date: "2026-06-20", type: "internal" },
    { label: "Q3 Planning Session",     date: "2026-06-30", type: "internal" },
  ],

  // ── Team ──
  team: [
    { name: "Ashan Wijeratne",   role: "Creative Director",  avatar: "AW", email: "ashan@mawkishcreates.com",  img: "https://i.pravatar.cc/150?img=68" },
    { name: "Sarah Perera",      role: "Senior Designer",    avatar: "SP", email: "sarah@mawkishcreates.com",  img: "https://i.pravatar.cc/150?img=47" },
    { name: "Kamal Fernando",    role: "Social Media Lead",  avatar: "KF", email: "kamal@mawkishcreates.com",  img: "https://i.pravatar.cc/150?img=12" },
    { name: "Nisha Jayawardena", role: "Content Strategist", avatar: "NJ", email: "nisha@mawkishcreates.com",  img: "https://i.pravatar.cc/150?img=45" },
  ],

};

// Helpers
function getTasksByStatus(status) {
  return MC_DATA.tasks.filter(t => t.status === status);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function isOverdue(dateStr) {
  return new Date(dateStr) < new Date() && dateStr !== '';
}

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTeamMember(avatar) {
  return MC_DATA.team.find(t => t.avatar === avatar);
}

function formatCurrency(n) {
  return 'LKR ' + n.toLocaleString('en-LK');
}
