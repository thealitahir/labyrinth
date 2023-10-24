import express from 'express';

const router = express.Router();
import { fetchLabyrinths, fetchLabyrinthById, createNewLabyrinth, updateLabyrinth, updateLabyrinthStartCoordinates, updateLabyrinthEndCoordinates, calculateLabyrinthSolution } from "../controllers/labyrinth.controller";
import { authenticateToken } from '../middlewares/authentication.middleware';

/**
   * @remarks
     Lybrinths routes
   *
*/
router.get("/labyrinth", authenticateToken, fetchLabyrinths)
router.post("/labyrinth",authenticateToken, createNewLabyrinth);
router.put("/labyrinth/:id/playfield/:x/:y/:type",authenticateToken, updateLabyrinth);
router.put("/labyrinth/:id/start/:x/:y",authenticateToken, updateLabyrinthStartCoordinates)
router.put("/labyrinth/:id/end/:x/:y",authenticateToken, updateLabyrinthEndCoordinates)
router.get("/labyrinth/:id/solution",authenticateToken, calculateLabyrinthSolution)
router.get("/labyrinth/:id",authenticateToken, fetchLabyrinthById)

export default router;