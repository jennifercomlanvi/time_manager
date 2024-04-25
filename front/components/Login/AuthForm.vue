<template>
  <form @submit.prevent="onSubmit">
    <div v-if="register" class="flex flex-column gap-2">
      <PIconField iconPosition="left">
        <PInputIcon class="pi pi-user"> </PInputIcon>
        <PInputText
          id="input"
          v-model="form.name"
          type="text"
          placeholder="Nom"
          autofocus
          style="width: 100%"
        />
      </PIconField>
      <small class="text-red-500">{{ errors.getMessage("name") }}</small>
    </div>
    <div class="flex flex-column gap-2 mt-2">
      <PIconField iconPosition="left">
        <PInputIcon class="pi pi-envelope"> </PInputIcon>
        <PInputText
          placeholder="Adresse mail"
          v-model="form.email"
          type="email"
          style="width: 100%"
        />
      </PIconField>
      <small class="text-red-500">{{ errors.getMessage("email") }}</small>
    </div>
    <div class="flex flex-column gap-2">
      <PPassword
        name="password"
        class="mt-2"
        v-model="form.password"
        :input-style="{ width: '100%' }"
        placeholder="Mot de passe"
        toggle-mask
        :feedback="false"
      />
      <small class="text-red-500">{{ errors.getMessage("password") }}</small>
    </div>
    <div class="flex flex-wrap justify-content-between">
      <div class="field-checkbox mt-2">
        <PCheckbox
          v-model="form.remember"
          input-id="Auth-remember"
          name="remember"
          binary
        />
        <label for="Auth-remember"> Rester connecter </label>
      </div>
      <div v-if="!register">
        <PButton
          label="Mot de passe oublié?"
          severity="help"
          text
          @click="navigateTo({ name: 'recovery' })"
        />
      </div>
    </div>

    <div class="my-2">
      <PButton
        class="col-12"
        rounded
        raised
        type="submit"
        severity="contrast"
        :label="register ? 'Enregistrer' : 'Se connecter'"
        :loading="loading"
      />
    </div>
  </form>
</template>

<script setup>
const route = useRoute();
const authTokenStore = useAuthTokenStore();
const errors = useFormError();
const props = defineProps({
  register: {
    type: Boolean,
    default: false,
  },
});
const loading = ref(false);
const emit = defineEmits(["error"]);

watch(errors.errors, (e) => {
  emit("error", e);
});
const form = reactive({
  remember: false,
  name: "jennifer",
  email: "comlanvihilary@gmail.com",
  password: "Timem@gager12!",
});

function logUser() {
  errors.reset();
  useHttp
    .post("/api/v1/signin", {
      email: form.email,
      password: form.password,
      remember: form.remember,
    })
    .then((r) => {
      authTokenStore.setToken(r);
      const path = route.query.redirect
        ? { path: route.query.redirect }
        : { name: "dashboard" };
      navigateTo(path, { replace: true });
    })
    .catch((e) => {
      errors.set(e);
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
}

function registerUser() {
  console.log(form);
  useHttp
    .post("/api/v1/signup", {
      name: form.name,
      email: form.email,
      password: form.password,
      remember: form.remember,
    })
    .then((r) => {
      authTokenStore.setToken(r);
      const path = route.query.redirect
        ? { path: route.query.redirect }
        : { name: "team" };
      navigateTo(path, { replace: true });
    })
    .catch((e) => {
      errors.set(e);
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
}

function onSubmit() {
  loading.value = true;
  if (props.register) {
    registerUser();
  } else {
    logUser();
  }
}
</script>
