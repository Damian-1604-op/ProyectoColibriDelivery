import { asyncHandler } from "../../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import pool from "../db.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

export const getUserById = asyncHandler(async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE id_user = $1", [
    req.params.id,
  ]);
  if (result.rowCount === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json(result.rows[0]);
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);
  console.log("Contraseña hasheada:", hashedPassword);
  const queryText =
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *";
  const result = await pool.query(queryText, [name, email, hashedPassword]);

  res.status(201).json({ message: "Éxito", user: result.rows[0] });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM users WHERE id_user = $1 RETURNING *",
    [id],
  );
  if (result.rowCount === 0) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }
  res.status(200).json({ message: "Usuario eliminado", user: result.rows[0] });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const queryText =
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id_user = $4 RETURNING *";

  if (!name) {
    queryText =
      "UPDATE users SET email = $1, password = $2 WHERE id_user = $3 RETURNING *";
  }
  const result = await pool.query(queryText, [name, email, password, id]);

  if (result.rowCount === 0) {
    const error = new Error("Usuario no encontrado");
    error.status = 404;
    throw error;
  }

  res
    .status(200)
    .json({ message: "Usuario actualizado", user: result.rows[0] });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const queryText = "SELECT  * FROM users WHERE email = $1";

  const result = await pool.query(queryText, [email]);
  if (result.rowCount === 0) {
    const error = new Error("El correo no está registrado");
    error.status = 401;
    throw error;
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Contraseña incorrecta");
    error.status = 401;
    throw error;
  }

  delete user.password;
  res.status(200).json({ message: "Login exitoso", userLoged: user });
});
