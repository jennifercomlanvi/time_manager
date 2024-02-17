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
app.use(helmet());
app.use(compress());
app.use(cors());
app.use(bodyParser());
app.use(router.routes());
// app.use(router.allowedMethods());
app.use(router.routes()).use(router.allowedMethods());

module.exports = app;
