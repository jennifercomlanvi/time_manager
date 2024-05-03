import { request, summary, tags, body, responses } from "koa-swagger-decorator";
const HttpError = require("../../../lib/HttpError");
const otpHelper = require("../../../lib/otp");

class ControlRegister {
  @request("put", "/api/v1/user/control/register")
  @summary("Vérifie le code OTP pour un utilisateur authentifié")
  @tags(["UserControl"])
  @body({
    otp: {
      type: "string",
      required: true,
      description: "Code OTP soumis par l'utilisateur",
    },
  })
  @responses({
    200: {
      description: "OTP vérifié avec succès, contrôle utilisateur supprimé",
    },
    400: { description: "Code OTP incorrect ou expiré" },
    404: { description: "Contrôle utilisateur correspondant non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const userId = ctx.state.user.id;
    const { otp } = ctx.request.body;

    const userControl = await ctx.db.UserControl.findOne({
      where: {
        control_user: userId,
        control_type: ctx.db.UserControl.CTRL_REGISTER,
      },
    });

    if (!userControl) {
      throw new HttpError(
        404,
        "Contrôle utilisateur correspondant non trouvé."
      );
    }

    const now = new Date();
    if (new Date(userControl.control_expired_at) < now) {
      throw new HttpError(400, "Le code OTP a expiré.");
    }

    if (userControl.control_otp !== otp) {
      throw new HttpError(400, "Code OTP incorrect.");
    }

    await userControl.destroy();

    const user = await ctx.db.User.findByPk(userId);
    console.log(user);
    if (user) {
      user.user_state = ctx.db.User.USER_STATES.ACTIVE;
      await user.save();
    }

    const remainingControls = await ctx.db.UserControl.findOne({
      where: {
        control_user: userId,
      },
    });

    ctx.body = { has_control: !!remainingControls };
  }
}

module.exports = ControlRegister;
