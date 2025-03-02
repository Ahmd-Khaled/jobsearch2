import express from "express";
import bootstrap from "./src/app.controller.js";
const app = express();
const port = process.env.PORT || 3030;

await bootstrap(app, express);

app.listen(port, () =>
  console.log(`SocialMediaapp listening on port ${port}!`)
);
