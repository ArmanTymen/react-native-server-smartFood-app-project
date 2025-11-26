import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import categoryRoutes from './routes/categoryRoutes'
import articleRoutes from './routes/articleRoutes'
import favoritesRoutes from './routes/favoritesRoutes'
import personalRationRoutes from './routes/personalRationRoutes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/personalRation', personalRationRoutes)

export default app
