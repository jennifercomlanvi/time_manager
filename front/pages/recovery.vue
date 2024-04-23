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
          <!-- Formulaire pour envoyer l'email -->
          <form @submit.prevent="submit">
            <template v-if="step === SEND">
              <div class="text-center">
                <p>
                  Entrez votre adresse e-mail ci-dessous et nous vous enverrons
                  un lien pour réinitialiser votre mot de passe.
                </p>
              </div>
              <div class="flex flex-column gap-2">
                <PInputText
                  id="recovery-email"
                  v-model="email"
                  type="email"
                  autofocus
                />
              </div>
            </template>
            <!-- <div class="flex justify-content-between mt-5 align-self-stretch">
              <PButton
                severity="help"
                text
                class="p-0"
                label="Annuler"
                type="button"
                @click="navigateTo({ name: 'login' })"
              />
              <PButton severity="success" label="Réinitialiser" type="submit" />
            </div> -->
            <template v-if="step !== SEND">
              <div class="flex flex-column align-items-center">
                <div class="flex flex-column gap-2">
                  <PInputOtp
                    id="recovery_password_otp"
                    v-model="otpRecovery"
                    integerOnly
                    :length="6"
                  />
                </div>
                <div class="flex flex-column gap-2 mt-5">
                  <PPassword
                    class="mt-2"
                    v-model="newPassword"
                    placeholder="Nouveau mot de passe"
                    :input-style="{ width: '100%' }"
                    toggle-mask
                    :feedback="false"
                  />
                </div>
                <div class="flex flex-column gap-2">
                  <PPassword
                    v-model="confirmPassword"
                    class="mt-2"
                    placeholder="Confirmez le mot de passe"
                    :input-style="{ width: '100%' }"
                    toggle-mask
                    :feedback="false"
                  />
                </div>
              </div>
            </template>
            <div v-if="step === SEND" class="flex justify-content-end">
              <PButton
                type="button"
                label="J'ai déjà un code ?"
                severity="help"
                text
                :disabled="loading"
                @click="hasOTP"
              />
            </div>
            <div class="flex justify-content-between">
              <div>
                <PButton
                  severity="secondary"
                  label="Annuler"
                  type="button"
                  :disabled="loading"
                  @click="navigateTo({ name: 'login' })"
                />
              </div>
              <PButton type="submit" label="Valider" :loading="loading" />
            </div>
            <!-- <div class="flex justify-content-between mt-5">
              <PButton
                severity="help"
                text
                class="p-0"
                label="Annuler"
                type="button"
                @click="navigateTo({ name: 'login' })"
              />
              <PButton severity="success" label="Valider" type="submit" />
            </div> -->
          </form>
        </template>
      </PCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: useScope().PUBLIC,
});
// Data ------------------------------------------------------------------------
// import { useToast } from "primevue/usetoast";
const SEND = 1;
const HAS_OTP = 2;
const CHECK_OTP = 3;

// const toast = useToast();
const email = ref(null);
const loading = ref(false);
const step = ref(SEND);
const otpRecovery = ref(null);
const newPassword = ref(null);
const confirmPassword = ref(null);
const router = useRouter();

function hasOTP() {
  step.value = HAS_OTP;
}

function SendEmail() {
  loading.value = true;
  useHttp
    .post("/api/v1/recovery", {
      email: email.value,
    })
    .then((res) => {
      if (res.is_user === false) {
        router.push("/register");
      }
      step.value = CHECK_OTP;
    })
    .catch((e) => {
      console.error(e);
    })
    .finally(() => {
      loading.value = false;
    });
}

function verifyOtpAndResetPassword() {
  if (newPassword.value !== confirmPassword.value) {
    return;
  }
  loading.value = true;
  useHttp
    .post("/api/v1/verify-otp", {
      email: email.value,
      otp: otpRecovery.value,
      password: newPassword.value,
    })
    .then(() => {
      router.push("/login");
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.value = true;
    });
}

function submit() {
  if (step.value === SEND) {
    SendEmail();
  } else {
    verifyOtpAndResetPassword();
  }
}
</script>
