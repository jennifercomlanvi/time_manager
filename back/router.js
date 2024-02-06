// const Router = require("@koa/router");
const auth = require("./middleware/auth.js");
const { SwaggerRouter } = require('koa-swagger-decorator');
const router = new SwaggerRouter();
// const router = new Router();

router.swagger({
  title: 'Timer Manager API',
  description: 'API Documentation pour Timer Manager',
  version: '1.0.0',
});

router.get("/", (ctx, next) => {
  ctx.body = "Hello";
});

// router.get('/swagger-html', router.swaggerUi);
router.post("/api/v1/signin", require("./controllers/signin.js"));
router.post("/api/v1/signup", require("./controllers/signup.js"));
router.post("/api/v1/refresh", require("./controllers/refresh.js"));
router.get("/api/v1/test", require("./controllers/test.js"));
// router.get('/test', auth, require('./controllers/test.js'));
router.post("/api/v1/teams", require("./controllers/teams/create.js"));

module.exports = router;
