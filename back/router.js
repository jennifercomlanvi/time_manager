const Router = require('@koa/router');
const auth = require('./middleware/auth.js');

const router = new Router();

router.get('/', (ctx, next) => {
    ctx.body = 'Hello';
});

router.post('/login', require('./controllers/login.js'));
router.post('/signin', require('./controllers/signin.js'));
router.post('/refresh', require('./controllers/refresh.js'));
router.get('/test', require('./controllers/test.js'));
// router.get('/test', auth, require('./controllers/test.js'));
router.post('/teams', require('./controllers/teams/create.js'));

module.exports = router;
