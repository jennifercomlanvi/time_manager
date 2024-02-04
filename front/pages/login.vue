<template>
  <main class="container-login">
    <img src="../assets/img/logo.png" alt="Logo" class="logo">
    <div class="grid">
      <div class="col">
        <div class="login-form">
          <h1 class="flex justify-content-center log-title">Connexion</h1>
          <LoginSocialForm />
          <p class="flex justify-content-center">
            ou utiliser votre email pour connexion
          </p>
          <LoginAuthForm />
          <div class="mt-4 flex justify-content-center flex-wrap">
            Vous n'avez pas de compte ? <a href="#" class="no-underline" @click="navigateTo({ name: 'register' })">Inscrivez vous maintenant</a>
          </div>
        </div>
      </div>
      <div class="col overlay-container">
        <p>
          Connectez vous à votre compte pour commencer à optimiser votre
          productivité. Nous sommes ravis de vous avoir parmi nous !
        </p>
      </div>
    </div>
  </main>
</template>

<script setup></script>
<style scoped></style>
