import express from 'express'
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  getArticles
} from '../controllers/categoryController'

const router = express.Router()

router.get('/', getAllCategories)        // /categories
router.post('/', createCategory)         // /categories
router.get('/articles/search', getArticles) 
router.get('/:id', getCategoryById)      // /categories/:id

export default router