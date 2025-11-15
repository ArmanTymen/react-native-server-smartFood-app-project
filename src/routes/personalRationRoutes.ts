import express from 'express'
import { 
  getUserPersonalRation, 
  updatePersonalRation,
  getRecommendations
} from '../controllers/personalRationController'

const router = express.Router()

router.get("/", getUserPersonalRation)
router.put("/", updatePersonalRation)
router.get("/recommended", getRecommendations)

export default router