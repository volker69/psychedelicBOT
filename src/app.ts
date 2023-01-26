import express from "express";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { userRoutes } from "./router/user.routes";
import { commandRouter } from "./router/command.routes";

dotenv.config();
const app = express();

/**
 * Setting
 * @author Volker
 * @description: Configuración del servidor
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("port", process.env.NODE_PORT);

/**
 * Routes
 * @author Sebastián García
 * @description: Definicion de las rutas del Servidor
 */
app.get("/", (_req, res) => {
	res.send(`Las API estan en la Dirección http://localhost:3000/api/`);
});

app.use("/api/", commandRouter);
app.use("/api/", userRoutes);

export default app;
