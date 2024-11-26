import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/** 회원가입 API **/
router.post('/signup', async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    // 아이디 중복 확인
    const isExistUser = await prisma.account.findFirst({
      where: { userId },
    });

    if (isExistUser) {
      return res.status(409).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // Account 생성
    const account = await prisma.account.create({
      data: {
        userId,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (err) {
    next(err);
  }
});

/** 로그인 API **/
router.post('/login', async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const account = await prisma.account.findFirst({
      where: { userId },
    });

    if (!account) {
      return res.status(401).json({ message: '존재하지 않는 아이디입니다.' });
    }

    // 비밀번호 검증
    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { accountId: account.accountId },
      'custom-secret-key',
      { expiresIn: '24h' } // 만료 시간 증가
    );

    // 쿠키에 토큰 저장
    res.cookie('authorization', `Bearer ${token}`, {
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      httpOnly: false,
      path: '/',
      secure: false, // 개발 환경에서는 false로 설정
      sameSite: 'lax',
    });

    return res.status(200).json({ message: '로그인에 성공했습니다.' });
  } catch (err) {
    next(err);
  }
});

/** 계정 정보 조회 API **/
router.get('/accounts/:accountId', authMiddleware, async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.account.findFirst({
      where: { accountId: +accountId },
      select: {
        accountId: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        characters: {
          select: {
            id: true,
            nickname: true,
            characterInfo: {
              select: {
                equipLevel: true,
                manaPoint: true,
                attackDamage: true,
                magicDamage: true,
                strength: true,
                intelligence: true,
              },
            },
            inventory: {
              select: {
                gold: true,
                maxSlots: true,
                items: {
                  select: {
                    name: true,
                    itemLevel: true,
                    type: true,
                    rarity: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: account });
  } catch (err) {
    next(err);
  }
});

/** 캐릭터 정보 조회 API **/
router.get('/characters/:nickname', async (req, res, next) => {
  try {
    const { nickname } = req.params;

    const character = await prisma.character.findFirst({
      where: { nickname: nickname },

      select: {
        characterId: true,
        nickname: true,
        characterInfo: {
          select: {
            equipLevel: true,
            manaPoint: true,
            attackDamage: true,
            magicDamage: true,
            strength: true,
            intelligence: true,
          },
        },
        inventory: {
          select: {
            gold: true,
            maxSlots: true,
            items: {
              select: {
                name: true,
                itemLevel: true,
                type: true,
                rarity: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({ data: character });
  } catch (err) {
    next(err);
  }
});

export default router;
