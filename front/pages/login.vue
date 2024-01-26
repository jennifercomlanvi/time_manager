<template>
  <main class="container">
    <form @submit.prevent="onSubmit">
      <h1>Login</h1>

      <label for="email">Email</label>
      <input type="email" id="email" name="email" v-model="form.email" />
      <small v-if="form.errors.email">{{ form.errors.email }}</small>

      <label for="password">Mot de passe</label>
      <input
        type="password"
        id="password"
        name="password"
        v-model="form.password"
      />
      <small v-if="form.errors.password">{{ form.errors.password }}</small>

      <button type="submit">Connexion</button>
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
