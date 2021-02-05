import { join } from "path";
import express from "express";
import { config } from "dotenv";
import { connectDatabase } from "./_rest/config/database";
import { errorHandler } from "./_rest/misc/errors";
import cors from "cors";
import cookies from "cookie-parser";

import userRoutes from "./main/users/routes";
import authRoutes from "./main/auth/routes";
import clientRoutes from "./main/clients/routes";
import warehouseRoutes from "./main/warehouses/routes";
import delivererRoutes from "./main/deliverers/routes";

async function main() {
  config({ path: join(__dirname, "_rest", "config", "dev.env") });
  await connectDatabase();

  const app = express();
  const PORT = process.env.PORT ?? 4040;

  // middleware;
  app.use(cors());
  //@ts-ignore
  app.use(cookies());
  app.use(express.json());

  // routes
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/clients", clientRoutes);
  app.use("/warehouses", warehouseRoutes);
  app.use("/deliverers", delivererRoutes);

  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server on port: ${PORT}`));
}

main();