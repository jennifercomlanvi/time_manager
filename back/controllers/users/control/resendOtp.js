import { request, summary, tags, body, responses } from "koa-swagger-decorator";
const HttpError = require("../../../lib/HttpError");
const otp = require("../../../lib/otp");
const sendEmail = require("../../../emailSender");

class UserControl {
  @request("post", "/api/v1/user/control/:id")
  @summary("Renvoie ou génère un nouveau code OTP")
  @tags(["UserControl"])
  @responses({
    200: { description: "OTP envoyé avec succès" },
    404: { description: "Contrôle utilisateur non trouvé" },
    500: { description: "Erreur interne du serveur" },
  })
  static async resendOrGenerateOtp(ctx) {
    const userControlId = ctx.params.id;
    const userControl = await ctx.db.UserControl.findByPk(userControlId);

      if (!userControl) {
        throw new HttpError(404, "Contrôle utilisateur non trouvé.");
      }

      const user = await ctx.db.User.findByPk(userControl.control_user);
      if (!user) {
        throw new HttpError(404, "Utilisateur non trouvé.");
      }

      let otpCode = userControl.control_otp;
      const now = new Date();

      if (new Date(userControl.control_expired_at) <= now) {
        otpCode = otp.generateOtp();
        const newExpirationDate = new Date(now.getTime() + 10 * 60000);

        await userControl.update({
          control_otp: otpCode,
          control_expired_at: newExpirationDate,
        });
      }
      console.log('code otp:', otpCode);
      // await sendEmail(
      //   user.user_email,
      //   "Votre code de vérification",
      //   `<p>Votre code de vérification pour l'inscription est : <strong>${otpCode}</strong></p>`
      // );

      ctx.body = { message: "OTP envoyé avec succès." };
  }
}

module.exports = UserControl.resendOrGenerateOtp;
