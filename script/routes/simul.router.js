import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

/** 캐릭터 정보 및 인벤토리 조회 API **/
router.get(
  '/characters/:characterId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { characterId } = req.params;
      const character = await prisma.character.findUnique({
        where: { characterId: +characterId },
        include: {
          characterInfo: true,
          inventory: {
            include: {
              items: true,
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
  }
);

const RANDOM_ITEM_COST = 100; // 랜덤 뽑기 가격

/** 아이템 랜덤 생성 API **/
router.post(
  '/random-item/:characterId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { characterId } = req.params;

      const inventory = await prisma.inventory.findUnique({
        where: { characterId: +characterId },
        include: { items: true },
      });

      // 인벤토리가 생성되었는지 확인
      if (!inventory) {
        return res
          .status(404)
          .json({ message: '인벤토리를 찾을 수 없습니다.' });
      }
      // 인벤토리 슬롯 확인
      if (inventory.items.length >= inventory.maxSlots) {
        return res.status(400).json({ message: '인벤토리가 가득 찼습니다.' });
      }

      // 골드 확인
      if (inventory.gold < RANDOM_ITEM_COST) {
        return res.status(400).json({
          message: `골드가 부족합니다. (필요 골드: ${RANDOM_ITEM_COST})`,
        });
      }

      // 랜덤 아이템 선택
      const itemList = await prisma.itemList.findMany();
      const randomItem = itemList[Math.floor(Math.random() * itemList.length)];

      // 아이템 생성 및 인벤토리 업데이트
      const newItem = await prisma.$transaction(async (tx) => {
        const item = await tx.item.create({
          data: {
            inventoryId: inventory.id,
            itemListId: randomItem.id,
            name: randomItem.name,
            type: randomItem.type,
            rarity: randomItem.rarity,
            itemLevel: randomItem.itemLevel,
            price: randomItem.price,
            equippable: randomItem.equippable,
          },
        });

        // 트랜잭션으로 인벤토리의 골드가 차감 update
        const updatedInventory = await tx.inventory.update({
          where: { id: inventory.id },
          data: { gold: { decrement: RANDOM_ITEM_COST } },
          select: { gold: true },
        });

        return { item, remainingGold: updatedInventory.gold };
      });

      return res.status(201).json({
        message: '아이템이 성공적으로 생성되었습니다.',
        data: {
          item: newItem.item,
          remainingGold: newItem.remainingGold,
          cost: RANDOM_ITEM_COST,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/** 아이템 개별 판매 API **/
router.post(
  '/sell-item/:characterId/:itemId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { characterId, itemId } = req.params;

      const item = await prisma.item.findFirst({
        where: {
          id: +itemId,
          inventory: { characterId: +characterId },
        },
      });

      if (!item) {
        return res.status(404).json({ message: '아이템을 찾을 수 없습니다.' });
      }

      // 아이템 판매 및 골드 증가
      await prisma.$transaction(async (tx) => {
        await tx.item.delete({
          where: { id: +itemId },
        });

        await tx.inventory.update({
          where: { characterId: +characterId },
          data: { gold: { increment: item.price } },
        });
      });

      return res
        .status(200)
        .json({ message: '아이템이 성공적으로 판매되었습니다.' });
    } catch (err) {
      next(err);
    }
  }
);

/** 전체 아이템 판매 API **/
router.post(
  '/sell-all/:characterId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { characterId } = req.params;

      const inventory = await prisma.inventory.findUnique({
        where: { characterId: +characterId },
        include: { items: true },
      });

      if (!inventory) {
        return res
          .status(404)
          .json({ message: '인벤토리를 찾을 수 없습니다.' });
      }

      const totalPrice = inventory.items.reduce(
        (sum, item) => sum + item.price,
        0
      );

      // 모든 아이템 판매 및 골드 증가
      await prisma.$transaction(async (tx) => {
        await tx.item.deleteMany({
          where: { inventoryId: inventory.id },
        });

        await tx.inventory.update({
          where: { id: inventory.id },
          data: { gold: { increment: totalPrice } },
        });
      });

      return res.status(200).json({
        message: '모든 아이템이 성공적으로 판매되었습니다.',
        soldAmount: totalPrice,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
