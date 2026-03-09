import { Router } from "express";
import pool from "../db.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
} from "../controller/user.controller.js";
const router = Router();

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.post("/users", createUser);

router.delete("/users/:id", deleteUser);

router.put("/users/:id", updateUser);

router.get("/login", loginUser);

export default router;
