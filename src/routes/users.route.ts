import express from 'express';

const router = express.Router();
import { createUser, loginUser } from "../controllers/users.controller";

/**
   * @remarks
     User routes
   *
*/
router.post("/user/sign-up", createUser);
router.post("/user/login", loginUser);

export default router;