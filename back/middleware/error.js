const HttpError = require("../lib/HttpError");

module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.status = err.status;
      ctx.body = { error: err.error, errors: err.errors };
    } else {
      ctx.status = err.status || 500;
      ctx.body = { error: "Internal Server Error", message: err.message };
    }
  }
};
