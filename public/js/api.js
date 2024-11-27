const API_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3010/api'
    : 'http://wakelight.shop:3010/api';

export async function signup(userId, password, confirmPassword) {
  const response = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, password, confirmPassword }),
    credentials: 'include',
  });
  return await response.json();
}

export async function login(userId, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    throw new Error('서버 연결에 실패했습니다.');
  }
}

export async function createCharacter(nickname) {
  try {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nickname }),
      credentials: 'include',
      mode: 'cors',
    });
    return await response.json();
  } catch (error) {
    throw new Error('캐릭터 생성 요청에 실패했습니다.');
  }
}

export async function searchCharacter(nickname) {
  const response = await fetch(`${API_URL}/characters/${nickname}`, {
    credentials: 'include', // 추가
  });
  return await response.json();
}
