
function parse(type, value) {

    if (value === null) {
        return null;
    }

    if (type === "boolean") {
        return parseBoolean(value);
    } else if (type === "integer") {
        return parseInteger(value);
    } else if (type === "number") {
        return parseNumber(value);
    } else if (type === "string") {
        return parseString(value);
    } else if (type.indexOf("array") === 0) {
        return parseArray(type.substring(5).toLocaleLowerCase(), value);
    }

    return value;
}

function parseBoolean(value) {

    if ("boolean" === typeof value) {
        return value;
    }

    if ("string" == typeof value) {
        value = value.toLowerCase().trim();
    }

    const on = ["true", "yes", "on", "1", 1];

    if (on.indexOf(value) !== -1) {
        return true;
    }

    const off = ["false", "no", "off", "0", 0];
    if (off.indexOf(value) !== -1) {
        return false;
    }

    return null;
}

function parseInteger(value) {

    if ("number" === typeof value && Number.isSafeInteger(value)) {
        return value;
    }

    value = parseNumber(value);
    return value ? Math.floor(value) : null;

}

function parseNumber(value) {

    if ("number" === typeof value) {
        return value;
    }

    if ("string" == typeof value) {
        value = value.toLowerCase().trim();
        value = parseFloat(value);
        return isNaN(value) ? null : value;
    }

    return null;
}

function parseString(value) {
    return value.trim();
}

function parseArray(type, inputs) {
    if (!Array.isArray(inputs)) {
        return null;
    }

    let outputs = [];

    inputs.forEach(input => {
        let output = this.parse(type, input);
        if (output !== null) {
            out.push(output)
        }
    });

    if (outputs.length === 0) {
        return null;
    }

    return outputs;
}

module.exports = parse;
