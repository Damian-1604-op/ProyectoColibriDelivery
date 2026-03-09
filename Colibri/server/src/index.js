import userRoutes from "./routes/users.routes.js";
import rolesRoutes from "./routes/roles.routes.js";
import express from "express";
import morgan from "morgan";
import pool from "./db.js";
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan("dev"));
app.use("/api", userRoutes);
app.use("/api", rolesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(`[Error Log]: ${err.stack}`);

  if (res.headersSent) {
    return next(err);
  }

  if (err.code === "23505") {
    return res.status(409).json({
      message: "Datos duplicados (violación de restricción de unicidad)",
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      message: "Violación de llave foránea (el registro relacionado no existe)",
    });
  }

  const statusCode = err.status || 500;
  const message = err.message || "Ocurrió un error interno";

  res.status(statusCode).json({
    status: "error",
    message: message,
  });
});
