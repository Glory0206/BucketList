# 🎯 BucketList - 버킷리스트 관리 애플리케이션
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.3-6DB33F?style=for-the-badge&logo=spring-boot)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql)
![JWT](https://img.shields.io/badge/JWT-0.11.5-000000?style=for-the-badge&logo=json-web-tokens)

**개인 버킷리스트를 관리하고 꿈을 실현해나가는 웹 애플리케이션**

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [설치 및 실행](#-설치-및-실행)
- [API 문서](#-api-문서)
- [개발 과정](#-개발-과정)
- [향후 계획](#-향후-계획)

---

## 🎯 프로젝트 개요

BucketList는 사용자가 개인적인 버킷리스트를 생성하고 관리할 수 있는 풀스택 웹 애플리케이션입니다. JWT 기반 인증 시스템을 통해 안전한 사용자 관리가 가능하며, 완료/미완료 상태를 구분하여 목표 달성 현황을 한눈에 파악할 수 있습니다.

### 핵심 가치
- **개인화된 경험**: 사용자별 버킷리스트 관리
- **안전한 인증**: JWT 토큰 기반 보안 시스템
- **실시간 상태 관리**: 완료/미완료 상태 실시간 업데이트

---

## ✨ 주요 기능

### 🔐 사용자 인증
- 회원가입 및 로그인
- JWT 토큰 기반 인증
- 비밀번호 재설정 (이메일 인증)
- 사용자별 데이터 분리

### 📝 버킷리스트 관리
- 버킷리스트 생성, 수정, 삭제
- 완료/미완료 상태 관리
- 전체 목록 및 분류별 조회
- 파일 업로드 기능
- 카테고리별 분류 및 관리

### ⚙️ 시스템 및 인프라
- Spring AOP 기반 API 실행 시간 로깅  
- Global Exception Handling을 통한 일관된 예외 응답

### 🎨 사용자 인터페이스
- 반응형 웹 디자인
- 직관적인 CRUD 작업
- 실시간 상태 업데이트

---

## 🛠 기술 스택

### Frontend
- **React 19.1.0** - 사용자 인터페이스 구축
- **React Router DOM 7.6.3** - 클라이언트 사이드 라우팅
- **Bootstrap 5.3.7** - 반응형 UI 컴포넌트
- **Axios 1.10.0** - HTTP 클라이언트
- **Vite 7.0.4** - 빌드 도구 및 개발 서버

### Backend
- **Spring Boot 3.5.3** - RESTful API 서버
- **Spring Security** - 인증 및 권한 관리
- **Spring Data JPA** - 데이터베이스 ORM
- **PostgreSQL** - 관계형 데이터베이스
- **JWT (jjwt 0.11.5)** - 토큰 기반 인증
- **Spring Mail** - 이메일 서비스
- **Spring AOP** - API 실행 시간 로깅
- **Global Exception Handling** - 일관된 예외 응답
- **Redis** - Refresh 저장용

### Development Tools
- **Java 17** - 백엔드 개발 언어
- **Node.js 18+** - 프론트엔드 개발 환경
- **Gradle** - 빌드 도구

---

## 📁 프로젝트 구조

```
BucketList/
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/          # 페이지 컴포넌트
│   │   ├── services/       # API 통신 서비스
│   │   └── App.jsx         # 메인 애플리케이션
│   └── package.json
├── backend/                  # Spring Boot 백엔드
│   ├── src/main/java/
│   │   └── com/bucketlist/app/
│   │       ├── aop/         # AOP(관점 지향 프로그래밍) 설정 및 로깅
│   │       ├── controller/  # REST API 컨트롤러
│   │       ├── service/     # 비즈니스 로직 처리
│   │       ├── repository/  # 데이터베이스 접근 계층(JPA 등)
│   │       ├── domain/      # 엔티티 클래스(데이터베이스 테이블 매핑)
│   │       ├── dto/         # 데이터 전송 객체(요청/응답용)
│   │       ├── exception/   # 전역 예외 처리 및 커스텀 예외
│   │       ├── security/    # JWT 및 Spring Security 설정
│   │       └── config/      # 애플리케이션 전역 설정
│   └── build.gradle
└── README.md
```

---

## 🛠 실행 방법

### 0. 환경 변수 설정 (공통)

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 작성하세요:

```bash
# 데이터베이스 설정
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password_here

# JWT 설정
JWT_SECRET_KEY=your_jwt_secret_key_here_make_it_long_and_secure

# 이메일 설정 (Naver)
MAIL_EMAIL=your_naver_email@naver.com
MAIL_PASSWORD=your_app_password_here

```

**중요한 설정 사항:**
- `POSTGRES_USER`: PostgreSQL User 이름름
- `POSTGRES_PASSWORD`: PostgreSQL 데이터베이스 비밀번호
- `JWT_SECRET_KEY`: JWT 토큰 서명에 사용되는 비밀키 (최소 32자 이상의 랜덤 문자열 권장)
- `MAIL_EMAIL`: Gmail 계정 (비밀번호 재설정 기능에 사용)
- `MAIL_PASSWORD`: Gmail 앱 비밀번호 (Gmail 2단계 인증 설정 후 생성)

**Gmail 앱 비밀번호 설정 방법:**
1. Gmail 계정에서 2단계 인증 활성화
2. Google 계정 설정 → 보안 → 앱 비밀번호 생성
3. 생성된 16자리 앱 비밀번호를 `MAIL_PASSWORD`에 입력

### 1. Docker Compose로 실행 (추천)

#### 1) 저장소 클론
```bash
git clone https://github.com/Glory0206/BucketList.git
cd BucketList
```

#### 2) 도커 컴포즈로 전체 서비스 실행
```bash
docker-compose up --build
```

#### 3) 브라우저에서 접속
- **프론트엔드**: [http://localhost:5173](http://localhost:5173)

---

### 2. 로컬 환경에서 직접 실행

#### 1) 사전 요구사항
- Java 17 이상
- Node.js 20 이상
- PostgreSQL 13 이상
- npm 8 이상

#### 2) PostgreSQL 데이터베이스 설정
```sql
CREATE DATABASE bucketlist;
CREATE USER postgres WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE bucketlist TO postgres;
```

#### 3) 백엔드(Spring Boot)
```bash
cd backend
./gradlew build
java -jar build/libs/bucketlist-0.0.1-SNAPSHOT.jar
```
또는 IDE에서 `BucketlistApplication.java`의 main() 실행

#### 4) 프론트엔드(React)
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 API 문서

### 인증 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/auth/create-code` | 비밀번호 재설정 코드 생성 |
| POST | `/api/auth/reset-password` | 비밀번호 재설정 |
| POST | `/api/auth/token-reissue` | Access Token 재발급(Refresh Token 기반) |

### 버킷리스트 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bucket` | 전체 버킷리스트 조회 |
| GET | `/api/bucket/completed` | 완료된 버킷리스트 조회 |
| GET | `/api/bucket/incompleted` | 미완료 버킷리스트 조회 |
| POST | `/api/bucket` | 버킷리스트 항목 생성 |
| PUT | `/api/bucket/{id}` | 버킷리스트 항목 수정 |
| PUT | `/api/bucket/{id}/complete` | 버킷리스트 항목 완료 처리 |
| PUT | `/api/bucket/{id}/uncomplete` | 버킷리스트 항목 미완료(완료 취소) 처리 |
| DELETE | `/api/bucket/{id}` | 버킷리스트 항목 삭제 |
| POST | `/api/bucket/bucket-item/{id}/file` | 파일 업로드 |
| DELETE | `/api/bucket/bucket-item/{id}/file/{fileId}` | 파일 삭제 |

### 카테고리 관리 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/category` | 사용자별 모든 카테고리 조회 |
| POST | `/api/category` | 카테고리 생성 |
| PUT | `/api/category/{id}` | 카테고리 수정 |
| DELETE | `/api/category/{id}` | 카테고리 삭제 |

---

## 🔧 개발 과정

### 1. 프로젝트 초기 설정
- Spring Boot 프로젝트 생성 (Java 17, Spring Boot 3.5.3)
- React 프로젝트 생성 (Vite, React 19)
- 데이터베이스 스키마 설계

### 2. 백엔드 개발
- JWT 기반 인증 시스템 구현
- Spring Security 설정
- RESTful API 개발
- 파일 업로드 기능 구현
- 카테고리 관리 시스템 구현

### 3. 프론트엔드 개발
- React Router를 활용한 라우팅
- Bootstrap을 활용한 반응형 UI
- Axios를 활용한 API 통신
- 상태 관리 및 컴포넌트 분리

### 4. 통합 및 테스트
- 프론트엔드-백엔드 연동
- CORS 설정
- 에러 핸들링
- 사용자 테스트

---

## 🎯 향후 계획

### 단기 계획
- [ ] 사용자 프로필 관리 기능
- [o] 버킷리스트 카테고리 분류
- [ ] 진행률 시각화 (차트, 그래프)

### 중기 계획
- [ ] 소셜 기능 (친구 추가, 공유)
- [ ] 알림 시스템
- [ ] 다국어 지원
- [ ] PWA (Progressive Web App) 구현

### 장기 계획
- [ ] AI 기반 추천 시스템
- [ ] 커뮤니티 기능

---

## 👤 개발자 정보
| 항목     | 내용                                    |
|----------|-----------------------------------------|
| 이름     | 서영광                                  |
| GitHub  | [github.com/Glory0206](https://github.com/Glory0206) |
| 이메일   | dmb07223@gmail.com |

---
