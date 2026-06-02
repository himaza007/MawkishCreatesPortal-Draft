/* auth.js — Login Page Logic */

// Demo users (in real app: server-side auth)
const DEMO_USERS = [
  { email: "admin@mawkishcreates.com",   password: "admin123",   name: "Ashan Wijeratne",  role: "Creative Director", avatar: "AW" },
  { email: "sarah@mawkishcreates.com",   password: "sarah123",   name: "Sarah Perera",     role: "Senior Designer",   avatar: "SP" },
  { email: "kamal@mawkishcreates.com",   password: "kamal123",   name: "Kamal Fernando",   role: "Social Media Lead", avatar: "KF" },
  { email: "nisha@mawkishcreates.com",   password: "nisha123",   name: "Nisha Jayawardena",role: "Content Strategist",avatar: "NJ" },
  { email: "demo@mawkishcreates.com",    password: "demo",        name: "Demo User",        role: "Staff",             avatar: "DU" },
];

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect to dashboard
  if (sessionStorage.getItem('mc_user')) {
    window.location.href = 'pages/dashboard.html';
    return;
  }

  const form   = document.getElementById('loginForm');
  const error  = document.getElementById('formError');
  const btn    = form.querySelector('.btn-login');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    error.textContent = '';

    const email    = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;

    const user = DEMO_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      error.textContent = 'Incorrect email or password. Please try again.';
      return;
    }

    // Save session
    sessionStorage.setItem('mc_user', JSON.stringify(user));

    // Animate button
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Signed in';
    btn.style.background = 'var(--cyan)';
    btn.style.color = 'var(--grey-800)';

    setTimeout(() => {
      window.location.href = 'pages/dashboard.html';
    }, 600);
  });
});
