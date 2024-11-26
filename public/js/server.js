import { signup, login, createCharacter, searchCharacter } from './api.js';
export {
  handleSignup,
  handleLogin,
  handleCreateCharacter,
  handleSearchCharacter,
};

document.addEventListener('DOMContentLoaded', () => {
  // 이벤트 리스너 등록
  document.getElementById('signupBtn').addEventListener('click', handleSignup);
  document.getElementById('loginBtn').addEventListener('click', handleLogin);

  // 페이지 로드 시 로그인 상태 확인
  // const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  // if (isLoggedIn === 'true') {
  //   document.getElementById('characterSection').classList.remove('hidden');
  //   document.getElementById('accountSection').classList.add('hidden');
  // }

  // 캐릭터 생성 UI
  document
    .getElementById('createCharacterBtn')
    .addEventListener('click', handleCreateCharacter);
  // 캐릭터 검색 UI
  document
    .getElementById('searchBtn')
    .addEventListener('click', handleSearchCharacter);
});

async function handleSignup() {
  try {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const data = await signup(userId, password);
    alert(data.message);
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
  }
}

async function handleLogin() {
  try {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const data = await login(userId, password);

    if (data.message === '로그인에 성공했습니다.') {
      // 쿠키 설정 즉시 확인
      console.log('로그인 후 쿠키:', document.cookie);
      document.getElementById('characterSection').classList.remove('hidden');
      document.getElementById('accountSection').classList.add('hidden');
    }
    alert(data.message);
  } catch (error) {
    console.error('로그인 에러:', error);
    alert('로그인 중 오류가 발생했습니다.');
  }
}

// 페이지 로드 시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    document.getElementById('characterSection').classList.remove('hidden');
    document.getElementById('accountSection').classList.add('hidden');
  }
});

async function handleCreateCharacter() {
  try {
    // 쿠키 확인
    const cookies = document.cookie;
    console.log('현재 쿠키:', cookies);

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || !cookies.includes('authorization')) {
      alert('로그인이 필요합니다.');
      document.getElementById('accountSection').classList.remove('hidden');
      document.getElementById('characterSection').classList.add('hidden');
      return;
    }

    const nickname = document.getElementById('nickname').value;
    const data = await createCharacter(nickname);
    alert(data.message);
  } catch (error) {
    alert('캐릭터 생성 중 오류가 발생했습니다.');
  }
}

async function handleSearchCharacter() {
  try {
    const nickname = document.getElementById('searchNickname').value;
    const data = await searchCharacter(nickname);
    if (data.data) {
      displayCharacterInfo(data.data);
      document.getElementById('characterInfo').classList.remove('hidden');
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('캐릭터 검색 중 오류가 발생했습니다.');
  }
}

function displayCharacterInfo(character) {
  const characterDetails = document.getElementById('characterDetails');
  characterDetails.innerHTML = `
      <div class="character-info">
          <div class="stat-group">
              <div class="stat-label">닉네임</div>
              <div>${character.nickname}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">장비 레벨</div>
              <div>${character.characterInfo.equipLevel}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">마나</div>
              <div>${character.characterInfo.manaPoint}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">공격력</div>
              <div>${character.characterInfo.attackDamage}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">마법 공격력</div>
              <div>${character.characterInfo.magicDamage}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">힘</div>
              <div>${character.characterInfo.strength}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">지능</div>
              <div>${character.characterInfo.intelligence}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">보유 골드</div>
              <div>${character.inventory.gold}</div>
          </div>
      </div>
  `;
}
