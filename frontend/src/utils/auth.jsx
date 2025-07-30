export function logout(navigate) {
  localStorage.removeItem('token');
  localStorage.removeItem('nickname');

  if (navigate) {
    navigate('/login');
  } else {
    window.location.href = '/login';
  }
}