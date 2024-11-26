import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UsersRouter from './routes/users.router.js';
import CharactersRouter from './routes/characters.router.js';
import logMiddware from './middlewares/log.middleware.js';
import errorHandlingMiddleware from './middlewares/error-handling.middleware.js';

const app = express();
const PORT = 3010;

// 1. 기본 미들웨어
app.use(express.json());
app.use(cookieParser());

// 2. CORS 설정
app.use(
  cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. 로깅 미들웨어
app.use(logMiddware);

// 4. 정적 파일 제공
app.use(express.static('public'));

// 5. 라우터
app.use('/api', [UsersRouter, CharactersRouter]);

// 6. 에러 핸들링 (항상 마지막에 위치)
app.use(errorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
