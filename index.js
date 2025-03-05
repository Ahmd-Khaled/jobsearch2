import express from "express";
import bootstrap from "./src/app.controller.js";
import { runSocketio } from "./src/Modules/socketio/index.js";
const app = express();
const port = process.env.PORT || 3030;

await bootstrap(app, express);

const server = app.listen(port, () =>
  console.log(`SocialMediaapp listening on port ${port}!`)
);

runSocketio(server);
