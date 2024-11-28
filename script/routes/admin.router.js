import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/adminauth.middleware.js';

const router = express.Router();
// 관리자 권한 확인 미들웨어
const adminAuthMiddleware = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const admin = await prisma.account.findFirst({
      where: {
        userId,
        isAdmin: true,
      },
    });

    if (!admin) {
      return res.status(403).json({ message: '관리자 권한이 없습니다.' });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// 서버 시작 시 admin 계정 생성 함수
async function createAdminAccount() {
  try {
    // admin 계정 존재 여부 확인
    const existingAdmin = await prisma.account.findFirst({
      where: { userId: 'admin' },
    });

    // admin 계정이 없을 경우에만 생성
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin&70016453', 10);
      await prisma.account.create({
        data: {
          userId: 'admin',
          password: hashedPassword,
          isAdmin: true,
        },
      });
      console.log('Admin account created successfully');
    }
  } catch (error) {
    console.error('Admin account creation failed:', error);
  }
}

// 서버 시작 시 admin 계정 생성 실행
createAdminAccount();

router.post('/admin/login', async (req, res, next) => {
  try {
    const { userId, password } = req.body;

    const admin = await prisma.account.findFirst({
      where: { userId, isAdmin: true }, // 관리자 계정만 조회
    });

    if (!admin) {
      return res.status(401).json({ message: '관리자 계정이 아닙니다.' });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    const token = jwt.sign(
      { accountId: admin.userId, isAdmin: true },
      'custom-secret-key',
      { expiresIn: '24h' }
    );

    res.cookie('authorization', `Bearer ${token}`, {
      maxAge: 24 * 60 * 60 * 1000, // 24시간
      httpOnly: false,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      domain:
        process.env.NODE_ENV === 'production'
          ? process.env.COOKIE_DOMAIN
          : undefined,
    });
    return res.status(200).json({
      message: '관리자 로그인에 성공했습니다.',
      isAdmin: true,
    });
  } catch (err) {
    next(err);
  }
});

/** 전체 계정 조회 API **/
router.get(
  '/admin/accounts',
  authMiddleware,
  adminAuthMiddleware,
  async (req, res, next) => {
    try {
      const accounts = await prisma.account.findMany({
        select: {
          id: true,
          userId: true,
          createdAt: true,
          characters: {
            select: {
              id: true,
              nickname: true,
            },
          },
        },
      });

      return res.status(200).json({ data: accounts });
    } catch (err) {
      next(err);
    }
  }
);

/** 전체 캐릭터 조회 API **/
router.get(
  '/admin/characters',
  authMiddleware,
  adminAuthMiddleware,
  async (req, res, next) => {
    try {
      const characters = await prisma.character.findMany({
        include: {
          characterInfo: true,
          inventory: true,
        },
      });

      return res.status(200).json({ data: characters });
    } catch (err) {
      next(err);
    }
  }
);

/** 아이템 생성 API **/
router.post(
  '/admin/createitems',
  authMiddleware,
  adminAuthMiddleware,
  async (req, res, next) => {
    try {
      // name:아이템이름, type:장착부위, rarity:등급, description:상세설명,
      // itemLevel:장착했을 때 추가되는 레벨, price:판매가격, equippabe:장착이 가능한가
      const { name, type, rarity, description, itemLevel, price, equippable } =
        req.body;
      // 필수 필드 검증
      if (!name || !type || !rarity || !itemLevel || !price) {
        return res.status(400).json({
          message: '필수 항목이 누락되었습니다.',
        });
      }

      // 아이템 이름 중복 검사
      const isExistItem = await prisma.itemList.findFirst({
        where: { name },
      });

      if (isExistItem) {
        return res.status(409).json({ message: '이미 존재하는 아이템입니다.' });
      }

      // ItemList에 아이템 추가
      const itemList = await prisma.itemList.create({
        data: {
          name,
          type,
          rarity,
          description,
          itemLevel,
          price,
          equippable,
        },
      });

      return res.status(201).json({
        message: '아이템이 성공적으로 생성되었습니다.',
        data: itemList,
      });
    } catch (err) {
      next(err);
    }
  }
);

/** 아이템 삭제 API **/
router.delete(
  '/admin/deleteitems/:itemListId',
  authMiddleware,
  adminAuthMiddleware,
  async (req, res, next) => {
    try {
      const { itemListId } = req.params;

      // itemListId 유효성 검사
      if (!itemListId || isNaN(+itemListId)) {
        return res.status(400).json({
          message: '유효하지 않은 아이템 ID입니다.',
        });
      }
      // 아이템 리스트 존재 여부 확인
      const itemList = await prisma.itemList.findUnique({
        where: { id: +itemListId },
        include: {
          items: true,
        },
      });

      if (!itemList) {
        return res.status(404).json({
          message: '존재하지 않는 아이템입니다.',
        });
      }

      // 연관된 아이템들이 장착되어 있는지 확인
      const equippedItems = await prisma.equip.findFirst({
        where: {
          OR: [
            { headSlotId: { in: itemList.items.map((item) => item.id) } },
            { bodyTopSlotId: { in: itemList.items.map((item) => item.id) } },
            { bodyBottomSlotId: { in: itemList.items.map((item) => item.id) } },
            { gloveSlotId: { in: itemList.items.map((item) => item.id) } },
            { shoesSlotId: { in: itemList.items.map((item) => item.id) } },
            { weaponSlotId: { in: itemList.items.map((item) => item.id) } },
          ],
        },
      });

      if (equippedItems) {
        return res.status(400).json({
          message: '장착 중인 아이템은 삭제할 수 없습니다.',
        });
      }

      // 트랜잭션으로 아이템 삭제 및 ID 초기화
      await prisma.$transaction(async (tx) => {
        // 연관된 아이템 삭제
        await tx.item.deleteMany({
          where: { itemListId: +itemListId },
        });

        // ItemList 삭제
        await tx.itemList.delete({
          where: { id: +itemListId },
        });

        // ID 시퀀스 초기화
        // MySQL의 AUTO_INCREMENT 초기화
        await tx.$executeRaw`ALTER TABLE ItemLists AUTO_INCREMENT = 1;`;
        await tx.$executeRaw`ALTER TABLE Items AUTO_INCREMENT = 1;`;
      });

      return res.status(200).json({
        message: '아이템이 성공적으로 삭제되었습니다.',
      });
    } catch (err) {
      console.error('아이템 삭제 중 오류 발생:', err);
      next(err);
    }
  }
);

/** 전체 아이템 조회 API **/
router.get(
  '/admin/allitems',
  authMiddleware,
  adminAuthMiddleware,
  async (req, res, next) => {
    try {
      const itemList = await prisma.itemList.findMany();
      return res.status(200).json({ data: itemList });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
