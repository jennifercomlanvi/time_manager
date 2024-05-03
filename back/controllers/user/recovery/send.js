import { request, summary, tags, body, responses } from "koa-swagger-decorator";

const otp = require("../../../lib/otp");
import Form from "../../../lib/validation/form";
const rules = require("../../../lib/validation/rules");
const sendEmail = require("../../../emailSender");

class Recovery {
  @request("post", "/api/v1/recovery")
  @summary("Demande de réinitialisation de mot de passe Etape 1")
  @tags(["Recovery"])
  @body({
    email: {
      type: "string",
      required: true,
      description: "Adresse email de l'utilisateur pour la réinitialisation",
    },
  })
  @responses({
    204: { description: "Email de réinitialisation envoyé" },
    400: { description: "Email invalide ou non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async index(ctx) {
    const form = new Form();
    form.stringField("email", (value) => {
      rules.required(value, "Un email valide est requis");
      rules.isEmail(value, "Un email valide est requis");
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Erreur de validation", form.errors());
    }

    const user = await ctx.db.User.findOne({
      where: {
        user_email: form.value("email"),
        user_state: ctx.db.User.USER_STATES.ACTIVE,
      },
    });

    if (!user) {
      ctx.body = { is_user: false }; // Aucun utilisateur actif trouvé avec cet email.
      return;
    }
    let recovery = ctx.db.UserUpdate.RECOVERY;
    const existingUpdate = await ctx.db.UserUpdate.findOne({
      where: {
        userup_user: user.user_id,
        userup_type: recovery,
      },
    });

    if (existingUpdate && existingUpdate.userup_expired_at > new Date()) {
      console.log("OTP:", existingUpdate.userup_otp);
      ctx.body = { is_user: true };
      return;
    } else if (existingUpdate) {
      await existingUpdate.destroy();
    }

    const newOtp = otp.generateOtp();

    await ctx.db.UserUpdate.create({
      userup_user: user.user_id,
      userup_type: recovery,
      userup_otp: newOtp,
    });

    console.log("New OTP:", newOtp); // Log temporaire pour le développement
    // Envoyer l'email avec le nouveau OTP
    // await sendEmail(
    //   user.user_email,
    //   "Réinitialisation de votre mot de passe",
    //   `Votre nouveau code de réinitialisation est: ${newOtp}`
    // );
    ctx.body = { is_user: true };
  }
}
module.exports = Recovery;
