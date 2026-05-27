export const validate = {
  name: v => !v.trim() ? 'Name is required' : v.trim().length < 2 ? 'Name must be at least 2 characters' : '',
  email: v => !v.trim() ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address' : '',
  message: v => !v.trim() ? 'Message is required' : v.trim().length < 10 ? 'Message must be at least 10 characters' : '',
  password: v => !v ? 'Password is required' : v.length < 6 ? 'Password must be at least 6 characters' : !/[A-Z]/.test(v) ? 'Include at least one uppercase letter' : !/[0-9]/.test(v) ? 'Include at least one number' : '',
};