<template>
  <PCard>
    <template #title
      ><div class="flex justify-content-center">
        <h3>Saisir le code d'authentification</h3>
      </div></template
    >
    <template #content>
      <div class="flex justify-content-center">
        <p>
          Code envoyé vers <strong>{{ userStore.user.email }} </strong> cela
          peux prendre quelques mintutes.
        </p>
      </div>
      <!-- Formulaire -->
      <form @submit.prevent="submit">
        <div class="flex justify-content-center">
          <div class="flex flex-column align-items-center">
            <PInputOtp
              id="control-register-otp"
              ref="otp"
              v-model="otpValue"
              :length="6"
            />
            <!-- <small style="color: red">{{ errorsCheck.getMessage("otp") }}</small> -->
            <div class="flex justify-content-between mt-5 align-self-stretch">
              <PToast />
              <PButton
                aria-label="Me renvoyer un email d'activation"
                severity="help"
                text
                class="p-0"
                label="Renvoyer le code"
                type="button"
                :disabled="!!loading"
                :loading="loading === 1"
                @click="resendEmail"
              />
              <PButton
                aria-label="Valider le formulaire"
                severity="success"
                :disabled="disableForm"
                :loading="loading === 2"
                label="Valider"
                type="submit"
              />
            </div>
          </div>
        </div>
      </form>
    </template>
  </PCard>
</template>

<script setup>
// Data ------------------------------------------------------------------------
import { useToast } from "primevue/usetoast";

const emit = defineEmits(["refresh", "error"]);
const toast = useToast();

const otp = ref(null);
const otpValue = ref(null);
const loading = ref(false);

const { CONTROLED } = useScope();
const userStore = useUserStore();
// const errorsCheck = useFormError();
const authTokenStore = useAuthTokenStore();

const disableForm = computed(() => loading.value);
// const disableForm = computed(
//   () => loading.value || errorsCheck.getMessage("otp"),
// );

// Méthode ---------------------------------------------------------------------

// watch(errorsCheck.errors, (e) => {
//   emit("error", e);
// });

function resendEmail() {
  // errorsCheck.reset();
  loading.value = 1;
  useHttp
    .post("/api/v1/user/control/resendOtp")
    .then(() => {
      toast.add({
        severity: "success",
        summary: "Code envoyé",
        detail:
          "Le code de vérification a été renvoyé à votre adresse e-mail. Veuillez le vérifier, cela peut prendre quelques minutes.",
        life: 3000,
      });
    })
    .catch((e) => {
      // errorsCheck.set(e);
      console.log(e);
    })
    .finally(() => {
      loading.value = null;
    });
}
function submit() {
  // errorsCheck.reset();
  loading.value = 2;
  useHttp
    .put("/api/v1/user/control/register", {
      otp: otpValue.value,
    })
    .then((res) => {
      if (res.has_control) {
        emit("refresh");
      } else {
        authTokenStore.setAuthLevel(CONTROLED);
      }
    })
    .catch((e) => {
      // errorsCheck.set(e);
      // errorsCheck.focus([otp]);
      console.log(e);
    })
    .finally(() => {
      loading.value = null;
    });
}
</script>
