// --- Phase 2: Global State ---
let currentUser = null;
const STORAGE_KEY = 'ipt_demo_v1';

// Initialize the "database" in memory
window.db = {
    accounts: [],
    departments: [],
    employees: [],
    requests: []
};

// --- Phase 4: Data Persistence ---
function loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        window.db = JSON.parse(data);
    } else {
        // Seed with default admin account
        window.db.accounts.push({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'Password123!',
            role: 'Admin',
            verified: true
        });
        // Seed departments
        window.db.departments = [
            { id: 1, name: 'Engineering', description: 'Software team' },
            { id: 2, name: 'HR', description: 'Human Resources' }
        ];
        saveToStorage();
    }
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(window.db));
}

// --- Phase 2 & 3: Routing & Auth State ---
function handleRouting() {
    const hash = window.location.hash || '#/';
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));

    // Route Protection
    const protectedRoutes = ['#/profile', '#/requests'];
    const adminRoutes = ['#/employees', '#/accounts', '#/departments'];

    if (protectedRoutes.includes(hash) && !currentUser) {
        return navigateTo('#/login');
    }
    if (adminRoutes.includes(hash) && (!currentUser || currentUser.role !== 'Admin')) {
        return navigateTo('#/');
    }

    // Map hash to Section ID
    let pageId = 'home-page';
    if (hash === '#/login') pageId = 'login-page';
    if (hash === '#/register') pageId = 'register-page';
    if (hash === '#/verify-email') pageId = 'verify-email-page';
    if (hash === '#/profile') { pageId = 'profile-page'; renderProfile(); }
    if (hash === '#/employees') pageId = 'employees-page';
    if (hash === '#/requests') pageId = 'requests-page';

    document.getElementById(pageId).classList.add('active');
}

function navigateTo(hash) {
    window.location.hash = hash;
}

function setAuthState(isAuth, user = null) {
    currentUser = user;
    const body = document.body;

    if (isAuth) {
        body.classList.replace('not-authenticated', 'authenticated');
        if (user.role === 'Admin') body.classList.add('is-admin');
    } else {
        body.classList.replace('authenticated', 'not-authenticated');
        body.classList.remove('is-admin');
        localStorage.removeItem('auth_token');
    }
}

// --- Phase 3: Registration & Login ---
document.getElementById('register-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    
    // Check if exists
    if (window.db.accounts.find(a => a.email === email)) return alert("Email exists!");

    const newUser = {
        firstName: document.getElementById('reg-firstname').value,
        lastName: document.getElementById('reg-lastname').value,
        email: email,
        password: document.getElementById('reg-pass').value,
        role: 'User',
        verified: false
    };

    window.db.accounts.push(newUser);
    localStorage.setItem('unverified_email', email);
    saveToStorage();
    navigateTo('#/verify-email');
});

function simulateVerification() {
    const email = localStorage.getItem('unverified_email');
    const account = window.db.accounts.find(a => a.email === email);
    if (account) {
        account.verified = true;
        saveToStorage();
        alert("Email verified! You may now log in.");
        navigateTo('#/login');
    }
}

document.getElementById('login-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    const user = window.db.accounts.find(a => a.email === email && a.password === pass && a.verified);

    if (user) {
        localStorage.setItem('auth_token', email);
        setAuthState(true, user);
        navigateTo('#/profile');
    } else {
        alert("Invalid credentials or unverified email.");
    }
});

function logout() {
    setAuthState(false);
    navigateTo('#/');
}

// --- Phase 5: Profile ---
function renderProfile() {
    const container = document.getElementById('profile-content');
    if (currentUser) {
        container.innerHTML = `
            <p><strong>Name:</strong> ${currentUser.firstName} ${currentUser.lastName}</p>
            <p><strong>Email:</strong> ${currentUser.email}</p>
            <p><strong>Role:</strong> ${currentUser.role}</p>
            <button class="btn btn-sm btn-primary" onclick="alert('Edit Profile clicked')">Edit Profile</button>
        `; 
    }
}

// --- Initialization ---
window.addEventListener('hashchange', handleRouting);

window.onload = () => {
    loadFromStorage();
    
    // Check for existing session
    const token = localStorage.getItem('auth_token');
    if (token) {
        const user = window.db.accounts.find(a => a.email === token);
        if (user) setAuthState(true, user);
    }
    
    if (!window.location.hash) navigateTo('#/');
    handleRouting();
};