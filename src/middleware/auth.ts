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
    const decoded = jwt.verify(token, JWT_SECRET, { 
      algorithms: ['HS256']
    }) as { userId: number }
    
    req.user = decoded
    next()
  } catch (error: any) {
    console.error('JWT verification error:', error.message)
    
    // Более детальные ошибки
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false,
        message: 'Токен просрочен' 
      })
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false,
        message: 'Невалидный токен' 
      })
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Ошибка аутентификации' 
    })
  }
}

export default authenticate