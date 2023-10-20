import express from 'express';

const router = express.Router();
import { getLabyrinths, createLabyrinth, updatedLabyrinth, updatedLabyrinthStartCords, updatedLabyrinthEndCords, getLabyrinthSolution } from "../controllers/labyrinth.controller";
import { authenticateToken } from '../middlewares/authentication.middleware';

router.get("/labyrinth", authenticateToken, getLabyrinths)
router.post("/labyrinth",authenticateToken, createLabyrinth);
router.put("/labyrinth/:id/playfield/:x/:y/:type",authenticateToken, updatedLabyrinth);
router.put("/labyrinth/:id/start/:x/:y",authenticateToken, updatedLabyrinthStartCords)
router.put("/labyrinth/:id/end/:x/:y",authenticateToken, updatedLabyrinthEndCords)
router.get("/labyrinth/:id/solution",authenticateToken, getLabyrinthSolution)

export default router;