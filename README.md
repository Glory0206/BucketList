# BucketList

## 🛠 실행 방법

### 사전 요구사항

```
Java 17 이상
Node.js 18 이상
npm 8 이상
PostgreSQL 설치 및 DB 생성
```

### 1. 백엔드 (Spring Boot)
```
cd backend
./gradlew build  # 또는 ./mvnw package
java -jar build/libs/your-app-name.jar
```
**IDE를 사용할 경우 BucketlistApplication.java 파일의 main()을 직접 실행해도 됩니다.**

### 1. 프론트엔드 (React)
```
cd frontend
npm install
npm run dev
```

### 3. DB (PostgreSQL)
1. PostgreSQL 실행
2. DB 생성
3. application.yml 작성
```
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
```
