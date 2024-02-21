const HttpError = require("../lib/HttpError");
module.exports = async (ctx, next) => {
  const user_id = ctx.state.user.id;
  const team_id = ctx.params.teamId;

  const permission = await ctx.db.Permission.findOne({
    where: {
      perm_user: user_id,
      perm_team: team_id,
    },
  });

  if (!permission || permission.level !== ctx.db.Permission.LEVELS.ADMIN) {
    throw new HttpError(403, "Vous n'avez pas les permissions nécessaires pour modifier cette équipe.");
  }

  await next();
};