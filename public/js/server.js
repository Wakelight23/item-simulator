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
  // 캐릭터 관련
  document
    .getElementById('createCharacterBtn')
    .addEventListener('click', handleCreateCharacter);
  document
    .getElementById('searchBtn')
    .addEventListener('click', handleSearchCharacter);
});

// document.addEventListener('DOMContentLoaded', () => {
//   // 이벤트 리스너 등록
//   document
//     .getElementById('showSignupBtn')
//     .addEventListener('click', showSignupSection);
//   document.getElementById('signupBtn').addEventListener('click', async () => {
//     const userId = document.getElementById('signupUserId').value;
//     const password = document.getElementById('signupPassword').value;
//     const confirmPassword = document.getElementById('confirmPassword').value;

//     try {
//       const data = await signup(userId, password, confirmPassword);
//       alert(data.message);
//       showLoginSection();
//       // 입력 필드 초기화
//       document.getElementById('signupUserId').value = '';
//       document.getElementById('signupPassword').value = '';
//       document.getElementById('confirmPassword').value = '';
//     } catch (error) {
//       alert('회원가입 중 오류가 발생했습니다.');
//     }
//   });
//   document
//     .getElementById('createCharacterBtn')
//     .addEventListener('click', handleCreateCharacter);
//   document
//     .getElementById('searchBtn')
//     .addEventListener('click', handleSearchCharacter);
// });

async function handleSignup() {
  try {
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const data = await signup(userId, password, confirmPassword);
    alert(data.message);
  } catch (error) {
    alert('회원가입 중 오류가 발생했습니다.');
  }
}

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

// 페이지 로드 시 로그인 상태 확인
// document.addEventListener('DOMContentLoaded', () => {
//   const isLoggedIn = localStorage.getItem('isLoggedIn');
//   if (isLoggedIn === 'true') {
//     document.getElementById('characterSection').classList.remove('hidden');
//     document.getElementById('accountSection').classList.add('hidden');
//   }
// });

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
