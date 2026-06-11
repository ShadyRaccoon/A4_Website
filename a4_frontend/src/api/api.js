const BASE_URL = 'http://localhost:5242/api'

export function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export const api = {
  login: (email, password) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }),

  getPosts: () =>
    fetch(`${BASE_URL}/post`),

  getAllPosts: (token) =>
    fetch(`${BASE_URL}/post/all`, {
      headers: authHeaders(token),
    }),

  createPost: (token, dto) =>
    fetch(`${BASE_URL}/post`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(dto)
    }),

  updatePost: (token, id, dto) =>
    fetch(`${BASE_URL}/post/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(dto)
    }),

  toggleHidden: (token, id) =>
    fetch(`${BASE_URL}/post/${id}/toggle-hidden`, {
      method: 'PATCH',
      headers: authHeaders(token),
    }),

  deletePost: (token, id) =>
    fetch(`${BASE_URL}/post/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),

  getMembers: (token) =>
    fetch(`${BASE_URL}/member`, {
      headers: authHeaders(token),
    }),

  createMember: (token, dto) =>
    fetch(`${BASE_URL}/member`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(dto)
    }),

  markMemberLeft: (token, id) =>
    fetch(`${BASE_URL}/member/${id}/mark-left`, {
      method: 'PATCH',
      headers: authHeaders(token),
    }),

  getAccountRequests: (token) =>
    fetch(`${BASE_URL}/accountrequest`, {
      headers: authHeaders(token),
    }),

  acceptRequest: (token, id) =>
    fetch(`${BASE_URL}/accountrequest/${id}/accept`, {
      method: 'PATCH',
      headers: authHeaders(token),
    }),

  denyRequest: (token, id) =>
    fetch(`${BASE_URL}/accountrequest/${id}/deny`, {
      method: 'PATCH',
      headers: authHeaders(token),
    }),

  getDevices: (token) =>
    fetch(`${BASE_URL}/device`, {
      headers: authHeaders(token),
    }),

  deactivateDevice: (token, id) =>
    fetch(`${BASE_URL}/device/${id}/deactivate`, {
      method: 'PATCH',
      headers: authHeaders(token),
    }),

  uploadImage: (token, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return fetch(`${BASE_URL}/blobstorage/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
  },

  savePicture: (token, url) =>
  fetch(`${BASE_URL}/picture`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ url })
  }),

  updateMember: (token, id, dto) =>
  fetch(`${BASE_URL}/member/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(dto)
  }),

  createRequest: (token, dto) =>
  fetch(`${BASE_URL}/accountrequest`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dto)
  }),

  getAccounts: (token) =>
  fetch(`${BASE_URL}/auth/accounts`, {
    headers: authHeaders(token),
  }),

  toggleAccountActive: (token, id) =>
  fetch(`${BASE_URL}/auth/${id}/toggle-active`, {
    method: 'PATCH',
    headers: authHeaders(token),
  }),

  createAccount: (token, dto) =>
  fetch(`${BASE_URL}/auth/create-account`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(dto)
  }),

  sendDeviceToken: (token, userId) =>
  fetch(`${BASE_URL}/auth/${userId}/send-device-token`, {
    method: 'POST',
    headers: authHeaders(token),
  }),

  sendDeviceTokenByEmail: (token, email) =>
  fetch(`${BASE_URL}/auth/device-token`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ email })
  }),
}