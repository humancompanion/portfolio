// Static server for the built site, used by the Playwright webServer option.
// Serves _site (run `npm run build` first) so screen reader tests exercise
// the same HTML that ships to production.
const express = require("express");
const path = require("path");

const port = process.env.PORT || 4000;
const site = path.join(__dirname, "..", "_site");

const app = express();
app.use(express.static(site, { extensions: ["html"] }));
app.listen(port, () => {
  console.log(`Serving ${site} at http://localhost:${port}`);
});
