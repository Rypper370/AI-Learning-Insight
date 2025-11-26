// const BASE_URL = '';

// // Dummy users database (simulasi backend)
// const DUMMY_USERS = [
//   {
//     id: '1',
//     name: 'John Doe',
//     email: 'john@example.com',
//     password: 'password123'
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     password: 'password123'
//   }
// ];

// // simulasi delay
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// function getAccessToken() {
//   return localStorage.getItem('accessToken');
// }

// function putAccessToken(accessToken) {
//   return localStorage.setItem('accessToken', accessToken);
// }

// async function fetchWithToken(url, options = {}) {
//   return fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${getAccessToken()}`,
//     },
//   });
// }

// async function login({ email, password }) {
//   const response = await fetch(`${BASE_URL}/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   const responseJson = await response.json();

//   if (responseJson.status !== 'success') {
//     alert(responseJson.message);
//     return { error: true, data: null };
//   }

//   return { error: false, data: responseJson.data };
// }

// async function register({ name, email, password }) {
//   const response = await fetch(`${BASE_URL}/register`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ name, email, password }),
//   });

//   const responseJson = await response.json();

//   if (responseJson.status !== 'success') {
//     alert(responseJson.message);
//     return { error: true };
//   }

//   return { error: false };
// }

// async function getUserLogged() {
//   const response = await fetchWithToken(`${BASE_URL}/users/me`);
//   const responseJson = await response.json();

//   if (responseJson.status !== 'success') {
//     return { error: true, data: null };
//   }

//   return { error: false, data: responseJson.data };
// }

// export { getAccessToken, putAccessToken, login, register, getUserLogged };

// Dummy users database (simulasi backend)
const DUMMY_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123'
  }
];

// Simulasi delay network
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function putAccessToken(accessToken) {
  return localStorage.setItem('accessToken', accessToken);
}

async function login({ email, password }) {
  // Simulasi network delay
  await delay(500);

  // Cari user di dummy database
  const user = DUMMY_USERS.find(u => u.email === email && u.password === password);

  if (!user) {
    // alert('Email atau password salah!');
    return { error: true, data: null };
  }

  // Generate dummy access token
  const accessToken = `dummy-token-${user.id}-${Date.now()}`;

  return { 
    error: false, 
    data: { 
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    } 
  };
}

async function register({ name, email, password }) {
  // Simulasi network delay
  await delay(500);

  // Cek apakah email sudah terdaftar
  const existingUser = DUMMY_USERS.find(u => u.email === email);
  
  if (existingUser) {
    // alert('Email sudah terdaftar!');
    return { error: true };
  }

  // Tambahkan user baru ke dummy database
  const newUser = {
    id: String(DUMMY_USERS.length + 1),
    name,
    email,
    password
  };
  
  DUMMY_USERS.push(newUser);
  
  // alert('Registrasi berhasil! Silakan login.');
  return { error: false };
}

async function getUserLogged() {
  // Simulasi network delay
  await delay(300);

  const token = getAccessToken();
  
  if (!token) {
    return { error: true, data: null };
  }

  // Extract user id dari token (format: dummy-token-{id}-{timestamp})
  const userId = token.split('-')[2];
  const user = DUMMY_USERS.find(u => u.id === userId);

  if (!user) {
    return { error: true, data: null };
  }

  return { 
    error: false, 
    data: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

export { getAccessToken, putAccessToken, login, register, getUserLogged };