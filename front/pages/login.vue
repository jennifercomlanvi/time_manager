<template>
  <main class="container-login">
    <img
      src="../assets/img/logo.png"
      alt="Logo"
      class="logo"
      @click="navigateTo({ name: 'index' })"
    />
    <div class="grid">
      <div class="col">
        <div class="login-form">
          <h1 class="flex justify-content-center log-title">Connexion</h1>
          <!-- <PMessage
            v-if="errors.getMessage('form')"
            severity="error"
            :closable="false"
          >
            <p>{{ errors.getMessage("form") }}</p>
          </PMessage> -->
          <LoginSocialForm />
          <p class="flex justify-content-center">
            ou utiliser votre email pour connexion
          </p>
          <LoginAuthForm @error="errors.init" />
          <div class="mt-4 flex justify-content-center flex-wrap">
            Vous n'avez pas de compte ?
            <a
              href="#"
              class="no-underline"
              @click="navigateTo({ name: 'register' })"
              >Inscrivez vous maintenant</a
            >
          </div>
        </div>
      </div>
      <div class="col overlay-container">
        <div>
          <p>
            Connectez vous à votre compte pour commencer à optimiser votre
            productivité.
          </p>
          <p>Nous sommes ravis de vous avoir parmi nous !</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
definePageMeta({
  auth: useScope().PUBLIC,
});

const errors = useFormError();
</script>
<style scoped></style>
