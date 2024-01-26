const Form = require("../lib/validation/form.js")
const HttpError = require("../lib/HttpError.js");
const rules = require("../lib/validation/rules.js")
const password = require('../lib/password.js')
const otp = require('../lib/otp.js')
//const UserControl = require('../models/user_control');

const index = async (ctx, next) => {

    const form = new Form
    form.stringField('username', value => {
        rules.required(value, "Un email valide est requis")
    })
    form.stringField('email', value => {
        rules.required(value, "Un email valide est requis")
        rules.isEmail(value, "Un email valide est requis")
    })
    form.stringField('password', value => {
        rules.required(value, "Un mot de passe valide est requis")
    })

    if (!form.validate(ctx.request.body)) {
        throw new HttpError(400, 'validation', form.errors());
    }

    let user = await ctx.db.User.findOne({
        where: { user_email: form.value('email') }
    })

    if (user) {
        form.setError('email', 'bad');
        throw new HttpError(400, 'validation', form.errors());
    }

    user = await ctx.db.User.create({
        user_name: form.value('username'),
        user_email: form.value('email'),
    })

    await ctx.db.UserPassword.create({
        user_id: user.user_id,
        value: await password.hash(form.value('password')),
    })

    await ctx.db.UserControl.create({
        control_user: user.user_id,
        control_type: ctx.db.UserControl.CTRL_REGISTER,
        control_otp: await otp.generateOtp(),
    })

    ctx.response.body = { user: user }
}

module.exports = index
