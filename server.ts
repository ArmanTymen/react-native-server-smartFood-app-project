import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './src/routes/authRoutes'
import categoryRoutes from './src/routes/categoryRoutes' 
import articleRoutes from './src/routes/articleRoutes'
import favoritesRoutes from './src/routes/favoritesRoutes'
import personalRationRoutes from './src/routes/personalRationRoutes'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/articles', articleRoutes)
app.use('/api/favorites', favoritesRoutes)
app.use('/api/personalRation', personalRationRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})