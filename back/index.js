require("@babel/register");
const env = process.env.NODE_ENV || "development";
const http = require("http");
const app = require("./app.js");

const port = env === "development" ? 3001 : 3000;

async function bootstrap() {
  /**
   * Initialisation des services externes (ex: connexion base de données)
   * await sequelize.authenticate()
   */
  return http.createServer(app.callback()).listen(port);
}

bootstrap()
  .then(() => {
    console.log(`🚀 Server listening on port ${port}!`);
  })
  .catch((err) => {
    setImmediate(() => {
      console.error("Unable to run the server because of the following error:");
      console.error(err);
      process.exit();
    });
  });
