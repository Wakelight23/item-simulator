const API_URL =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3010/api'
    : 'http://wakelight.shop:3010/api';

export async function signup(userId, password, confirmPassword) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password, confirmPassword }),
      credentials: 'include',
    });
    return await response.json();
  } catch (error) {
    throw new Error('회원가입 요청에 실패했습니다.');
  }
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
      mode: 'cors',
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

// 캐릭터 조회
export async function searchCharacter(nickname) {
  const response = await fetch(`${API_URL}/characters/${nickname}`, {
    credentials: 'include',
  });
  return await response.json();
}

// 캐릭터 리스트 가져오기
export async function getCharacterList(accountId) {
  const response = await fetch(`${API_URL}/accounts/${accountId}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

// 캐릭터 정보
export async function getCharacterInfo(characterId) {
  try {
    const response = await fetch(`${API_URL}/characters/${characterId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '캐릭터 정보를 불러올 수 없습니다.');
    }

    const data = await response.json();
    if (!data || !data.data) {
      throw new Error('잘못된 응답 데이터 형식입니다.');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// 아이템 뽑기
export async function drawRandomItem(characterId) {
  const response = await fetch(`${API_URL}/random-item/${characterId}`, {
    method: 'POST',
    credentials: 'include', // 인증 토큰 포함
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '아이템 뽑기에 실패했습니다.');
  }

  return await response.json();
}

// 아이템 판매
export async function sellItem(characterId, itemId) {
  const response = await fetch(
    `${API_URL}/sell-item/${characterId}/${itemId}`,
    {
      method: 'POST',
      credentials: 'include', // 인증 토큰 포함
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '아이템 판매에 실패했습니다.');
  }

  return await response.json();
}

// 모든 아이템 판매
export async function sellAllItems(characterId) {
  const response = await fetch(`${API_URL}/sell-all/${characterId}`, {
    method: 'POST',
    credentials: 'include', // 인증 토큰 포함
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '모든 아이템 판매에 실패했습니다.');
  }

  return await response.json();
}
