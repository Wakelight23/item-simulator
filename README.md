# Item-Simulator (아이템 시뮬레이터)

## 개요

- 게임 클라이언트에 접속 할 수 없을 때 현재 나의 게임 아이템 상황 및 다른 사람들의
  게임 아이템 상황을 볼 수 있도록 정보를 제공하는 서비스
- 단, 이번 프로그램에서는 직접 아이템을 가지는 형태가 아닌 시뮬레이션 형태로 제작

## 기본 기능 구현

1. 회원가입 API (회원가입을 하면 캐릭터 생성 및 프로그램 조작 권한 부여)
2. 로그인 API (등록된 회원의 경우 캐릭터 인벤토리 조작 권한 부여)
   -> 로그인한 계정에 있는 캐릭터에만 접근이 가능
3. JWT 인증 과정을 거쳐 계정에 새로운 캐릭터 생성, 삭제
   -> 한 개의 계정에서 여러개의 캐릭터를 만들기 가능
4. 각 캐릭터에 대한 정보를 상세조회
   -> 로그인하지 않아도 조회할 수 있도록 구현(누구나 조회 가능)
5. 아이템 생성 및 판매 및 삭제
   - 아이템 랜덤 생성으로 확률에 따라 아이템을 얻는다
   - 아이템을 판매하거나 삭제할 수 있는 기능 구현
6. 아이템 목록 조회
   - 어떤 아이템이 있는지 전체 리스트를 조회할 수 있는 페이지 구현
   - 해당 아이템의 상세 정보는 아이템 아이콘을 눌렀을 때 확인하는 팝업 생성

## 도전 기능

1. JWT 인증 과정을 거치는 기능들
   - 아이템 구입 시 게임 머니 차감 및 인벤토리 추가
   - 아이템 판매 시스템
   - 특정 캐릭터의 인벤토리 아이템 목록 조회
   - 특정 캐릭터 장착한 아이템 목록 조회 -> JWT 인증 과정 없어도 가능
   - 아이템 장/탈착 시스템 (아이템 장/탈착 시 캐릭터 스탯 변경)
   - 캐릭터의 능력치에 따라 클릭 형태의 게임 머니 획득 수단 구현

## :exclamation: 작업중... (구현되거나 아직 구현되지 않은 기능)

- API

  - [x] 로그인, 회원가입, 관리자 로그인
  - [x] 관리자 로그인 시 아이템 생성, 삭제, 모든 캐릭터 조회, 모든 계정 조회 가능
  - [x] 로그인 시 캐릭터 생성 (캐릭터는 최대 3개까지 생성 가능)
  - [x] 캐릭터 생성 후 캐릭터를 선택하여 인벤토리 및 능력치 확인 가능
  - [x] 아이템 랜덤 뽑기, 아이템 판매, 아이템 전체 판매 기능
  - [ ] 캐릭터 삭제
  - [ ] 아이템 장착 시스템, 캐릭터 능력치 변경
  - [ ] 캐릭터 검색 시 인벤토리 열람

- Frontend
  - [x] 로그인, 회원가입, 관리자 로그인
  - [x] 관리자 로그인 시 아이템 생성, 삭제, 모든 캐릭터 조회, 모든 계정 조회 가능
  - [x] 로그인 시 캐릭터 생성 (캐릭터는 최대 3개까지 생성 가능)
  - [x] 캐릭터 생성 후 캐릭터를 선택하여 인벤토리 및 능력치 확인 가능
  - [x] 캐릭터 재선택 가능
  - [x] 아이템 랜덤 뽑기, 아이템 판매, 아이템 전체 판매 기능
  - [ ] 캐릭터 삭제
  - [ ] 아이템 장착 시스템, 캐릭터 능력치 변경
  - [ ] 캐릭터 검색 시 인벤토리 열람

## 질문과 답변

1.  **암호화 방식**

    Q1. 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?

        A : 단방향 암호화에 해당합니다.

        - 암호화만 할 수 있고 복호화 할 수 없는 암호화 기술입니다.
        - 암호화된 데이터를 원래의 평문으로 되돌릴 수 없는 암호화 방법입니다.
        - 단방향 암호화는 데이터의 기밀성보다 무결성, 인증을 보장하는데 중점을 둡니다.

    Q2. 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?

        A :
        - 해시값은 역산이 불가능하기에 원본 비밀번호에 대한 복원이 어렵습니다
          즉, 원본 비밀번호 노출을 방지할 수 있습니다.
        - 원본 비밀번호 노출 없이 인증 처리가 가능합니다.

2.  **인증 방식**

    Q1. JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?

          A :
          - JWT는 발급 후 만료 시간까지 토큰이 유효하기에 토큰이 탈취되어도 즉시
            무효화에 어려움이 있습니다.
          - 만약, 관리자 계정의 토큰이 노출될 경우 관리자 API에 접근하여 개인정보
            유출 및 게임의 경우 게임 시스템의 근간이 흔들릴 수 있습니다.
            ex) 아이템 생성 및 삭제, 재화 등

    Q2. 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

          A :
          - 간단한 방법으로는 Access Token의 만료 시간을 짧게 설정합니다.
          - httpOnly 쿠키를 사용하여 코드적으로 접근할 수 없게 설정합니다.
          - 지속적인 모니터링으로 비정삭적인 토큰 사용을 감지하며 접근 로그 기록을
            남기도록 설정하고 실시간 보안 모니터링을 구현함으로 보완할 수 있습니다.

3.  **인증과 인가**

    Q1. 인증과 인가가 무엇인지 각각 설명해 주세요.

          A :
          인증(Authentication) :
             - 사용자의 신원을 확인하고 로그인 과정을 통해 사용자가 누구인지
               확인합니다.
             - 토큰을 할당하여 인증 상태를 유지하고 미들웨어를 통해 토큰 유효성을
               검사하여 유효한 토큰이 존재하면 접근 허가, 없으면 거부합니다.
          인가(Authorization) :
             - 권한에 대한 확인을 합니다.
             - 관리자인지 일반 사용자인지 중간 관리자인지 설정해놓은 권한 단계에
               따라 권한을 검증하고 API에 대한 허가 및 접근을 차단합니다.

    Q2. 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?

          A :
          - 인증을 필요로 하는 API에 경우는 노출되면 민감할 수 있는 정보를
            수집할 경우 이를 숨기고 인증 과정을 거쳐 확인하는 경우에 사용합니다
            ex) 회원가입 시 입력하는 정보, 게임 캐릭터의 재화 등
          - 인증이 필요 없는 API는 누구든지 볼 수 있는 정보이며 읽기만 가능하게
            할 경우에 사용합니다.
            ex) 공개 게시글, 공개 댓글, 게임 캐릭터 정보 등

    Q3. 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?

          A :
          - 게임에서 아이템을 생성한다는 것은 해당 아이템에는 가치가 생길 수도 있고
            아이템에 대한 상세 설정, 정보들을 담아야하며 이 정보들은 일관성 있게
            생성되어야하기 때문입니다.
          - 만약 누구나 아이템 생성, 수정이 가능하다면 아이템은 일관성이 사라지고
            데이터베이스에 저장될 때 어려움이 있을 것입니다. 또한 게임에서는
            균형적인 플레이를 유지해야하기 때문에 게임을 전체적으로 관리하는 권한을
            가지고 있는 관리자만 생성, 수정이 가능해야 합니다.

4.  **Http Status Code**

    Q1. 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.

          A :
          2XX : 구현한 코드가 제대로 작동 되었을 때
          - 200 : 따로 status에 번호를 적지 않았을 때 default 값
          - 201 : Created (생성을 성공했습니다)
          - 201 :
          4XX : 클라이언트에서 오류가 발생했을 때
          - 401 : Unauthorized (인증에 실패했습니다)
          - 401 : 토큰이 만료되었습니다
          - 401 : 아이디가 존재하지 않습니다
          - 404 : 캐릭터를 찾을 수 없습니다 (리소스를 찾을 수 없을 때)
          - 409 : 이미 존재하는 아이템입니다 (리소스가 충돌할 때)
          5xx : 서버에서 오류가 발생했을 때
          - 500 : 서버 내부에서 오류가 발생했습니다

5.  **게임 경제**

    Q1. 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다.

    - Q1-1. 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요?

          A :
          - money에는 변화가 없고 기본값으로 설정된 money로만 행동이 가능합니다.
          - money가 0에 도달했을 때 아이템 획득 등 money가 필요한 기능을 사용할
            때 추가적으로 이용이 불가능합니다.

    - Q1-2. 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?

          A :
          - 클릭 할 수 있는 UI를 구현하여 클릭 할 때마다 money가 증가하는 기능을
           구현하여 money가 증가하도록 구현할 수 있습니다.
          - 일정 시간이 지나면 money가 증가하도록 설정하여 계속해서 money가 필요한
            기능들을 지속적으로 이용할 수 있게 구현할 수 있습니다.
          - money가 0에 도달했을 때 자동적으로 다시 초기 수치로 돌아가게 구현하여
            money가 필요한 기능들을 이용할 수 있게 구현할 수 있습니다.

    Q2. 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?

         A :
         - 아이템 가격을 클라이언트가 정하게 되면 게임의 난이도가 매우 쉬워지며
           게임의 목적성을 상실할 수 있습니다.
         - 예를 들어 게임의 목표가 1억 money를 모으는 게임이라면 아이템의 가격을
           클라이언트가 입력할 수 있을 때 하나의 아이템만을 얻어서 그 아이템을 바로
           1억 money로 입력하여 판매하게 되면 바로 게임이 클리어 되어버리고 게임의
           목적을 상실하게 되고 이는 곧 게임의 플레이 경험, 평가가 저하되는 결과가
           초래됩니다.
