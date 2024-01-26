function required(value, message = 'required') {
    if (value === null) {
        throw message;
    }
}

function minLen(value, min, message = 'min_len') {
    if (value.length < min) {
        throw message;
    }
}

function maxLen(value, min, message = 'max_len') {
    if (value.length < min) {
        throw message;
    }
}

function equalLen(value, len, message = 'equal_len') {
    if (value.length !== len) {
        throw message;
    }
}

function matchRegex(value, regex, message = 'match_regex') {
    if (!value.match(regex)) {
        throw message
    }
}
function differRegex(value, regex, message = 'differ_regex') {
    if (value.match(regex)) {
        throw message;
    }
}

function isEmail(value, message = 'is_email') {
    const regex = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
    matchRegex(value, regex, message);
}

// async function userExists(value, message = 'user_exists') {
//     const user = await User.findByPk(value);
//     if (!user) {
//         throw message;
//     }
// }

// async function teamExists(value, message = 'team_exists') {
//     const team = await Team.findByPk(value);
//     if (!team) {
//         throw message;
//     }
// }

module.exports = {
    required,
    minLen,
    maxLen,
    equalLen,
    matchRegex,
    differRegex,
    isEmail,
};
