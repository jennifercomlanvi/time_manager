<template>
  <form @submit.prevent="onSubmit">
    <div v-if="isRegistering" class="flex flex-column gap-2">
      <span class="p-input-icon-left">
        <i class="pi pi-user" />
        <PInputText
          id="input"
          v-model="form.name"
          type="text"
          placeholder="Nom"
          autofocus
          style="width: 100%"
        />
      </span>
    </div>
    <div class="flex flex-column gap-2 mt-2">
      <span class="p-input-icon-left">
        <i class="pi pi-envelope" />
        <PInputText
          placeholder="Adresse mail"
          v-model="form.email"
          type="email"
          style="width: 100%"
        />
      </span>
      <small v-if="form.errors.email">{{ form.errors.email }}</small>
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
      <small v-if="form.errors.password">{{ form.errors.password }}</small>
    </div>
    <div v-if="!isRegistering" class="flex flex-wrap justify-content-between">
      <div class="field-checkbox mt-2">
        <PCheckbox
          v-model="form.remember"
          input-id="Auth-remember"
          name="remember"
          binary
        />
        <label for="Auth-remember"> Rester connecter </label>
      </div>
      <div>
        <PButton label="Mot de passe oublié?" severity="help" text />
      </div>
    </div>

    <div class="my-2">
      <PButton
        class="col-12"
        rounded
        raised
        type="submit"
        severity="contrast"
        :label="isRegistering ? 'Enregistrer' : 'Se connecter'"
      />
    </div>
  </form>
</template>

<script setup>
// const session = useSessionStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  isRegistering: {
    type: Boolean,
    default: false,
  },
});

const form = ref({
  name: "",
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
