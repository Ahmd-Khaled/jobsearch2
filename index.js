import express from "express";
import bootstrap from "./src/app.controller.js";
import { initializeSocket } from "./src/Modules/socketio/index.js";
const app = express();
const port = process.env.PORT || 3030;

await bootstrap(app, express);

const server = app.listen(port, () =>
  console.log(`JobSearch listening on port ${port}!`)
);

initializeSocket(server, app);
