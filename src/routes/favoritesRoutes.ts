import express from 'express'
import { 
  getAllFavorites, 
  deleteFavorite, 
  addFavorite 
} from '../controllers/favoritesController'

const router = express.Router()

router.get('/', getAllFavorites)
router.post('/', addFavorite)
router.delete('/:id', deleteFavorite)

export default router