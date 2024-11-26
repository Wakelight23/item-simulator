const API_URL = 'http://localhost:3010/api';

export async function signup(userId, password) {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
  });
  return await response.json();
}

export async function login(userId, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password }),
    credentials: 'include',
  });

  // 응답 헤더에서 쿠키 확인
  console.log('Response Headers:', response.headers);
  return await response.json();
}

export async function createCharacter(nickname) {
  const response = await fetch(`${API_URL}/characters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nickname }),
    credentials: 'include', // 쿠키 자동 전송
  });
  return await response.json();
}

export async function searchCharacter(nickname) {
  const response = await fetch(`${API_URL}/characters/${nickname}`);
  return await response.json();
}
