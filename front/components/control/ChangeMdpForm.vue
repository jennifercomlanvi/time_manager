<template>
  <form @submit.prevent="submit">
    <div class="flex flex-column gap-2">
      <label for="ChangePasswordForm-password">Nouveau mot de passe:</label>
      <PPassword
        id="ChangePasswordForm-password"
        ref="password"
        v-model="value.password"
        toggle-mask
        :input-style="{ width: '100%' }"
        name="password"
        :feedback="false"
        @input="validatePassword(false)"
        @blur="validatePassword"
      />
      <small style="color: red">{{ errorsMdp.getMessage("password") }}</small>
    </div>

    <div class="flex justify-content-end">
      <PButton
        aria-label="Valider le formulaire"
        severity="success"
        label="Valider"
        type="submit"
        :disabled="disableForm"
        :loading="loading"
      />
    </div>
  </form>
</template>

<script setup>
// Data ------------------------------------------------------------------------

const emit = defineEmits(["refresh", "error"]);

const value = reactive({
  password: null,
});
const password = ref("");
const loading = ref(false);

const { CONTROLED } = useScope();
const errorsMdp = useFormError();
const authTokenStore = useAuthTokenStore();

const disableForm = computed(
  () => loading.value || errorsMdp.getMessage("password"),
);

// Méthode ---------------------------------------------------------------------
watch(errorsMdp.errors, (e) => {
  emit("error", e);
});

function validatePassword(error = true) {
  if (!value.password || value.password.length > 3) {
    errorsMdp.reset("password");
  } else if (error) {
    errorsMdp.set("user_password", "password", "required");
  }
}

function submit() {
  errorsMdp.reset();
  loading.value = true;
  useHttp.put('/api/v1/user/control/password', {
    password: value.password,
  }).then((res) => {
    if (res.has_control) {
      emit('refresh');
    } else {
      authTokenStore.setAuthLevel(CONTROLED);
    }
  }).catch((e) => {
    errorsMdp.set(e);
    errorsMdp.focus([password]);
  }).finally(() => {
    loading.value = false;
  });
}
</script>
