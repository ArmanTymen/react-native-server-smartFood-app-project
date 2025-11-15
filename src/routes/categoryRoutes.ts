import express from 'express'
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  getArticles
} from '../controllers/categoryController'

const router = express.Router()

router.get('/articles', getArticles) // <- сначала фиксированный путь
router.get('/:id', getCategoryById) // <- потом параметр
router.get('/', getAllCategories)
router.post('/', createCategory)

export default router