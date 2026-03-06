

// Global api
const base_api = 'http://localhost:1005/api';

let currentUser    = null;
let approveLeaveId = null;
let bsApproveModal = null;
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth() + 1;


// Api

async function apiCall(path, options = {}) {

    const headers = { 'Content-Type': 'application/json' };

    if (currentUser) {
        const credentials = currentUser.email + ':' + currentUser.password;
        headers['Authorization'] = 'Basic ' + btoa(credentials);
    }

    const response = await fetch(base_api + path, {
        ...options,
        headers: { ...headers, ...(options.headers || {}) }
    });

    let data = null;

    try {
        data = await response.json();
    } catch (e) {}

    if (!response.ok) {
        throw new Error(data?.message || "Request Failed");
    }

    return data;
}



function showToast(message, type = 'info') {

    const container = document.getElementById('toast-container');
    if (!container) return; // prevent crash

    const colorMap = {
        success: 'bg-success',
        error: 'bg-danger',
        info: 'bg-primary'
    };

    const iconMap = {
        success: 'bi-check-circle-fill',
        error: 'bi-x-circle-fill',
        info: 'bi-info-circle-fill'
    };

    const toastEl = document.createElement('div');

    toastEl.className = `toast align-items-center text-white ${colorMap[type] || 'bg-primary'} border-0 show`;

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
                <i class="bi ${iconMap[type] || 'bi-info-circle-fill'}"></i>
                ${message}
            </div>
            <button class="btn-close btn-close-white me-2 m-auto"
                onclick="this.closest('.toast').remove()">
            </button>
        </div>
    `;

    container.appendChild(toastEl);

    setTimeout(() => toastEl.remove(), 3500);
}



// it help to switch login to reg


function showAuthTab(tab) {
    document.getElementById('login-form').style.display    = (tab === 'login')    ? 'block' : 'none';
    document.getElementById('register-form').style.display = (tab === 'register') ? 'block' : 'none';

    const loginBtn    = document.getElementById('tab-btn-login');
    const registerBtn = document.getElementById('tab-btn-register');

    if (tab === 'login') {
        loginBtn.className    = 'btn btn-primary';
        registerBtn.className = 'btn btn-outline-primary';
    } else {
        loginBtn.className    = 'btn btn-outline-primary';
        registerBtn.className = 'btn btn-primary';
    }
}

// reg

async function register() {
    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role     = document.getElementById('reg-role').value;

    if (!name || !email || !password) {
        return showToast('Please fill all fields', 'error');
    }

    try {
        await apiCall('/user/reg', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, role })
        });

        showToast('Account created! Please login.', 'success');
        showAuthTab('login');
        document.getElementById('login-email').value = email;
    } catch(e) {
        showToast(e.message, 'error');
    }
}
// login section
async function login() {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        return showToast('Please enter email and password', 'error');
    }

    try {
        const loginResponse = await apiCall('/user/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        const userData = loginResponse.user || loginResponse;
        currentUser = { ...userData, email, password };

        if (!currentUser.id) {
            const allUsers = await apiCall('/user/alluser');
            const userList = Array.isArray(allUsers) ? allUsers : (allUsers.users || []);
            const found = userList.find(u => u.email === email);
            if (found) {
                currentUser = { ...currentUser, ...found, password };
            }
        }

        startApp();
    } catch(e) {
        showToast(e.message || 'Login failed', 'error');
    }
}

//Starting of the application

function startApp() {
    document.getElementById('auth-page').style.display = 'none';
    document.getElementById('app-page').style.display  = 'block';

    document.getElementById('user-name-display').textContent = currentUser.name  || currentUser.email;
    document.getElementById('user-role-display').textContent = currentUser.role  || '';

    if (currentUser.role === 'MANAGER') {
        document.getElementById('nav-pending').style.display    = 'flex';
        document.getElementById('nav-all-leaves').style.display = 'flex';
    }

    // Init Bootstrap modal
    bsApproveModal = new bootstrap.Modal(document.getElementById('approve-modal'));

    showPage('dashboard');
}
//logout js
function logout() {
    currentUser = null;
    document.getElementById('app-page').style.display  = 'none';
    document.getElementById('auth-page').style.display = 'flex';
    showToast('Logged out successfully', 'info');
}

// switch section
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + pageName).classList.add('active');

    // Reset all nav buttons
    document.querySelectorAll('.nav-item-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('nav-btn-' + pageName);
    if (btn) btn.classList.add('active');

    if (pageName === 'dashboard')
    {
        loadDashboard();
    }
    if (pageName === 'my-leaves')
    {
        loadMyLeaves();
    }
    if (pageName === 'balance')    {
        loadBalance();
    }
    if (pageName === 'calendar')  {
        loadCalendar();
    }
    if (pageName === 'users')    {
        loadUsers();
    }
    if (pageName === 'pending')   {
        loadPending();
    }
    if (pageName === 'all-leaves') {
        loadAllLeaves();
    }
}

function buildLeaveTable(leaves, showApproveBtn = false) {
    if (!leaves || leaves.length === 0) {
        return '<div class="text-center text-muted py-4"><i class="bi bi-inbox fs-3 d-block mb-2"></i>No leave records found.</div>';
    }

    const rows = leaves.map(leave => `
            <tr>
                <td class="text-muted small">${leave.id || '—'}</td>
                <td><span class="fw-semibold">${leave.leaveType || leave.type || '—'}</span></td>
                <td>${leave.startDate || '—'}</td>
                <td>${leave.endDate   || '—'}</td>
                <td class="text-truncate" style="max-width:160px">${leave.reason || '—'}</td>
                <td>${buildBadge(leave.status)}</td>
                ${showApproveBtn
        ? (leave.status === 'PENDING'
            ? `<td><button class="btn btn-success btn-sm" onclick="openApproveModal(${leave.id})">
                                <i class="bi bi-check-lg me-1"></i>Approve
                            </button></td>`
            : '<td><span class="text-muted">—</span></td>')
        : ''}
            </tr>
        `).join('');

    return `
            <div class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                    <thead class="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Reason</th>
                            <th>Status</th>
                            ${showApproveBtn ? '<th>Action</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
}



function buildBadge(status) {
    const s   = (status || 'PENDING').toUpperCase();
    const cls = s === 'APPROVED' ? 'status-approved'
        : s === 'REJECTED' ? 'status-rejected'
            : 'status-pending';
    return `<span class="status-badge ${cls}">${s}</span>`;
}




async function loadDashboard() {
    try {
        let leaves = [];

        try {
            const data = await apiCall('/leaves/all');
            leaves = Array.isArray(data) ? data : (data.leaves || []);
        } catch {
            const data = await apiCall('/leaves/my');
            leaves = Array.isArray(data) ? data : (data.leaves || []);
        }

        document.getElementById('stat-total').textContent    = leaves.length;
        document.getElementById('stat-pending').textContent  = leaves.filter(l => l.status === 'PENDING').length;
        document.getElementById('stat-approved').textContent = leaves.filter(l => l.status === 'APPROVED').length;
        document.getElementById('stat-rejected').textContent = leaves.filter(l => l.status === 'REJECTED').length;

        document.getElementById('dash-table').innerHTML = buildLeaveTable(leaves.slice(0, 8));

    } catch(e) {
        document.getElementById('dash-table').innerHTML =
            '<div class="text-center text-muted py-4">Could not load data.</div>';
    }
}