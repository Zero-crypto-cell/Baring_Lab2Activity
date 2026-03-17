// ========== GLOBAL STATE ==========
let charts = {};
let currentStudentId = null;
let currentStudentName = null;
let currentUserRole = null; // 'student' or 'admin'

// ========== AUTHENTICATION SYSTEM ==========

// Initialize authentication data
function initializeAuthData() {
    // Sample registered users in database
    if (!localStorage.getItem('registeredUsers')) {
        const sampleUsers = [
            {
                id: '2024-0001',
                firstname: 'John',
                lastname: 'Doe',
                email: 'john.doe@cit.edu',
                course: 'BSCS',
                year: '3rd Year',
                password: 'password123',
                role: 'student',
                profilePhoto: null,
                sessions: 15,
                registeredDate: '2026-03-01'
            },
            {
                id: '2024-0002',
                firstname: 'Jane',
                lastname: 'Smith',
                email: 'jane.smith@cit.edu',
                course: 'BSHM',
                year: '2nd Year',
                password: 'password123',
                role: 'student',
                profilePhoto: null,
                sessions: 12,
                registeredDate: '2026-03-02'
            },
            {
                id: '2024-0003',
                firstname: 'Mike',
                lastname: 'Johnson',
                email: 'mike.johnson@cit.edu',
                course: 'BSCS',
                year: '4th Year',
                password: 'password123',
                role: 'student',
                profilePhoto: null,
                sessions: 8,
                registeredDate: '2026-03-03'
            },
            {
                id: 'ADMIN-001',
                firstname: 'Admin',
                lastname: 'User',
                email: 'admin@cit.edu',
                course: 'N/A',
                year: 'N/A',
                password: 'admin123',
                role: 'admin',
                profilePhoto: null,
                registeredDate: '2026-01-01'
            }
        ];
        localStorage.setItem('registeredUsers', JSON.stringify(sampleUsers));
        console.log('Sample registered users initialized');
        
        // Also initialize adminStudents with sessions
        const adminStudents = [
            { id: '2024-0001', name: 'John Doe', firstname: 'John', lastname: 'Doe', email: 'john.doe@cit.edu', course: 'BSCS', year: '3rd Year', sessions: 15 },
            { id: '2024-0002', name: 'Jane Smith', firstname: 'Jane', lastname: 'Smith', email: 'jane.smith@cit.edu', course: 'BSHM', year: '2nd Year', sessions: 12 },
            { id: '2024-0003', name: 'Mike Johnson', firstname: 'Mike', lastname: 'Johnson', email: 'mike.johnson@cit.edu', course: 'BSCS', year: '4th Year', sessions: 8 }
        ];
        localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
    }
    
    // Initialize active purposes/topics
    if (!localStorage.getItem('activePurposes')) {
        const purposes = [
            { name: 'C Programming', active: true },
            { name: 'Java', active: true },
            { name: 'Python', active: true },
            { name: 'Web Development', active: true },
            { name: 'Data Structures', active: true }
        ];
        localStorage.setItem('activePurposes', JSON.stringify(purposes));
    }
}

// Switch to registration page
function switchToRegister() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'flex';
}

// Switch to login page
function switchToLogin() {
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
}

// Perform user registration
function performRegister() {
    const id = document.getElementById('reg-id').value.trim();
    const firstname = document.getElementById('reg-firstname').value.trim();
    const lastname = document.getElementById('reg-lastname').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const course = document.getElementById('reg-course').value.trim();
    const year = document.getElementById('reg-year').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    
    // Validation
    if (!id || !firstname || !lastname || !email || !course || !year || !password || !confirmPassword) {
        alert('❌ Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('❌ Passwords do not match');
        return;
    }
    
    if (!email.includes('@')) {
        alert('❌ Please enter a valid email address');
        return;
    }
    
    initializeAuthData();
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    
    // Check if user already exists
    if (registeredUsers.find(u => u.id === id)) {
        alert('❌ An account with this ID already exists');
        return;
    }
    
    // Add new user
    const newUser = {
        id,
        firstname,
        lastname,
        email,
        course,
        year,
        password,
        role,
        profilePhoto: null,
        sessions: role === 'student' ? 15 : 0,
        registeredDate: new Date().toISOString().split('T')[0]
    };
    
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Add to adminStudents if student
    if (role === 'student') {
        let adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
        adminStudents.push({
            id,
            name: `${firstname} ${lastname}`,
            firstname,
            lastname,
            email,
            course,
            year,
            sessions: 15
        });
        localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
    }
    
    alert(`✓ Account created successfully!\n\nID: ${id}\nName: ${firstname} ${lastname}\nRole: ${role.toUpperCase()}\n\nYou can now login.`);
    
    // Reset form and switch to login
    document.getElementById('reg-id').value = '';
    document.getElementById('reg-firstname').value = '';
    document.getElementById('reg-lastname').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-course').value = '';
    document.getElementById('reg-year').value = '';
    document.getElementById('reg-password').value = '';
    document.getElementById('reg-confirm-password').value = '';
    
    switchToLogin();
}

function performLogin() {
    const id = document.getElementById('login-id').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!id || !password) {
        alert('❌ Please enter both ID and password');
        return;
    }
    
    initializeAuthData();
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = registeredUsers.find(u => u.id === id);
    
    if (!user) {
        alert('❌ User not found. Please register first or check your ID.');
        return;
    }
    
    if (user.password !== password) {
        alert('❌ Incorrect password');
        return;
    }
    
    // Login successful
    currentStudentId = id;
    currentStudentName = `${user.firstname} ${user.lastname}`;
    currentUserRole = user.role;
    
    localStorage.setItem('currentStudentId', id);
    localStorage.setItem('currentStudentName', currentStudentName);
    localStorage.setItem('currentUserRole', user.role);
    
    console.log(`✓ Login successful! Role: ${user.role}`);
    
    // Hide auth and show main app
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    // Show/hide navbars based on role
    if (user.role === 'admin') {
        document.getElementById('student-navbar').style.display = 'none';
        document.getElementById('admin-navbar').style.display = 'flex';
        showSection('admin-dash');
        loadDashboard();
    } else {
        document.getElementById('student-navbar').style.display = 'flex';
        document.getElementById('admin-navbar').style.display = 'none';
        showSection('student-dash');
    }
    
    updateStudentInfo();
    loadProfileInfo();
    loadStudentAnnouncements();
    
    alert(`✓ Welcome, ${user.firstname}!`);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentStudentId = null;
        currentStudentName = null;
        currentUserRole = null;
        localStorage.removeItem('currentStudentId');
        localStorage.removeItem('currentStudentName');
        localStorage.removeItem('currentUserRole');
        
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
        
        // Reset navbars
        document.getElementById('student-navbar').style.display = 'flex';
        document.getElementById('admin-navbar').style.display = 'none';
        
        // Reset to login page
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('register-page').style.display = 'none';
        
        // Reset login form
        document.getElementById('login-id').value = '';
        document.getElementById('login-password').value = '';
        
        console.log('✓ Logged out successfully');
    }
}

function updateStudentInfo() {
    const fullName = currentStudentName || 'Student';
    const parts = fullName.split(' ');
    const firstName = parts[0];
    
    // Get user data from registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const currentUser = users.find(u => u.id === currentStudentId);
    
    document.getElementById('user-id').textContent = currentStudentId || '2024-0001';
    document.getElementById('user-name').textContent = fullName || 'Student';
    
    // Update reservation form fields
    document.getElementById('res-id').value = currentStudentId || '2024-0001';
    document.getElementById('res-name').value = fullName || 'Student';
    
    // Update dashboard with user details
    if (currentUser) {
        document.getElementById('user-email').textContent = currentUser.email || '-';
        document.getElementById('user-course').textContent = currentUser.course || '-';
        document.getElementById('user-year').textContent = currentUser.year || '-';
        
        // Load profile photo
        const profileContainer = document.getElementById('dashboard-profile-photo');
        if (currentUser.profilePhoto) {
            profileContainer.innerHTML = `<img src="${currentUser.profilePhoto}" alt="Profile Photo" class="profile-photo-large-img">`;
        } else {
            profileContainer.innerHTML = `<div class="profile-placeholder-large">📷</div>`;
        }
        
        // Get sessions from adminStudents
        const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
        const adminData = adminStudents.find(a => a.id === currentStudentId);
        document.getElementById('sessions').textContent = adminData ? adminData.sessions : 15;
    }
}

function loadProfileInfo() {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const currentUser = users.find(u => u.id === currentStudentId);
    
    if (currentUser) {
        // Update profile header
        document.getElementById('profile-name').textContent = `${currentUser.firstname} ${currentUser.lastname}`;
        document.getElementById('profile-id-display').textContent = `ID: ${currentUser.id}`;
        document.getElementById('profile-role-display').textContent = `Role: ${currentUser.role.toUpperCase()}`;
        
        // Update profile details
        document.getElementById('profile-email-display').textContent = currentUser.email || '-';
        document.getElementById('profile-course-display').textContent = currentUser.course || '-';
        document.getElementById('profile-year-display').textContent = currentUser.year || '-';
        document.getElementById('profile-account-type').textContent = currentUser.role.toUpperCase();
        
        // Get sessions from adminStudents
        const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
        const adminData = adminStudents.find(a => a.id === currentStudentId);
        document.getElementById('profile-sessions-display').textContent = adminData ? adminData.sessions : 15;
        document.getElementById('profile-member-since').textContent = currentUser.registeredDate || '-';
        
        // Load profile photo
        const profilePhoto = document.getElementById('profile-display-photo');
        const placeholder = document.getElementById('profile-photo-placeholder');
        
        if (currentUser.profilePhoto) {
            profilePhoto.src = currentUser.profilePhoto;
            profilePhoto.style.display = 'block';
            placeholder.style.display = 'none';
        } else {
            profilePhoto.style.display = 'none';
            placeholder.style.display = 'flex';
        }
    }
}

// Handle profile photo upload
function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result;
        
        // Save to registered users
        const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const userIndex = users.findIndex(u => u.id === currentStudentId);
        
        if (userIndex !== -1) {
            users[userIndex].profilePhoto = photoData;
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            
            // Update UI
            loadProfileInfo();
            updateStudentInfo();
            
            alert('✓ Profile photo updated successfully!');
        }
    };
    reader.readAsDataURL(file);
}

// ========== INITIALIZATION ==========
function initApp() {
    // Initialize authentication and admin data
    initializeAuthData();
    initializeAdminData();
    initializeAnnouncements();
    
    const savedId = localStorage.getItem('currentStudentId');
    const savedName = localStorage.getItem('currentStudentName');
    const savedRole = localStorage.getItem('currentUserRole');
    
    if (savedId && savedName && savedRole) {
        // User is logged in
        currentStudentId = savedId;
        currentStudentName = savedName;
        currentUserRole = savedRole;
        
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        // Show correct navbar based on role
        if (savedRole === 'admin') {
            document.getElementById('student-navbar').style.display = 'none';
            document.getElementById('admin-navbar').style.display = 'flex';
            showSection('admin-dash');
            loadDashboard();
        } else {
            document.getElementById('student-navbar').style.display = 'flex';
            document.getElementById('admin-navbar').style.display = 'none';
            showSection('student-dash');
        }
        
        updateStudentInfo();
        loadStudentAnnouncements();
    } else {
        // Show login page
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('student-navbar').style.display = 'flex';
        document.getElementById('admin-navbar').style.display = 'none';
    }
}

// Run initialization when page loads
window.addEventListener('DOMContentLoaded', initApp);

// ========== UI NAVIGATION ==========
function showSection(sectionId) {
    // Prevent non-admin users from accessing admin sections
    if (sectionId === 'admin-dash' && currentUserRole !== 'admin') {
        alert('❌ Access Denied: Only admins can access this page');
        return;
    }
    
    // Prevent admin users from accessing student-only sections
    if ((sectionId === 'student-dash' || sectionId === 'reservation' || sectionId === 'history' || sectionId === 'my-profile') && currentUserRole === 'admin') {
        alert('❌ Access Denied: Please use the Admin Portal');
        return;
    }
    
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    if (sectionId === 'history') {
        loadHistory();
    } else if (sectionId === 'my-profile') {
        loadProfileInfo();
    } else if (sectionId === 'student-dash') {
        updateStudentInfo();
        loadStudentAnnouncements();
    } else if (sectionId === 'admin-dash') {
        loadDashboard();
    }
}

function initAdminMode() {
    if (currentUserRole !== 'admin') {
        alert('❌ Access Denied: Only admins can access this page');
        return;
    }
    showSection('admin-dash');
    loadDashboard();
}

function showAdminTab(tabName) {
    if (currentUserRole !== 'admin') {
        alert('❌ Access Denied: Only admins can access this page');
        return;
    }
    
    // Hide all admin tabs
    document.querySelectorAll('.admin-tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load tab data
    if (tabName === 'dashboard') {
        loadDashboard();
    } else if (tabName === 'students') {
        loadStudentsList();
    } else if (tabName === 'records') {
        loadRecords();
    } else if (tabName === 'reports') {
        loadReports();
    } else if (tabName === 'purposes') {
        loadPurposes();
    } else if (tabName === 'announcements') {
        loadAdminAnnouncements();
    }
}

// ========== MODAL FUNCTIONS ==========
function openModal(modalId) {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById('modal-overlay').style.display = 'none';
    document.getElementById(modalId).style.display = 'none';
    
    // Reset sit-in form when closed
    if (modalId === 'sitin-form-modal') {
        document.getElementById('sitin-purpose').value = '';
        document.getElementById('sitin-lab').value = '';
    }
    
    // Reset profile photo upload input when closing edit modal
    if (modalId === 'profile-edit-modal') {
        document.getElementById('profile-photo-input').value = '';
        window.newProfilePhoto = null;
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
    document.getElementById('modal-overlay').style.display = 'none';
}

// ========== DATA INITIALIZATION ==========
function initializeAdminData() {
    // Initialize students if not exists
    if (!localStorage.getItem('adminStudents')) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const students = registeredUsers
            .filter(u => u.role === 'student')
            .map(u => ({
                id: u.id,
                name: `${u.firstname} ${u.lastname}`,
                firstname: u.firstname,
                lastname: u.lastname,
                email: u.email,
                course: u.course,
                year: u.year,
                sessions: 15
            }));
        localStorage.setItem('adminStudents', JSON.stringify(students));
        console.log('Admin students initialized from registered users');
    }
    
    // Initialize available purposes/topics
    if (!localStorage.getItem('availablePurposes')) {
        const purposes = [
            { name: 'C Programming', active: true },
            { name: 'Java', active: true },
            { name: 'Python', active: true },
            { name: 'Web Development', active: true },
            { name: 'Data Structures', active: true }
        ];
        localStorage.setItem('availablePurposes', JSON.stringify(purposes));
        console.log('Available purposes initialized');
    }
    
    // Initialize active sessions
    if (!localStorage.getItem('activeSessions')) {
        localStorage.setItem('activeSessions', JSON.stringify([]));
    }
    
    // Initialize completed sessions with sample data
    if (!localStorage.getItem('completedSessions')) {
        const completed = [
            {
                id: '2024-0001',
                name: 'John Doe',
                purpose: 'C Programming',
                lab: 'Lab 501',
                loginTime: '10:00 AM',
                logoutTime: '11:30 AM',
                date: '2026-03-15',
                duration: 90
            },
            {
                id: '2024-0002',
                name: 'Jane Smith',
                purpose: 'Java',
                lab: 'Lab 502',
                loginTime: '2:00 PM',
                logoutTime: '3:45 PM',
                date: '2026-03-15',
                duration: 105
            }
        ];
        localStorage.setItem('completedSessions', JSON.stringify(completed));
        console.log('Completed sessions initialized');
    }
    
    // Initialize sit-in sessions for student portal
    if (!localStorage.getItem('sitinSessions')) {
        localStorage.setItem('sitinSessions', JSON.stringify([]));
    }
}

// ========== ANNOUNCEMENTS SYSTEM ==========
function initializeAnnouncements() {
    if (!localStorage.getItem('announcements')) {
        const sampleAnnouncements = [
            {
                id: '1',
                title: 'Lab 502 Closed',
                content: 'Lab 502 will be closed on Friday for maintenance.',
                date: '2026-03-15',
                createdBy: 'ADMIN-001'
            },
            {
                id: '2',
                title: 'No Food or Drinks',
                content: 'Please note that food and drinks are not allowed in the computer labs.',
                date: '2026-03-10',
                createdBy: 'ADMIN-001'
            }
        ];
        localStorage.setItem('announcements', JSON.stringify(sampleAnnouncements));
    }
}

function loadAdminAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const container = document.getElementById('admin-announcements-list');
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="no-announcements">No announcements yet.</p>';
        return;
    }
    
    container.innerHTML = announcements.map(ann => `
        <div class="announcement-item">
            <div class="announcement-header">
                <h4>${ann.title}</h4>
                <span class="announcement-date">${ann.date}</span>
            </div>
            <p>${ann.content}</p>
            <button class="btn-delete" onclick="deleteAnnouncement('${ann.id}')">Delete</button>
        </div>
    `).join('');
}

function createAnnouncement() {
    const title = document.getElementById('announcement-title').value.trim();
    const content = document.getElementById('announcement-content').value.trim();
    
    if (!title || !content) {
        alert('❌ Please fill in both title and content');
        return;
    }
    
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    
    const newAnnouncement = {
        id: Date.now().toString(),
        title: title,
        content: content,
        date: new Date().toISOString().split('T')[0],
        createdBy: currentStudentId
    };
    
    announcements.unshift(newAnnouncement);
    localStorage.setItem('announcements', JSON.stringify(announcements));
    
    // Clear form
    document.getElementById('announcement-title').value = '';
    document.getElementById('announcement-content').value = '';
    
    alert('✓ Announcement posted successfully!');
    loadAdminAnnouncements();
}

function deleteAnnouncement(announcementId) {
    if (confirm('Are you sure you want to delete this announcement?')) {
        let announcements = JSON.parse(localStorage.getItem('announcements')) || [];
        announcements = announcements.filter(a => a.id !== announcementId);
        localStorage.setItem('announcements', JSON.stringify(announcements));
        
        alert('✓ Announcement deleted successfully!');
        loadAdminAnnouncements();
    }
}

function loadStudentAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('announcements')) || [];
    const container = document.getElementById('student-announcements');
    
    if (announcements.length === 0) {
        container.innerHTML = '<p class="no-announcements">No announcements at this time.</p>';
        return;
    }
    
    container.innerHTML = announcements.map(ann => `
        <div class="announcement-item">
            <div class="announcement-header">
                <h4>${ann.title}</h4>
                <span class="announcement-date">${ann.date}</span>
            </div>
            <p>${ann.content}</p>
        </div>
    `).join('');
}

// ========== DASHBOARD ==========
function loadDashboard() {
    initializeAdminData();
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const students = registeredUsers.filter(u => u.role === 'student');
    const active = JSON.parse(localStorage.getItem('activeSessions')) || [];
    const completed = JSON.parse(localStorage.getItem('completedSessions')) || [];
    
    document.getElementById('total-students').textContent = students.length;
    document.getElementById('total-sitins').textContent = completed.length;
    document.getElementById('active-sessions').textContent = active.length;
    
    console.log(`Dashboard updated: ${students.length} students, ${completed.length} total sit-ins, ${active.length} active`);
    
    // Render pie chart
    renderPurposeChart(completed);
}

function renderPurposeChart(sessions) {
    const ctx = document.getElementById('purposeChart');
    if (!ctx) return;
    
    const context = ctx.getContext('2d');
    
    // Destroy existing chart
    if (charts.purposeChart) {
        charts.purposeChart.destroy();
    }
    
    // Count purposes
    const purposeCounts = {};
    sessions.forEach(s => {
        purposeCounts[s.purpose] = (purposeCounts[s.purpose] || 0) + 1;
    });
    
    const labels = Object.keys(purposeCounts);
    const data = Object.values(purposeCounts);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
    
    charts.purposeChart = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors.slice(0, labels.length),
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ========== STUDENT MANAGEMENT ==========
function loadStudentsList() {
    initializeAdminData();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const students = registeredUsers.filter(u => u.role === 'student');
    
    // Get admin students data
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    
    const studentsWithSessions = students.map(u => {
        const adminData = adminStudents.find(a => a.id === u.id);
        return {
            id: u.id,
            name: `${u.firstname} ${u.lastname}`,
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            course: `${u.course} - ${u.year}`,
            sessions: adminData ? adminData.sessions : 15
        };
    });
    
    displayStudents(studentsWithSessions);
}

function displayStudents(students) {
    const tbody = document.getElementById('students-table-body');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.course}</td>
            <td>${student.sessions}</td>
            <td>
                <button class="btn-edit" onclick="editStudentModal('${student.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteStudent('${student.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function searchStudents() {
    const searchTerm = document.getElementById('student-search').value.toLowerCase();
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    
    const students = registeredUsers.filter(u => u.role === 'student');
    const filtered = students.filter(s => 
        s.id.toLowerCase().includes(searchTerm) || 
        s.firstname.toLowerCase().includes(searchTerm) ||
        s.lastname.toLowerCase().includes(searchTerm)
    );
    
    const studentsWithSessions = filtered.map(u => {
        const adminData = adminStudents.find(a => a.id === u.id);
        return {
            id: u.id,
            name: `${u.firstname} ${u.lastname}`,
            firstname: u.firstname,
            lastname: u.lastname,
            email: u.email,
            course: `${u.course} - ${u.year}`,
            sessions: adminData ? adminData.sessions : 15
        };
    });
    
    displayStudents(studentsWithSessions);
}

function editStudentModal(studentId) {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const student = registeredUsers.find(s => s.id === studentId && s.role === 'student');
    
    if (student) {
        const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
        const adminData = adminStudents.find(a => a.id === studentId);
        
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-student-name').value = `${student.firstname} ${student.lastname}`;
        document.getElementById('edit-student-course').value = `${student.course} - ${student.year}`;
        document.getElementById('edit-student-sessions').value = adminData ? adminData.sessions : 15;
        
        openModal('edit-student-modal');
    }
}

function updateStudent() {
    const id = document.getElementById('edit-student-id').value;
    const sessions = parseInt(document.getElementById('edit-student-sessions').value);
    
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    const index = adminStudents.findIndex(s => s.id === id);
    
    if (index !== -1) {
        adminStudents[index].sessions = sessions;
        localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
        
        alert('✓ Student sessions updated successfully!');
        closeModal('edit-student-modal');
        loadStudentsList();
    }
}

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
        const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
        
        // Remove from registered users
        const userIndex = registeredUsers.findIndex(u => u.id === studentId);
        if (userIndex !== -1) {
            registeredUsers.splice(userIndex, 1);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        // Remove from admin students
        const adminIndex = adminStudents.findIndex(s => s.id === studentId);
        if (adminIndex !== -1) {
            adminStudents.splice(adminIndex, 1);
            localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
        }
        
        loadStudentsList();
        loadDashboard();
        alert('✓ Student deleted successfully!');
    }
}

// ========== SIT-IN PROCESSING ==========
function searchForSitIn() {
    const search = document.getElementById('sitin-search-input').value.trim();
    const resultsDiv = document.getElementById('sitin-results');
    
    console.log('Searching for registered student:', search);
    
    if (search.length === 0) {
        resultsDiv.innerHTML = '';
        return;
    }
    
    initializeAdminData();
    
    // Search in registered users (database)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const registeredStudent = registeredUsers.find(u => u.id.toLowerCase() === search.toLowerCase() && u.role === 'student');
    
    if (!registeredStudent) {
        resultsDiv.innerHTML = '<div class="student-not-found"><p>❌ Student not registered in the system. Please register first.</p></div>';
        return;
    }
    
    // Get admin data (sessions count)
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    let adminData = adminStudents.find(a => a.id === registeredStudent.id);
    
    if (!adminData) {
        // Create admin data for this student if it doesn't exist
        adminData = {
            id: registeredStudent.id,
            name: `${registeredStudent.firstname} ${registeredStudent.lastname}`,
            firstname: registeredStudent.firstname,
            lastname: registeredStudent.lastname,
            email: registeredStudent.email,
            course: registeredStudent.course,
            year: registeredStudent.year,
            sessions: 15
        };
        adminStudents.push(adminData);
        localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
    }
    
    // Get student's session history
    const completedSessions = JSON.parse(localStorage.getItem('completedSessions')) || [];
    const studentSessions = completedSessions.filter(s => s.id === registeredStudent.id);
    
    // Get active sessions for this student
    const activeSessions = JSON.parse(localStorage.getItem('activeSessions')) || [];
    const studentActive = activeSessions.find(s => s.id === registeredStudent.id);
    
    console.log('Found student:', registeredStudent);
    
    let sessionHistoryHTML = '';
    if (studentSessions.length > 0) {
        const recentSessions = studentSessions.slice(-3);
        sessionHistoryHTML = '<div class="recent-sessions"><strong>Recent Sessions:</strong><ul>';
        recentSessions.forEach(session => {
            sessionHistoryHTML += `<li>
                <span class="session-purpose">${session.purpose}</span> - 
                <span class="session-lab">${session.lab}</span> - 
                <span class="session-date">${session.date}</span>
                <span class="session-duration">(${session.duration} mins)</span>
            </li>`;
        });
        sessionHistoryHTML += '</ul></div>';
    }
    
    let activeStatus = '';
    if (studentActive) {
        activeStatus = `<div class="alert-active"><strong style="color: red;">⚠ Currently in Active Session:</strong> ${studentActive.purpose} at ${studentActive.lab}</div>`;
    }
    
    resultsDiv.innerHTML = `
        <div class="student-details-card">
            ${activeStatus}
            <div class="student-info-grid">
                <div class="info-item">
                    <label>Student ID:</label>
                    <span class="info-value">${registeredStudent.id}</span>
                </div>
                <div class="info-item">
                    <label>Full Name:</label>
                    <span class="info-value">${registeredStudent.firstname} ${registeredStudent.lastname}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span class="info-value">${registeredStudent.email}</span>
                </div>
                <div class="info-item">
                    <label>Course & Year:</label>
                    <span class="info-value">${registeredStudent.course} - ${registeredStudent.year}</span>
                </div>
                <div class="info-item">
                    <label>Remaining Sessions:</label>
                    <span class="info-value" ${adminData.sessions <= 0 ? 'style="color: red; font-weight: bold;"' : ''}>${adminData.sessions}</span>
                </div>
                <div class="info-item">
                    <label>Total Sessions Used:</label>
                    <span class="info-value">${studentSessions.length}</span>
                </div>
                <div class="info-item">
                    <label>Total Duration:</label>
                    <span class="info-value">${studentSessions.reduce((sum, s) => sum + s.duration, 0)} mins</span>
                </div>
            </div>
            
            ${sessionHistoryHTML}
            
            <div class="action-buttons">
                ${adminData.sessions > 0 ? `<button class="btn-process-sitin" onclick="openSitInForm('${registeredStudent.id}')">Process Sit-in</button>` : `<button class="btn-process-sitin" style="opacity: 0.6; cursor: not-allowed;">No Sessions Available</button>`}
                <button class="btn-view-history" onclick="viewStudentFullHistory('${registeredStudent.id}')">View Full History</button>
            </div>
        </div>
    `;
}

function viewStudentFullHistory(studentId) {
    const completedSessions = JSON.parse(localStorage.getItem('completedSessions')) || [];
    const studentSessions = completedSessions.filter(s => s.id === studentId);
    
    let historyHTML = 'Complete Session History\n\n';
    
    if (studentSessions.length === 0) {
        alert('No session history available.');
    } else {
        historyHTML += 'Date | Purpose | Lab | Login | Logout | Duration\n';
        historyHTML += '----|-----------|---------|-----------|-----------|---------\n';
        studentSessions.forEach(session => {
            historyHTML += `${session.date} | ${session.purpose} | ${session.lab} | ${session.loginTime} | ${session.logoutTime} | ${session.duration} mins\n`;
        });
        alert(historyHTML);
    }
}

function openSitInForm(studentId) {
    initializeAdminData();
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const student = registeredUsers.find(u => u.id === studentId && u.role === 'student');
    
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    const adminData = adminStudents.find(a => a.id === studentId);
    
    console.log('Opening sit-in form for:', student);
    
    if (student && adminData) {
        if (adminData.sessions <= 0) {
            alert('This student has no remaining sessions');
            return;
        }
        
        document.getElementById('sitin-student-id').value = student.id;
        document.getElementById('sitin-student-name').textContent = `${student.firstname} ${student.lastname}`;
        document.getElementById('sitin-remaining-sessions').textContent = adminData.sessions;
        
        // Populate available purposes
        const purposes = JSON.parse(localStorage.getItem('availablePurposes')) || [];
        const purposeSelect = document.getElementById('sitin-purpose');
        purposeSelect.innerHTML = '<option value="">Select Purpose</option>';
        
        purposes.filter(p => p.active).forEach(purpose => {
            const option = document.createElement('option');
            option.value = purpose.name;
            option.textContent = purpose.name;
            purposeSelect.appendChild(option);
        });
        
        openModal('sitin-form-modal');
    }
}

function startSitIn() {
    const studentId = document.getElementById('sitin-student-id').value;
    const purpose = document.getElementById('sitin-purpose').value;
    const lab = document.getElementById('sitin-lab').value;
    
    console.log('Starting sit-in for:', studentId, purpose, lab);
    
    if (!purpose || !lab) {
        alert('Please select Purpose and Lab Room');
        return;
    }
    
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const student = registeredUsers.find(s => s.id === studentId && s.role === 'student');
    
    if (!student) {
        alert('❌ Student not found');
        return;
    }
    
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    const adminData = adminStudents.find(a => a.id === studentId);
    
    if (!adminData || adminData.sessions <= 0) {
        alert('❌ No remaining sessions available');
        return;
    }
    
    const now = new Date();
    const session = {
        id: studentId,
        name: `${student.firstname} ${student.lastname}`,
        purpose: purpose,
        lab: lab,
        loginTime: now.toLocaleTimeString('en-US', { hour12: true }),
        logoutTime: null,
        date: now.toLocaleDateString('en-US'),
        startTimestamp: now.getTime()
    };
    
    const active = JSON.parse(localStorage.getItem('activeSessions')) || [];
    active.push(session);
    localStorage.setItem('activeSessions', JSON.stringify(active));
    
    // Deduct a session
    adminData.sessions -= 1;
    localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
    
    console.log('✓ Session started, updated student:', adminData);
    
    alert(`✓ Sit-in Session Started!\n\nStudent: ${student.firstname} ${student.lastname}\nPurpose: ${purpose}\nLab: ${lab}\nLogin Time: ${session.loginTime}\n\nRemaining Sessions: ${adminData.sessions}`);
    
    closeModal('sitin-form-modal');
    
    // Clear search
    document.getElementById('sitin-search-input').value = '';
    document.getElementById('sitin-results').innerHTML = '';
    
    // Refresh records and dashboard
    loadRecords();
    loadDashboard();
}

// ========== SESSION MANAGEMENT ==========
function loadRecords() {
    initializeAdminData();
    const active = JSON.parse(localStorage.getItem('activeSessions')) || [];
    const completed = JSON.parse(localStorage.getItem('completedSessions')) || [];
    
    const all = [
        ...active.map(s => ({ ...s, status: 'ACTIVE' })),
        ...completed.map(s => ({ ...s, status: 'COMPLETED' }))
    ];
    
    const tbody = document.getElementById('records-table-body');
    tbody.innerHTML = '';
    
    all.forEach((session, index) => {
        const row = document.createElement('tr');
        const isActive = session.status === 'ACTIVE';
        
        row.innerHTML = `
            <td>${session.id}</td>
            <td>${session.name}</td>
            <td>${session.purpose}</td>
            <td>${session.lab}</td>
            <td>${session.loginTime}</td>
            <td>${session.logoutTime || '--'}</td>
            <td>${session.duration ? session.duration + ' mins' : '--'}</td>
            <td><span style="color: ${isActive ? 'green' : 'gray'}; font-weight: 600;">${session.status}</span></td>
            <td>${isActive ? `<button class="btn-logout" onclick="endSession(${index})">Logout</button>` : '--'}</td>
        `;
        tbody.appendChild(row);
    });
}

function endSession(index) {
    const active = JSON.parse(localStorage.getItem('activeSessions')) || [];
    const session = active[index];
    
    if (!session) {
        alert('Session not found');
        return;
    }
    
    const now = new Date();
    const endTime = now.toLocaleTimeString('en-US', { hour12: true });
    
    // Calculate duration
    const startTime = new Date(session.startTimestamp);
    const duration = Math.round((now - startTime) / 60000); // minutes
    
    const completed = {
        ...session,
        logoutTime: endTime,
        duration: duration
    };
    
    // Add to completed sessions
    let completedSessions = JSON.parse(localStorage.getItem('completedSessions')) || [];
    completedSessions.push(completed);
    localStorage.setItem('completedSessions', JSON.stringify(completedSessions));
    
    // Remove from active
    active.splice(index, 1);
    localStorage.setItem('activeSessions', JSON.stringify(active));
    
    // Restore session to student
    const adminStudents = JSON.parse(localStorage.getItem('adminStudents')) || [];
    const student = adminStudents.find(s => s.id === session.id);
    if (student) {
        student.sessions += 1;
        localStorage.setItem('adminStudents', JSON.stringify(adminStudents));
    }
    
    console.log('✓ Session ended:', completed);
    
    alert(`✓ Session Ended!\n\nStudent: ${session.name}\nDuration: ${duration} minutes\nLogout Time: ${endTime}`);
    
    loadRecords();
    loadDashboard();
}

// ========== REPORTS ==========
function loadReports() {
    initializeAdminData();
    const completed = JSON.parse(localStorage.getItem('completedSessions')) || [];
    const active = JSON.parse(localStorage.getItem('activeSessions')) || [];
    
    // Combine all sessions
    const allSessions = [
        ...completed,
        ...active.map(s => ({
            ...s,
            logoutTime: 'ACTIVE',
            duration: 'ongoing'
        }))
    ];
    
    const tbody = document.getElementById('reports-table-body');
    tbody.innerHTML = '';
    
    allSessions.forEach(session => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${session.id}</td>
            <td>${session.name}</td>
            <td>${session.purpose}</td>
            <td>${session.lab}</td>
            <td>${session.loginTime}</td>
            <td>${session.logoutTime}</td>
            <td>${session.date}</td>
            <td>${typeof session.duration === 'number' ? session.duration : session.duration}</td>
        `;
        tbody.appendChild(row);
    });
    
    console.log(`✓ Reports loaded: ${completed.length} completed, ${active.length} active`);
}

function generateExport() {
    const completed = JSON.parse(localStorage.getItem('completedSessions')) || [];
    
    if (completed.length === 0) {
        alert('No sessions to export');
        return;
    }
    
    // Create CSV
    let csv = 'Student ID,Name,Purpose,Lab Room,Login Time,Logout Time,Date,Duration (mins)\n';
    
    completed.forEach(session => {
        csv += `"${session.id}","${session.name}","${session.purpose}","${session.lab}","${session.loginTime}","${session.logoutTime}","${session.date}",${session.duration}\n`;
    });
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitin-report.csv';
    a.click();
    
    alert('✓ Report exported successfully!');
}

// ========== STUDENT PORTAL - RESERVATION ==========
function submitReservation() {
    const purpose = document.getElementById('res-purpose').value;
    const lab = document.getElementById('res-lab').value;
    const studentId = document.getElementById('res-id').value;
    const studentName = document.getElementById('res-name').value;
    
    if (!purpose || !lab) {
        alert("Please select both Purpose and Lab Room.");
        return;
    }
    
    const timestamp = new Date();
    const loginTime = timestamp.toLocaleTimeString();
    const date = timestamp.toLocaleDateString();
    
    const newSession = {
        id: studentId,
        name: studentName,
        purpose: purpose,
        lab: lab,
        loginTime: loginTime,
        logoutTime: '--',
        date: date,
        feedback: ''
    };
    
    let sessions = JSON.parse(localStorage.getItem('sitinSessions')) || [];
    sessions.push(newSession);
    localStorage.setItem('sitinSessions', JSON.stringify(sessions));
    
    alert(`Reservation confirmed!\nPurpose: ${purpose}\nLab Room: ${lab}\nLogin Time: ${loginTime}`);
    
    document.getElementById('reservation-form').reset();
    document.getElementById('res-id').value = currentStudentId;
    document.getElementById('res-name').value = currentStudentName;
    showSection('student-dash');
}

// ========== STUDENT PORTAL - HISTORY ==========
function loadHistory() {
    const sessions = JSON.parse(localStorage.getItem('sitinSessions')) || [];
    const historyBody = document.getElementById('history-body');
    
    if (sessions.length === 0) {
        const sampleSessions = [
            {
                id: '2024-0001',
                name: 'John Doe',
                purpose: 'C Programming',
                lab: 'Lab 501',
                loginTime: '10:00 AM',
                logoutTime: '11:30 AM',
                date: '2026-03-15',
                feedback: ''
            },
            {
                id: '2024-0001',
                name: 'John Doe',
                purpose: 'Data Structures',
                lab: 'Lab 502',
                loginTime: '2:00 PM',
                logoutTime: '3:45 PM',
                date: '2026-03-14',
                feedback: ''
            },
            {
                id: '2024-0001',
                name: 'John Doe',
                purpose: 'Java',
                lab: 'Lab 503',
                loginTime: '9:30 AM',
                logoutTime: '10:45 AM',
                date: '2026-03-13',
                feedback: ''
            }
        ];
        localStorage.setItem('sitinSessions', JSON.stringify(sampleSessions));
        sessions = sampleSessions;
    }
    
    historyBody.innerHTML = '';
    
    sessions.forEach((session, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${session.id}</td>
            <td>${session.purpose}</td>
            <td>${session.lab}</td>
            <td>${session.loginTime}</td>
            <td>${session.logoutTime}</td>
            <td>${session.date}</td>
            <td><button class="btn-feedback" onclick="openFeedbackModal(${index})">Feedback</button></td>
        `;
        historyBody.appendChild(row);
    });
}

function openFeedbackModal(sessionIndex) {
    document.getElementById('feedback-session-id').value = sessionIndex;
    const sessions = JSON.parse(localStorage.getItem('sitinSessions')) || [];
    const session = sessions[sessionIndex];
    
    document.getElementById('feedback-text').value = session.feedback || '';
    openModal('feedback-modal');
}

function submitFeedback() {
    const sessionIndex = document.getElementById('feedback-session-id').value;
    const feedbackText = document.getElementById('feedback-text').value;
    
    if (!feedbackText.trim()) {
        alert("Please enter your feedback before submitting.");
        return;
    }
    
    const sessions = JSON.parse(localStorage.getItem('sitinSessions')) || [];
    sessions[sessionIndex].feedback = feedbackText;
    localStorage.setItem('sitinSessions', JSON.stringify(sessions));
    
    alert("Thank you! Your feedback has been submitted successfully.");
    closeModal('feedback-modal');
    loadHistory();
}

// ========== LEGACY FUNCTIONS ==========
function saveStudent() {
    alert("Student added successfully to the database!");
    closeModal('add-student-modal');
}

function confirmSitIn() {
    alert("Sit-in session started!");
    closeModal('reserve-modal');
}

// ========== PURPOSE MANAGEMENT ==========
function loadPurposes() {
    initializeAdminData();
    const purposes = JSON.parse(localStorage.getItem('availablePurposes')) || [];
    
    const purposesList = document.getElementById('purposes-list');
    purposesList.innerHTML = '';
    
    purposes.forEach((purpose, index) => {
        const card = document.createElement('div');
        card.className = 'purpose-card';
        card.innerHTML = `
            <div class="purpose-info">
                <h4>${purpose.name}</h4>
                <p>${purpose.active ? '✓ Available for sit-ins' : '✗ Disabled'}</p>
            </div>
            <div class="purpose-toggle">
                <button class="toggle-switch ${purpose.active ? 'active' : ''}" onclick="togglePurpose(${index})"></button>
                <span class="status-badge ${purpose.active ? 'active' : 'inactive'}">${purpose.active ? 'Active' : 'Inactive'}</span>
            </div>
        `;
        purposesList.appendChild(card);
    });
    
    console.log(`✓ Purposes loaded: ${purposes.length} total`);
}

// ========== PROFILE MANAGEMENT ==========

// Load and display user profile
function loadProfilePage() {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const currentUser = users.find(u => u.id === currentStudentId);
    
    if (!currentUser) {
        console.log('User not found');
        return;
    }
    
    const fullName = `${currentUser.firstname} ${currentUser.lastname}`;
    
    // Update profile display
    document.getElementById('profile-name').textContent = fullName;
    document.getElementById('profile-id-display').textContent = `ID: ${currentUser.id}`;
    document.getElementById('profile-role-display').textContent = `Role: ${currentUser.role}`;
    document.getElementById('profile-email-display').textContent = currentUser.email;
    document.getElementById('profile-course-display').textContent = currentUser.course;
    document.getElementById('profile-year-display').textContent = currentUser.year;
    document.getElementById('profile-account-type').textContent = currentUser.role === 'admin' ? 'Administrator' : 'Student';
    document.getElementById('profile-sessions-display').textContent = currentUser.sessions || 'N/A';
    document.getElementById('profile-member-since').textContent = currentUser.registeredDate || 'N/A';
    
    // Display profile photo if exists
    if (currentUser.profilePhoto) {
        document.getElementById('profile-display-photo').src = currentUser.profilePhoto;
        document.getElementById('profile-display-photo').style.display = 'block';
        const placeholder = document.getElementById('profile-photo-placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }
    } else {
        document.getElementById('profile-display-photo').style.display = 'none';
        const placeholder = document.getElementById('profile-photo-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
    }
    
    console.log('✓ Profile page loaded for ' + fullName);
}

// Open profile editor modal
function openProfileEditor() {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const currentUser = users.find(u => u.id === currentStudentId);
    
    if (!currentUser) {
        alert('❌ Unable to load profile information');
        return;
    }
    
    // Populate form with current user data
    document.getElementById('edit-profile-firstname').value = currentUser.firstname;
    document.getElementById('edit-profile-lastname').value = currentUser.lastname;
    document.getElementById('edit-profile-email').value = currentUser.email;
    document.getElementById('edit-profile-course').value = currentUser.course;
    document.getElementById('edit-profile-year').value = currentUser.year;
    
    // Clear password fields
    document.getElementById('edit-profile-password').value = '';
    document.getElementById('edit-profile-confirm-password').value = '';
    
    // Display current photo in preview
    if (currentUser.profilePhoto) {
        document.getElementById('photo-preview').src = currentUser.profilePhoto;
        document.getElementById('photo-preview').style.display = 'block';
        document.getElementById('photo-preview-placeholder').style.display = 'none';
    } else {
        document.getElementById('photo-preview').style.display = 'none';
        document.getElementById('photo-preview-placeholder').style.display = 'flex';
    }
    
    // Store original photo for comparison
    window.originalProfilePhoto = currentUser.profilePhoto || null;
    window.newProfilePhoto = null;
    
    // Reset file input
    document.getElementById('profile-photo-input').value = '';
    
    openModal('profile-edit-modal');
}

// Handle profile photo upload
// Save profile changes
function saveProfileChanges() {
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentStudentId);
    
    if (userIndex === -1) {
        alert('❌ User not found');
        return;
    }
    
    // Get form values
    const firstname = document.getElementById('edit-profile-firstname').value.trim();
    const lastname = document.getElementById('edit-profile-lastname').value.trim();
    const email = document.getElementById('edit-profile-email').value.trim();
    const course = document.getElementById('edit-profile-course').value.trim();
    const year = document.getElementById('edit-profile-year').value.trim();
    const password = document.getElementById('edit-profile-password').value;
    const confirmPassword = document.getElementById('edit-profile-confirm-password').value;
    
    // Validation
    if (!firstname || !lastname || !email || !course || !year) {
        alert('❌ Please fill in all required fields');
        return;
    }
    
    if (!email.includes('@')) {
        alert('❌ Please enter a valid email address');
        return;
    }
    
    // Check if password fields are filled
    if (password || confirmPassword) {
        if (!password || !confirmPassword) {
            alert('❌ Please fill in both password fields or leave both empty');
            return;
        }
        
        if (password.length < 6) {
            alert('❌ Password must be at least 6 characters');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('❌ Passwords do not match');
            return;
        }
        
        users[userIndex].password = password;
    }
    
    // Update user profile
    users[userIndex].firstname = firstname;
    users[userIndex].lastname = lastname;
    users[userIndex].email = email;
    users[userIndex].course = course;
    users[userIndex].year = year;
    
    // Update profile photo if a new one was selected
    const tempPhoto = localStorage.getItem('tempProfilePhoto');
    if (tempPhoto) {
        users[userIndex].profilePhoto = tempPhoto;
        localStorage.removeItem('tempProfilePhoto'); // Clear temp photo
    }
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    
    // Update current user name in session
    currentStudentName = `${firstname} ${lastname}`;
    localStorage.setItem('currentStudentName', currentStudentName);
    
    // Update UI
    updateStudentInfo();
    loadProfilePage();
    
    // Close modal and show success message
    closeModal('profile-edit-modal');
    alert('✓ Profile updated successfully!');
    
    console.log('✓ Profile saved for ' + currentStudentName);
}

// ========== MANAGE PURPOSES/TOPICS ==========
function loadPurposes() {
    initializeAuthData();
    const purposes = JSON.parse(localStorage.getItem('activePurposes')) || [];
    
    const purposesList = document.getElementById('purposes-list');
    purposesList.innerHTML = '';
    
    purposes.forEach((purpose, index) => {
        const purposeCard = document.createElement('div');
        purposeCard.className = 'purpose-card';
        purposeCard.innerHTML = `
            <div class="purpose-info">
                <h4>${purpose.name}</h4>
                <p>Status: <strong>${purpose.active ? '✓ ACTIVE' : '✗ INACTIVE'}</strong></p>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" ${purpose.active ? 'checked' : ''} onchange="togglePurpose(${index})">
                <span class="slider"></span>
            </label>
        `;
        purposesList.appendChild(purposeCard);
    });
}

function togglePurpose(index) {
    const purposes = JSON.parse(localStorage.getItem('activePurposes')) || [];
    if (purposes[index]) {
        purposes[index].active = !purposes[index].active;
        localStorage.setItem('activePurposes', JSON.stringify(purposes));
        console.log(`✓ Purpose "${purposes[index].name}" is now ${purposes[index].active ? 'ACTIVE' : 'INACTIVE'}`);
        loadPurposes();
        alert(`✓ "${purposes[index].name}" is now ${purposes[index].active ? 'ACTIVE' : 'INACTIVE'}`);
    }
}

// ========== PROFILE EDIT MODAL FUNCTIONS ==========
function openProfileEditModal() {
    // Get current user data
    const users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    const user = users.find(u => u.id === currentStudentId);
    
    if (!user) {
        alert('✗ User data not found');
        return;
    }
    
    // Populate form fields
    document.getElementById('edit-profile-firstname').value = user.firstname || '';
    document.getElementById('edit-profile-lastname').value = user.lastname || '';
    document.getElementById('edit-profile-email').value = user.email || '';
    document.getElementById('edit-profile-course').value = user.course || '';
    document.getElementById('edit-profile-year').value = user.year || '';
    document.getElementById('edit-profile-password').value = ''; // Don't pre-fill password
    
    // Show current profile photo if exists
    if (user.profilePhoto) {
        document.getElementById('photo-preview').src = user.profilePhoto;
        document.getElementById('photo-preview').style.display = 'block';
        document.getElementById('photo-preview-placeholder').style.display = 'none';
    } else {
        document.getElementById('photo-preview').style.display = 'none';
        document.getElementById('photo-preview-placeholder').style.display = 'block';
    }
    
    // Open the modal
    openModal('profile-edit-modal');
}

function handleProfilePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
        alert('❌ File size exceeds 2MB limit');
        return;
    }
    
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        alert('❌ Only JPG and PNG formats allowed');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const photoData = e.target.result; // Base64 string
        document.getElementById('photo-preview').src = photoData;
        document.getElementById('photo-preview').style.display = 'block';
        document.getElementById('photo-preview-placeholder').style.display = 'none';
        
        // Store temporarily for saving later
        localStorage.setItem('tempProfilePhoto', photoData);
    };
    reader.readAsDataURL(file);
}

// ========== PAGE INITIALIZATION ==========
function initializePage() {
    // Check if user is already logged in
    const savedUserId = localStorage.getItem('currentStudentId');
    const savedUserRole = localStorage.getItem('currentUserRole');
    const savedUserName = localStorage.getItem('currentStudentName');
    
    if (savedUserId && savedUserRole && savedUserName) {
        // User is logged in, restore session
        currentStudentId = savedUserId;
        currentUserRole = savedUserRole;
        currentStudentName = savedUserName;
        
        // Hide auth and show main app
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        
        // Show/hide admin nav based on role
        document.getElementById('admin-nav').style.display = savedUserRole === 'admin' ? 'block' : 'none';
        
        updateStudentInfo();
        loadProfileInfo();
        
        // Route to appropriate dashboard
        if (savedUserRole === 'admin') {
            showSection('admin-dash');
            loadDashboard();
        } else {
            showSection('student-dash');
        }
        
        console.log('✓ Session restored for ' + savedUserName);
    } else {
        // No logged-in user, show auth container
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
        initializeAuthData();
    }
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);
