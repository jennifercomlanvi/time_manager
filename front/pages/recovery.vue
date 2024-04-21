<template>
  <div class="flex flex-row justify-content-center">
    <div class="col-12 sm:col-10 md:col-5">
      <h1 class="text-primary text-center">Time Manager !</h1>
      <PCard>
        <template #title
          ><div class="flex justify-content-center">
            <h3>Réinitialiser le mot de passe</h3>
          </div></template
        >
        <template #content>
          <div class="flex justify-content-center">
            <p>
              Entrez votre adresse e-mail ci-dessous et nous vous enverrons un
              lien pour réinitialiser votre mot de passe.
            </p>
          </div>
          <!-- Formulaire -->
          <form @submit.prevent="submit">
            <div class="flex flex-column gap-2">
              <label for="recovery-email">Email :</label>
              <PInputText id="recovery-email" v-model="email" type="email" />
              <!-- <small id="username-help"
                        >Enter your username to reset your password.</small
                    > -->
            </div>

            <div class="flex justify-content-between mt-5 align-self-stretch">
              <PToast />
              <PButton
                severity="help"
                text
                class="p-0"
                label="Annuler"
                type="button"
                @click="navigateTo({ name: 'login' })"
              />
              <PButton severity="success" label="Réinitialiser" type="submit" />
            </div>
          </form>
        </template>
      </PCard>
    </div>
  </div>
</template>

<script setup>
// Data ------------------------------------------------------------------------
import { useToast } from "primevue/usetoast";

const toast = useToast();

const email = ref(null);
const loading = ref(false);

function submit() {
  loading.value = true;
  useHttp
    .post("/api/v1/recovery", {
      email: email.value,
    })
    .then((res) => {})
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
