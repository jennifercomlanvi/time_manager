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
//Recovery
router.post("/api/v1/recovery", require("./controllers/user/recovery/send"));
// router.put('/api/v1/recovery', require("./controllers/user/recovery/password"));

//Auth
router.post("/api/v1/signin", require("./controllers/user/auth/signin"));
router.post("/api/v1/signup", require("./controllers/user/auth/signup"));
router.get("/api/v1/refresh", require("./controllers/user/auth/refresh"));
router.get("/api/v1/renew", auth, require("./controllers/user/auth/renew"));

//Test
router.get("/api/v1/test", require("./controllers/test"));
router.get("/test", auth, require("./controllers/test"));

//User
router.get("/api/v1/user/profile", auth, require("./controllers/user/profil"));
router.put(
  "/api/v1/user/:uuid",
  auth,
  require("./controllers/user/editNameDescription")
);
router.get(
  "/api/v1/user/teams/admin",
  auth,
  require("./controllers/user/userAdminTeams")
);
router.get("/api/v1/user/teams", auth, require("./controllers/user/userTeams"));

//Team
router.post(
  "/api/v1/user/invitation/team",
  auth,
  permissions,
  require("./controllers/invitation/create")
);

router.get(
  "/api/v1/teams",
  auth,
  permissions,
  require("./controllers/team/all")
);

router.get("/api/v1/teams/user", auth, require("./controllers/team/search"));
router.post("/api/v1/team", auth, require("./controllers/team/create"));
router.put(
  "/api/v1/team/:id",
  auth,
  permissions,
  require("./controllers/team/edit")
);
router.delete(
  "/api/v1/team/:id",
  auth,
  permissions,
  require("./controllers/team/delete")
);

//UserControl
router.get(
  "/api/v1/user/control",
  auth,
  require("./controllers/user/control/search")
);
router.get(
  "/api/v1/user/control",
  auth,
  require("./controllers/user/control/search")
);
router.post(
  "/api/v1/user/control/resendOtp",
  auth,
  require("./controllers/user/control/resendOtp")
);
router.put(
  "/api/v1/user/control/register",
  auth,
  require("./controllers/user/control/register")
);

//Project
router.get("/api/v1/projects/:id", auth, require("./controllers/project/all"));
router.get(
  "/api/v1/user/projects",
  auth,
  require("./controllers/project/teamProjects")
);
router.post("/api/v1/project", auth, require("./controllers/project/create"));
module.exports = router;
