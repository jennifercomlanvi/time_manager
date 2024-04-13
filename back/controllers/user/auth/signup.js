const Form = require("../../../lib/validation/form");
const HttpError = require("../../../lib/HttpError");
const rules = require("../../../lib/validation/rules");
const password = require("../../../lib/password");
const otp = require("../../../lib/otp");
const TokenManager = require("../../../lib/token");
const sendEmail = require("../../../emailSender");

const {
  request,
  summary,
  body,
  tags,
  responses,
} = require("koa-swagger-decorator");
class Register {
  @request("post", "/api/v1/signup")
  @summary("Inscription utilisateur")
  @tags(["Utilisateur"])
  @body({
    username: {
      type: "string",
      required: true,
      description: "Nom d'utilisateur",
    },
    email: {
      type: "string",
      required: true,
      description: "Adresse email de l'utilisateur",
    },
    password: {
      type: "string",
      required: true,
      description: "Mot de passe de l'utilisateur",
    },
  })
  @responses({
    200: { description: "Inscription réussie" },
    400: { description: "Erreur de validation ou utilisateur déjà existant" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("name", (value) => {
      rules.required(value, "Un email valide est requis");
    });
    form.stringField("email", (value) => {
      rules.required(value, "Un email valide est requis");
      rules.isEmail(value, "Un email valide est requis");
    });
    form.stringField("password", (value) => {
      rules.required(value, "Un mot de passe valide est requis");
    });
    form.booleanField("remember", (value) => {
      rules.required(value, "requis");
    });
    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "validation", form.errors());
    }

    let user = await ctx.db.User.findOne({
      where: { user_email: form.value("email") },
    });

    if (user) {
      form.setError("email", "bad");
      throw new HttpError(400, "validation", form.errors());
    }

    user = await ctx.db.User.create({
      user_name: form.value("name"),
      user_email: form.value("email"),
    });

    await ctx.db.UserPassword.create({
      user_id: user.user_id,
      value: await password.hash(form.value("password")),
    });

    const otpCode = otp.generateOtp();

    await ctx.db.UserControl.create({
      control_user: user.user_id,
      control_type: ctx.db.UserControl.CTRL_REGISTER,
      control_otp: otpCode,
    });

    console.log("code otp:", otpCode);
    // await sendEmail(user.user_email,"Votre code de vérification",`<p>Votre code de vérification pour l'inscription est : <strong>${otpCode}</strong></p>`,
    // );

    const tokenManager = new TokenManager(ctx.config.jwt_secret);
    const accessToken = tokenManager.generateAccess(user.user_id);
    let refresh = null;
    if (form.value("remember")) {
      const refreshToken = tokenManager.generateRefresh(user.user_id);

      refresh = await ctx.db.UserToken.create({
        user_id: user.user_id,
        token: refreshToken.token,
        expired_at: refreshToken.expired_at,
      });
    }
    ctx.response.body = {
      uuid: user.user_uuid,
      name: user.user_name,
      email: user.user_email,
      access_token: accessToken.token,
      expire_in: accessToken.exp,
      refresh_token: refresh ? refresh.token : null,
      refresh_in: refresh ? refresh.expired_at : null,
      has_control: true,
    };
  }
}

module.exports = Register.index;
