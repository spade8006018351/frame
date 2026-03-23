// Simple global state for admin authentication that survives navigation but not refresh
// This acts as a fallback for localStorage in restricted iframe environments
let isAdminAuthenticated = false;

export const setAdminAuth = (value: boolean) => {
  isAdminAuthenticated = value;
  // Also try to persist
  try {
    localStorage.setItem('isAdminAuthenticated', value ? 'true' : 'false');
    sessionStorage.setItem('isAdminAuthenticated', value ? 'true' : 'false');
  } catch (e) {
    console.warn('Storage access denied, relying on memory state');
  }
};

export const getAdminAuth = () => {
  if (isAdminAuthenticated) return true;
  
  try {
    return localStorage.getItem('isAdminAuthenticated') === 'true' || 
           sessionStorage.getItem('isAdminAuthenticated') === 'true';
  } catch (e) {
    return false;
  }
};
