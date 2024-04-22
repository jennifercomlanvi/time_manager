const otp = require("../../../lib/otp");
import Form from "../../../lib/validation/form";
const sendEmail = require("../../../emailSender");
import { request, summary, body, tags, responses } from "koa-swagger-decorator";
class Password {
  @request("post", "/api/v1/recovery")
  @summary("Demande de réinitialisation de mot de passe Etape 1")
  @tags(["Utilisateur"])
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
  static async resetPassword(ctx) {
    const form = new Form();
    form.stringField("email", (value) => {
      rules.required(value, "L'email est requis");
      rules.isEmail(value, "L'email doit être valide");
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Erreur de validation", form.errors());
    }

    const user = await ctx.db.User.findOne({
      where: {
        user_email: form.value("email"),
        user_state: ctx.db.User.ACTIVE,
      },
    });

    if (!user) {
      ctx.status = 204; // Aucun utilisateur actif trouvé avec cet email.
      return;
    }

    const existingUpdate = await UserUpdate.findOne({
      where: {
        userup_user: user.user_id,
        userup_type: ctx.db.UserUpdate.RECOVERY,
      },
    });

    if (!existingUpdate) {
      await this.#upsertUserUpdate(ctx, user);
    }

    if (existingUpdate && existingUpdate.userup_expired_at < now) {
      await this.#upsertUserUpdate(ctx, user, existingUpdate);
    }

    ctx.status = 204;
  }

  static async #upsertUserUpdate(ctx, user, existingUpdate) {
    if (existingUpdate) {
      await existingUpdate.destroy();
    }
    const newOtp = otp.generateOtp();
    await ctx.db.UserUpdate.create({
      userup_user: user.user_id,
      userup_type: ctx.db.UserUpdate.RECOVERY,
      userup_otp: newOtp,
    });
    console.log("New OTP:", newOtp); // Log temporaire pour le développement
    // await sendEmail(
    //   user.user_email,
    //   "Réinitialisation de votre mot de passe",
    //   `Votre code de réinitialisation est: ${newOtp}`
    // );
  }
}
module.exports = Password.resetPassword;
