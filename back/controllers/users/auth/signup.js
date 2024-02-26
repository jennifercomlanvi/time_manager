const Form = require("../../../lib/validation/form");
const HttpError = require("../../../lib/HttpError");
const rules = require("../../../lib/validation/rules");
const password = require("../../../lib/password");
const otp = require("../../../lib/otp");
import { sign } from "jsonwebtoken";
import { DateTime } from "luxon";
const sendEmail = require("../../../emailSender");
import { v4 as uuidv4 } from "uuid";

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
    form.stringField("username", (value) => {
      rules.required(value, "Un email valide est requis");
    });
    form.stringField("email", (value) => {
      rules.required(value, "Un email valide est requis");
      rules.isEmail(value, "Un email valide est requis");
    });
    form.stringField("password", (value) => {
      rules.required(value, "Un mot de passe valide est requis");
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
      user_name: form.value("username"),
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

    const now = Math.floor(Date.now() / 1000);
    const exp = now + 3600;

    const token = sign(
      {
        sub: user.user_id,
        iat: now,
        exp: exp,
      },
      ctx.config.jwt_secret
    );
    const refresh_token = uuidv4();
    await ctx.db.UserToken.create({
      user_id: user.user_id,
      token: refresh_token,
      expired_at: DateTime.now().plus({ hours: 24 }).toJSDate(),
    });

    ctx.response.body = {
      useruuid: user.user_uuid,
      username: user.user_name,
      useremail: user.user_email,
      token: token,
      expire_in: exp,
      has_control: true,
    };
  }
}

module.exports = Register.index;
