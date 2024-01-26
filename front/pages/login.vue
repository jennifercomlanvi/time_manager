<template>
  <main class="container">
    <form @submit.prevent="onSubmit">
      <h1>Login</h1>
      <div class="flex flex-column gap-2">
        <label for="email">Email</label>
        <PInputText id="email" v-model="form.email" type="email" />
        <small v-if="form.errors.email">{{ form.errors.email }}</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="password">Mot de passe</label>
        <PPassword
          id="password"
          name="password"
          v-model="form.password"
          :input-style="{ width: '100%' }"
          toggle-mask
          :feedback="false"
        />
        <small v-if="form.errors.password">{{ form.errors.password }}</small>
      </div>
      <div class="field-checkbox mt-2">
        <PCheckbox
          v-model="form.remember"
          input-id="Auth-remember"
          name="remember"
          binary
        />
        <label for="Auth-remember"> Rester connecter </label>
      </div>
      <div class="my-2">
        <PButton class="col-12" type="submit" label="Connexion" />
      </div>
    </form>
  </main>
</template>

<script setup>
// const session = useSessionStore();
const router = useRouter();
const route = useRoute();

const form = ref({
  email: "",
  password: "",
  remember: false,
  error: "",
  errors: {},
});

function onSubmit(e) {
  e.preventDefault;

  form.value.error = "";
  form.value.errors = {};

  if (form.value.email.trim().length === 0) {
    form.value.errors.email = "L'adresse email est requise";
  }

  if (form.value.password.trim().length === 0) {
    form.value.errors.email = "Le mot de passe est requis";
  }

  if (Object.keys(form.value.errors).length > 0) {
    form.value.error = "Le formulaire comporte des erreurs";
  } else {
    session.token = "token";
    session.username = form.value.errors.email;

    if (route.query.redirect) {
      router.push({ path: route.query.redirect });
    } else {
      router.push({ name: "home" });
    }
  }
}
</script>
