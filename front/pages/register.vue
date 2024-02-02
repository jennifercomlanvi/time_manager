<template>
  <main class="container-login">
    <div class="grid">
      <div class="col overlay-container">
        <p>
          Connectez vous à votre compte pour commencer à optimiser votre
          productivité Nous sommes ravis de vous avoir parmi nous !
        </p>
      </div>
      <div class="col">
        <div class="login-form">
          <h1 class="flex justify-content-center">Creer un compte</h1>
          <LoginSocialForm />
          <p class="flex justify-content-center">
            ou utiliser votre email pour inscription
          </p>
          <LoginAuthForm />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup></script>
