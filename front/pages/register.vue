<template>
  <main class="container-login">
    <img
      src="../assets/img/logo2.png"
      alt="Logo"
      class="logo"
      @click="navigateTo({ name: 'index' })"
    />
    <div class="grid">
      <div class="col overlay-container">
        <div>
          <p>Créez un compte pour découvrir toutes les fonctionnalités.</p>
          <p>Nous serions ravis de vous avoir parmi nous !</p>
        </div>
      </div>
      <div class="col">
        <div class="login-form">
          <h1 class="flex justify-content-center log-title">Créer un compte</h1>
          <LoginSocialForm />
          <p class="flex justify-content-center">
            ou utiliser votre email pour inscription
          </p>
          <LoginAuthForm :register="true" />
        </div>
        <div class="mt-4 flex justify-content-center flex-wrap">
          Vous avez déjà un compte ?
          <a
            href="#"
            class="no-underline"
            @click="navigateTo({ name: 'login' })"
          >
            Connectez vous maintenant</a
          >
        </div>
      </div>
    </div>
  </main>
</template>

<script setup></script>
