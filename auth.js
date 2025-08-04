const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      sessionStorage.setItem('userType', data.userType);
      sessionStorage.setItem('fullName', data.fullName);
      window.location = '/index.html';
    } else {
      alert(data.message);
    }
  });
}
