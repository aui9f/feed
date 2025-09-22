## 📅 개발 진행 기록

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

UX 개선

- 풀 투 리프레시 (모바일)
- 댓글 표시와 입력 UI

기능 개선

- 이미지 lazy loading
