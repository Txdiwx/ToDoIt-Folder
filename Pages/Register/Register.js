function toggleForms(formID) {
    document.getElementById('registerForm').classList.toggle('active');
  }
  
  function login() {
    localStorage.removeItem('token');
    window.location.href = "Login.html";
  }
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = "Login.html";
  }
  
  function tasks() {
    localStorage.removeItem('token');
    window.location.href = "Tasks.html"
  }
  
  function home() {
    localStorage.removeItem('token');
    window.location.href = "Home.html";
  }