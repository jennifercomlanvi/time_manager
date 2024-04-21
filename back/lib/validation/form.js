const parse = require("./parse");

class Form {
  #fields;
  #values;
  #errors;

  constructor() {
    this.#fields = {};
    this.#values = {};
    this.#errors = {};
  }

  /**
   * @param {string} name
   * @param {string} type
   * @param {function} callback
   * @returns {this}
   */
  #field(name, type, callback) {
    this.#fields[name] = { type, callback };
    return this;
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  booleanField(name, callback) {
    return this.#field(name, "boolean", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  integerField(name, callback) {
    return this.#field(name, "integer", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  numberField(name, callback) {
    return this.#field(name, "number", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  stringField(name, callback) {
    return this.#field(name, "string", callback);
  }
  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  dateField(name, callback) {
    return this.#field(name, "date", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  arrayBooleanField(name, callback) {
    return this.#field(name, "arrayboolean", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  arrayIntegerField(name, callback) {
    return this.#field(name, "arrayinteger", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  arrayNumberField(name, callback) {
    return this.#field(name, "arrayboolean", callback);
  }

  /**
   * @param {string} name
   * @param {function} callback
   * @returns {this}
   */
  arrayStringField(name, callback) {
    return this.#field(name, "arrayboolean", callback);
  }

  /**
   * @param {object} data
   * @returns {boolean}
   */
  validate(data) {
    this.#values = {};
    this.#errors = {};

    for (const [name, field] of Object.entries(this.#fields)) {
      if (name in this.#errors) {
        continue;
      }

      try {
        this.#values[name] = parse(
          field.type,
          name in data ? data[name] : null
        );

        if (field.callback) {
          field.callback(this.#values[name]);
        }
      } catch (error) {
        this.setError(name, error);
      }
    }

    return this.isValid();
  }

  /**
   * @returns {boolean}
   */
  isValid() {
    return Object.entries(this.#errors).length === 0;
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  error(name) {
    return name in this.#errors ? this.#errors[name] : null;
  }

  /**
   * @returns {object}
   */
  errors() {
    return this.#errors;
  }

  /**
   * @param {string} name
   * @param {string} message
   * @returns {this}
   */
  setError(name, message) {
    if (name in this.#fields) {
      this.#errors[name] = message;
    }

    return this;
  }

  /**
   * @returns {*}
   */
  value(name) {
    return name in this.#values ? this.#values[name] : null;
  }

  /**
   * @returns {object}
   */
  values() {
    return this.#values;
  }
}

module.exports = Form;
