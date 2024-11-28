import {
  signup,
  login,
  createCharacter,
  searchCharacter,
  getCharacterList,
  getCharacterInfo,
} from './api.js';
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
  // 로그인 토큰이 유지되는 한 새로고침해도 페이지가 뒤로 넘어가지 않음
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    document.getElementById('characterSection').classList.remove('hidden');
    document.getElementById('loginSection').classList.add('hidden');
    displayCharacterList();
  }

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document
    .getElementById('drawItemBtn')
    .addEventListener('click', handleDrawItem);
  document
    .getElementById('sellItemBtn')
    .addEventListener('click', handleSellItem);
  document
    .getElementById('sellAllBtn')
    .addEventListener('click', handleSellAll);
  document
    .getElementById('backToCharacterList')
    .addEventListener('click', handleBackToList);

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
      localStorage.setItem('accountId', data.accountId); // accountId 저장 추가
      document.getElementById('characterSection').classList.remove('hidden');
      document.getElementById('loginSection').classList.add('hidden');
      displayCharacterList(); // 로그인 성공 시 캐릭터 목록 표시
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
              <div class="stat-label">HP</div>
              <div>${character.characterInfo.healthPoint}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">MP</div>
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
              <div class="stat-label">방어력</div>
              <div>${character.characterInfo.defensivePower}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">힘</div>
              <div>${character.characterInfo.strength}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">민첩성</div>
              <div>${character.characterInfo.dexterity}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">지능</div>
              <div>${character.characterInfo.intelligence}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">운</div>
              <div>${character.characterInfo.luck}</div>
          </div>
          <div class="stat-group">
              <div class="stat-label">보유 골드</div>
              <div>${character.inventory.gold}</div>
          </div>
      </div>
  `;
}

let selectedCharacterId = null;
let selectedSlotId = null;

// 캐릭터 목록 표시 함수
async function displayCharacterList() {
  try {
    const accountId = localStorage.getItem('accountId');
    if (!accountId) {
      throw new Error('로그인이 필요합니다.');
    }

    const response = await getCharacterList(accountId);
    if (!response || !response.data) {
      throw new Error('캐릭터 정보를 불러올 수 없습니다.');
    }

    const characterList = document.getElementById('characterList');
    if (response.data.characters && response.data.characters.length > 0) {
      characterList.innerHTML = response.data.characters
        .map(
          (char) => `
                    <div class="character-card">
                        <h3>${char.nickname}</h3>
                        <button onclick="window.handleCharacterSelect(${char.characterId})">캐릭터 선택</button>
                    </div>
                `
        )
        .join('');
    } else {
      characterList.innerHTML = '<p>생성된 캐릭터가 없습니다.</p>';
    }
  } catch (error) {
    console.error('캐릭터 목록 로딩 실패:', error);
    alert(error.message);
  }
}

// 캐릭터 선택 처리 함수
window.handleCharacterSelect = async function (characterId) {
  try {
    if (!characterId) {
      throw new Error('캐릭터 ID가 유효하지 않습니다.');
    }

    selectedCharacterId = characterId;
    const response = await getCharacterInfo(characterId);

    if (!response || !response.data) {
      throw new Error('캐릭터 정보를 불러올 수 없습니다.');
    }

    // UI 전환
    document.getElementById('characterSection').classList.add('hidden');
    document.getElementById('gameSection').classList.remove('hidden');

    // 게임 UI 업데이트
    updateGameUI(response.data);
  } catch (error) {
    console.error('캐릭터 선택 실패:', error);
    alert('캐릭터 정보를 불러오는데 실패했습니다.');
  }
};

// 아이템 뽑기
async function handleDrawItem() {
  try {
    const characterId = selectedCharacterId;
    if (!characterId) {
      alert('캐릭터를 선택해주세요.');
      return;
    }

    const data = await drawRandomItem(characterId);
    alert(data.message);
    // UI 업데이트
    updateGameUI(data);
  } catch (error) {
    console.error('아이템 뽑기 실패:', error);
    alert('아이템 뽑기에 실패했습니다.');
  }
}

// 아이템 판매
async function handleSellItem() {
  try {
    if (!selectedCharacterId) {
      alert('캐릭터를 선택해주세요.');
      return;
    }

    const selectedSlot = document.querySelector('.inventory-slot.selected');
    if (!selectedSlot || !selectedSlot.dataset.itemId) {
      alert('판매할 아이템을 선택해주세요.');
      return;
    }

    const data = await sellItem(
      selectedCharacterId,
      selectedSlot.dataset.itemId
    );
    alert(data.message);
    updateGameUI(data);
  } catch (error) {
    console.error('아이템 판매 실패:', error);
    alert('아이템 판매에 실패했습니다.');
  }
}

// 모든 아이템 판매
async function handleSellAll() {
  try {
    if (!selectedCharacterId) {
      alert('캐릭터를 선택해주세요.');
      return;
    }

    const data = await sellAllItems(selectedCharacterId);
    if (data.message) {
      alert(data.message);
      updateGameUI(data);
    }
  } catch (error) {
    console.error('전체 아이템 판매 실패:', error);
    alert('아이템 판매에 실패했습니다.');
  }
}

// 게임 UI 업데이트
function updateGameUI(data) {
  // 골드 업데이트
  document.getElementById('goldAmount').textContent = data.inventory.gold;

  // 인벤토리 슬롯 업데이트
  const inventorySlots = document.getElementById('inventorySlots');
  inventorySlots.innerHTML = Array(data.inventory.maxSlots)
    .fill(0)
    .map((_, index) => {
      const item = data.inventory.items[index];
      return `
              <div class="inventory-slot ${item ? '' : 'empty'}" 
                   data-slot="${index}" 
                   ${item ? `data-item-id="${item.id}"` : ''}>
                  ${item ? item.name : '빈 슬롯'}
              </div>
          `;
    })
    .join('');
}

// 다시 캐릭터 선택창으로 돌아감
function handleBackToList() {
  document.getElementById('gameSection').classList.add('hidden');
  document.getElementById('characterSection').classList.remove('hidden');
  displayCharacterList();
}

// 로그아웃
function handleLogout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('accountId');
  document.cookie =
    'authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  location.reload();
}
