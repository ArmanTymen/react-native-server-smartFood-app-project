import express from 'express'
import { 
  getAllArticles, 
  getArticleById, 
  createArticle 
} from '../controllers/articleController'

const router = express.Router()

router.get('/', getAllArticles)
router.get('/:id', getArticleById)
router.post('/', createArticle)

export default router