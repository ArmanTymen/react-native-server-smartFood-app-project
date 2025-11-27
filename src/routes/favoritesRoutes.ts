import express from 'express'
import { 
  getAllFavorites, 
  deleteFavorite, 
  addFavorite 
} from '../controllers/favoritesController'
import authenticate from '../middleware/auth'

const router = express.Router()

router.get('/', authenticate, getAllFavorites)
router.post('/', authenticate, addFavorite)
router.delete('/:id', authenticate, deleteFavorite)

export default router