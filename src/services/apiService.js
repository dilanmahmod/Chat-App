const API_BASE_URL = 'https://chatify-api.up.railway.app';

async function handleFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Request failed');
    }
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error; 
  }
}

export async function fetchCsrfToken() {
  return handleFetch(`${API_BASE_URL}/csrf`, {
    method: 'PATCH',
  });
}

export async function registerUser(username, email, password) {
  const csrfToken = await fetchCsrfToken();
  return handleFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function loginUser(email, password) {
  const csrfToken = await fetchCsrfToken();
  const data = await handleFetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({ email, password }),
  });
  return data.token;
}

export async function fetchMessages(token) {
  return handleFetch(`${API_BASE_URL}/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function createMessage(token, content) {
  return handleFetch(`${API_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
}

export async function deleteMessage(token, msgId) {
  await handleFetch(`${API_BASE_URL}/messages/${msgId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return true; 
}

export async function fetchUser(token, userId) {
  return handleFetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
}

export async function updateUser(token, userData) {
  return handleFetch(`${API_BASE_URL}/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
}

export async function deleteUser(token, userId) {
  await handleFetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return true;
}


  