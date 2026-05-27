const BASE_URL = 'https://she-can-api.vercel.app/api'; 

const fetcher = async (endpoint, method = 'GET', body = null) => {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'API Error');
  return data;
};

export const API = {
  login: (data) => fetcher('/auth/login', 'POST', data),
  register: (data) => fetcher('/auth/register', 'POST', data),
  logout: () => fetcher('/auth/logout', 'POST'),
  submitContact: (data) => fetcher('/contact', 'POST', data),
  getMessages: () => fetcher('/messages'),
  updateMessageStatus: (id, status) => fetcher(`/messages/${id}`, 'PATCH', { status }),
  deleteMessage: (id) => fetcher(`/messages/${id}`, 'DELETE'),
  getUsers: () => fetcher('/users')
};