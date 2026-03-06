

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


async function applyLeave() {
    const leaveType = document.getElementById('leave-type').value;
    const startDate = document.getElementById('leave-start').value;
    const endDate   = document.getElementById('leave-end').value;
    const reason    = document.getElementById('leave-reason').value.trim();

    if (!startDate || !endDate || !reason) {
        return showToast('Please fill all fields', 'error');
    }
    if (startDate > endDate) {
        return showToast('End date must be after start date', 'error');
    }

    try {
        await apiCall('/leaves', {
            method: 'POST',
            body: JSON.stringify({ leaveType, startDate, endDate, reason })
        });

        showToast('Leave request submitted!', 'success');
        document.getElementById('leave-start').value  = '';
        document.getElementById('leave-end').value    = '';
        document.getElementById('leave-reason').value = '';
        showPage('my-leaves');
    } catch(e) {
        showToast(e.message, 'error');
    }
}


async function loadMyLeaves() {
    document.getElementById('my-leaves-table').innerHTML = '<div class="text-center text-muted py-4">Loading...</div>';
    try {
        const data   = await apiCall('/leaves/my');
        const leaves = Array.isArray(data) ? data : (data.leaves || []);
        document.getElementById('my-leaves-table').innerHTML = buildLeaveTable(leaves);
    } catch(e) {
        document.getElementById('my-leaves-table').innerHTML =
            `<div class="text-center text-danger py-4">${e.message}</div>`;
    }
}


async function loadBalance() {
    document.getElementById('balance-content').innerHTML = '<div class="text-center text-muted py-4">Loading...</div>';

    const userId = currentUser.id || currentUser.userId;

    if (!userId) {
        document.getElementById('balance-content').innerHTML =
            '<div class="text-center text-warning py-4">User ID not found. Please logout and login again.</div>';
        return;
    }

    try {
        const data = await apiCall('/leave-balance/' + userId);

        const leaveTypes = [
            { label: 'Vacation',   total: data.vacationTotal,  used: data.vacationUsed,  color: 'primary' },
            { label: 'Sick Leave', total: data.sickTotal,      used: data.sickUsed,      color: 'danger'  },
            { label: 'Personal',   total: data.personalTotal,  used: data.personalUsed,  color: 'warning' },
            { label: 'Emergency',  total: data.emergencyTotal, used: data.emergencyUsed, color: 'info'    },
        ];

        const list = leaveTypes.filter(t => t.total != null);

        if (!list.length) {
            document.getElementById('balance-content').innerHTML =
                '<div class="text-center text-muted py-4">No balance data.</div>';
            return;
        }

        const year = data.year ? `<p class="text-muted small mb-3"><i class="bi bi-calendar me-1"></i>Year: ${data.year}</p>` : '';

        const html = list.map(b => {
            const used      = b.used  || 0;
            const total     = b.total || 0;
            const remaining = total - used;
            const percent   = total ? Math.round((used / total) * 100) : 0;

            return `
                    <div class="mb-4">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-semibold small">${b.label}</span>
                            <span class="text-muted small">${remaining} of ${total} days remaining</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-${b.color}" role="progressbar"
                                 style="width:${percent}%"
                                 aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between mt-1">
                            <span class="text-muted" style="font-size:0.72rem">Used: ${used}</span>
                            <span class="text-muted" style="font-size:0.72rem">${percent}%</span>
                        </div>
                    </div>
                `;
        }).join('');

        document.getElementById('balance-content').innerHTML = year + html;
    } catch(e) {
        document.getElementById('balance-content').innerHTML =
            `<div class="text-center text-danger py-4">${e.message}</div>`;
    }
}


function changeMonth(delta) {
    calMonth += delta;
    if (calMonth > 12) { calMonth = 1;  calYear++; }
    if (calMonth < 1)  { calMonth = 12; calYear--; }
    loadCalendar();
}



async function loadCalendar() {
    const monthNames = ['January','February','March','April','May','June',
        'July','August','September','October','November','December'];

    document.getElementById('cal-label').textContent = monthNames[calMonth - 1] + ' ' + calYear;
    document.getElementById('cal-grid').innerHTML = '<div class="text-center text-muted py-3">Loading...</div>';

    try {
        const data   = await apiCall('/leaves/calendar?year=' + calYear + '&month=' + calMonth);
        const leaves = Array.isArray(data) ? data : (data.leaves || []);

        const leaveDays = new Set();
        leaves.forEach(leave => {
            const startDate = new Date(leave.startDate);
            const endDate   = new Date(leave.endDate);
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                leaveDays.add(d.getDate());
            }
        });

        const today       = new Date();
        const daysInMonth = new Date(calYear, calMonth, 0).getDate();
        const firstDay    = new Date(calYear, calMonth - 1, 1).getDay();

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let html = '<div class="cal-grid">';
        dayNames.forEach(d => { html += `<div class="cal-day-name">${d}</div>`; });

        for (let i = 0; i < firstDay; i++) {
            html += '<div class="cal-day"></div>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const isLeave = leaveDays.has(day);
            const isToday = today.getDate() === day &&
                today.getMonth() + 1 === calMonth &&
                today.getFullYear() === calYear;

            let cls = 'cal-day';
            if (isLeave) cls += ' on-leave';
            if (isToday) cls += ' today';

            html += `<div class="${cls}">${day}</div>`;
        }

        html += '</div>';
        document.getElementById('cal-grid').innerHTML = html;

    } catch(e) {
        document.getElementById('cal-grid').innerHTML =
            `<div class="text-center text-danger py-3">${e.message}</div>`;
    }
}


async function loadUsers() {
    document.getElementById('users-table').innerHTML = '<div class="text-center text-muted py-4">Loading...</div>';
    try {
        const data  = await apiCall('/user/alluser');
        const users = Array.isArray(data) ? data : (data.users || []);

        if (!users.length) {
            document.getElementById('users-table').innerHTML =
                '<div class="text-center text-muted py-4">No users found.</div>';
            return;
        }

        const rows = users.map(u => `
                <tr>
                    <td class="text-muted small">${u.id || '—'}</td>
                    <td><strong>${u.name || '—'}</strong></td>
                    <td>${u.email || '—'}</td>
                    <td>${buildBadge(u.role || 'EMPLOYEE')}</td>
                </tr>
            `).join('');

        document.getElementById('users-table').innerHTML = `
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </div>
            `;
    } catch(e) {
        document.getElementById('users-table').innerHTML =
            `<div class="text-center text-danger py-4">${e.message}</div>`;
    }
}
