<template>
  <main class="container-login">
    <div class="grid">
      <div class="col">
        <form @submit.prevent="onSubmit" class="login-form">
          <h1>Connexion</h1>
          <div class="social-container">
            <a href="#" class="social"
              ><i class="pi pi-facebook" style="font-size: 2rem"></i
            ></a>
            <a href="#" class="social"
              ><i class="pi pi-google" style="font-size: 2rem"></i
            ></a>
            <a href="#" class="social"
              ><i class="pi pi-apple" style="font-size: 2rem"></i
            ></a>
          </div>
          <p>ou utiliser votre email pour connexion</p>
          <LoginAuthForm />
        </form>
      </div>
      <div class="col overlay-container">
        <p>
          Connectez vous à votre compte pour commencer à optimiser votre
          productivité.
        </p>
        <p>Nous sommes ravis de vous avoir parmi nous !</p>
      </div>
    </div>
  </main>
</template>

<script setup></script>
<style scoped>


</style>