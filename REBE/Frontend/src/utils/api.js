const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(accessToken) {
  localStorage.setItem('accessToken', accessToken);
}

async function fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

/** ============================
 *  REAL LOGIN (Supabase backend)
 *  ============================ */
async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const responseJson = await response.json();

  if (!response.ok) {
    return { error: true };
  }

  const token = responseJson.session?.access_token;

  if (!token) {
    return { error: true };
  }

  putAccessToken(token);

  return { error: false, accessToken: token };
}

/** ============================
 *  REAL REGISTER
 *  ============================ */
async function register({ name, email, password }) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const json = await res.json();

  if (!res.ok) {
    return { error: true };
  }

  return { error: false };
}

/** ============================
 *  REAL FETCH LOGGED USER
 *  ============================ */
async function getUserLogged() {
  const response = await fetch(`${BASE_URL}/auth/me-full`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      'Content-Type': 'application/json',
    },
  });

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.error || 'Unauthorized');
  }

  return {
    error: false,
    data: responseJson.data,
  };
}

/** ============================
 *  PREDICTION ENDPOINTS
 *  ============================ */
async function getModelInfo() {
  const res = await fetch(`${BASE_URL}/api/model/info`);
  const json = await res.json();

  if (!res.ok) {
    return { error: true, message: json.error || 'Failed to load model info' };
  }

  return { error: false, data: json };
}

async function predictLearning(payload) {
  const res = await fetch(`${BASE_URL}/api/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    return { error: true, message: json.error || 'Prediction failed' };
  }

  return { error: false, data: json.data };
}

async function predictAndSave(payload) {
  const res = await fetchWithToken(`${BASE_URL}/api/predict/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    return { error: true, message: json.error || 'Prediction save failed' };
  }

  return { error: false, data: json.data };
}

async function getMyPrediction() {
  const res = await fetchWithToken(`${BASE_URL}/api/predict/me`);
  const json = await res.json();

  if (!res.ok || json.success === false) {
    return { error: true, message: json.error || 'Failed to load prediction' };
  }

  return { error: false, data: json.data };
}

export {
  getAccessToken,
  putAccessToken,
  login,
  register,
  getUserLogged,
  getModelInfo,
  predictLearning,
  predictAndSave,
  getMyPrediction,
};
