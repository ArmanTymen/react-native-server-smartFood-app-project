import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth';
import { LoginInput, RegisterInput } from '../types/types';

const JWT_SECRET = process.env.JWT_SECRET as string;
const TOKEN_EXPIRATION = '7d';

export const register = async (req: Request<{}, {}, RegisterInput['body']>, res: Response) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { 
      expiresIn: TOKEN_EXPIRATION,
      algorithm: 'HS256' 
    });

    res.status(201).json({
      success: true,
      message: 'Пользователь успешно создан',
      data: { user, token },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
  }
};

export const login = async (req: Request<{}, {}, LoginInput['body']>, res: Response) => {
  try {
    const { email, password } = req.body;
    const trimmedEmail = email.trim();

    console.log('🔐 LOGIN ATTEMPT:', { email, trimmedEmail, password });

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      select: { id: true, email: true, password: true, createdAt: true, updatedAt: true }, // ← ДОБАВЬ createdAt, updatedAt
    });

    console.log('👤 FOUND USER:', user);

    if (!user) {
      console.log('❌ USER NOT FOUND IN DB');
      return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
    }

    console.log('✅ LOGIN SUCCESSFUL');

    // 🔥 ДОБАВЬ ЭТОТ КОД - ГЕНЕРАЦИЯ ТОКЕНА И ОТВЕТ
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { 
      expiresIn: TOKEN_EXPIRATION,
      algorithm: 'HS256' 
    });

    const { password: _, ...userWithoutPassword } = user;

    console.log('📤 SENDING RESPONSE WITH USER:', userWithoutPassword);
    
    res.json({ 
      success: true, 
      message: 'Вход выполнен успешно', 
      data: { 
        user: userWithoutPassword, // ← содержит id, email, createdAt, updatedAt
        token 
      } 
    });
    
  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Пользователь не авторизован' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, createdAt: true, updatedAt: true }
    });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
};
