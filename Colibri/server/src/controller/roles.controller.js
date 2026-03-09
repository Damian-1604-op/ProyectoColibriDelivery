import { asyncHandler } from "../../utils/asyncHandler.js";
import pool from "../db.js";

export const getAllRoles = asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM roles WHERE active = true");
  res.json(result.rows);
});

export const getRoleById = asyncHandler(async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM roles WHERE id_rol = $1 AND active = true",
    [req.params.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Rol no encontrado" });
  }
  res.json(result.rows[0]);
});

export const createRole = asyncHandler(async (req, res) => {
  const { rol_name } = req.body;
  const queryText = "INSERT INTO roles (rol_name) VALUES ($1) RETURNING *";
  const result = await pool.query(queryText, [rol_name]);
  res.status(201).json({ message: "Rol creado", role: result.rows[0] });
});

export const deleteRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE roles SET active = false WHERE id_rol = $1 RETURNING *",
    [id],
  );

  if (result.rowCount === 0) {
    const error = new Error("Rol no encontrado");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ message: "Rol eliminado", role: result.rows[0] });
});

export const activeRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE roles SET active = true WHERE id_rol = $1 RETURNING *",
    [id],
  );

  if (result.rowCount === 0) {
    const error = new Error("Rol no encontrado");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ message: "Rol activado", role: result.rows[0] });
});

export const updateRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rol_name } = req.body;

  const queryText =
    "UPDATE roles SET rol_name = $1 WHERE id_rol = $2 AND active =true RETURNING *";

  const result = await pool.query(queryText, [rol_name, id]);

  if (result.rowCount === 0) {
    const error = new Error("Rol no encontrado");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ message: "Rol actualizado", role: result.rows[0] });
});
