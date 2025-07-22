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
│   │       ├── controller/  # REST API 컨트롤러
│   │       ├── service/     # 비즈니스 로직
│   │       ├── repository/  # 데이터 접근 계층
│   │       ├── domain/      # 엔티티 클래스
│   │       ├── dto/         # 데이터 전송 객체
│   │       ├── security/    # JWT 보안 설정
│   │       └── config/      # 애플리케이션 설정
│   └── build.gradle
└── README.md
```

---

## 🚀 설치 및 실행

### 사전 요구사항

- **Java 17** 이상
- **Node.js 18** 이상
- **PostgreSQL 13** 이상
- **npm 8** 이상

### 1. 프로젝트 클론

```bash
git clone https://github.com/Glory0206/BucketList.git
cd BucketList
```

### 2. 데이터베이스 설정

PostgreSQL에서 데이터베이스를 생성하고 연결 정보를 설정합니다.

```sql
CREATE DATABASE bucketlist;
```

### 3. 백엔드 실행

```bash
cd backend

# Gradle을 사용한 빌드
./gradlew build

# 애플리케이션 실행
java -jar build/libs/bucketlist-0.0.1-SNAPSHOT.jar
```

**또는 IDE에서 직접 실행:**
- `BucketlistApplication.java`의 `main()` 메서드 실행

### 4. 프론트엔드 실행

```bash
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 5. 환경 설정

백엔드 `application.yml` 파일을 생성하고 다음 설정을 추가:

```yaml
spring:
  application:
    name: bucketlist

  datasource:
    url: jdbc:postgresql://localhost:5432/bucketlist
    username: postgres
    password: your_password

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

  output:
    ansi:
      enabled: always

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
  
  web:
    resources:
      static-locations: file:./uploads/

  # SMTP
  mail:
    host: smtp.naver.com
    port: 587
    username: your_naver_email
    password: your_password
    properties:
      mail:
        smtp:
          auth: true
          starttls:
            enable: true
            required: true
          ssl:
            trust: smtp.naver.com
    default-encoding: UTF-8
```

---

## 📚 API 문서

### 인증 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/create-code` | 비밀번호 재설정 코드 생성 |
| POST | `/api/auth/reset-password` | 비밀번호 재설정 |

### 버킷리스트 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bucket` | 전체 버킷리스트 조회 |
| GET | `/api/bucket/completed` | 완료된 버킷리스트 조회 |
| GET | `/api/bucket/incompleted` | 미완료 버킷리스트 조회 |
| POST | `/api/bucket` | 버킷리스트 생성 |
| PUT | `/api/bucket/{id}` | 버킷리스트 수정 |
| PUT | `/api/bucket/{id}/complete` | 버킷리스트 항목 완료 처리 |
| PUT | `/api/bucket/{id}/uncomplete` | 버킷리스트 항목 미완료(완료 취소) 처리 |
| DELETE | `/api/bucket/{id}` | 버킷리스트 삭제 |
| POST | `/api/bucket/bucket-item/{id}/file` | 파일 업로드 |

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
- [ ] 버킷리스트 카테고리 분류
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
