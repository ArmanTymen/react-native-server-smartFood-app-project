import { Response } from 'express'
import prisma from '../db'
import { AuthRequest } from '../middleware/auth' 

export const getAllFavorites = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Пользователь не авторизован' 
      })
    }

    const favorites = await prisma.favorites.findMany({
      where: { userId: req.user.userId },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            content: true
          },
        },
      },
      orderBy: { createdAt: 'desc'}
    })
    res.json({ success: true, data: favorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении избранного'
    })
  }
}

export const deleteFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    
    // 1. Проверяем что пользователь авторизован
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Пользователь не авторизован' 
      })
    }

    const favoriteId = Number(id)
    
    // 2. Проверяем что ID валидный
    if (isNaN(favoriteId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID должен быть числом' 
      })
    }

    // 3. Находим запись избранного
    const favorite = await prisma.favorites.findUnique({
      where: { id: favoriteId },
      include: {
        article: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    // 4. Проверяем что запись существует
    if (!favorite) {
      return res.status(404).json({ 
        success: false, 
        message: 'Запись не найдена' 
      })
    }

    // 5. ⚡ КРИТИЧЕСКИ ВАЖНО: Проверяем что пользователь удаляет СВОЮ запись
    if (favorite.userId !== req.user.userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Нет прав для удаления этой записи' 
      })
    }

    // 6. Только теперь удаляем
    await prisma.favorites.delete({
      where: { id: favoriteId }
    })

    res.json({ 
      success: true, 
      message: 'Удалено из избранного',
      data: {
        deletedFavorite: favorite
      }
    })
    
  } catch (error) {
    console.error('Delete favorites error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при удалении из избранного'
    })
  }
}

export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Пользователь не авторизован' 
      })
    }

    const { articleId } = req.body
    
    // ПРЕОБРАЗУЕМ articleId В ЧИСЛО
    const articleIdNum = Number(articleId)
    if (isNaN(articleIdNum)) {
      return res.status(400).json({ 
        success: false, 
        message: 'articleId должен быть числом' 
      })
    }

    const userId = req.user.userId

    const existing = await prisma.favorites.findFirst({ 
      where: { 
        userId: userId,
        articleId: articleIdNum  // ← используем число!
      } 
    })
    
    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: 'Уже в избранном' 
      })
    }

    const favorite = await prisma.favorites.create({
      data: { userId, articleId: articleIdNum },  // ← используем число!
      include: {
        article: {
          select: {
            id: true,
            title: true,
            content: true
          }
        }
      }
    })
    
    res.status(201).json({ 
      success: true, 
      message: 'Добавлено в избранное', 
      data: favorite 
    })
  } catch (error) {
    console.error('Adding favorite error:', error)
    res.status(500).json({
      success: false,
      message: 'Ошибка при добавлении в избранное'
    })
  }
}