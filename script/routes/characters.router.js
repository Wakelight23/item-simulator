import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/** 캐릭터 생성 API **/
router.post('/characters', authMiddleware, async (req, res, next) => {
  try {
    const { accountId } = req.user;
    const { nickname } = req.body;

    // 닉네임 중복 검사
    const isExistNickname = await prisma.character.findFirst({
      where: { nickname },
    });

    if (isExistNickname) {
      return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
    }

    // 트랜잭션으로 캐릭터, 스탯, 인벤토리 동시 생성
    const character = await prisma.$transaction(async (tx) => {
      // 캐릭터 생성
      const character = await tx.character.create({
        data: {
          accountId,
          nickname,
          // 캐릭터 정보 생성
          characterInfo: {
            create: {
              equipLevel: 0,
              manaPoint: 10,
              attackDamage: 10,
              magicDamage: 10,
              strength: 10,
              intelligence: 10,
            },
          },
          // 인벤토리 생성
          inventory: {
            create: {
              gold: 10000,
              maxSlots: 20,
            },
          },
        },
        include: {
          characterInfo: true,
          inventory: true,
        },
      });

      return character;
    });

    return res.status(201).json({ data: character });
  } catch (err) {
    next(err);
  }
});

/** 캐릭터 조회 API **/
router.get('/characters/:nickname', async (req, res, next) => {
  try {
    const { nickname } = req.params;

    const character = await prisma.character.findFirst({
      where: { nickname },
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
                type: true,
                rarity: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!character) {
      return res.status(404).json({ message: '캐릭터를 찾을 수 없습니다.' });
    }

    return res.status(200).json({ data: character });
  } catch (err) {
    next(err);
  }
});

export default router;
