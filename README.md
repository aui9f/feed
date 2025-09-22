## ⚙️ 실행방법

#### 1. 레포지토리 클론

git clone https://github.com/aui9f/feed.git

#### 2. 클론한 디렉토리로 이동

cd feed

#### 3. 원격 브랜치 확인 (선택 사항)

git branch -r

#### 4. master 브랜치 체크아웃

git checkout master

#### 5. 최신 커밋 가져오기

git pull origin master

### 의존성 설치

아래 명령어 중 하나를 사용해 의존성을 설치하세요.

```bash
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 데이터베이스 마이그레이션 및 시드 데이터 입력

##### 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성 후 아래 내용 입력:

```bash
DATABASE_URL="file:./database.db"
```

##### 기존 SQLite DB 파일 삭제 후 Prisma 마이그레이션 적용

```bash
# 삭제
rm prisma/database.db
# Prisma 마이그레이션 적용, --name 뒤는 마이그레이션 이름으로 자유롭게 지정 가능
npx prisma migrate deploy
npx prisma migrate dev --name init
```

##### 시드 데이터 입력

```bash
npx prisma db seed
```

## 🖥️ 사용한 기술 스택 및 선택 이유

1. NextJS

   React 기반의 프레임워크로 클라이언트 + 서버 코드를 한 프로젝트에서 관리 가능

   next/image와 같은 이미지 최적화 제공

   폴더 구조 기반의 파일 라우팅이기 때문에 별도의 라우터 라이브러리 없이 페이지 이동 가능

   (이번 과제는 아니지만, 쿼리를 서버에서 처리할수있기 때문에 브라우저에서 확인이 불가, 클라이언트 렌더링 대비 보안성이 좋음)

2. Prisma

   Typescript와 호환이 좋으며 모델 기반 타입을 지원하여 타입 안정성이 보장

   mock 데이터를 Prisma seed용으로 변환 -> mockPost에 데이터를 나눠서 User, commentList 모델을 추가

3. Zustand

   전역 상태를 쉽게 관리

4. React Query

   서버 상태 관리 라이브러리

   캐시 관리, refetch, 낙관적 업데이트 등을 제공

5. Tailwind CSS

   클래스 이름으로 스타일을 작성할수 있으며, 커스텀 CSS 작성과 반응형 UI를 빠르게 개발 가능

## 🧩 간략한 디렉토리 구조와 설명

- app/: 페이지 UI와 해당 페이지에서 동작하는 로직(actions)을 구분하여 관리.

- components/: 자주 쓰이는 UI. 재사용성과 스타일 통일에 유리

  ├─ intercept/ # 인터셉터로 처리되는 공통 UI/로직

  ├─ Loading.tsx # 로딩 스피너

  ├─ PreviewImages.tsx # 이미지 미리보기 컴포넌트

  └─ Feed/ # Feed 리스트 및 관련 컴포넌트

- hooks/: API 호출, 캐시 처리 등 공통 로직을 커스텀 훅으로 관리

- lib/: Prisma 연결, 정규식 등 프로젝트 공통 모듈.

- store/: Zustand를 활용한 전역 상태 관리.

- types/: UI 및 공통 데이터 타입 정의.

- utils/: 날짜, 숫자 등 반복되는 유틸리티 함수.

## ☑️ 구현한 기능 목록

##### ✅ 완료, ⚠️ 제약 있음, ❌ 미구현

- 전체

  ✅ 반응형 UI

- 게시물 리스트(/)

  ✅ 무한 스크롤로 게시물 목록 표시

- 게시물 카드에 포함될 정보

  ✅ 작성자 정보(프로필 이미지, 닉네임)

  ✅ 게시물 내용(텍스트, 이미지, 카테고리)

  ✅ 작성시간(상대적 시간: “방금전”, “1시간 전”)-- 받은 데이터는 날짜는 이전이라, 피드 작성후 확인

  ✅ 상호작용 관련 내용(좋아요 수, 리트윗수, 댓글 수)

  ⚠️ 상호작용 버튼(좋아요, 리트윗) -- intercepting routes(modal)에서 적용후 리스트 반영은 안됩니다.

- 게시물 작성(/create)

  ✅ 게시물 작성 모달 또는 별도 페이지 -- 별도 페이지

  ✅ 텍스트 입력(최대 280자)

  ✅ 실시간 글자 수 카운터

  ✅ 이미지 첨부 기능 (미리보기 포함, 최대 4장)

  ✅ 카테고리 선택(1개만)

  ✅ 작성 완료 후 피드에 새 게시물 반영 -- 작성완료후엔 상세페이지로 이동하며, 목록에도 반영됩니다.

- UX 개선

  ✅ 스켈레톤 로딩 적용 -- 리스트 적용

  ❌ 풀 투 리프레시 (모바일)

  ⚠️이미지 확대보기 모달 -- 상세보기로 대체 하였습니다.

  ✅ 댓글 표시와 입력 UI

  ✅ 텍스트 하이라이팅(해시태그, URL) -- 리스트 상세보기에서 태그 클릭시 페이지 이동 (구현은 하지 않았지만, 페이지 이동 및 레이아웃은 잡아둠)

- 기능 개선

  ✅ 카테고리 필터링 기능 추가

  ✅ 등록시간별 정렬 기능 추가

  ⚠️️ 이미지 lazy loading -- Nextjs에서는 next/image의 <Image/>컴포넌트를 사용 → <Image /> 태그 형식으로 정리

## 📅 개발 진행 기록

### 개발환경

맥북

### Day 1

- 파일로 받은 mock데이터를 Prisma seed용으로 수정

- category, post 관계에 맞춰 데이터 구조 조정

  -- mockPosts의 images와 commentList를 별도 테이블로 분리

  -- Post와 Comment에 작성된 유저 정보를 추출하여 User 테이블 생성

### Day 2

- 게시물 리스트 출력

- 상세보기 (아직 확인 페이지, 이미지 확대를 상세보기에서 처리)

### Day 3

- 게시물 작성(/feed/create)

  -- 이미지는 0~4

  -- 카테고리 1개 필수

- 상세보기 추가개발

  -- 댓글 표시

  -- 입력UI
