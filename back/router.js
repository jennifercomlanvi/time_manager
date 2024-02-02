const Router = require("@koa/router");
const auth = require("./middleware/auth.js");

const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "Hello";
});

router.post("/api/v1/login", require("./controllers/login.js"));
router.post("/api/v1/signin", require("./controllers/signin.js"));
router.post("/api/v1/refresh", require("./controllers/refresh.js"));
router.get("/api/v1/test", require("./controllers/test.js"));
// router.get('/test', auth, require('./controllers/test.js'));
router.post("/api/v1/teams", require("./controllers/teams/create.js"));

module.exports = router;
