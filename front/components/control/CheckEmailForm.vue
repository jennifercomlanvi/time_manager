<template>
  <PCard>
    <template #title
      ><div class="flex justify-content-center">
        <h3>Saisir le code d'authrntification</h3>
      </div></template
    >
    <template #content>
      <div class="flex justify-content-center">
        <p>
          Code envoyé vers <strong>.....</strong> cela peux prendre quelques
          mintutes.
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
              <PButton
                aria-label="Me renvoyer un email d'activation"
                severity="help"
                text
                class="p-0"
                label="Générer un nouveau code"
                type="button"
                @click="resendEmail"
              />
              <PButton
                aria-label="Valider le formulaire"
                severity="success"
                label="Valider"
                type="submit"
              />
            </div>
          </div>
        </div>
      </form>
    </template>

    <!-- Alert
    <PMessage :severity="emailSend ? 'success' : 'info'" :closable="false">
      <p>
        Un email vous a été envoyé dans votre boite mail
        <strong> {{ userStore.user.email }} </strong> pour confirmer votre
        adresse email.<br />
        Si vous ne l'avez pas reçu, nous vous invitons à demander le renvoi et à
        vérifier votre dossier « spam » / courriers indésirables.
      </p>
    </PMessage>

    <form @submit.prevent="submit">
      <div class="flex justify-content-center">
        <div class="flex flex-column align-items-center">
          <PInputOtp
            id="control-register-otp"
            ref="otp"
            v-model="otpValue"
            :length="6"
            @keydown="errorsCheck.reset('otp')"
          />
          <small style="color: red">{{ errorsCheck.getMessage("otp") }}</small>
          <div class="flex justify-content-between mt-5 align-self-stretch">
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
              label="Valider"
              type="submit"
              :disabled="disableForm"
              :loading="loading === 2"
            />
          </div>
        </div>
      </div>
    </form> -->
  </PCard>
</template>

<script setup>
// Data ------------------------------------------------------------------------

// const emit = defineEmits(["refresh", "error"]);

const otp = ref(null);

const otpValue = ref(null);
const emailSend = ref(false);
const loading = ref(false);

// const { CONTROLED } = useScope();
// const userStore = useUserStore();
// const errorsCheck = useFormError();
// const authTokenStore = useAuthTokenStore();

// const disableForm = computed(
//   () => loading.value || errorsCheck.getMessage("otp"),
// );

// Méthode ---------------------------------------------------------------------

// watch(errorsCheck.errors, (e) => {
//   emit("error", e);
// });

function resendEmail() {
  //   errorsCheck.reset();
  //   loading.value = 1;
  //   useHttp
  //     .post("/api/v1/user/control/email")
  //     .then(() => {
  //       emailSend.value = true;
  //     })
  //     .catch((e) => {
  //       errorsCheck.set(e);
  //     })
  //     .finally(() => {
  //       loading.value = null;
  //     });
  // }
  // function submit() {
  //   errorsCheck.reset();
  //   loading.value = 2;
  //   useHttp
  //     .put("/api/v1/user/control/email", {
  //       otp: otpValue.value,
  //     })
  //     .then((res) => {
  //       if (res.has_control) {
  //         emit("refresh");
  //       } else {
  //         authTokenStore.setAuthLevel(CONTROLED);
  //       }
  //     })
  //     .catch((e) => {
  //       errorsCheck.set(e);
  //       errorsCheck.focus([otp]);
  //     })
  //     .finally(() => {
  //       loading.value = null;
  //     });
}
</script>
