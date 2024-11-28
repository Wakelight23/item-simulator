import { signup, login, createCharacter, searchCharacter } from './api.js';
export {
  handleSignup,
  handleLogin,
  handleCreateCharacter,
  handleSearchCharacter,
};

document.addEventListener('DOMContentLoaded', () => {
  // 회원가입 UI 전환
  document
    .getElementById('showSignupBtn')
    .addEventListener('click', showSignupSection);
  // 회원가입 처리
  document.getElementById('signupBtn').addEventListener('click', handleSignup);
  // 로그인 처리
  document.getElementById('loginBtn').addEventListener('click', handleLogin);
  // const isLoggedIn = localStorage.getItem('isLoggedIn');
  // if (isLoggedIn === 'true') {
  //   document.getElementById('characterSection').classList.remove('hidden');
  //   document.getElementById('loginSection').classList.add('hidden');
  // }
  // 캐릭터 관련
  document
    .getElementById('createCharacterBtn')
    .addEventListener('click', handleCreateCharacter);
  document
    .getElementById('searchBtn')
    .addEventListener('click', handleSearchCharacter);
});

// 회원가입할 때 UI
async function handleSignup() {
  try {
    const userId = document.getElementById('signupUserId').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!userId || !password || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const data = await signup(userId, password, confirmPassword);
    alert(data.message);
    if (data.message === '회원가입이 완료되었습니다.') {
      showLoginSection();
    }
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
  }
}

// 로그인할 때 UI
async function handleLogin() {
  try {
    const userId = document.getElementById('loginUserId').value;
    const password = document.getElementById('loginPassword').value;

    if (!userId || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    const data = await login(userId, password);
    if (data.message === '로그인에 성공했습니다.') {
      localStorage.setItem('isLoggedIn', 'true');
      document.getElementById('characterSection').classList.remove('hidden');
      document.getElementById('loginSection').classList.add('hidden');
    }
    alert(data.message);
  } catch (error) {
    alert(error.message);
  }
}

// UI 전환 함수
function showLoginSection() {
  document.getElementById('loginSection').classList.remove('hidden');
  document.getElementById('signupSection').classList.add('hidden');
}

// UI 전환 함수
function showSignupSection() {
  document.getElementById('loginSection').classList.add('hidden');
  document.getElementById('signupSection').classList.remove('hidden');
}

// 캐릭터 생성 시 UI
async function handleCreateCharacter() {
  try {
    const cookies = document.cookie;
    console.log('현재 쿠키:', cookies);

    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || !cookies.includes('authorization')) {
      alert('로그인이 필요합니다.');
      document.getElementById('loginSection').classList.remove('hidden'); // ID 수정
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

// 캐릭터 검색 UI
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

// 캐릭터 정보 UI
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
