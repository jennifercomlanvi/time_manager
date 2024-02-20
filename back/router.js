// const Router = require("@koa/router");
const auth = require("./middleware/auth");
const { SwaggerRouter } = require("koa-swagger-decorator");
const router = new SwaggerRouter();
// const router = new Router();

router.swagger({
  title: "Timer Manager API",
  description: "API Documentation pour Timer Manager",
  version: "1.0.0",
});

router.get("/", (ctx, next) => {
  ctx.body = "Hello";
});

// router.get('/swagger-html', router.swaggerUi);

//Auth
router.post("/api/v1/signin", require("./controllers/users/auth/signin.js"));
router.post("/api/v1/signup", require("./controllers/users/auth/signup.js"));
router.post("/api/v1/refresh", require("./controllers/users/auth/refresh.js"));

//Test
router.get("/api/v1/test", require("./controllers/test.js"));
router.get("/test", auth, require("./controllers/test.js"));

//Team
router.post("/api/v1/team", auth, require("./controllers/team/create.js"));
router.get("/api/v1/team", auth, require("./controllers/team/all.js"));

//Control
router.get(
  "/api/v1/user/control/:id",
  auth,
  require("./controllers/users/control/search.js")
);

module.exports = router;
