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