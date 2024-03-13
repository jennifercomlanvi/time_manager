function set(e) {
  if (!e || !e.data) return;
  errors.value = {
    status: e.data.status,
    message: e.data.message,
  };
  if (e.data.form) {
    errors.value.form = e.data.form;
  }
  if (e.data.fields) {
    errors.value.fields = { ...e.data.fields };
  }
}

function setCustom(form, field, code, message) {
  errors.value = {
    ...errors.value,
    status: 400,
    code: "validation",
    form,
    fields: {
      ...(errors.value.fields || {}),
      [field]: {
        code,
        message,
      },
    },
  };
}

function get(field = null) {
  if (field) {
    return errors.value.fields ? errors.value.fields[field] || {} : {};
  }
  return errors.value || {};
}

function init(newErrors) {
  errors.value = newErrors || {};
}

function focus(refs) {
  const firstErrorField = refs.find(
    (ref) => ref.value?.$el?.name && get(ref.value.$el.name).message,
  );
  if (firstErrorField) {
    firstErrorField.value.$el.focus();
  }
}

export const useFormError = () => {
  const errors = ref({});
  return {
    errors,
    init: (newErrors) => init(errors, newErrors),
    focus: (refs) => focus(errors, refs),
    get: (field = null) => get(errors, field),
    getMessage: (field = null) => get(errors, field).message,
    reset: (field = null) => reset(errors, field),
    set: (e, field = null, code = null) => {
      if (code) {
        setCustom(errors, e, field, code);
      } else {
        set(errors, e);
      }
    },
  };
};
