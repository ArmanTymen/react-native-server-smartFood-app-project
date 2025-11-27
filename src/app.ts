import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import articleRoutes from './routes/articleRoutes'
import favoritesRoutes from './routes/favoritesRoutes'
import personalRationRoutes from './routes/personalRationRoutes'

const app = express()

// 🔒 Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// 🌐 CORS
app.use(cors({
  origin: true,  // ← разрешает мобильные приложения
  credentials: true
}))

// ⚡ Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}))

// 📦 Body parsing
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// 🩺 Health checks
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// 🛣️ Routes
app.use('/api/users', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/personalRation', personalRationRoutes)

// ❌ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// 🚨 Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error)
  const status = error.status || 500
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
  res.status(status).json({ error: message })
})

export default app