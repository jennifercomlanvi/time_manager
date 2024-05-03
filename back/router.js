// const Router = require("@koa/router");
const auth = require("./middleware/auth");
const permissions = require("./middleware/permissions");
const { SwaggerRouter } = require("koa-swagger-decorator");
const router = new SwaggerRouter();
const path = require("path");

router.swagger({
  title: "Time Manager API",
  description:
    "Documentation API pour le système de gestion de temps de projet",
  version: "1.0.0",
  swaggerHtmlEndpoint: "/swagger-html",
  swaggerJsonEndpoint: "/swagger-json",
});
router.mapDir(path.resolve(__dirname, "./controllers"), {
  recursive: true,
});
router.get("/", (ctx, next) => {
  ctx.body = "Hello";
});

//Recovery
router.post("/api/v1/recovery", require("./controllers/user/recovery/send"));
// router.put('/api/v1/recovery', require("./controllers/user/recovery/password"));

//Auth
router.post("/api/v1/signin", require("./controllers/user/auth/signin"));
router.post("/api/v1/signup", require("./controllers/user/auth/signup"));
router.get("/api/v1/refresh", require("./controllers/user/auth/refresh"));
router.get("/api/v1/renew", auth, require("./controllers/user/auth/renew"));

//Test
router.get("/api/v1/test", require("./controllers/index"));
router.get("/test", auth, require("./controllers/index"));

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

router.get(
  "/api/v1/teams/user",
  auth,
  require("./controllers/team/search").default
);
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
  require("./controllers/team/delete").default
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
  "/api/v1/user/projects/admin",
  auth,
  require("./controllers/project/adminProjects")
);
router.get(
  "/api/v1/user/projects",
  auth,
  require("./controllers/project/teamProjects")
);
router.post("/api/v1/project", auth, require("./controllers/project/create"));
router.delete(
  "/api/v1/project/:id",
  auth,
  require("./controllers/project/delete")
);

//Task
router.get(
  "/api/v1/project/:id/tasks",
  auth,
  require("./controllers/task/all")
);
router.post("/api/v1/task", auth, require("./controllers/task/create"));

module.exports = router;
