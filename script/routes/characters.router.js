import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/** 캐릭터 조회 API **/
router.get('/characters/:nickname', async (req, res, next) => {
  try {
    const { nickname } = req.params;

    const character = await prisma.character.findFirst({
      where: { nickname },
      select: {
        characterId: true,
        nickname: true,
        characterInfo: {
          select: {
            equipLevel: true,
            healthPoint: true,
            manaPoint: true,
            attackDamage: true,
            magicDamage: true,
            defensivePower: true,
            strength: true,
            dexterity: true,
            intelligence: true,
            luck: true,
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

/** 캐릭터 생성 API **/
router.post('/characters', authMiddleware, async (req, res, next) => {
  try {
    const { accountId } = req.user;
    const { nickname } = req.body;

    // 닉네임 input 값이 NULL이면
    if (!nickname) {
      return res.status(400).json({ message: '캐릭터명을 입력해주세요.' });
    }

    // 계정의 캐릭터 수 확인
    const characterCount = await prisma.character.count({
      where: { accountId },
    });

    if (characterCount >= 3) {
      return res.status(400).json({
        message: '캐릭터는 최대 3개까지만 생성할 수 있습니다.',
      });
    }

    // 닉네임 중복 검사
    const isExistNickname = await prisma.character.findFirst({
      where: { nickname },
    });

    // 닉네임이 데이터테이블에 존재하는지 확인
    if (isExistNickname) {
      return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
    }

    // 트랜잭션으로 캐릭터, 스탯, 인벤토리 동시 생성
    const character = await prisma.$transaction(async (tx) => {
      const character = await tx.character.create({
        data: {
          accountId,
          nickname,
          // 캐릭터 정보 생성
          characterInfo: {
            create: {
              equipLevel: 0,
              healthPoint: 100,
              manaPoint: 10,
              attackDamage: 10,
              magicDamage: 10,
              defensivePower: 10,
              strength: 10,
              dexterity: 10,
              intelligence: 10,
              luck: 0,
            },
          },
          // 인벤토리 생성
          inventory: {
            create: {
              gold: 10000,
              maxSlots: 20,
              equip: {
                create: {}, // 빈 장비 슬롯 생성
              },
            },
          },
        },
        include: {
          inventory: {
            include: {
              equip: true,
              items: true,
            },
          },
          characterInfo: true,
        },
      });
      return character;
    });

    return res.status(201).json({
      message: '캐릭터가 성공적으로 생성되었습니다.',
      data: character,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
