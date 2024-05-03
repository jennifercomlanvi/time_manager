// const Router = require("@koa/router");
// import auth from "./middleware/auth";
// import Router from '@koa/router'
import { SwaggerRouter } from "koa-swagger-decorator";
const router = new SwaggerRouter();
import { resolve } from "path";
router.swagger({
  title: "Time Manager API",
  description:
    "Documentation API pour le système de gestion de temps de projet",
  version: "1.0.0",
  swaggerHtmlEndpoint: "/swagger-html",
  swaggerJsonEndpoint: "/swagger-json",
});
router.mapDir(resolve(__dirname, "./controllers"), {
  recursive: true,
});
// router.get("/", (ctx, next) => {
//   ctx.body = "Hello";
// });

//Recovery
router.post("/api/v1/recovery", require("./controllers/user/recovery/send"));
// router.put('/api/v1/recovery', require("./controllers/user/recovery/password"));

//Auth
router.post("/api/v1/signin", require("./controllers/user/auth/signin"));
router.post("/api/v1/signup", require("./controllers/user/auth/signup"));
router.get("/api/v1/refresh", require("./controllers/user/auth/refresh"));
router.get("/api/v1/renew", require("./controllers/user/auth/renew"));

//Test
router.get("/api/v1/test", require("./controllers/index"));
// router.get("/test", auth, require("./controllers/index"));

//User
router.get("/api/v1/user/profile", require("./controllers/user/profil"));
router.put(
  "/api/v1/user/:uuid",
  require("./controllers/user/editNameDescription")
);
router.get(
  "/api/v1/user/teams/admin",
  require("./controllers/user/userAdminTeams")
);
router.get("/api/v1/user/teams", require("./controllers/user/userTeams"));

//Invitation
router.post(
  "/api/v1/user/invitation/team",
  require("./controllers/invitation/create")
);

router.get("/api/v1/teams/user", require("./controllers/team/search"));
router.post("/api/v1/team", require("./controllers/team/create"));
router.put("/api/v1/team/:id", require("./controllers/team/edit"));
router.delete("/api/v1/team/:id", require("./controllers/team/delete"));

//UserControl
router.get(
  "/api/v1/user/control",
  require("./controllers/user/control/search")
);
router.post(
  "/api/v1/user/control/resendOtp",
  require("./controllers/user/control/resendOtp")
);
router.put(
  "/api/v1/user/control/register",
  require("./controllers/user/control/register")
);

//Project
router.get("/api/v1/projects/:id", require("./controllers/project/all"));
router.get(
  "/api/v1/user/projects/admin",
  require("./controllers/project/adminProjects")
);
router.get(
  "/api/v1/user/projects",
  require("./controllers/project/teamProjects")
);
router.post("/api/v1/project", require("./controllers/project/create"));
router.delete("/api/v1/project/:id", require("./controllers/project/delete"));

//Task
router.get("/api/v1/project/:id/tasks", require("./controllers/task/all"));
router.post("/api/v1/task", require("./controllers/task/create"));

module.exports = router;
