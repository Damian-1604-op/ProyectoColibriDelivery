import { Router } from "express";

import {
  getAllRoles,
  getRoleById,
  createRole,
  deleteRole,
  updateRole,
  activeRole,
} from "../controller/roles.controller.js";
const router = Router();

router.get("/roles", getAllRoles);

router.get("/roles/:id", getRoleById);

router.post("/roles", createRole);

router.delete("/roles/:id", deleteRole);

router.put("/roles/:id", updateRole);

router.patch("/roles/:id", activeRole);

export default router;
