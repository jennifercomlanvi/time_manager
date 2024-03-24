import HttpError from "../../lib/HttpError";
import Form from "../../lib/validation/form";
import { generateToken } from "../../lib/token";
const sendEmail = require('../../emailSender');
import { request, summary, tags, body, responses } from "koa-swagger-decorator";


class Invitation {
  @request("post", "/api/v1/user/invitation/team")
  @summary("Crée une invitation pour rejoindre une équipe")
  @tags(["User"])
  @body({
    email: { type: "string", required: true, description: "Email de l'utilisateur à inviter" },
    teamId: { type: "number", required: true, description: "ID de l'équipe à laquelle l'utilisateur est invité" }
  })
  @responses({
    200: { description: "Invitation créée avec succès" },
    400: { description: "Erreur de validation" },
    404: { description: "Équipe non trouvée ou utilisateur déjà membre" },
    500: { description: "Erreur interne du serveur" }
  })
  static async create(ctx) {
    const form = new Form();
    form.stringField("email", (value) => {
      rules.required(value, "L'email est requis");
      rules.email(value, "L'email n'est pas valide");
    });
    form.integerField("teamId", (value) => {
      rules.required(value, "L'ID de l'équipe est requis");
    });

    if (!form.validate(ctx.request.body)) {
      throw new HttpError(400, "Erreur de validation", form.errors());
    }

    const { email, teamId } = form.values();
    const user = await ctx.db.User.findOne({ where: { email } });
    const team = await ctx.db.Team.findByPk(teamId);

    if (!team) throw new HttpError(404, "Équipe non trouvée.");

    let status = 1;
    let token = generateToken();

    // Vérifier si l'utilisateur est déjà membre de l'équipe
    const isMember = user && await team.hasUser(user);
    if (isMember) throw new HttpError(400, "L'utilisateur est déjà membre de l'équipe.");

    // Créer ou mettre à jour l'invitation
    const [invitation, created] = await ctx.db.Invitation.findOrCreate({
      where: { inv_email: email, inv_team: teamId },
      defaults: {
        inv_token: token,
        inv_status: status,
        expired_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    if (!created) {
      // Mise à jour si l'invitation existe déjà mais n'a pas été acceptée/refusée
      invitation.inv_token = token;
      invitation.expired_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await invitation.save();
    }
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

    const invitationLink = `${FRONTEND_URL}/accept-invitation?token=${token}`;

    // Envoyer l'email d'invitation
    // await this.sendInvitationEmail(email, team.team_name, invitationLink);
    console.log(invitationLink)
  }

  static async sendInvitationEmail(email, teamName, invitationLink) {
    const subject = `Invitation à rejoindre l'équipe ${teamName}`;
    const text = `<p>Vous avez été invité à rejoindre l'équipe <strong>${teamName}</strong>. 
    Cliquez sur ce lien pour accepter l'invitation: <strong>${invitationLink}</strong></p>`;    
    await sendEmail(email, subject, text);
  }
}
module.exports = Invitation.create;