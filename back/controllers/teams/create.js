const Form = require("../../lib/validation/form.js");
const rules = require("../../lib/validation/rules.js");
const HttpError = require("../../lib/HttpError.js");

// Fonction pour créer une équipe
const index = async (ctx, next) => {
    const form = new Form
    form.stringField('name', value => {
        rules.required(value, "Un nom est requis")
    });

    // Vérifier si la description n'est pas nulle avant d'appliquer les règles
    const description = form.value('description');
    if (description !== null) {
        rules.minLen(description, 10, "La description doit avoir au moins 10 caractères");
        rules.maxLen(description, 255, "La description ne doit pas dépasser 255 caractères");
    }

     // Valider les champs
     if (!form.validate(ctx.request.body)) {
        throw new HttpError(400, 'Validation', form.errors());
    }

    let team = await ctx.db.Team.findOne({
        where: { team_name: form.value('name') }
    })

    if (team) {
        form.setError('name', 'bad');
        throw new HttpError(400, 'validation', form.errors());
    }

    //Création de l'équipe dans la base de données
    team = await ctx.db.Team.create({
        name: form.value('name'),
        description: description
    });

    // Envoyer une réponse réussie
    ctx.response.body = { team: team }
}
module.exports = index