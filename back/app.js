// https://github.com/tonyghiani/koa-template

const Koa = require("koa");
const helmet = require("koa-helmet"); //sécurité
const compress = require("koa-compress");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const router = require("./router");
const errorHandler = require("./middleware/error");
const env = process.env.NODE_ENV || "development";
const config = require(`./config/${env}.json`);

const app = new Koa();

app.context.db = require("./models");
app.context.config = config;
app.use(errorHandler);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdnjs.cloudflare.com", // Autoriser les scripts de CDN pour Swagger
          "'unsafe-inline'", // Permettre les scripts en ligne nécessaires pour Swagger UI
          "https://fonts.googleapis.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'", // Permettre les styles en ligne
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        imgSrc: [
          "'self'",
          "data:", // Permettre les images en données encodées
          "https://cdnjs.cloudflare.com",
        ],
        connectSrc: ["'self'", "https://cdnjs.cloudflare.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
  })
);
app.use(compress());
app.use(cors());
app.use(bodyParser());
// app.use(middleware.swaggerRouter(options));
app.use(router.routes()).use(router.allowedMethods());
module.exports = app;
