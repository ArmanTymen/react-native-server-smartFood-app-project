import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    iat?: number;
    exp?: number;
  }
}

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined! Exiting...');
  process.exit(1);
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'Токен отсутствует' 
    })
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ 
      success: false,
      message: 'Неверный формат токена' 
    })
  }

  const token = parts[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ 
      success: false,
      message: 'Невалидный или просроченный токен' 
    })
  }
}

export default authenticate