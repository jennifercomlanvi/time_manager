function set(errors, e) {
  errors.value = {
    status: e.status,
    code: e.data.code,
    message: "Une erreur de validation s'est produite.", // Message par défaut
    fields: {}, // Champ d'erreurs
  };

  if (e.data.errors) {
    Object.entries(e.data.errors).forEach(([field, message]) => {
      errors.value.fields[field] = {
        message: message, // Utiliser le message d'erreur fourni dans les données d'erreur
      };
    });
  }
}

function setCustom(errors, form, field, code, extra) {
  if (form === "_http") {
    errors.value = {
      status: form,
      code,
      message: useLangError.get("_http", field, code, extra),
    };
  } else {
    errors.value = {
      status: 400,
      code: "validation",
      message: useLangError.get("_http", "400", "validation"),
      form,
      fields: {
        ...(errors.value?.fields ?? {}),
        [field]: {
          code,
          message: useLangError.get(form, field, code, extra),
        },
      },
    };
  }
}

function init(errors, newErrors) {
  errors.value = newErrors;
}

function focus(errors, refs) {
  refs.every((ref) => {
    const field = ref.value?.$el?.name;
    if (field && get(errors, field).message) {
      ref.value.$el.focus();
      return false;
    }
    return true;
  });
}

function get(errors, field) {
  if (field) {
    if (errors.value?.fields) {
      return errors.value.fields[field] ?? {};
    }
    return {};
  }
  return errors.value ?? {};
}

function getMessage(errors, field) {
  return get(errors, field).message;
}

function reset(errors, field) {
  if (field) {
    if (errors.value?.fields && errors.value.fields[field]) {
      delete errors.value.fields[field];
      if (Object.keys(errors.value.fields).length) {
        return;
      }
    } else {
      return;
    }
  }
  errors.value = null;
}

export const useFormError = () => {
  const errors = ref(null);
  return {
    errors,
    init: (newErrors) => init(errors, newErrors),
    focus: (refs) => focus(errors, refs),
    get: (field = null) => get(errors, field),
    getMessage: (field = null) => getMessage(errors, field),
    reset: (field = null) => reset(errors, field),
    set: (e, field = null, code = null, extra = null) => {
      if (code) {
        setCustom(errors, e, field, code, extra);
      } else {
        set(errors, e);
      }
    },
  };
};
