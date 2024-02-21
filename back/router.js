// const Router = require("@koa/router");
const auth = require("./middleware/auth");
const permissions = require("./middleware/permissions");
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
router.post("/api/v1/signin", require("./controllers/users/auth/signin"));
router.post("/api/v1/signup", require("./controllers/users/auth/signup"));
router.post("/api/v1/refresh", require("./controllers/users/auth/refresh"));

//Test
router.get("/api/v1/test", require("./controllers/test"));
router.get("/test", auth, require("./controllers/test"));

//User
router.get("/api/v1/user/profile", auth, require("./controllers/test"));

//Team
router.post("/api/v1/user/invitation/team", auth, permissions, require("./controllers/invitation/create"));

router.get("/api/v1/teams", auth, permissions, require("./controllers/team/all"));
router.get("/api/v1/team/:id", auth, require("./controllers/team/search"));
router.post("/api/v1/team", auth, require("./controllers/team/create"));
router.put("/api/v1/team/:id", auth, permissions, require("./controllers/team/edit"));
router.delete("/api/v1/team/:id", auth, permissions, require("./controllers/team/delete"));

//Control
router.get(
  "/api/v1/user/control/:id",
  auth,
  require("./controllers/users/control/search")
);
router.get(
  "/api/v1/user/control/:id",
  auth,
  require("./controllers/users/control/search")
);
router.post(
  "/api/v1/user/control/:id",
  auth,
  require("./controllers/users/control/resendOtp")
);

module.exports = router;
